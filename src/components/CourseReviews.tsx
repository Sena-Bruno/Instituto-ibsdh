import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from 'firebase/firestore/lite';
import { LogIn, Star, Trash2, UserCircle2 } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import type React from 'react';
import { useCallback, useEffect, useState } from 'react';
import { db } from '../firebase/banco';
import { revealUp, staggerContainer } from '../lib/motion';
import { useAutenticacao } from '../lib/useAutenticacao';
import { useDelayedFlag } from '../lib/useDelayedFlag';
import { SkeletonReview } from './Skeleton';

interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  /** Timestamp do Firestore; ausente até o servidor gravar o valor. */
  createdAt?: { toDate: () => Date };
}

export const CourseReviews = ({ courseId }: { courseId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  /* O SDK de autenticação só desce se alguém for escrever — ver
     `lib/useAutenticacao.ts`. Ler as avaliações não passa por login. */
  const { usuario: user, entrando, erro: erroDeLogin, entrar, sair } = useAutenticacao();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Sem estes dois, a lista aparecia como "Ainda não há avaliações"
  // enquanto a consulta estava em andamento, e uma falha do Firestore
  // ficava só no console — o visitante via um vazio permanente.
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitError, setSubmitError] = useState('');
  // Numa conexão boa a consulta volta em ~150ms; mostrar e esconder o
  // skeleton nesse intervalo incomoda mais do que a espera.
  const showSkeleton = useDelayedFlag(isLoading);

  /**
   * Lê a lista uma vez.
   *
   * Era um `onSnapshot`, que mantinha um canal aberto com o servidor e
   * redesenhava a lista a cada gravação de qualquer visitante. O que isso
   * comprava, na prática, era nada: ninguém fica parado numa página de
   * curso esperando a avaliação de um desconhecido aparecer. O que custava
   * era o cliente de tempo real do Firestore — a maior parte dos 652 kB
   * que esta seção baixava só para exibir meia dúzia de comentários.
   *
   * Com uma leitura só, a versão `lite` do SDK basta, e ela é uma fração
   * do tamanho. O único momento em que a lista precisa mudar sozinha é
   * depois de o próprio visitante escrever ou apagar — e isso está logo
   * abaixo, explícito.
   */
  const buscarAvaliacoes = useCallback(async () => {
    const q = query(
      collection(db, 'course_reviews'),
      where('courseId', '==', courseId),
      orderBy('createdAt', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as Review[];
  }, [courseId]);

  useEffect(() => {
    // Ao trocar de curso, volta ao estado de carregamento: sem isto a
    // lista do curso anterior ficaria visível até a nova consulta chegar.
    setIsLoading(true);

    /* A resposta de uma consulta abandonada não pode escrever na tela: se
       o visitante trocar de curso antes de ela chegar, a lista do curso
       anterior sobrescreveria a do curso atual. */
    let atual = true;
    buscarAvaliacoes()
      .then((lista) => {
        if (!atual) return;
        setReviews(lista);
        setLoadError(false);
      })
      .catch((error) => {
        if (!atual) return;
        console.error('Erro ao carregar avaliações:', error);
        setLoadError(true);
      })
      .finally(() => {
        if (atual) setIsLoading(false);
      });

    return () => {
      atual = false;
    };
  }, [buscarAvaliacoes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    setSubmitError('');
    try {
      await addDoc(collection(db, 'course_reviews'), {
        courseId,
        userId: user.uid,
        userName: user.displayName || 'Usuário',
        userPhoto: user.photoURL || '',
        rating: newRating,
        comment: newComment.trim(),
        createdAt: serverTimestamp(),
      });
      setNewComment('');
      setNewRating(5);

      /* A releitura é o que substitui o tempo real: a avaliação recém
         escrita precisa aparecer na lista, e é a única atualização que o
         visitante espera ver. Se ela falhar, o comentário já está gravado
         — recarregar a página mostra tudo —, então não vira erro na tela. */
      try {
        setReviews(await buscarAvaliacoes());
      } catch (error) {
        console.error('Avaliação gravada, mas a lista não recarregou:', error);
      }
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      setSubmitError('Não foi possível enviar sua avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteDoc(doc(db, 'course_reviews', reviewId));
      // Tirar da lista aqui, e não numa releitura: o item some com a
      // animação de saída, que é o retorno visível de ter apagado.
      setReviews((atuais) => atuais.filter((r) => r.id !== reviewId));
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  // Calculate average rating
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-8">
        <h3 className="font-display text-2xl font-bold text-brand-cream md:text-[28px]">
          Avaliações de Alunos
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-baseline gap-2 border-l border-white/15 pl-4">
            <Star className="text-brand-accent fill-brand-accent" size={20} />
            <span className="text-brand-cream font-bold">{averageRating}</span>
            <span className="text-brand-platinum text-sm">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="cartao mb-10 p-6">
        {user ? (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 mb-6">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || ''}
                  className="h-11 w-11 rounded-full border border-white/20 object-cover"
                />
              ) : (
                <UserCircle2 className="h-11 w-11 text-brand-platinum" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-brand-cream font-medium">{user.displayName}</p>
                  <button
                    type="button"
                    onClick={sair}
                    className="text-xs text-brand-platinum hover:text-brand-accent transition-colors underline"
                  >
                    Sair
                  </button>
                </div>
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      aria-label={`Avaliar com ${star} ${star === 1 ? 'estrela' : 'estrelas'}`}
                      aria-pressed={star === newRating}
                      className="transition-opacity hover:opacity-75"
                    >
                      <Star
                        size={20}
                        aria-hidden="true"
                        className={
                          star <= newRating
                            ? 'text-brand-accent fill-brand-accent'
                            : 'text-white/40'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Compartilhe sua experiência com esta formação..."
              className="mb-4 h-28 w-full resize-none rounded-[14px] border border-white/12 bg-black/40 p-4 text-brand-cream transition-colors placeholder:text-white/60 focus:border-brand-accent/60"
              required
              maxLength={2000}
            />
            {submitError && (
              <p role="alert" className="text-brand-danger text-sm mb-4">
                {submitError}
              </p>
            )}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || !newComment.trim()}
                className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? 'Enviando...' : 'Publicar Avaliação'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <h4 className="text-xl text-brand-cream font-medium mb-3">Já fez esta formação?</h4>
            <p className="text-brand-platinum mb-6">
              Faça login para compartilhar sua experiência com outros alunos.
            </p>
            <button
              type="button"
              onClick={entrar}
              disabled={entrando}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-brand-dark transition-colors hover:bg-brand-platinum disabled:cursor-not-allowed disabled:opacity-60"
            >
              <LogIn size={20} aria-hidden="true" />
              {entrando ? 'Entrando…' : 'Entrar com Google'}
            </button>

            {/* O botão era `onClick={loginWithGoogle}`, com a promessa
                solta: num domínio não autorizado no Firebase, clicar não
                fazia nada — nem janela, nem mensagem. Agora a recusa vira
                uma frase que diz onde se conserta. */}
            {erroDeLogin && (
              <p
                role="alert"
                className="mx-auto mt-6 max-w-md text-left text-[13.5px] leading-relaxed text-brand-danger"
              >
                {erroDeLogin}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          showSkeleton && (
            <div role="status" aria-live="polite" className="space-y-6">
              <span className="sr-only">Carregando avaliações…</span>
              <SkeletonReview />
              <SkeletonReview />
            </div>
          )
        ) : loadError ? (
          <p
            role="alert"
            className="rounded-[18px] border border-brand-danger/25 bg-brand-danger/[0.05] px-6 py-7 text-center text-brand-danger"
          >
            Não foi possível carregar as avaliações agora. Recarregue a página para tentar de
            novo.
          </p>
        ) : reviews.length === 0 ? (
          <p className="cartao px-6 py-7 text-center">
            Ainda não há avaliações para esta formação. Seja o primeiro a avaliar!
          </p>
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <AnimatePresence initial={false}>
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  variants={revealUp}
                  exit={{ opacity: 0, scale: 0.97 }}
                  className="cartao p-6"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      {review.userPhoto ? (
                        <img
                          src={review.userPhoto}
                          alt={review.userName}
                          className="h-9 w-9 rounded-full border border-white/20 object-cover"
                        />
                      ) : (
                        <UserCircle2 className="h-9 w-9 text-brand-platinum" />
                      )}
                      <div>
                        <h5 className="text-brand-cream font-medium">{review.userName}</h5>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                className={
                                  i < review.rating
                                    ? 'text-brand-accent fill-brand-accent'
                                    : 'text-white/40'
                                }
                              />
                            ))}
                          </div>
                          {review.createdAt && (
                            <span className="text-[12px] text-brand-quiet">
                              {new Date(review.createdAt.toDate()).toLocaleDateString('pt-BR')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {user && user.uid === review.userId && (
                      <button
                        type="button"
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-white/60 transition-colors hover:text-brand-danger"
                        title="Excluir avaliação"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                  <p className="text-brand-platinum leading-relaxed whitespace-pre-wrap">
                    {review.comment}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
};
