import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, loginWithGoogle, logout } from '../firebase';
import { Star, Trash2, UserCircle2, LogIn } from 'lucide-react';

interface Review {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  userPhoto?: string;
  rating: number;
  comment: string;
  createdAt: any;
}

export const CourseReviews = ({ courseId }: { courseId: string }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Sem estes dois, a lista aparecia como "Ainda não há avaliações"
  // enquanto a consulta estava em andamento, e uma falha do Firestore
  // ficava só no console — o visitante via um vazio permanente.
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    const q = query(
      collection(db, 'course_reviews'),
      where('courseId', '==', courseId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedReviews = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(fetchedReviews);
      setIsLoading(false);
      setLoadError(false);
    }, (error) => {
      console.error('Erro ao carregar avaliações:', error);
      setIsLoading(false);
      setLoadError(true);
    });

    return () => unsubscribe();
    setIsLoading(true);
    return () => unsubscribe();
  }, [courseId]);

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
        createdAt: serverTimestamp()
      });
      setNewComment('');
      setNewRating(5);
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
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  // Calculate average rating
  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="w-full max-w-4xl mx-auto py-16 px-6">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl md:text-3xl font-display font-bold text-white">Avaliações de Alunos</h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
            <Star className="text-brand-accent fill-brand-accent" size={20} />
            <span className="text-white font-bold">{averageRating}</span>
            <span className="text-brand-platinum text-sm">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Review Form */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10">
        {user ? (
          <form onSubmit={handleSubmit}>
            <div className="flex items-center gap-4 mb-6">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-12 h-12 rounded-full border border-white/20"  />
              ) : (
                <UserCircle2 className="w-12 h-12 text-brand-platinum" />
              )}
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <p className="text-white font-medium">{user.displayName}</p>
                  <button
                    type="button"
                    onClick={logout}
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
                      className="rounded transition-transform hover:scale-110"
                    >
                      <Star
                        size={20}
                        aria-hidden="true"
                        className={star <= newRating ? 'text-brand-accent fill-brand-accent' : 'text-white/40'}
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
              className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/60 focus:outline-none focus:border-brand-accent/50 focus:ring-1 focus:ring-brand-accent/50 resize-none h-28 mb-4 transition-all"
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
                className="btn-primary px-8 py-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {isSubmitting ? 'Enviando...' : 'Publicar Avaliação'}
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-8">
            <h4 className="text-xl text-white font-medium mb-3">Já fez esta formação?</h4>
            <p className="text-brand-platinum mb-6">Faça login para compartilhar sua experiência com outros alunos.</p>
            <button
              onClick={loginWithGoogle}
              className="inline-flex items-center gap-2 bg-white text-brand-dark px-6 py-3 rounded-full font-bold hover:bg-brand-platinum transition-colors"
            >
              <LogIn size={20} />
              Entrar com Google
            </button>
          </div>
        )}
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {isLoading ? (
          <p
            role="status"
            aria-live="polite"
            className="text-center text-brand-platinum py-8 bg-white/5 rounded-2xl border border-white/5"
          >
            Carregando avaliações…
          </p>
        ) : loadError ? (
          <p
            role="alert"
            className="text-center text-brand-danger py-8 bg-white/5 rounded-2xl border border-white/5"
          >
            Não foi possível carregar as avaliações agora. Recarregue a página para tentar de novo.
          </p>
        ) : reviews.length === 0 ? (
          <p className="text-center text-brand-platinum py-8 bg-white/5 rounded-2xl border border-white/5">
            Ainda não há avaliações para esta formação. Seja o primeiro a avaliar!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 transition-all hover:bg-white/10">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  {review.userPhoto ? (
                    <img src={review.userPhoto} alt={review.userName} className="w-10 h-10 rounded-full border border-white/20"  />
                  ) : (
                    <UserCircle2 className="w-10 h-10 text-brand-platinum" />
                  )}
                  <div>
                    <h5 className="text-white font-medium">{review.userName}</h5>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < review.rating ? "text-brand-accent fill-brand-accent" : "text-white/40"}
                          />
                        ))}
                      </div>
                      {review.createdAt && (
                        <span className="text-xs text-white/70">
                          {new Date(review.createdAt.toDate()).toLocaleDateString('pt-BR')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                {user && user.uid === review.userId && (
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-white/60 hover:text-red-400 transition-colors p-2"
                    title="Excluir avaliação"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
              <p className="text-brand-platinum leading-relaxed whitespace-pre-wrap">
                {review.comment}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
