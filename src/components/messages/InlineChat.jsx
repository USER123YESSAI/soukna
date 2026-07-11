import { useEffect, useRef, useState, useCallback } from 'react';
import { messageService } from '../../services/messageService';
import { getErrorMessage } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import toast from 'react-hot-toast';

/* ── Avatar ───────────────────────────────────────────────── */
function Avatar({ name, size = 28, color = '#6366f1' }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 99, flexShrink: 0,
      background: `linear-gradient(135deg, ${color}, #8b5cf6)`,
      color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38
    }}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

/* ── Bulle de message ─────────────────────────────────────── */
function Bubble({ msg, isMine }) {
  return (
    <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
      <div style={{
        maxWidth: '78%', padding: '8px 12px',
        borderRadius: isMine ? '14px 14px 3px 14px' : '14px 14px 14px 3px',
        background: isMine ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'white',
        color: isMine ? 'white' : '#0f172a',
        border: isMine ? 'none' : '1px solid var(--border)',
        fontSize: 13, lineHeight: 1.5,
      }}>
        <p style={{ margin: 0 }}>{msg.content}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 3 }}>
          <span style={{ fontSize: 10, opacity: .65, color: isMine ? 'white' : '#94a3b8' }}>
            {msg.created_at
              ? new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
              : ''}
          </span>
          {isMine && (
            <span style={{ fontSize: 10, opacity: .65, color: 'white' }}>
              {msg.read_at || msg.is_read ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Composant InlineChat ─────────────────────────────────── */
export default function InlineChat({
  recipientId,
  recipientName,
  title,
  maxHeight = 360,
  accentColor = '#6366f1',
}) {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const pollingRef = useRef(null);

  const scrollBottom = useCallback(() => {
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  /* Charger le thread */
  const loadThread = useCallback(() => {
    if (!recipientId) return;
    messageService.getThread(recipientId)
      .then(({ data }) => {
        const msgs = data.messages ?? data.data ?? [];
        setMessages(Array.isArray(msgs) ? [...msgs].reverse() : []);
        scrollBottom();
      })
      .catch(() => {});
  }, [recipientId, scrollBottom]);

  /* Chargement initial + polling 5s */
  useEffect(() => {
    if (!recipientId) return;
    setLoading(true);
    messageService.getThread(recipientId)
      .then(({ data }) => {
        const msgs = data.messages ?? data.data ?? [];
        setMessages(Array.isArray(msgs) ? [...msgs].reverse() : []);
        scrollBottom();
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    pollingRef.current = setInterval(loadThread, 5000);
    return () => clearInterval(pollingRef.current);
  }, [recipientId, loadThread, scrollBottom]);

  /* Envoi */
  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !recipientId || sending) return;
    const content = text.trim();
    setSending(true);
    setText('');

    // Optimistic update
    const tmp = {
      id: `tmp_${Date.now()}`,
      content,
      sender_id: user?.id,
      is_mine: true,
      created_at: new Date().toISOString(),
      read_at: null,
    };
    setMessages(prev => [...prev, tmp]);
    scrollBottom();

    try {
      await messageService.send({ recipient_id: recipientId, content });
      // Rafraîchir le thread
      const { data } = await messageService.getThread(recipientId);
      setMessages(Array.isArray(data.messages ?? data.data) ? [...(data.messages ?? data.data)].reverse() : []);
    } catch (err) {
      toast.error(getErrorMessage(err));
      setMessages(prev => prev.filter(m => m.id !== tmp.id));
      setText(content);
    } finally {
      setSending(false);
      scrollBottom();
    }
  };

  if (!recipientId) return null;

  return (
    <div style={{
      background: 'white', borderRadius: 16,
      border: '1.5px solid var(--border)',
      overflow: 'hidden', boxShadow: 'var(--shadow-sm)',
    }}>
      {/* Header */}
      <div style={{
        padding: '10px 14px',
        borderBottom: '1px solid var(--border)',
        background: '#fafafa',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <Avatar name={recipientName} size={28} color={accentColor} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#0f172a' }}>
            {title || `💬 Conversation avec ${recipientName ?? 'Utilisateur'}`}
          </p>
        </div>
      </div>

      {/* Zone messages */}
      <div style={{
        height: maxHeight, overflowY: 'auto', padding: '10px 12px',
        background: '#f8fafc',
      }}>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <LoadingSpinner size="sm" />
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px 12px', color: '#94a3b8' }}>
            <div style={{ fontSize: 28, marginBottom: 6 }}>👋</div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 500 }}>
              Démarrez la conversation avec <strong>{recipientName}</strong>
            </p>
          </div>
        ) : (
          <>
            {messages.map(msg => (
              <Bubble
                key={msg.id}
                msg={msg}
                isMine={msg.sender?.id === user?.id || msg.sender_id === user?.id || msg.is_mine}
              />
            ))}
            <div ref={endRef} />
          </>
        )}
      </div>

      {/* Zone saisie */}
      <div style={{
        padding: '8px 10px',
        borderTop: '1px solid var(--border)',
        background: 'white',
      }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: 6 }}>
          <input
            ref={inputRef}
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }
            }}
            placeholder="Écrire un message..."
            style={{
              flex: 1, padding: '8px 12px',
              border: '1.5px solid var(--border)',
              borderRadius: 10, fontSize: 13,
              outline: 'none', fontFamily: 'inherit',
              transition: 'border-color .15s',
            }}
            onFocus={e => e.target.style.borderColor = accentColor}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            type="submit"
            disabled={!text.trim() || sending}
            style={{
              width: 34, height: 34, borderRadius: 10,
              border: 'none',
              cursor: !text.trim() || sending ? 'not-allowed' : 'pointer',
              background: !text.trim() || sending
                ? '#e2e8f0'
                : `linear-gradient(135deg, ${accentColor}, #8b5cf6)`,
              color: !text.trim() || sending ? '#94a3b8' : 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, transition: 'all .15s',
              boxShadow: !text.trim() || sending ? 'none' : `0 2px 8px ${accentColor}40`,
            }}
          >
            {sending
              ? <div style={{
                  width: 14, height: 14, borderRadius: 99,
                  border: '2px solid #94a3b8', borderTopColor: 'transparent',
                  animation: 'spin .6s linear infinite',
                }} />
              : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
            }
          </button>
        </form>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
