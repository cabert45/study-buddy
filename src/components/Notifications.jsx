import React, { useState, useEffect } from 'react';
import { getNotifications, getUnreadCount, markAllRead, deleteNotification, clearAll } from '../utils/notifications';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  if (mins < 1) return 'à l\'instant';
  if (mins < 60) return `il y a ${mins} min`;
  if (hours < 24) return `il y a ${hours}h`;
  if (days < 7) return `il y a ${days}j`;
  return new Date(iso).toLocaleDateString();
}

const typeStyles = {
  celebration: { bg: 'bg-orange-50', border: 'border-orange-300', text: 'text-fox-d' },
  success: { bg: 'bg-green-50', border: 'border-green-300', text: 'text-green-700' },
  info: { bg: 'bg-blue-50', border: 'border-blue-300', text: 'text-blue-700' },
  warning: { bg: 'bg-red-50', border: 'border-red-300', text: 'text-red-700' },
};

export function NotificationBell({ onClick }) {
  const [unread, setUnread] = useState(getUnreadCount());

  useEffect(() => {
    const update = () => setUnread(getUnreadCount());
    window.addEventListener('notifications-updated', update);
    return () => window.removeEventListener('notifications-updated', update);
  }, []);

  return (
    <button onClick={onClick}
      className="bg-white border-2 border-s2 rounded-xl px-3 py-2 text-sm font-bold text-s6 hover:border-lava hover:text-lava transition-all relative">
      🔔
      {unread > 0 && (
        <span className="absolute -top-1 -right-1 bg-lava text-white text-[10px] font-extrabold rounded-full w-5 h-5 flex items-center justify-center">
          {unread > 9 ? '9+' : unread}
        </span>
      )}
    </button>
  );
}

export default function NotificationsPanel({ onClose }) {
  const [notifications, setNotifications] = useState(getNotifications());

  useEffect(() => {
    const update = () => setNotifications(getNotifications());
    window.addEventListener('notifications-updated', update);
    markAllRead();
    return () => window.removeEventListener('notifications-updated', update);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-end md:items-start md:pt-16 justify-center p-4"
      onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}
        className="bg-cream rounded-2xl p-5 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl border-2 border-s1">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-heading text-xl font-extrabold text-stone">🔔 Notifications</h3>
          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <button onClick={() => { if (confirm('Tout effacer?')) clearAll(); }}
                className="text-xs font-bold text-s4 hover:text-lava">
                Tout effacer
              </button>
            )}
            <button onClick={onClose}
              className="w-9 h-9 rounded-full bg-white border-2 border-s2 text-s4 font-bold hover:border-lava hover:text-lava">
              ✕
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-s4 font-semibold">Pas de notifications.</p>
            <p className="text-xs text-s4 font-semibold mt-1">Quand Ryan ou Cayla termine une session, elle apparaîtra ici.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map(n => {
              const s = typeStyles[n.type] || typeStyles.info;
              return (
                <div key={n.id}
                  className={`rounded-2xl p-3 border-2 ${s.bg} ${s.border}`}>
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className={`font-heading font-bold text-sm ${s.text}`}>{n.title}</div>
                      <div className="text-xs text-stone font-semibold mt-1">{n.message}</div>
                      <div className="text-[10px] text-s4 font-bold uppercase mt-1.5">{timeAgo(n.timestamp)}</div>
                    </div>
                    <button onClick={() => deleteNotification(n.id)}
                      className="text-s4 font-bold text-xs hover:text-lava flex-shrink-0">
                      ✕
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
