import { useState } from 'react';
import {
  AlertOctagon,
  Clock,
  ArrowUpRight,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertTriangle,
  Building2,
  FileText,
  HelpCircle,
} from 'lucide-react';
import { grievances as allGrievances, type GrievanceItem, applications } from '@/data/mockData';

export function GrievancesPage() {
  const [grievances, setGrievances] = useState<GrievanceItem[]>(allGrievances);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(applications[0]?.id || '');
  const [subject, setSubject] = useState('');
  const [reason, setReason] = useState('SLA Delay: No progress beyond statutory timeline');
  const [escalationSuccess, setEscalationSuccess] = useState<string | null>(null);

  const handleEscalate = (e: React.FormEvent) => {
    e.preventDefault();
    const targetApp = applications.find((a) => a.id === selectedAppId);
    const newGrv: GrievanceItem = {
      id: `GRV-2026-${Math.floor(500 + Math.random() * 499)}`,
      applicationId: selectedAppId,
      subject: subject || `SLA Breach Inquiry: ${targetApp?.name || 'Application'}`,
      department: targetApp?.department || 'Department Authority',
      escalationLevel: 'Level 1 - Nodal Officer',
      slaBreachDays: 3,
      status: 'Escalated',
      filedDate: 'Today',
      lastUpdate: 'Just now',
      resolutionTimeline: 'Mandated Response within 72 hours under Ease of Doing Business Act',
    };

    setGrievances([newGrv, ...grievances]);
    setShowFileModal(false);
    setSubject('');
    setEscalationSuccess(newGrv.id);
    setTimeout(() => setEscalationSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
            <AlertOctagon size={22} className="text-rose-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Grievance & Delay Escalation</h1>
            <p className="text-gray-600">
              Statutory auto-escalation mechanism for applications exceeding Service Level Agreements (SLAs).
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowFileModal(true)}
          className="btn-primary text-xs py-2 px-3 bg-rose-600 hover:bg-rose-700 flex items-center gap-2 self-start sm:self-auto"
        >
          <ArrowUpRight size={16} /> File SLA Escalation
        </button>
      </div>

      {escalationSuccess && (
        <div className="card p-4 bg-emerald-50 border-emerald-200 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Escalation Docket #{escalationSuccess} Filed!</p>
            <p className="text-xs text-emerald-700">
              Alert dispatched directly to the District Industrial Nodal Officer & Automated Escalation Matrix.
            </p>
          </div>
        </div>
      )}

      {/* Escalation Hierarchy Card */}
      <div className="card p-5 bg-gradient-to-br from-rose-50/50 via-white to-orange-50/40 border-rose-100">
        <h2 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
          <ShieldAlert size={18} className="text-rose-600" /> 3-Tier Statutory Guarantee (Right to Public Services Act)
        </h2>
        <div className="grid md:grid-cols-3 gap-4 mt-3">
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
              Tier 1 (Day 1–3 SLA Breach)
            </span>
            <p className="text-xs font-semibold text-gray-800 mt-2">Department Nodal Officer</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Automatic alert triggers explanation order from the head of the licensing department.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
              Tier 2 (Day 4–7 SLA Breach)
            </span>
            <p className="text-xs font-semibold text-gray-800 mt-2">District Collector / DIC General Manager</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Subpoenas the scrutiny officer; summons inter-departmental joint clearance meeting.
            </p>
          </div>
          <div className="p-3 bg-white rounded-xl border border-gray-200">
            <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-0.5 rounded">
              Tier 3 (&gt; 7 Days Breach)
            </span>
            <p className="text-xs font-semibold text-gray-800 mt-2">State Apex Clearance Committee</p>
            <p className="text-[11px] text-gray-500 mt-1">
              Deemed approval provisions triggered under Single Window Clearance Legislation.
            </p>
          </div>
        </div>
      </div>

      {/* Grievances Docket List */}
      <div className="space-y-4">
        {grievances.map((item) => (
          <div key={item.id} className="card p-5 border hover:border-rose-200 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  {item.id}
                </span>
                <span className="text-xs font-semibold text-gray-500">
                  Ref: {item.applicationId}
                </span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-semibold self-start sm:self-auto ${
                  item.status === 'Resolved'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : item.status === 'Escalated'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {item.status} ({item.escalationLevel})
              </span>
            </div>

            <div className="mt-3">
              <h2 className="text-base font-bold text-gray-900">{item.subject}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                <span className="flex items-center gap-1 font-medium text-gray-700">
                  <Building2 size={14} className="text-gray-400" />
                  {item.department}
                </span>
                <span className="flex items-center gap-1 font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">
                  <Clock size={13} />
                  SLA Breached by {item.slaBreachDays} Days
                </span>
                <span>Filed: {item.filedDate}</span>
                <span>Last Updated: {item.lastUpdate}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <p className="text-xs text-gray-700 font-medium">
                <span className="text-gray-400 font-normal">Next Mandatory Action: </span>
                {item.resolutionTimeline}
              </p>
              <button
                onClick={() => alert(`Docket ${item.id} tracking: Inspector memo issued. Hearing scheduled.`)}
                className="btn-secondary text-xs py-1.5 px-3 self-end sm:self-auto"
              >
                Track Hearing Log
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* File Escalation Modal */}
      {showFileModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleEscalate} className="card max-w-lg w-full p-6 animate-scale-in">
            <h2 className="text-lg font-bold text-gray-900">File Statutory SLA Breach Notice</h2>
            <p className="text-xs text-gray-500 mt-1">
              Select the delayed clearance to trigger automated escalation to supervisory authorities.
            </p>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Target Application</label>
                <select
                  value={selectedAppId}
                  onChange={(e) => setSelectedAppId(e.target.value)}
                  className="input-field text-xs"
                >
                  {applications.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.name} ({app.id}) — {app.department} [{app.status.toUpperCase()}]
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Escalation Trigger Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="SLA Delay: No progress beyond statutory timeline">
                    SLA Delay: Department exceeded published service charter timeframe
                  </option>
                  <option value="Repetitive Scrutiny: Same document queried multiple times">
                    Repetitive Scrutiny: Already submitted and verified document queried again
                  </option>
                  <option value="Unreasonable Condition: Requisition outside statutory checklist">
                    Unreasonable Requirement: Demanding NOC not present in standard gazetted list
                  </option>
                  <option value="No response to clarification submitted">
                    Clarification submitted by applicant pending review &gt; 5 working days
                  </option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Specific Grievance Summary</label>
                <textarea
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Provide concise details on delay, references, and impact on operations..."
                  className="input-field text-xs h-24"
                  required
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-[11px]">
                <p className="font-semibold flex items-center gap-1 mb-0.5">
                  <AlertTriangle size={14} className="text-amber-600" /> Statutory Protection
                </p>
                Under Section 7 of the Public Services Guarantee, nodal officers are mandated to render decision or provide formal explanation within 72 hours of receiving this notification.
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowFileModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary text-xs bg-rose-600 hover:bg-rose-700"
              >
                Dispatch Statutory Escalation
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
