import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Copy, Download, Loader2, LogIn, ShieldAlert } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useMemo, useState } from 'react';
import Seo from '../components/Seo';
import { SkeletonRow } from '../components/Skeleton';
import Troca from '../components/Troca';
import { isAdmin } from '../config/admin';
import { routes, site } from '../config/site';
import { auth, loginWithGoogle, logout } from '../firebase/auth';
import { bancoAoVivo } from '../firebase/banco-ao-vivo';
import { codigoDoErro, mensagemDoErroDeLogin } from '../lib/erroDeLogin';
import { collapse } from '../lib/motion';
import { useDelayedFlag } from '../lib/useDelayedFlag';

/**
 * Um cadastro, seja de qual lista for.
 *
 * As duas coleções guardam a mesma coisa (nome, e-mail, quando, e a que
 * respeito), com um nome de campo diferente para o "a que respeito":
 * `courseId` na lista de espera, `materialId` nos leads dos artigos. A
 * leitura normaliza esse campo em `referencia` para que a tabela, o CSV e
 * a contagem existam uma vez só, e não duas quase iguais.
 */
interface Cadastro {
  id: string;
  name: string;
  email: string;
  /** O curso esperado, ou o material baixado. */
  referencia: string;
  /** A rota em que o formulário foi preenchido. */
  origem?: string;
  /**
   * A etiqueta `utm_` da entrada — `instagram / cpc / setembro`.
   *
   * Vazia para quem chegou sem campanha (a maioria) e para todo cadastro
   * anterior a setembro de 2026, quando o campo passou a ser gravado.
   */
  campanha?: string;
  createdAt?: { toDate: () => Date };
}

/**
 * As duas listas, e o que muda entre elas.
 *
 * ┌───────────────────────────────────────────────────────────────────────┐
 * │  POR QUE SÃO DUAS COLEÇÕES, E NÃO UMA COM UM CAMPO "TIPO"             │
 * │                                                                       │
 * │  Porque significam coisas diferentes. Quem entra na lista de espera   │
 * │  já escolheu um curso e está esperando ele abrir — é a lista de quem  │
 * │  está mais perto de comprar. Quem baixa um material chegou por um     │
 * │  artigo e ainda não escolheu nada.                                    │
 * │                                                                       │
 * │  Misturadas, a primeira lista se perderia dentro da segunda, que      │
 * │  tende a ser muito maior. Separadas, cada uma responde à sua          │
 * │  pergunta — e o CSV sai pronto para o que se vai fazer com ele.       │
 * └───────────────────────────────────────────────────────────────────────┘
 */
const LISTAS = {
  waitlist: {
    rotulo: 'Lista de espera',
    colecao: 'waitlist',
    /** O cabeçalho da terceira coluna, e do CSV. */
    coluna: 'Curso',
    campo: 'courseId',
    vazio: 'Nenhum cadastro na lista de espera ainda.',
    arquivo: 'lista-de-espera',
  },
  leads: {
    rotulo: 'Materiais',
    colecao: 'leads',
    coluna: 'Material',
    campo: 'materialId',
    vazio: 'Nenhum material foi baixado ainda.',
    arquivo: 'leads-de-material',
  },
} as const;

type NomeDaLista = keyof typeof LISTAS;

/**
 * Painel dos cadastros: a lista de espera e os leads dos materiais.
 *
 * As duas coleções são fechadas para leitura pública — são dados pessoais
 * sob a LGPD. Só os UID listados em config/admin.ts (e na mesma lista
 * dentro de firestore.rules) conseguem ler.
 *
 * A rota é noindex: não deve aparecer em busca.
 */
