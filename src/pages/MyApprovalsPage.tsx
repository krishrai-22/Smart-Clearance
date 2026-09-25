import { useState } from 'react';
import { ArrowRight, Search, Filter, Plus, FileCheck2, Sparkles, Building2 } from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/Stepper';
import type { ApprovalStatus } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

interface MyApprovalsPageProps {
  onViewApplication: (id: string) => void;
  onOpenNewApplication?: () => void;
}

const filterTabs: { label: string; value: ApprovalStatus | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: 'Under Review', value: 'review' },
  { label: 'Query Raised', value: 'query' },
  { label: 'Approved', value: 'approved' },
  { label: 'Pending', value: 'pending' },
];

export function MyApprovalsPage({ onViewApplication, onOpenNewApplication }: MyApprovalsPageProps) {
  const { applications, submitNewApplication } = useApp();
  const [filter, setFilter] = useState<ApprovalStatus | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showApplyModal, setShowApplyModal] = useState(false);

  // New application form state
  const [newAppName, setNewAppName] = useState('Groundwater Extraction NOC');
  const [newDept, setNewDept] = useState('Central Ground Water Authority (CGWA)');
  const [category, setCategory] = useState('Environment & Resource Clearance');
  const [submittedAlert, setSubmittedAlert] = useState<string | null>(null);

  const filtered = applications.filter((app) => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.department.toLowerCase().includes(search.toLowerCase()) ||
      app.id.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppName.trim() || !newDept.trim()) return;

    const created = submitNewApplication({
      name: newAppName.trim(),
      department: newDept.trim(),
      category,
      documents: [
        { name: 'Common Application Form (CAF)', verified: true },
        { name: 'Site Plan & Borewell Geo-Coordinates', verified: true },
        { name: 'Water Balance Diagram', verified: true },
        { name: 'Rainwater Harvesting Plan', verified: false },
      ],
      expectedDays: '12–15 days',
    });

    setShowApplyModal(false);
    setSubmittedAlert(`Docket ${created.id} submitted! Synchronized instantly to Department Officer Console.`);
    setTimeout(() => setSubmittedAlert(null), 5000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Approvals</h1>
          <p className="text-gray-600 mt-1">Track all your industrial approval applications in real time.</p>
        </div>
        <button
          onClick={() => setShowApplyModal(true)}
          className="btn-primary flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> New Clearance Application
        </button>
      </div>

      {submittedAlert && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-800 flex items-center justify-between animate-slide-up">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{submittedAlert}</span>
          </div>
          <span className="text-[11px] text-emerald-600 underline cursor-pointer" onClick={() => setSubmittedAlert(null)}>
            Dismiss
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, department, or ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-thin">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilter(tab.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === tab.value
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Application list */}
      <div className="space-y-4">
        {filtered.map((app) => (
          <div
            key={app.id}
            className="card card-hover p-5 cursor-pointer"
            onClick={() => onViewApplication(app.id)}
          >
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-gray-900">{app.name}</h3>
                  <StatusBadge status={app.status} />
                </div>
                <p className="text-sm text-gray-500">{app.department}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-gray-500">
                  <span>ID: <span className="font-medium text-gray-700">{app.id}</span></span>
                  <span>Submitted: <span className="font-medium text-gray-700">{app.submittedDate}</span></span>
                  <span>Last Updated: <span className="font-medium text-gray-700">{app.lastUpdated}</span></span>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-32">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">Progress</span>
                    <span className="font-semibold text-gray-700">{app.progress}%</span>
                  </div>
                  <ProgressBar value={app.progress} />
                  <p className="text-xs text-gray-500 mt-1 truncate" title={app.currentStage}>{app.currentStage}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewApplication(app.id);
                  }}
                  className={`text-xs font-medium px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                    app.status === 'query'
                      ? 'bg-warning-50 text-warning-700 hover:bg-warning-100 font-bold'
                      : app.status === 'approved'
                      ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold'
                      : 'bg-brand-50 text-brand-700 hover:bg-brand-100'
                  }`}
                >
                  {app.status === 'query' ? 'Respond to Query' : app.status === 'approved' ? 'View Sanction' : 'Track'}
                  <ArrowRight size={12} className="inline ml-1" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <Filter size={32} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500">No applications match your search.</p>
          </div>
        )}
      </div>

      {/* New Application Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-600">
                  <FileCheck2 size={18} />
                </div>
                <h3 className="font-bold text-gray-900 text-base">Submit New Clearance Application</h3>
              </div>
              <button
                onClick={() => setShowApplyModal(false)}
                className="text-gray-400 hover:text-gray-600 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Clearance Title</label>
                <input
                  type="text"
                  value={newAppName}
                  onChange={(e) => setNewAppName(e.target.value)}
                  placeholder="e.g., Boiler Registration, Hazardous Waste Authorisation"
                  className="input-field text-xs py-2.5"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Nodal Department</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="input-field text-xs py-2.5"
                >
                  <option value="Central Ground Water Authority (CGWA)">Central Ground Water Authority (CGWA)</option>
                  <option value="Directorate of Industrial Safety & Health (DISH)">Directorate of Industrial Safety & Health (DISH)</option>
                  <option value="State Pollution Control Board (MPCB)">State Pollution Control Board (MPCB)</option>
                  <option value="Maharashtra Fire Services">Maharashtra Fire Services</option>
                  <option value="MIDC Water Works Division">MIDC Water Works Division</option>
                  <option value="MSEDCL Power Distribution">MSEDCL Power Distribution</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-brand-50 border border-brand-100 text-brand-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <Sparkles size={14} className="text-brand-600" />
                  Auto-Attached Pre-Validated Dossier
                </p>
                <p className="text-[11px] text-brand-700">
                  Your verified PAN, Land Allotment, Factory Layout, and CAF documents from the Document Vault will be automatically bundled.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5 font-bold flex items-center gap-1.5"
                >
                  <Plus size={14} /> Submit Application Docket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
