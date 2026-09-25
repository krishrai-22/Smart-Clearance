import { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Check,
  Building2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Send,
  Calendar,
  Layers,
  HelpCircle,
  Shield,
  FileCheck2,
  FileCheck,
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/Stepper';
import { company, type Application, type DocumentItem, type ApprovalStatus } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import type { AuthUser } from '@/types/auth';

interface AdminDashboardPageProps {
  adminUser: AuthUser;
  onLogout: () => void;
  onViewApplicantView?: () => void;
}

export function AdminDashboardPage({ adminUser, onLogout, onViewApplicantView }: AdminDashboardPageProps) {
  const {
    applications,
    documents: allDocuments,
    approveApplication,
    raiseApplicationQuery,
    verifyDocument,
  } = useApp();

  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [selectedDocForPreview, setSelectedDocForPreview] = useState<DocumentItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [adminNote, setAdminNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);

  const selectedApp = applications.find((a) => a.id === selectedAppId) || null;

  // Filtered applications
  const filteredApps = applications.filter((app) => {
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Admin Approve Action with Synchronized Context
  const handleApprove = (appId: string) => {
    setActionInProgress(appId);
    setTimeout(() => {
      approveApplication(appId, adminUser.name);
      setActionInProgress(null);
      showToast(`Application ${appId} approved successfully! Statutory sanction issued.`);
    }, 600);
  };

  // Admin Raise Query Action with Synchronized Context
  const handleRaiseQuery = (appId: string) => {
    if (!adminNote.trim()) {
      alert('Please specify the clarification or deficiency note before raising a query.');
      return;
    }
    setActionInProgress(appId);
    setTimeout(() => {
      raiseApplicationQuery(appId, adminNote.trim(), adminUser.name);
      setAdminNote('');
      setActionInProgress(null);
      showToast(`Formal query dispatched to applicant for ${appId}.`);
    }, 600);
  };

  // Verify single uploaded document
  const handleVerify = (docName: string) => {
    verifyDocument(docName);
    showToast(`Document "${docName}" verified & digitally stamped.`);
  };

  const pendingScrutinyCount = applications.filter((a) => a.status === 'review' || a.status === 'pending').length;
  const approvedCount = applications.filter((a) => a.status === 'approved').length;
  const queryCount = applications.filter((a) => a.status === 'query').length;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
              <Shield size={22} className="text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  OFFICER CONSOLE
                </span>
                <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Synchronized
                </span>
              </div>
              <h1 className="text-lg font-bold text-white mt-0.5">
                {adminUser.department || 'Directorate of Industries'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-white">{adminUser.name}</p>
              <p className="text-[11px] text-amber-400">{adminUser.designation || 'Nodal Officer'}</p>
            </div>
            {onViewApplicantView && (
              <button
                onClick={onViewApplicantView}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors border border-slate-700 flex items-center gap-1.5"
              >
                <Layers size={14} /> Switch to Applicant View
              </button>
            )}
            <button
              onClick={onLogout}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 space-y-6">
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-slide-up">
            <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Admin KPI Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80">
            <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
              <span>Total Docket Submissions</span>
              <Layers size={16} className="text-slate-400" />
            </div>
            <p className="text-2xl font-bold text-white mt-1.5">{applications.length}</p>
            <p className="text-[11px] text-slate-400 mt-1">Live synchronized records</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-amber-500/30">
            <div className="flex items-center justify-between text-amber-400 text-xs font-medium">
              <span>Pending Scrutiny / Review</span>
              <Clock size={16} className="text-amber-400" />
            </div>
            <p className="text-2xl font-bold text-amber-300 mt-1.5">{pendingScrutinyCount}</p>
            <p className="text-[11px] text-slate-400 mt-1">Awaiting statutory sanction</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-emerald-500/30">
            <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
              <span>Sanctioned / Approved</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-emerald-300 mt-1.5">{approvedCount}</p>
            <p className="text-[11px] text-slate-400 mt-1">Certificates issued</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-orange-500/30">
            <div className="flex items-center justify-between text-orange-400 text-xs font-medium">
              <span>Queries / Deficiencies</span>
              <AlertCircle size={16} className="text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-orange-300 mt-1.5">{queryCount}</p>
            <p className="text-[11px] text-slate-400 mt-1">Under applicant clarification</p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
            {[
              { label: 'All Requests', val: 'all' },
              { label: 'Under Review', val: 'review' },
              { label: 'Query Raised', val: 'query' },
              { label: 'Approved', val: 'approved' },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setStatusFilter(tab.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                  statusFilter === tab.val
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ID, clearance or dept..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Clearance Applications Table */}
        <div className="rounded-2xl bg-slate-800/60 border border-slate-700/80 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white">Departmental Clearance Inward Register</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Applicant unit: <strong className="text-amber-400">{company.name}</strong> • {company.registrationId}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-700 text-slate-300">
              {filteredApps.length} Records Found
            </span>
          </div>

          <div className="divide-y divide-slate-700/60">
            {filteredApps.map((app) => (
              <div
                key={app.id}
                className="p-5 hover:bg-slate-800/90 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                      {app.id}
                    </span>
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        app.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : app.status === 'query'
                          ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                          : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {app.status}
                    </span>
                    <span className="text-xs text-slate-400">Submitted: {app.submittedDate}</span>
                  </div>

                  <h3 className="text-base font-bold text-white">{app.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                    <span>{app.department}</span>
                    <span>•</span>
                    <span>Stage: <span className="text-slate-200 font-semibold">{app.currentStage}</span></span>
                  </p>

                  <div className="mt-2.5 flex items-center gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">Scrutiny Progress:</span>
                      <span className="font-semibold text-white">{app.progress}%</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <FileCheck size={14} className="text-amber-400" />
                      <span>{app.documents.filter((d) => d.verified).length} / {app.documents.length} verified docs</span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                  <button
                    onClick={() => setSelectedAppId(app.id)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-700 text-white hover:bg-slate-600 transition-colors flex items-center gap-1.5"
                  >
                    <Eye size={14} /> Scrutinize & View Docs
                  </button>

                  {app.status !== 'approved' && (
                    <button
                      onClick={() => handleApprove(app.id)}
                      disabled={actionInProgress === app.id}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50"
                    >
                      <CheckCircle2 size={14} />
                      {actionInProgress === app.id ? 'Sanctioning...' : 'Approve Application'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Master Uploaded Document Vault Section (Direct Admin Inspection) */}
        <div className="p-6 rounded-2xl bg-slate-800/60 border border-slate-700/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 size={20} className="text-amber-400" />
                Applicant Uploaded Document Dossier ({allDocuments.length} files)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Inspect raw uploaded certificates, licenses, and layouts in the centralized repository.
              </p>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
              Reusable Verified Repository Active
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {allDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-slate-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-amber-300 border border-slate-700">
                      {doc.type}
                    </span>
                    <span className="text-[11px] text-slate-400">{doc.size}</span>
                  </div>
                  <p className="text-xs font-bold text-white truncate">{doc.name}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Uploaded: {doc.uploadDate}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'verified'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : 'bg-amber-500/20 text-amber-300'
                    }`}
                  >
                    {doc.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => setSelectedDocForPreview(doc)}
                    className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    Inspect <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Scrutiny & Approval Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-2xl w-full rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                    {selectedApp.id}
                  </span>
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                      selectedApp.status === 'approved'
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : selectedApp.status === 'query'
                        ? 'bg-orange-500/20 text-orange-300'
                        : 'bg-blue-500/20 text-blue-300'
                    }`}
                  >
                    {selectedApp.status}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-white mt-1.5">{selectedApp.name}</h2>
                <p className="text-xs text-slate-400">{selectedApp.department}</p>
              </div>
              <button
                onClick={() => setSelectedAppId(null)}
                className="text-slate-400 hover:text-white text-lg font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Dossier Details */}
            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/80 grid sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400">Applicant:</span>
                  <p className="font-semibold text-white mt-0.5">Shree Industries Pvt. Ltd.</p>
                </div>
                <div>
                  <span className="text-slate-400">Current Department Stage:</span>
                  <p className="font-semibold text-amber-300 mt-0.5">{selectedApp.currentStage}</p>
                </div>
              </div>

              {/* Uploaded Documents List with Individual Verification */}
              <div>
                <h3 className="font-bold text-white mb-2 uppercase tracking-wider text-[11px]">
                  Uploaded Statutory Documents ({selectedApp.documents.length})
                </h3>
                <div className="space-y-2">
                  {selectedApp.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/80 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileText size={16} className="text-slate-400" />
                        <div>
                          <p className="font-semibold text-white">{doc.name}</p>
                          <p className="text-[11px] text-slate-400">
                            {doc.verified ? 'Scrutinized & Pre-Validated' : 'Requires Officer Stamp'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.verified ? (
                          <span className="px-2 py-1 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                            <Check size={12} /> Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerify(doc.name)}
                            className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition-colors"
                          >
                            Mark Verified
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Form: Raise Query / Deficiencies */}
              {selectedApp.status !== 'approved' && (
                <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 space-y-2">
                  <label className="block font-bold text-white text-xs">
                    Officer Clarification / Deficiency Requisition Note
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Specify missing calculations, revised site setbacks, or required technical attachments..."
                    className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 h-20"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRaiseQuery(selectedApp.id)}
                      disabled={!adminNote.trim() || actionInProgress === selectedApp.id}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-orange-600 text-white hover:bg-orange-500 transition-colors disabled:opacity-40 flex items-center gap-1.5"
                    >
                      <Send size={13} /> Dispatch Query to Applicant
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedAppId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Close Docket
              </button>

              {selectedApp.status !== 'approved' && (
                <button
                  onClick={() => handleApprove(selectedApp.id)}
                  disabled={actionInProgress === selectedApp.id}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-500 transition-colors flex items-center gap-1.5 shadow-lg shadow-emerald-950"
                >
                  <CheckCircle2 size={16} /> Grant Statutory Sanction (Approve)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Raw Document Inspection Modal */}
      {selectedDocForPreview && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 max-w-lg w-full rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-amber-400" />
                <h3 className="text-sm font-bold text-white">{selectedDocForPreview.name}</h3>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800 text-slate-300 space-y-1">
                <p><strong>File Classification:</strong> {selectedDocForPreview.type} ({selectedDocForPreview.size})</p>
                <p><strong>Digital Stamp:</strong> 256-bit Hash Verified (UIDAI / MCA Repository)</p>
                <p><strong>Date Lodged:</strong> {selectedDocForPreview.uploadDate}</p>
              </div>

              {selectedDocForPreview.extractedData && (
                <div>
                  <p className="font-bold text-white mb-1.5">Extracted Key Data Attributes:</p>
                  <div className="rounded-xl border border-slate-800 divide-y divide-slate-800 bg-slate-950/60">
                    {selectedDocForPreview.extractedData.map((d, i) => (
                      <div key={i} className="flex justify-between p-2 text-[11px]">
                        <span className="text-slate-400">{d.label}</span>
                        <span className="font-semibold text-slate-200">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
