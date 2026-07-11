import { useEffect, useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { messageService } from '../../services/messageService';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getErrorMessage } from '../../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

function Avatar({ name, size = 32, color = '#6366f1' }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 99, flexShrink: 0, background: `linear-gradient(135deg, ${color}, #8b5cf6)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: size * 0.38 }}>
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  );
}

function MessageBubble({ msg, isMine }) {
  return (
    <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start', marginBottom: 6 }}>
      <div style={{ maxWidth: '78%', padding: '8px 12px', borderRadius: isMine ? '14px 14px 3px 14px' : '14px 14px 14px 3px', background: isMine ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'white', color: isMine ? 'white' : '#0f172a', border: isMine ? 'none' : '1px solid var(--border)', fontSize: 13, lineHeight: 1.5 }}>
        <p style={{ margin: 0 }}>{msg.content}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 4, marginTop: 3 }}>
          <span style={{ fontSize: 10, opacity: .65, color: isMine ? 'white' : '#94a3b8' }}>
            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : ''}
          </span>
          {isMine && <span style={{ fontSize: 10, opacity: .65, color: 'white' }}>{msg.read_at ? '✓✓' : '✓'}</span>}
        </div>
      </div>
    </div>
  );
}

export default function MessagesWidget() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [sending, setSending] = useState(false);
  const [unread, setUnread] = useState(0);
  const endRef = useRef(null);
  const inputRef = useRef(null);
  const pollingRef = useRef(null);

  const scrollBottom = useCallback(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, []);

  const loadConvs = useCallback(() => {
    messageService.getConversations()
      .then(({ data }) => {
        const arr = Array.isArray(data.data ?? data.conversations) ? (data.data ?? data.conversations) : [];
        setConversations(arr);
        setUnread(arr.reduce((s, c) => s + (c.unread_count ?? 0), 0));
      }).catch(() => {});
  }, []);

  useEffect(() => {
    setLoadingConvs(true);
    loadConvs();
    setLoadingConvs(false);
    const id = setInterval(loadConvs, 15000);
    return () => clearInterval(id);
  }, [loadConvs]);

  useEffect(() => {
    if (!selectedUser?.id) return;
    const load = () => {
      messageService.getThread(selectedUser.id)
        .then(({ data }) => {
          const msgs = data.messages ?? data.data ?? [];
          setMessages(Array.isArray(msgs) ? [...msgs].reverse() : []);
          setTimeout(scrollBottom, 50);
        }).catch(() => {});
    };
    load();
    pollingRef.current = setInterval(() => { load(); loadConvs(); }, 5000);
    return () => clearInterval(pollingRef.current);
  }, [selectedUser?.id, scrollBottom, loadConvs]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !selectedUser || sending) return;
    const content = text.trim();
    setSending(true);
    setText('');
    const tmp = { id: `tmp_${Date.now()}`, content, sender_id: user?.id, is_mine: true, created_at: new Date().toISOString(), read_at: null };
    setMessages(p => [...p, tmp]);
    scrollBottom();
    try {
      await messageService.send({ recipient_id: selectedUser.id, content });
      const { data } = await messageService.getThread(selectedUser.id);
      setMessages(Array.isArray(data.messages ?? data.data) ? [...(data.messages ?? data.data)].reverse() : []);
      loadConvs();
    } catch (err) {
      toast.error(getErrorMessage(err));
      setMessages(p => p.filter(m => m.id !== tmp.id));
      setText(content);
    } finally {
      setSending(false);
      setTimeout(scrollBottom, 50);
    }
  };

  return (
    <div style={{ background: 'white', borderRadius: 20, border: '1.5px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
      {/* Header */}
      <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fafafa' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>💬</span>
          <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#0f172a' }}>
            Messagerie
            {unread > 0 && <span style={{ marginLeft: 8, background: '#ef4444', color: 'white', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>{unread}</span>}
          </h2>
        </div>
        <Link to="messages" style={{ fontSize: 12, color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Tout voir →</Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '190px 1fr', height: 400 }}>
        {/* Conversations */}
        <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto', background: '#fafafa' }}>
          {loadingConvs ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}><LoadingSpinner /></div>
          ) : conversations.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 24, marginBottom: 6 }}>💬</div>
              <p style={{ margin: 0, fontSize: 11 }}>Aucune conversation</p>
            </div>
          ) : conversations.map(conv => {
            const other = conv.user ?? conv.other_user ?? conv;
            const last = conv.last_message ?? conv.latest_message;
            const nb = conv.unread_count ?? 0;
            const sel = selectedUser?.id === other.id;
            return (
              <button key={other.id} onClick={() => { setSelectedUser(other); setTimeout(() => inputRef.current?.focus(), 100); }} style={{ width: '100%', padding: '9px 10px', textAlign: 'left', border: 'none', cursor: 'pointer', fontFamily: 'inherit', background: sel ? '#eef2ff' : 'transparent', borderLeft: sel ? '3px solid #6366f1' : '3px solid transparent', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <Avatar name={other.name} size={30} color={sel ? '#6366f1' : '#64748b'} />
                  {nb > 0 && <span style={{ position: 'absolute', top: -2, right: -2, width: 13, height: 13, borderRadius: 99, background: '#ef4444', color: 'white', fontSize: 8, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1.5px solid white' }}>{nb}</span>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: 12, fontWeight: nb > 0 ? 700 : 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{other.name ?? `#${other.id}`}</p>
                  {last && <p style={{ margin: 0, fontSize: 11, color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{last.content}</p>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {!selectedUser ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>💬</div>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 500 }}>Choisir une conversation</p>
            </div>
          ) : (
            <>
              <div style={{ padding: '9px 12px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8, background: '#fafafa', flexShrink: 0 }}>
                <Avatar name={selectedUser.name} size={26} />
                <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: '#0f172a' }}>{selectedUser.name}</p>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', background: '#f8fafc' }}>
                {messages.length === 0
                  ? <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 20 }}>Commencez la conversation 👋</p>
                  : <>{messages.map(msg => <MessageBubble key={msg.id} msg={msg} isMine={msg.sender?.id === user?.id || msg.sender_id === user?.id || msg.is_mine} />)}<div ref={endRef} /></>
                }
              </div>
              <div style={{ padding: '8px 10px', borderTop: '1px solid var(--border)', background: 'white', flexShrink: 0 }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: 6 }}>
                  <input ref={inputRef} value={text} onChange={e => setText(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); } }}
                    placeholder="Écrire un message..."
                    style={{ flex: 1, padding: '7px 11px', border: '1.5px solid var(--border)', borderRadius: 9, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
                    onFocus={e => e.target.style.borderColor = '#6366f1'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'} />
                  <button type="submit" disabled={!text.trim() || sending} style={{ width: 34, height: 34, borderRadius: 9, border: 'none', cursor: !text.trim() || sending ? 'not-allowed' : 'pointer', background: !text.trim() || sending ? '#e2e8f0' : 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: !text.trim() || sending ? '#94a3b8' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
