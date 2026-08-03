import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const INITIAL_REVIEWS = [
  {
    id: 1,
    author: 'Youssef B.',
    rating: 5,
    title: 'Produit conforme et d\'excellente qualité !',
    comment: 'Livré en 48h, emballage soigné. Le produit fonctionne parfaitement et correspond tout à fait aux photos.',
    date: 'Il y a 2 jours',
    verified: true,
    helpful: 12,
  },
  {
    id: 2,
    author: 'Sophie M.',
    rating: 5,
    title: 'Très satisfaite de mon achat',
    comment: 'Rapport qualité/prix imbattable. Le vendeur est réactif en cas de question. Je recommande vivement.',
    date: 'Il y a 1 semaine',
    verified: true,
    helpful: 5,
  },
  {
    id: 3,
    author: 'Karim L.',
    rating: 4,
    title: 'Bon produit dans l\'ensemble',
    comment: 'Bonne finition et très pratique au quotidien. Un tout petit délai de livraison de 3 jours, mais rien de bien méchant.',
    date: 'Il y a 2 semaines',
    verified: true,
    helpful: 3,
  },
];

export default function ProductReviews({ productId }) {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [showModal, setShowModal] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState('');
  const [newComment, setNewComment] = useState('');
  const [helpfulVotes, setHelpfulVotes] = useState({});

  const avgRating = (
    reviews.reduce((sum, r) => sum + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  const handleOpenReviewModal = () => {
    if (!isAuthenticated) {
      toast.error('Veuillez vous connecter pour publier un avis.');
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newComment.trim()) {
      toast.error('Veuillez remplir le titre et le commentaire.');
      return;
    }

    const createdReview = {
      id: Date.now(),
      author: user?.name || 'Acheteur',
      rating: Number(newRating),
      title: newTitle.trim(),
      comment: newComment.trim(),
      date: 'À l\'instant',
      verified: true,
      helpful: 0,
    };

    setReviews([createdReview, ...reviews]);
    setShowModal(false);
    setNewTitle('');
    setNewComment('');
    toast.success('Votre avis a été publié avec succès ! Merci pour votre retour.');
  };

  const handleHelpfulClick = (reviewId) => {
    if (helpfulVotes[reviewId]) {
      toast.error('Vous avez déjà voté pour cet avis.');
      return;
    }
    setHelpfulVotes((prev) => ({ ...prev, [reviewId]: true }));
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r))
    );
    toast.success('Merci pour votre vote !');
  };

  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: 20,
        border: '1px solid #e2e8f0',
        padding: 32,
        marginTop: 40,
        boxShadow: '0 4px 24px rgba(15, 23, 42, 0.04)',
      }}
    >
      {/* En-tête de la section des avis */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 24,
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: 24,
          marginBottom: 28,
        }}
      >
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
            Avis clients & Évaluations
          </h2>
          <p style={{ margin: 0, color: '#64748b', fontSize: 14 }}>
            Découvrez les retours de nos acheteurs vérifiés sur ce produit.
          </p>
        </div>

        {/* Bloc score global & bouton */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: '#f8fafc',
              padding: '12px 20px',
              borderRadius: 14,
              border: '1px solid #e2e8f0',
            }}
          >
            <span style={{ fontSize: 32, fontWeight: 800, color: '#0f172a' }}>{avgRating}</span>
            <div>
              <div style={{ display: 'flex', gap: 2, color: '#eab308' }}>
                {'★'.repeat(Math.round(avgRating))}
                {'☆'.repeat(5 - Math.round(avgRating))}
              </div>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>
                {reviews.length} avis vérifiés
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleOpenReviewModal}
            className="btn-primary"
            style={{
              padding: '12px 22px',
              borderRadius: 12,
              fontWeight: 600,
              fontSize: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'pointer',
              border: 'none',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.25)',
            }}
          >
            Rédiger un avis
          </button>
        </div>
      </div>

      {/* Liste des avis clients */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {reviews.map((review) => (
          <div
            key={review.id}
            style={{
              padding: 24,
              borderRadius: 16,
              background: '#f8fafc',
              border: '1px solid #f1f5f9',
              transition: 'all 0.2s ease',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: '#e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#334155',
                    fontSize: 16,
                  }}
                >
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontWeight: 700, color: '#0f172a', fontSize: 15 }}>
                      {review.author}
                    </span>
                    {review.verified && (
                      <span
                        style={{
                          fontSize: 12,
                          background: '#dcfce7',
                          color: '#166534',
                          padding: '2px 8px',
                          borderRadius: 20,
                          fontWeight: 600,
                          display: 'inline-block',
                        }}
                      >
                        Acheteur vérifié
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: '#94a3b8' }}>{review.date}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 2, color: '#eab308', fontSize: 16 }}>
                {'★'.repeat(review.rating)}
                {'☆'.repeat(5 - review.rating)}
              </div>
            </div>

            <h4 style={{ margin: '0 0 6px 0', fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
              {review.title}
            </h4>
            <p
              style={{
                margin: '0 0 16px 0',
                color: '#475569',
                fontSize: 14,
                lineHeight: 1.6,
              }}
            >
              {review.comment}
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={() => handleHelpfulClick(review.id)}
                style={{
                  background: helpfulVotes[review.id] ? '#e2e8f0' : '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: 20,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  color: helpfulVotes[review.id] ? '#1e293b' : '#64748b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  transition: 'all 0.2s ease',
                }}
              >
                Utile ({review.helpful})
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modale interactive de dépôt d'avis */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: 16,
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: 20,
              padding: 32,
              width: '100%',
              maxWidth: 520,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#0f172a' }}>
                Rédiger un avis
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 24,
                  color: '#64748b',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 8 }}>
                  Note globale (1 à 5 étoiles)
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setNewRating(star)}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: 28,
                        color: star <= newRating ? '#eab308' : '#cbd5e1',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'transform 0.1s ease',
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Titre du commentaire *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Excellent produit, conforme à mes attentes"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="form-input"
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#475569', marginBottom: 6 }}>
                  Votre expérience détaillée *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Détaillez la qualité, la livraison et votre satisfaction globale..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    fontSize: 14,
                    boxSizing: 'border-box',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    padding: '10px 18px',
                    borderRadius: 10,
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#475569',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 22px',
                    borderRadius: 10,
                    border: 'none',
                    background: '#2563eb',
                    color: 'white',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Publier l'avis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
