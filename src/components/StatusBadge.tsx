import { CheckCircle2, Clock, HelpCircle, AlertCircle, Circle } from 'lucide-react';
import type { ApprovalStatus } from '@/data/mockData';

const statusConfig: Record<ApprovalStatus, { label: string; class: string; icon: typeof CheckCircle2 }> = {
  approved: { label: 'Approved', class: 'badge-approved', icon: CheckCircle2 },
  review: { label: 'Under Review', class: 'badge-review', icon: Clock },
  query: { label: 'Query Raised', class: 'badge-query', icon: HelpCircle },
  pending: { label: 'Pending', class: 'badge-pending', icon: Circle },
};

export function StatusBadge({ status }: { status: ApprovalStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <span className={`status-badge ${config.class}`}>
      <Icon size={12} strokeWidth={2.5} />
      {config.label}
    </span>
  );
}

export function StatusDot({ status }: { status: 'done' | 'current' | 'pending' }) {
  if (status === 'done') return <CheckCircle2 size={20} className="text-success-500 flex-shrink-0" />;
  if (status === 'current') return <div className="w-5 h-5 rounded-full bg-brand-500 flex-shrink-0 ring-4 ring-brand-100 animate-pulse" />;
  return <Circle size={20} className="text-gray-300 flex-shrink-0" />;
}

export function AlertIcon({ type }: { type: 'action' | 'deadline' | 'update' }) {
  if (type === 'action') return <AlertCircle size={16} className="text-error-500 flex-shrink-0" />;
  if (type === 'deadline') return <Clock size={16} className="text-warning-500 flex-shrink-0" />;
  return <CheckCircle2 size={16} className="text-success-500 flex-shrink-0" />;
}