export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [aba, setAba] = useState<NomeDaLista>('waitlist');
  const [leads, setLeads] = useState<Cadastro[]>([]);
  const [loadingLeads, setLoadingLeads] = useState(true);
  const [error, setError] = useState('');
  const [erroLogin, setErroLogin] = useState('');
  const [entrando, setEntrando] = useState(false);
  const [copied, setCopied] = useState(false);

  const entrar = async () => {
    setErroLogin('');
    setEntrando(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      console.error('Erro ao entrar com o Google:', err);
      setErroLogin(mensagemDoErroDeLogin(codigoDoErro(err)));
    } finally {
      setEntrando(false);
    }
  };

  useEffect(
    () =>
      onAuthStateChanged(auth, (u) => {
        setUser(u);
        setCheckingAuth(false);
      }),
    [],
  );

  const allowed = isAdmin(user?.uid);
  const showSkeleton = useDelayedFlag(loadingLeads);

  /* Nomeia a tela atual para o <Troca>. As quatro se substituíam num corte
     seco: entrar com o Google fazia o painel de login desaparecer no mesmo
     quadro em que a lista aparecia. */
  const tela = checkingAuth
    ? 'verificando'
    : !user
      ? 'login'
      : !allowed
        ? 'sem-acesso'
        : 'lista';

  const lista = LISTAS[aba];

  useEffect(() => {
    if (!allowed) return;

    /* Trocar de aba volta ao estado de carregamento: sem isto a lista
       anterior fica na tela, com o cabeçalho da nova, até a consulta
       chegar — e por um instante o painel mostra dados de uma lista sob o
       rótulo da outra. */
    setLoadingLeads(true);

    const q = query(collection(bancoAoVivo, lista.colecao), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        setLeads(
          snap.docs.map((d) => {
            const dados = d.data();
            return {
              id: d.id,
              name: dados.name,
              email: dados.email,
              referencia: dados[lista.campo] ?? '',
              origem: dados.origem,
              campanha: dados.campanha,
              createdAt: dados.createdAt,
            };
          }),
        );
        setLoadingLeads(false);
        setError('');
      },
      (err) => {
        console.error(`Erro ao carregar a coleção ${lista.colecao}:`, err);
        setLoadingLeads(false);
        setError(
          'Não foi possível ler a lista. Confira se o seu UID também está em firestore.rules e se as regras foram publicadas.',
        );
      },
    );
  }, [allowed, lista.colecao, lista.campo]);

  /*
    `origem` e `campanha` saem nas DUAS listas.

    A de materiais já tinha origem; a de espera passou a gravá-la junto
    com a campanha. Enquanto a coluna era exclusiva dos materiais, a
    lista que interessa mais — quem já escolheu um curso e espera ele
    abrir — era a única que não dizia de onde a pessoa tinha vindo.

    Cadastro antigo não tem os campos e aparece como "—". É informação
    verdadeira: não é que a origem fosse desconhecida, é que ela não era
    perguntada.
  */
  const csv = useMemo(() => {
    const aspas = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = leads.map((l) =>
      [
        aspas(l.name),
        aspas(l.email),
        aspas(l.referencia),
        aspas(l.origem ?? ''),
        aspas(l.campanha ?? ''),
        aspas(l.createdAt ? l.createdAt.toDate().toLocaleString('pt-BR') : ''),
      ].join(','),
    );
    const cabecalho = [
      'nome',
      'email',
      lista.coluna.toLowerCase(),
      'origem',
      'campanha',
      'data',
    ].join(',');
    return [cabecalho, ...rows].join('\n');
  }, [leads, lista.coluna]);

  const csvHref = useMemo(
    // O BOM faz o Excel abrir o arquivo com a acentuação correta.
    () => `data:text/csv;charset=utf-8,${encodeURIComponent(`\ufeff${csv}`)}`,
    [csv],
  );

  const copyUid = async () => {
    if (!user) return;
    await navigator.clipboard.writeText(user.uid);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Seo
        rota={routes.admin}
        titulo={`Cadastros | ${site.name}`}
        descricao="Painel interno do Instituto Bruno Sena."
        indexar={false}
      />

      <main className="max-w-5xl mx-auto px-6 pt-36 pb-24">
        <h1 className="font-display text-4xl font-bold text-brand-cream mb-8">Cadastros</h1>

        <Troca chave={tela}>
          {checkingAuth ? (
            <p className="text-brand-platinum flex items-center gap-2" role="status">
              <Loader2 className="animate-spin" size={18} aria-hidden="true" />
              Verificando acesso…
            </p>
          ) : !user ? (
            <div className="cartao p-8 text-center">
              <p className="text-brand-platinum mb-6">
                Entre com a conta Google autorizada para ver os cadastros.
              </p>
              <button
                type="button"
                onClick={entrar}
                disabled={entrando}
                className="btn-primary mx-auto disabled:cursor-not-allowed disabled:opacity-60"
              >
                {entrando ? (
                  <Loader2 className="animate-spin" size={18} aria-hidden="true" />
                ) : (
                  <LogIn size={18} aria-hidden="true" />
                )}
                {entrando ? 'Entrando…' : 'Entrar com Google'}
              </button>

              <AnimatePresence initial={false}>
                {erroLogin && (
                  <motion.div
                    variants={collapse}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="overflow-hidden"
                  >
                    <p
                      role="alert"
                      className="mx-auto mt-6 max-w-md text-left text-[13.5px] leading-relaxed text-brand-danger"
                    >
                      {erroLogin}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : !allowed ? (
            <div className="border border-brand-danger/30 bg-brand-danger/[0.05] p-8">
              <ShieldAlert className="text-brand-danger mb-4" size={32} aria-hidden="true" />
              <h2 className="text-xl font-bold text-brand-cream mb-3">
                Esta conta não tem acesso
              </h2>
              <p className="text-brand-platinum mb-6">
                Para liberar, copie o identificador abaixo e adicione à lista{' '}
                <code className="text-brand-accent">ADMIN_UIDS</code> em{' '}
                <code className="text-brand-accent">src/config/admin.ts</code> e também em{' '}
                <code className="text-brand-accent">firestore.rules</code>. Depois publique as
                regras com{' '}
                <code className="text-brand-accent">
                  firebase deploy --only firestore:rules
                </code>
                .
              </p>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                <code className="border border-white/12 bg-brand-dark px-4 py-2 text-sm break-all text-brand-cream">
                  {user.uid}
                </code>
                <button
                  type="button"
                  onClick={copyUid}
                  className="inline-flex items-center gap-2 text-sm text-brand-accent hover:underline"
                >
                  <Copy size={16} aria-hidden="true" />
                  {copied ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
              <button
                type="button"
                onClick={logout}
                className="text-sm text-brand-platinum underline"
              >
                Sair desta conta
              </button>
            </div>
          ) : (
            <>
              {/* As abas. São <button> e não link: trocar de lista não é
                  navegar — o endereço do painel é um só, e ele é privado. */}
              <div
                role="tablist"
                aria-label="Listas de cadastro"
                className="mb-6 flex gap-1 border-b border-white/10"
              >
                {(Object.keys(LISTAS) as NomeDaLista[]).map((nome) => (
                  <button
                    key={nome}
                    type="button"
                    role="tab"
                    aria-selected={aba === nome}
                    onClick={() => setAba(nome)}
                    className={`-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                      aba === nome
                        ? 'border-brand-accent text-brand-cream'
                        : 'border-transparent text-brand-platinum hover:text-brand-cream'
                    }`}
                  >
                    {LISTAS[nome].rotulo}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <p className="text-brand-platinum">
                  {leads.length} {leads.length === 1 ? 'cadastro' : 'cadastros'}
                  {user.email && <> · {user.email}</>}
                </p>
                <div className="flex items-center gap-4">
                  {leads.length > 0 && (
                    <a
                      href={csvHref}
                      download={`${lista.arquivo}-${new Date().toISOString().slice(0, 10)}.csv`}
                      className="inline-flex items-center gap-2 text-sm text-brand-accent hover:underline"
                    >
                      <Download size={16} aria-hidden="true" />
                      Baixar CSV
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={logout}
                    className="text-sm text-brand-platinum underline"
                  >
                    Sair
                  </button>
                </div>
              </div>

              <AnimatePresence initial={false}>
                {error && (
                  <motion.div
                    variants={collapse}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    className="overflow-hidden"
                  >
                    <p
                      role="alert"
                      className="mb-6 border border-brand-danger/30 bg-brand-danger/[0.05] p-6 text-brand-danger"
                    >
                      {error}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Skeleton → tabela também passa pelo <Troca>: o esqueleto
                  sendo substituído no mesmo quadro pela tabela real é o
                  "instantaneous replacement" que a auditoria aponta. */}
              {/* A aba entra na chave: sem ela, trocar de lista redesenha a
                  tabela no mesmo quadro, que é o corte seco que o <Troca>
                  existe para evitar. */}
              <Troca
                chave={`${aba}-${loadingLeads ? 'carregando' : leads.length === 0 ? 'vazio' : 'tabela'}`}
              >
                {loadingLeads ? (
                  showSkeleton && (
                    <div
                      role="status"
                      aria-live="polite"
                      className="overflow-x-auto border border-white/12"
                    >
                      <span className="sr-only">Carregando cadastros…</span>
                      <table className="w-full">
                        <tbody>
                          {Array.from({ length: 4 }, (_, i) => (
                            <SkeletonRow key={i} />
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )
                ) : leads.length === 0 ? (
                  <p className="border border-white/10 p-8 text-center">{lista.vazio}</p>
                ) : (
                  <div className="overflow-x-auto border border-white/12">
                    <table className="w-full text-left text-sm">
                      <caption className="sr-only">{lista.rotulo}</caption>
                      <thead className="bg-white/5 text-brand-cream">
                        <tr>
                          <th scope="col" className="p-4 font-bold">
                            Nome
                          </th>
                          <th scope="col" className="p-4 font-bold">
                            E-mail
                          </th>
                          <th scope="col" className="p-4 font-bold">
                            {lista.coluna}
                          </th>
                          <th scope="col" className="p-4 font-bold">
                            Origem
                          </th>
                          <th scope="col" className="p-4 font-bold">
                            Campanha
                          </th>
                          <th scope="col" className="p-4 font-bold">
                            Data
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-brand-platinum">
                        {leads.map((lead) => (
                          <tr key={lead.id} className="border-t border-white/5">
                            <td className="p-4 text-brand-cream">{lead.name}</td>
                            <td className="p-4">
                              <a
                                href={`mailto:${lead.email}`}
                                className="hover:text-brand-accent"
                              >
                                {lead.email}
                              </a>
                            </td>
                            <td className="p-4">{lead.referencia}</td>
                            {/* A rota que trouxe o lead: qual artigo converte,
                                e portanto sobre o que escrever o próximo. */}
                            <td className="p-4 whitespace-nowrap">{lead.origem || '—'}</td>
                            {/* E por qual anúncio essa pessoa chegou ao site.
                                O GA4 responde isso em agregado; aqui a
                                resposta vem com nome e e-mail ao lado, que é
                                o que permite saber a quem ligar primeiro. */}
                            <td className="p-4 whitespace-nowrap">{lead.campanha || '—'}</td>
                            <td className="p-4 whitespace-nowrap">
                              {lead.createdAt
                                ? lead.createdAt.toDate().toLocaleString('pt-BR')
                                : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </Troca>
            </>
          )}
        </Troca>
      </main>
    </>
  );
}
