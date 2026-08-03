import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { messageService } from '../services/messageService';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatDate, getErrorMessage } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';

// ─── Sous-composants ────────────────────────────────────────

function Avatar({ name, size = 36, color = '#6366f1' }) {
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

function ConversationItem({ conv, isSelected, onClick }) {
  const other = conv.user ?? conv.other_user ?? conv;
  const lastMsg = conv.last_message ?? conv.latest_message;
  const unread = conv.unread_count ?? 0;

  return (
    <button onClick={onClick} style={{
      width: '100%', padding: '12px 14px', textAlign: 'left', border: 'none', cursor: 'pointer',
      background: isSelected ? '#eef2ff' : 'transparent', borderLeft: isSelected ? '3px solid #6366f1' : '3px solid transparent',
      display: 'flex', alignItems: 'center', gap: 10, transition: 'all .15s', fontFamily: 'inherit'
    }}>
      <div style={{ position: 'relative' }}>
        <Avatar name={other.name} size={40} color={isSelected ? '#6366f1' : '#64748b'} />
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -3, right: -3,
            minWidth: 18, height: 18, borderRadius: 99,
            background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
            border: '2px solid white'
          }}>{unread > 9 ? '9+' : unread}</span>
        )}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 4 }}>
          <span style={{ fontWeight: unread > 0 ? 700 : 600, fontSize: 14, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {other.name ?? `Utilisateur #${other.id}`}
          </span>
          {lastMsg?.created_at && (
            <span style={{ fontSize: 11, color: '#94a3b8', flexShrink: 0 }}>
              {new Date(lastMsg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
        {lastMsg && (
          <p style={{ margin: 0, fontSize: 12, color: unread > 0 ? '#475569' : '#94a3b8', fontWeight: unread > 0 ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {lastMsg.content}
          </p>
        )}
      </div>
    </button>
  );
}

function MessageBubble({ msg, isMine }) {
  return (
    <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
      <div style={{
        maxWidth: '72%', padding: '10px 14px', borderRadius: isMine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
        background: isMine ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'white',
        color: isMine ? 'white' : '#0f172a',
        border: isMine ? 'none' : '1.5px solid var(--border)',
        boxShadow: isMine ? '0 2px 8px rgba(99,102,241,.3)' : 'var(--shadow-sm)',
      }}>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.5 }}>{msg.content}</p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 6, marginTop: 4 }}>
          <span style={{ fontSize: 11, opacity: .7, color: isMine ? 'white' : '#94a3b8' }}>
            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
          {isMine && (
            <span style={{ fontSize: 11, opacity: .7, color: 'white' }}>
              {msg.read_at ? '✓✓' : '✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ─────────────────────────────────────────

function MessagesContent() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('user');

  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const pollingRef = useRef(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Charger conversations
  const loadConversations = useCallback(() => {
    messageService.getConversations()
      .then(({ data }) => {
        const convs = data.data ?? data.conversations ?? [];
        setConversations(Array.isArray(convs) ? convs : []);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoadingConvs(true);
    messageService.getConversations()
      .then(({ data }) => {
        const convs = data.data ?? data.conversations ?? [];
        setConversations(Array.isArray(convs) ? convs : []);
        // Sélection automatique via ?user=
        if (initialUserId) {
          const found = convs.find(c => String((c.user ?? c.other_user)?.id) === initialUserId);
          if (found) setSelectedUser(found.user ?? found.other_user);
          else setSelectedUser({ id: parseInt(initialUserId), name: `Utilisateur #${initialUserId}` });
        }
      })
      .catch(err => toast.error(getErrorMessage(err)))
      .finally(() => setLoadingConvs(false));
  }, [initialUserId]);

  // Charger messages du fil sélectionné + polling
  useEffect(() => {
    if (!selectedUser?.id) return;
    setLoadingMsgs(true);
    setMessages([]);

    const load = () => {
      messageService.getThread(selectedUser.id)
        .then(({ data }) => {
          const msgs = data.messages ?? data.data ?? [];
          setMessages(Array.isArray(msgs) ? [...msgs].reverse() : []);
          scrollToBottom();
        })
        .catch(() => {});
    };

    load();
    setLoadingMsgs(false);

    // Polling (réduit) pour limiter la charge serveur
    pollingRef.current = setInterval(() => {
      load();
      loadConversations();
    }, 15000);

    return () => clearInterval(pollingRef.current);
  }, [selectedUser?.id, scrollToBottom, loadConversations]);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  const handleSelectUser = (convUser) => {
    setSelectedUser(convUser);
    inputRef.current?.focus();
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser || sending) return;
    const text = newMessage.trim();
    setSending(true);
    setNewMessage('');

    // Optimistic update
    const optimistic = {
      id: `tmp_${Date.now()}`, content: text, sender_id: user?.id,
      is_mine: true, created_at: new Date().toISOString(), read_at: null
    };
    setMessages(prev => [...prev, optimistic]);
    scrollToBottom();

    try {
      await messageService.send({ recipient_id: selectedUser.id, content: text });
      // Rafraîchir après envoi
      const { data } = await messageService.getThread(selectedUser.id);
      setMessages(Array.isArray(data.messages ?? data.data) ? [...(data.messages ?? data.data)].reverse() : []);
      loadConversations();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setNewMessage(text);
    } finally {
      setSending(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }
  };

  const filteredConvs = conversations.filter(c => {
    const other = c.user ?? c.other_user ?? c;
    return other.name?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      <h1 style={{ margin: '0 0 20px', fontSize: 24, fontWeight: 800, color: '#0f172a' }}>Messagerie</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 0, height: 'calc(100vh - 220px)', minHeight: 500, background: 'white', borderRadius: 20, border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>

        {/* ── COLONNE GAUCHE : Conversations ── */}
        <div style={{ borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header conversations */}
          <div style={{ padding: '16px 14px', borderBottom: '1px solid var(--border)', background: '#fafafa' }}>
            <p style={{ margin: '0 0 10px', fontSize: 13, fontWeight: 700, color: '#0f172a' }}>
              Conversations {conversations.length > 0 && <span style={{ color: '#94a3b8', fontWeight: 400 }}>({conversations.length})</span>}
            </p>
            {/* Recherche */}
            <div style={{ position: 'relative' }}>
              <svg style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
              <input type="search" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Chercher..." style={{
                  width: '100%', padding: '7px 10px 7px 30px', border: '1.5px solid var(--border)',
                  borderRadius: 8, fontSize: 13, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
                  background: 'white'
                }} />
            </div>
          </div>

          {/* Liste conversations */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loadingConvs ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}><LoadingSpinner /></div>
            ) : filteredConvs.length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#94a3b8' }}>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 500 }}>
                  {searchQuery ? 'Aucun résultat' : 'Aucune conversation'}
                </p>
              </div>
            ) : (
              filteredConvs.map(conv => {
                const other = conv.user ?? conv.other_user ?? conv;
                return (
                  <ConversationItem
                    key={other.id}
                    conv={conv}
                    isSelected={selectedUser?.id === other.id}
                    onClick={() => handleSelectUser(other)}
                  />
                );
              })
            )}
          </div>
        </div>

        {/* ── COLONNE DROITE : Fil de messages ── */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selectedUser ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <h3 style={{ margin: '0 0 8px', fontSize: 18, fontWeight: 700, color: '#475569' }}>Vos messages</h3>
              <p style={{ margin: 0, fontSize: 14, textAlign: 'center', maxWidth: 280, lineHeight: 1.6 }}>
                Sélectionnez une conversation à gauche ou démarrez une nouvelle discussion.
              </p>
            </div>
          ) : (
            <>
              {/* Header fil */}
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', background: '#fafafa', display: 'flex', alignItems: 'center', gap: 10 }}>
                <Avatar name={selectedUser.name} size={36} />
                <div>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{selectedUser.name ?? `Utilisateur #${selectedUser.id}`}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#94a3b8' }}>
                    {conversations.find(c => (c.user ?? c.other_user)?.id === selectedUser.id) ? 'En ligne' : 'Membre'}
                  </p>
                </div>
              </div>

              {/* Zone messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 18px', background: '#f8fafc' }}>
                {loadingMsgs ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><LoadingSpinner /></div>
                ) : messages.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
                    <p style={{ margin: 0, fontSize: 14 }}>Commencez la conversation avec <strong>{selectedUser.name}</strong></p>
                  </div>
                ) : (
                  <>
                    {messages.map(msg => (
                      <MessageBubble key={msg.id} msg={msg} isMine={msg.sender?.id === user?.id || msg.sender_id === user?.id || msg.is_mine} />
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Zone saisie */}
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', background: 'white' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
                  <textarea
                    ref={inputRef}
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrivez votre message... (Entrée pour envoyer)"
                    rows={1}
                    style={{
                      flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)',
                      borderRadius: 12, fontSize: 14, outline: 'none', fontFamily: 'inherit',
                      resize: 'none', maxHeight: 120, lineHeight: 1.5,
                      transition: 'border-color .15s', boxSizing: 'border-box'
                    }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                    onInput={e => {
                      e.target.style.height = 'auto';
                      e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
                    }}
                  />
                  <button type="submit" disabled={!newMessage.trim() || sending} style={{
                    width: 44, height: 44, borderRadius: 12, border: 'none', cursor: !newMessage.trim() || sending ? 'not-allowed' : 'pointer',
                    background: !newMessage.trim() || sending ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: !newMessage.trim() || sending ? '#94a3b8' : 'white',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    transition: 'all .15s', boxShadow: !newMessage.trim() || sending ? 'none' : '0 2px 8px rgba(99,102,241,.35)'
                  }}>
                    {sending
                      ? <div style={{ width: 16, height: 16, borderRadius: 99, border: '2px solid #94a3b8', borderTopColor: 'transparent', animation: 'spin .6s linear infinite' }} />
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <line x1="22" y1="2" x2="11" y2="13"/>
                          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                        </svg>
                    }
                  </button>
                </form>
                <p style={{ margin: '6px 0 0', fontSize: 11, color: '#94a3b8' }}>Appuyez sur Entrée pour envoyer · Maj+Entrée pour aller à la ligne</p>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function MessagesPage() {
  return <MessagesContent />;
}
