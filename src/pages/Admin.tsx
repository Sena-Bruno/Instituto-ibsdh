import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Copy, Download, Loader2, LogIn, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Seo from '../components/Seo';
import { SkeletonRow } from '../components/Skeleton';
import { isAdmin } from '../config/admin';
import { routes, site } from '../config/site';
import { auth, db, loginWithGoogle, logout } from '../firebase';
import { useDelayedFlag } from '../lib/useDelayedFlag';

interface Lead {
  id: string;
  name: string;
  email: string;
  courseId: string;
  createdAt?: { toDate: () => Date };
}

/**
 * Traduz o código de erro do Firebase para uma frase que diz o que fazer.
 *
 * O caso que motivou isto é o primeiro da lista. O Firebase só permite
 * login nos domínios que estão em Authentication → Settings → Authorized
 * domains, e um projeto novo traz ali apenas `localhost` e os endereços
 * `*.firebaseapp.com` / `*.web.app`. Publicar o site no domínio próprio
 * portanto quebra o login, e a mensagem crua do SDK
 * (`auth/unauthorized-domain`) não diz onde se conserta.
 */
function mensagemDoErroDeLogin(codigo: string | undefined): string {
  switch (codigo) {
    case 'auth/unauthorized-domain':
      return `Este endereço (${window.location.hostname}) não está autorizado no Firebase. No console do Firebase, em Authentication → Settings → Authorized domains, acrescente este domínio e tente de novo.`;
    case 'auth/operation-not-allowed':
      return 'O login com Google não está habilitado neste projeto do Firebase. Ative-o em Authentication → Sign-in method.';
    case 'auth/popup-blocked':
      return 'O navegador bloqueou a janela de login. Libere os pop-ups para este site e tente de novo.';
    case 'auth/popup-closed-by-user':
    case 'auth/cancelled-popup-request':
      return 'A janela de login foi fechada antes de concluir.';
    case 'auth/network-request-failed':
      return 'Não foi possível falar com o Firebase. Verifique a conexão e tente de novo.';
    default:
      return codigo
        ? `Não foi possível entrar (${codigo}).`
        : 'Não foi possível entrar. Tente de novo.';
  }
}

/**
 * Painel da lista de espera.
 *
 * A coleção `waitlist` é fechada para leitura pública — são dados
 * pessoais sob a LGPD. Só os UID listados em config/admin.ts (e na mesma
 * lista dentro de firestore.rules) conseguem ler.
 *
 * A rota é noindex: não deve aparecer em busca.
 */
export default function Admin() {
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [leads, setLeads] = useState<Lead[]>([]);
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
      const codigo =
        typeof err === 'object' && err !== null && 'code' in err
          ? String((err as { code: unknown }).code)
          : undefined;
      setErroLogin(mensagemDoErroDeLogin(codigo));
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

  useEffect(() => {
    if (!allowed) return;
    const q = query(collection(db, 'waitlist'), orderBy('createdAt', 'desc'));
    return onSnapshot(
      q,
      (snap) => {
        setLeads(snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Lead[]);
        setLoadingLeads(false);
        setError('');
      },
      (err) => {
        console.error('Erro ao carregar a lista de espera:', err);
        setLoadingLeads(false);
        setError(
          'Não foi possível ler a lista. Confira se o seu UID também está em firestore.rules e se as regras foram publicadas.',
        );
      },
    );
  }, [allowed]);

  const csv = useMemo(() => {
    const aspas = (v: string) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = leads.map((l) =>
      [
        aspas(l.name),
        aspas(l.email),
        aspas(l.courseId),
        aspas(l.createdAt ? l.createdAt.toDate().toLocaleString('pt-BR') : ''),
      ].join(','),
    );
    return ['nome,email,curso,data', ...rows].join('\n');
  }, [leads]);

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
        titulo={`Lista de espera | ${site.name}`}
        descricao="Painel interno do Instituto Bruno Sena."
        indexar={false}
      />

      <main className="max-w-5xl mx-auto px-6 pt-36 pb-24">
        <h1 className="font-display text-4xl font-bold text-brand-cream mb-8">
          Lista de espera
        </h1>

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

            {erroLogin && (
              <p
                role="alert"
                className="mx-auto mt-6 max-w-md text-left text-[13.5px] leading-relaxed text-brand-danger"
              >
                {erroLogin}
              </p>
            )}
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
              <code className="text-brand-accent">firebase deploy --only firestore:rules</code>.
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
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
              <p className="text-brand-platinum">
                {leads.length} {leads.length === 1 ? 'cadastro' : 'cadastros'}
                {user.email && <> · {user.email}</>}
              </p>
              <div className="flex items-center gap-4">
                {leads.length > 0 && (
                  <a
                    href={csvHref}
                    download={`lista-de-espera-${new Date().toISOString().slice(0, 10)}.csv`}
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

            {error && (
              <p
                role="alert"
                className="mb-6 border border-brand-danger/30 bg-brand-danger/[0.05] p-6 text-brand-danger"
              >
                {error}
              </p>
            )}

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
              <p className="border border-white/10 p-8 text-center">Nenhum cadastro ainda.</p>
            ) : (
              <div className="overflow-x-auto border border-white/12">
                <table className="w-full text-left text-sm">
                  <caption className="sr-only">Cadastros na lista de espera</caption>
                  <thead className="bg-white/5 text-brand-cream">
                    <tr>
                      <th scope="col" className="p-4 font-bold">
                        Nome
                      </th>
                      <th scope="col" className="p-4 font-bold">
                        E-mail
                      </th>
                      <th scope="col" className="p-4 font-bold">
                        Curso
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
                          <a href={`mailto:${lead.email}`} className="hover:text-brand-accent">
                            {lead.email}
                          </a>
                        </td>
                        <td className="p-4">{lead.courseId}</td>
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
          </>
        )}
      </main>
    </>
  );
}
