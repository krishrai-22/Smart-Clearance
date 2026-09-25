import {
  LayoutDashboard,
  FileCheck2,
  Compass,
  FolderOpen,
  ShieldCheck,
  Sparkles,
  Landmark,
  Bell,
  User,
  X,
  Bot,
  Gift,
  CalendarDays,
  AlertOctagon,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { company } from '@/data/mockData';

export type PageKey =
  | 'dashboard'
  | 'approvals'
  | 'navigator'
  | 'documents'
  | 'schemes'
  | 'inspections'
  | 'grievances'
  | 'compliance'
  | 'ai-insights'
  | 'services'
  | 'ai-assistant'
  | 'notifications'
  | 'profile';

interface SidebarProps {
  currentPage: PageKey;
  onNavigate: (page: PageKey) => void;
  isOpen: boolean;
  onClose: () => void;
  notificationCount: number;
}

const navItems: { key: PageKey; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'approvals', label: 'My Approvals & Workflows', icon: FileCheck2 },
  { key: 'navigator', label: 'Checklist Generator', icon: Compass },
  { key: 'documents', label: 'Document Vault & OCR', icon: FolderOpen },
  { key: 'schemes', label: 'Incentives & Schemes', icon: Gift, badge: 'New' },
  { key: 'inspections', label: 'Common Inspections', icon: CalendarDays },
  { key: 'grievances', label: 'Grievance & Delay SLA', icon: AlertOctagon },
  { key: 'compliance', label: 'Compliance & Renewals', icon: ShieldCheck },
  { key: 'ai-insights', label: 'AI Risk Analytics', icon: Sparkles },
  { key: 'services', label: 'Government Portals', icon: Landmark },
  { key: 'ai-assistant', label: 'Regulatory AI Assistant', icon: Bot },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'profile', label: 'Industrial Profile', icon: User },
];

export function Sidebar({ currentPage, onNavigate, isOpen, onClose, notificationCount }: SidebarProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-72 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-gray-200">
          <Logo />
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  onClose();
                }}
                className={`nav-item w-full ${active ? 'nav-item-active' : ''}`}
              >
                <Icon size={18} strokeWidth={2} className={active ? 'text-brand-600' : ''} />
                <span className="flex-1 text-left truncate">{item.label}</span>
                {item.badge && !active && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700">
                    {item.badge}
                  </span>
                )}
                {item.key === 'notifications' && notificationCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-error-500 text-white text-[10px] font-bold">
                    {notificationCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-gray-200">
          <div className="card p-3 bg-gradient-to-br from-brand-50 to-accent-50 border-brand-100">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold text-gray-800 truncate">{company.name}</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-100 text-brand-700">MSME</span>
            </div>
            <p className="text-[11px] text-gray-500 mt-0.5">{company.location}</p>
            <p className="text-[11px] text-brand-600 font-medium mt-1">{company.registrationId}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
