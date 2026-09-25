import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  Calendar,
} from 'lucide-react';
import { CircularProgress } from '@/components/CircularProgress';
import { complianceItems, complianceStats } from '@/data/mockData';

const statusConfig = {
  completed: { label: 'Completed', icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50', bar: 'bg-success-500', dot: 'bg-success-500' },
  upcoming: { label: 'Upcoming', icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50', bar: 'bg-warning-400', dot: 'bg-warning-400' },
  overdue: { label: 'Overdue', icon: AlertCircle, color: 'text-error-600', bg: 'bg-error-50', bar: 'bg-error-500', dot: 'bg-error-500' },
};

export function CompliancePage() {
  const sorted = [...complianceItems].sort((a, b) => {
    const order = { overdue: 0, upcoming: 1, completed: 2 };
    return order[a.status] - order[b.status];
  });

  const statCards = [
    { label: 'Completed', value: complianceStats.completed, icon: CheckCircle2, color: 'text-success-600', bg: 'bg-success-50' },
    { label: 'Upcoming', value: complianceStats.upcoming, icon: Clock, color: 'text-warning-600', bg: 'bg-warning-50' },
    { label: 'Overdue', value: complianceStats.overdue, icon: AlertCircle, color: 'text-error-600', bg: 'bg-error-50' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center">
            <ShieldCheck size={22} className="text-success-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compliance Center</h1>
            <p className="text-gray-600">Monitor regulatory compliance and deadlines.</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Compliance Health */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-1">Compliance Health</h2>
          <p className="text-xs text-gray-500 mb-4">Overall compliance score</p>
          <div className="flex flex-col items-center">
            <CircularProgress
              value={complianceStats.health}
              size={140}
              strokeWidth={12}
              colorClass="text-success-500"
            />
            <div className="w-full mt-6 space-y-3">
              {statCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}>
                        <Icon size={14} className={stat.color} />
                      </div>
                      <span className="text-sm text-gray-600">{stat.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{stat.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-semibold text-gray-900">Upcoming Deadlines</h2>
              <p className="text-xs text-gray-500">Compliance tasks requiring attention</p>
            </div>
            <button className="btn-secondary text-sm">
              View All Compliance <ArrowRight size={14} />
            </button>
          </div>
          <div className="space-y-3">
            {sorted.map((item) => {
              const config = statusConfig[item.status];
              const Icon = config.icon;
              return (
                <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-all">
                  <div className={`w-1 h-12 rounded-full ${config.bar}`} />
                  <div className={`w-9 h-9 rounded-lg ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={18} className={config.color} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1.5">
                      <Calendar size={14} className="text-gray-400" />
                      <p className={`text-sm font-semibold ${item.status === 'overdue' ? 'text-error-600' : 'text-gray-700'}`}>
                        {item.dueDate}
                      </p>
                    </div>
                    <p className={`text-xs ${config.color} mt-0.5`}>{config.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success-500" />
            <span className="text-gray-600">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-warning-400" />
            <span className="text-gray-600">Upcoming</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-error-500" />
            <span className="text-gray-600">Overdue</span>
          </div>
        </div>
      </div>
    </div>
  );
}
