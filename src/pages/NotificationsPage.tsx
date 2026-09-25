import { useState } from 'react';
import { Bell, CheckCheck, Trash2 } from 'lucide-react';
import { AlertIcon } from '@/components/StatusBadge';
import type { NotificationItem } from '@/data/mockData';
import type { PageKey } from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

interface NotificationsPageProps {
  onNavigate: (page: PageKey) => void;
  onReadChange?: (count: number) => void;
}

const typeStyles: Record<string, { border: string; bg: string }> = {
  action: { border: 'border-l-error-500', bg: 'bg-error-50/50' },
  deadline: { border: 'border-l-warning-500', bg: 'bg-warning-50/50' },
  update: { border: 'border-l-success-500', bg: 'bg-success-50/50' },
};

export function NotificationsPage({ onNavigate, onReadChange }: NotificationsPageProps) {
  const { notifications, markNotificationAsRead } = useApp();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === 'unread' ? notifications.filter((n) => !n.read) : notifications;

  const markAsRead = (id: string) => {
    markNotificationAsRead(id);
    if (onReadChange) onReadChange(unreadCount - 1);
  };

  const markAllAsRead = () => {
    notifications.forEach((n) => markNotificationAsRead(n.id));
    if (onReadChange) onReadChange(0);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Bell size={22} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <p className="text-gray-600">{unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-300'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${filter === 'unread' ? 'bg-brand-600 text-white' : 'bg-white text-gray-600 border border-gray-300'}`}
          >
            Unread ({unreadCount})
          </button>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn-ghost text-brand-600">
              <CheckCheck size={16} /> Mark all read
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const style = typeStyles[item.type];
          return (
            <div
              key={item.id}
              className={`card p-4 border-l-4 ${style.border} ${item.read ? '' : style.bg} transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <AlertIcon type={item.type} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-sm font-semibold ${item.read ? 'text-gray-700' : 'text-gray-900'}`}>
                      {item.title}
                    </p>
                    <span className="text-xs text-gray-400 whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className={`text-sm mt-0.5 ${item.read ? 'text-gray-500' : 'text-gray-700'}`}>
                    {item.message}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {item.type === 'action' && (
                      <button
                        onClick={() => onNavigate('approvals')}
                        className="text-xs font-medium text-brand-600 hover:text-brand-700"
                      >
                        View Application →
                      </button>
                    )}
                    {item.type === 'deadline' && (
                      <button
                        onClick={() => onNavigate('compliance')}
                        className="text-xs font-medium text-brand-600 hover:text-brand-700"
                      >
                        View Compliance →
                      </button>
                    )}
                    {item.type === 'update' && (
                      <button
                        onClick={() => onNavigate('approvals')}
                        className="text-xs font-medium text-brand-600 hover:text-brand-700"
                      >
                        Track Status →
                      </button>
                    )}
                    {!item.read && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700 ml-auto"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
                {!item.read && <div className="w-2 h-2 rounded-full bg-brand-500 flex-shrink-0 mt-2" />}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Bell size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No notifications to show.</p>
          </div>
        )}
      </div>
    </div>
  );
}
