import { Helmet } from '@dr.pogodin/react-helmet';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { Copy, Download, Loader2, LogIn, ShieldAlert } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { SkeletonRow } from '../components/Skeleton';
import { isAdmin } from '../config/admin';
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
  const [copied, setCopied] = useState(false);

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
      <Helmet>
        <title>Lista de espera | Instituto Bruno Sena</title>
        {/* Página interna: nunca deve ser indexada */}
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-5xl mx-auto px-6 pt-36 pb-24">
        <h1 className="font-display text-4xl font-bold text-white mb-8">Lista de espera</h1>

        {checkingAuth ? (
          <p className="text-brand-platinum flex items-center gap-2" role="status">
            <Loader2 className="animate-spin" size={18} aria-hidden="true" />
            Verificando acesso…
          </p>
        ) : !user ? (
          <div className="bloco p-8 text-center">
            <p className="text-brand-platinum mb-6">
              Entre com a conta Google autorizada para ver os cadastros.
            </p>
            <button type="button" onClick={loginWithGoogle} className="btn-primary mx-auto">
              <LogIn size={18} aria-hidden="true" />
              Entrar com Google
            </button>
          </div>
        ) : !allowed ? (
          <div className="border border-brand-danger/30 bg-brand-danger/[0.05] p-8">
            <ShieldAlert className="text-brand-danger mb-4" size={32} aria-hidden="true" />
            <h2 className="text-xl font-bold text-white mb-3">Esta conta não tem acesso</h2>
            <p className="text-brand-platinum mb-6">
              Para liberar, copie o identificador abaixo e adicione à lista{' '}
              <code className="text-brand-accent">ADMIN_UIDS</code> em{' '}
              <code className="text-brand-accent">src/config/admin.ts</code> e também em{' '}
              <code className="text-brand-accent">firestore.rules</code>. Depois publique as
              regras com{' '}
              <code className="text-brand-accent">firebase deploy --only firestore:rules</code>.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <code className="border border-white/12 bg-brand-dark px-4 py-2 text-sm break-all text-white">
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
                  <thead className="bg-white/5 text-white">
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
                        <td className="p-4 text-white">{lead.name}</td>
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
      </div>
    </>
  );
}
