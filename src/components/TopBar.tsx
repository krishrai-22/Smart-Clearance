import { useState, useRef, useEffect } from 'react';
import { Menu, Search, Bell, ChevronDown, LogOut, Settings, User, Shield } from 'lucide-react';
import { company } from '@/data/mockData';
import type { PageKey } from '@/components/Sidebar';
import type { AuthUser } from '@/types/auth';

interface TopBarProps {
  currentUser: AuthUser;
  onMenuClick: () => void;
  onNavigate: (page: PageKey) => void;
  notificationCount: number;
  onLogout: () => void;
  onSwitchToAdmin?: () => void;
}

export function TopBar({
  currentUser,
  onMenuClick,
  onNavigate,
  notificationCount,
  onLogout,
  onSwitchToAdmin,
}: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const searchResults = [
    { label: 'Fire NOC', page: 'approvals' as PageKey },
    { label: 'MSEDCL Application', page: 'approvals' as PageKey },
    { label: 'Factory License', page: 'approvals' as PageKey },
    { label: 'Environmental Clearance', page: 'approvals' as PageKey },
    { label: 'Compliance Report', page: 'compliance' as PageKey },
    { label: 'Approval Navigator', page: 'navigator' as PageKey },
    { label: 'Document Vault', page: 'documents' as PageKey },
    { label: 'Incentives & Schemes', page: 'schemes' as PageKey },
    { label: 'Common Inspections', page: 'inspections' as PageKey },
    { label: 'Grievance & Delay SLA', page: 'grievances' as PageKey },
    { label: 'Government Services', page: 'services' as PageKey },
    { label: 'AI Assistant', page: 'ai-assistant' as PageKey },
  ];

  const filteredResults = searchQuery
    ? searchResults.filter((r) => r.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleResultClick = (page: PageKey) => {
    onNavigate(page);
    setSearchQuery('');
    setSearchOpen(false);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="flex items-center gap-3 px-4 sm:px-6 py-3">
        <button onClick={onMenuClick} className="lg:hidden text-gray-600 hover:text-gray-900">
          <Menu size={22} />
        </button>

        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search approvals, documents, schemes, portals…"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchOpen(true);
            }}
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
            className="input-field pl-10 py-2"
          />
          {searchOpen && filteredResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 card shadow-lg py-2 z-30 animate-slide-up">
              {filteredResults.map((result) => (
                <button
                  key={result.label}
                  onClick={() => handleResultClick(result.page)}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Search size={14} className="text-gray-400" />
                  {result.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {onSwitchToAdmin && (
            <button
              onClick={onSwitchToAdmin}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 transition-colors border border-slate-700"
              title="Open Department Officer Scrutiny Console"
            >
              <Shield size={14} className="text-amber-400" />
              <span>Officer Admin View</span>
            </button>
          )}

          <button
            onClick={() => onNavigate('notifications')}
            className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Bell size={20} />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-error-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 p-1 pr-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-xs font-bold">
                {currentUser.avatarText || 'RS'}
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown size={16} className="text-gray-400" />
            </button>

            {profileOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 card shadow-lg py-2 z-30 animate-slide-up">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">{currentUser.name}</p>
                  <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                    Role: {currentUser.role.toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => {
                    onNavigate('profile');
                    setProfileOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} /> Industrial Profile
                </button>
                {onSwitchToAdmin && (
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onSwitchToAdmin();
                    }}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
                  >
                    <Shield size={16} className="text-amber-600" /> Switch to Officer Console
                  </button>
                )}
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={onLogout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-error-600 hover:bg-error-50 transition-colors"
                  >
                    <LogOut size={16} /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
