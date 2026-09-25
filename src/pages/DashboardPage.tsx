import {
  FileCheck2,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  TrendingUp,
  FileText,
  ShieldCheck,
  Gift,
  CalendarDays,
  AlertOctagon,
  Sparkles,
  Zap,
} from 'lucide-react';
import { CircularProgress } from '@/components/CircularProgress';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/Stepper';
import {
  complianceItems,
  schemesAndIncentives,
  commonInspections,
  grievances,
} from '@/data/mockData';
import type { PageKey } from '@/components/Sidebar';
import type { ApprovalStatus } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

interface DashboardPageProps {
  onNavigate: (page: PageKey) => void;
  onViewApplication: (id: string) => void;
}

export function DashboardPage({ onNavigate, onViewApplication }: DashboardPageProps) {
  const { applications } = useApp();

  const totalCount = applications.length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const inProgressCount = applications.filter((a) => a.status === 'review' || a.status === 'pending').length;
  const queryCount = applications.filter((a) => a.status === 'query').length;
  const overallProgress = totalCount > 0
    ? Math.round(applications.reduce((acc, curr) => acc + (curr.progress || 0), 0) / totalCount)
    : 0;

  const statCards = [
    {
      label: 'Total Approvals',
      value: totalCount,
      icon: FileCheck2,
      color: 'text-brand-600',
      bg: 'bg-brand-50',
      border: 'border-brand-100',
    },
    {
      label: 'Approved & Active',
      value: approvedCount,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
    },
    {
      label: 'Parallel Processing',
      value: inProgressCount,
      icon: Clock,
      color: 'text-accent-600',
      bg: 'bg-accent-50',
      border: 'border-accent-100',
    },
    {
      label: 'Action / Query Required',
      value: queryCount,
      icon: AlertCircle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
    },
  ];

  const activeApplications = applications.filter((a) => a.status !== 'approved').slice(0, 4);
  const upcomingCompliance = complianceItems.filter((c) => c.status !== 'completed').slice(0, 3);
  const eligibleSchemesCount = schemesAndIncentives.filter((s) => s.status === 'Eligible').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Good Morning, Rajesh</h1>
          <p className="text-gray-600 mt-0.5">
            Single unified window for Shree Industries: 5 parallel departments, 0 physical visits required.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('navigator')}
            className="btn-primary text-xs py-2 px-3 flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles size={15} /> Regulatory Checklist Generator
          </button>
        </div>
      </div>

      {/* Statutory EODB Callout Banner */}
      <div className="card p-4 bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-600 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center flex-shrink-0">
              <Zap size={22} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-sm tracking-wide">
                Unified Industrial Clearance & Compliance Guarantee
              </p>
              <p className="text-xs text-white/90 mt-0.5">
                Pre-validated KYC reused across departments • Joint Inspections synchronized • 3-Tier SLA Escalation protected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-semibold">
              Ease of Doing Business Compliant
            </span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className={`card p-5 border ${stat.border} card-hover`}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs sm:text-sm text-gray-500">{stat.label}</p>
                  <p className={`text-2xl sm:text-3xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                  <Icon size={20} className={stat.color} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Middle Row: Progress and Active Applications */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Clearance Health & Progress</h2>
          <p className="text-xs text-gray-500 mb-4">Overall statutory completion across departments</p>
          <div className="flex flex-col items-center">
            <CircularProgress
              value={overallProgress}
              size={140}
              strokeWidth={12}
              colorClass="text-brand-600"
            />
            <p className="text-xs text-gray-500 mt-3 font-medium">Stage: Factory Construction & Pre-Operation</p>

            <div className="w-full mt-6 space-y-2">
              <div className="flex justify-between text-xs text-gray-600">
                <span>Approved Approvals</span>
                <span className="font-semibold text-emerald-600">{approvedCount}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Parallel In-Review</span>
                <span className="font-semibold text-brand-600">{inProgressCount}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span>Action / Clarification</span>
                <span className="font-semibold text-amber-600">{queryCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Active Applications */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Active Clearance Pipeline</h2>
              <p className="text-xs text-gray-500">Real-time status across statutory authorities</p>
            </div>
            <button onClick={() => onNavigate('approvals')} className="btn-ghost text-brand-600 text-xs">
              View All ({applications.length}) <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {activeApplications.map((app) => (
              <div
                key={app.id}
                onClick={() => onViewApplication(app.id)}
                className="card p-4 border border-gray-200 hover:border-brand-300 card-hover cursor-pointer"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-gray-900 truncate">{app.name}</p>
                      <StatusBadge status={app.status as ApprovalStatus} />
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{app.department} • Ref: {app.id}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-gray-700">{app.progress}%</span>
                    <div className="w-20 hidden sm:block">
                      <ProgressBar value={app.progress} />
                    </div>
                  </div>
                </div>
                {app.status === 'query' && (
                  <div className="mt-2.5 p-2 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center justify-between">
                    <span className="truncate pr-2">Action Required: {app.nextAction}</span>
                    <span className="text-amber-900 font-bold whitespace-nowrap">Respond →</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Problem Statement Specific Solution Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {/* Incentives & Schemes */}
        <div
          onClick={() => onNavigate('schemes')}
          className="card p-5 border border-purple-200 hover:border-purple-300 bg-gradient-to-br from-purple-50/50 to-white card-hover cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Gift size={20} className="text-purple-700" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
              {eligibleSchemesCount} Matched
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-base">Incentives & Subsidies</h3>
          <p className="text-xs text-gray-600 mt-1">
            Access Maharashtra PSI 2026, Capital Grants, and Solar Subventions estimated up to ₹2.50 Cr.
          </p>
          <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between text-xs text-purple-700 font-semibold">
            <span>Explore Matched Schemes</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Common Inspection Planning */}
        <div
          onClick={() => onNavigate('inspections')}
          className="card p-5 border border-blue-200 hover:border-blue-300 bg-gradient-to-br from-blue-50/50 to-white card-hover cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <CalendarDays size={20} className="text-blue-700" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              {commonInspections.length} Audits
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-base">Common Inspection Planner</h3>
          <p className="text-xs text-gray-600 mt-1">
            Synchronize Fire, DISH, and Pollution inspectors into a single joint on-site evaluation visit.
          </p>
          <div className="mt-4 pt-3 border-t border-blue-100 flex items-center justify-between text-xs text-blue-700 font-semibold">
            <span>View Joint Schedule</span>
            <ArrowRight size={14} />
          </div>
        </div>

        {/* Grievance & SLA Escalation */}
        <div
          onClick={() => onNavigate('grievances')}
          className="card p-5 border border-rose-200 hover:border-rose-300 bg-gradient-to-br from-rose-50/50 to-white card-hover cursor-pointer"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center">
              <AlertOctagon size={20} className="text-rose-700" />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {grievances.length} Active Dockets
            </span>
          </div>
          <h3 className="font-bold text-gray-900 text-base">SLA Delay Escalation</h3>
          <p className="text-xs text-gray-600 mt-1">
            Automatically escalate delayed departmental scrutinies to District Collector & State Nodal Officers.
          </p>
          <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-xs text-rose-700 font-semibold">
            <span>Track Statutory Grievances</span>
            <ArrowRight size={14} />
          </div>
        </div>
      </div>

      {/* Bottom Row: Quick Actions and Compliance */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Quick Tools & Services</h2>
          <p className="text-xs text-gray-500 mb-4">Unified operations shortcuts</p>
          <div className="space-y-2.5">
            <button
              onClick={() => onNavigate('navigator')}
              className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/30 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-brand-50 flex items-center justify-center">
                <FileCheck2 size={18} className="text-brand-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Custom Approval Checklist</p>
                <p className="text-xs text-gray-500">Regulatory knowledge engine</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
            <button
              onClick={() => onNavigate('documents')}
              className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/30 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-accent-50 flex items-center justify-center">
                <FileText size={18} className="text-accent-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Document Vault & Pre-Validation</p>
                <p className="text-xs text-gray-500">Upload once, reuse across depts</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
            <button
              onClick={() => onNavigate('ai-insights')}
              className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/30 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-warning-50 flex items-center justify-center">
                <TrendingUp size={18} className="text-warning-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Risk-Based Scrutiny & Delays</p>
                <p className="text-xs text-gray-500">SHAP bottleneck factor analysis</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
            <button
              onClick={() => onNavigate('compliance')}
              className="flex items-center gap-3 w-full p-3 rounded-xl border border-gray-200 hover:border-brand-200 hover:bg-brand-50/30 transition-all text-left"
            >
              <div className="w-9 h-9 rounded-lg bg-success-50 flex items-center justify-center">
                <ShieldCheck size={18} className="text-success-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Compliance & Renewals</p>
                <p className="text-xs text-gray-500">Statutory registers and audits</p>
              </div>
              <ArrowRight size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Upcoming Compliance Deadlines */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Upcoming Compliance & Renewal Deadlines</h2>
              <p className="text-xs text-gray-500">Continuous statutory safeguard tracking</p>
            </div>
            <button onClick={() => onNavigate('compliance')} className="btn-ghost text-brand-600 text-xs">
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {upcomingCompliance.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-gray-200">
                <div
                  className={`w-1.5 h-10 rounded-full ${
                    item.status === 'overdue' ? 'bg-error-500' : 'bg-warning-400'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.category}</p>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      item.status === 'overdue' ? 'text-error-600' : 'text-gray-700'
                    }`}
                  >
                    {item.dueDate}
                  </p>
                  <p
                    className={`text-xs font-medium ${
                      item.status === 'overdue' ? 'text-error-500' : 'text-amber-600'
                    }`}
                  >
                    {item.status === 'overdue' ? 'Overdue Action' : 'Upcoming Renewal'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
