import { useState } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  Eye,
  Check,
  Clock,
  ChevronRight,
  Send,
  Layers,
  Shield,
  FileCheck2,
  FileCheck,
  ArrowRight,
  Building2,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { StatusBadge } from '@/components/StatusBadge';
import { company, type DocumentItem, type ApprovalStatus } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { Logo } from '@/components/Logo';
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
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      {/* Top Header - Unified Clean Light Navbar matching User side */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-3.5 shadow-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <Logo size={36} />
            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                  Officer Console
                </span>
                <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Sync
                </span>
              </div>
              <h1 className="text-sm font-bold text-gray-900 mt-0.5">
                {adminUser.department || 'Directorate of Industries'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-gray-900">{adminUser.name}</p>
              <p className="text-[11px] text-gray-500">{adminUser.designation || 'Nodal Scrutiny Officer'}</p>
            </div>
            {onViewApplicantView && (
              <button
                onClick={onViewApplicantView}
                className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
              >
                <Layers size={14} /> Switch to Applicant View
              </button>
            )}
            <button
              onClick={onLogout}
              className="text-xs font-semibold px-3 py-2 rounded-xl text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center gap-1.5"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 space-y-6 animate-fade-in">
        {toastMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center gap-2.5 animate-slide-up shadow-xs">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Banner Notice */}
        <div className="card p-5 bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-200 text-xs font-semibold mb-1">
              <Shield size={15} />
              <span>National Single Window Gateway • Department Clearance Desk</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight">Statutory Clearance & Scrutiny Bench</h2>
            <p className="text-xs text-brand-100 mt-1 max-w-2xl">
              Inspect submitted architectural plans, environmental reports, and pre-validated dossier credentials. Digitally stamp, approve, or issue formal statutory queries.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 self-start md:self-auto text-xs">
            <Building2 size={16} className="text-brand-200" />
            <div>
              <p className="font-semibold text-white">{company.name}</p>
              <p className="text-[10px] text-brand-200">{company.registrationId}</p>
            </div>
          </div>
        </div>

        {/* KPI Cards (Same palette as User Dashboard) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="card p-4.5 bg-white border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Total Docket Submissions</span>
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <FileCheck2 size={18} className="text-brand-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-900 mt-2">{applications.length}</p>
            <p className="text-[11px] text-gray-500 mt-1">Live synchronized records</p>
          </div>

          <div className="card p-4.5 bg-white border border-amber-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Pending Scrutiny</span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
                <Clock size={18} className="text-amber-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-amber-600 mt-2">{pendingScrutinyCount}</p>
            <p className="text-[11px] text-gray-500 mt-1">Awaiting statutory sanction</p>
          </div>

          <div className="card p-4.5 bg-white border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Sanctioned / Approved</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 size={18} className="text-emerald-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-emerald-600 mt-2">{approvedCount}</p>
            <p className="text-[11px] text-gray-500 mt-1">Certificates issued</p>
          </div>

          <div className="card p-4.5 bg-white border border-orange-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between text-gray-500 text-xs font-medium">
              <span>Queries / Deficiencies</span>
              <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <AlertCircle size={18} className="text-orange-600" />
              </div>
            </div>
            <p className="text-2xl font-bold text-orange-600 mt-2">{queryCount}</p>
            <p className="text-[11px] text-gray-500 mt-1">Under applicant clarification</p>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="card p-4 bg-white border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-gray-100 rounded-xl">
            {[
              { label: 'All Requests', val: 'all' },
              { label: 'Under Review', val: 'review' },
              { label: 'Query Raised', val: 'query' },
              { label: 'Approved', val: 'approved' },
            ].map((tab) => (
              <button
                key={tab.val}
                onClick={() => setStatusFilter(tab.val)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === tab.val
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID, clearance or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 text-xs py-2 bg-gray-50 border-gray-200 focus:bg-white"
            />
          </div>
        </div>

        {/* Clearance Applications Table */}
        <div className="card bg-white border border-gray-200 overflow-hidden shadow-xs">
          <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold text-gray-900">Departmental Clearance Inward Register</h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Applicant unit: <strong className="text-gray-900">{company.name}</strong> • {company.registrationId}
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 border border-gray-200 self-start sm:self-auto">
              {filteredApps.length} Records Found
            </span>
          </div>

          <div className="divide-y divide-gray-100">
            {filteredApps.length === 0 ? (
              <div className="p-8 text-center text-gray-500 text-xs">
                No clearance applications match your current filters.
              </div>
            ) : (
              filteredApps.map((app) => (
                <div
                  key={app.id}
                  className="p-5 hover:bg-gray-50/80 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                        {app.id}
                      </span>
                      <StatusBadge status={app.status} />
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">Submitted: {app.submittedDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-gray-900">{app.name}</h3>
                    <p className="text-xs text-gray-600 mt-0.5 flex items-center gap-2">
                      <span className="font-medium text-brand-700">{app.department}</span>
                      <span className="text-gray-300">•</span>
                      <span>Stage: <span className="text-gray-800 font-semibold">{app.currentStage}</span></span>
                    </p>

                    <div className="mt-3 flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-500">Scrutiny Progress:</span>
                        <div className="w-24 bg-gray-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              app.status === 'approved' ? 'bg-emerald-500' : 'bg-brand-500'
                            }`}
                            style={{ width: `${app.progress}%` }}
                          />
                        </div>
                        <span className="font-semibold text-gray-900">{app.progress}%</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <FileCheck size={14} className="text-emerald-600" />
                        <span>{app.documents.filter((d) => d.verified).length} / {app.documents.length} verified docs</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                    <button
                      onClick={() => setSelectedAppId(app.id)}
                      className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
                    >
                      <Eye size={14} /> Scrutinize & View Docs
                    </button>

                    {app.status !== 'approved' && (
                      <button
                        onClick={() => handleApprove(app.id)}
                        disabled={actionInProgress === app.id}
                        className="btn-primary text-xs py-2 px-4 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <CheckCircle2 size={14} />
                        {actionInProgress === app.id ? 'Sanctioning...' : 'Approve Application'}
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Master Uploaded Document Vault Section (Direct Admin Inspection) */}
        <div className="card p-6 bg-white border border-gray-200 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FileCheck2 size={20} className="text-brand-600" />
                Applicant Uploaded Document Dossier ({allDocuments.length} files)
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Inspect raw uploaded certificates, licenses, and layouts in the centralized repository.
              </p>
            </div>
            <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Reusable Verified Repository Active
            </span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {allDocuments.map((doc) => (
              <div
                key={doc.id}
                className="p-4 rounded-xl bg-gray-50/70 border border-gray-200 hover:border-gray-300 hover:bg-white transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-white text-gray-700 border border-gray-200">
                      {doc.type}
                    </span>
                    <span className="text-[11px] text-gray-500">{doc.size}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate" title={doc.name}>
                    {doc.name}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Uploaded: {doc.uploadDate}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-200 flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      doc.status === 'verified'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {doc.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => setSelectedDocForPreview(doc)}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-0.5"
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
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 max-w-2xl w-full rounded-2xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto scrollbar-thin animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-200">
                    {selectedApp.id}
                  </span>
                  <StatusBadge status={selectedApp.status} />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mt-1.5">{selectedApp.name}</h2>
                <p className="text-xs text-gray-500">{selectedApp.department}</p>
              </div>
              <button
                onClick={() => setSelectedAppId(null)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold p-1 rounded-lg hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Dossier Details */}
            <div className="mt-4 space-y-4 text-xs">
              <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 grid sm:grid-cols-2 gap-3">
                <div>
                  <span className="text-gray-500 font-medium">Applicant Entity:</span>
                  <p className="font-semibold text-gray-900 mt-0.5">Shree Industries Pvt. Ltd.</p>
                </div>
                <div>
                  <span className="text-gray-500 font-medium">Current Department Stage:</span>
                  <p className="font-semibold text-brand-700 mt-0.5">{selectedApp.currentStage}</p>
                </div>
              </div>

              {/* Uploaded Documents List with Individual Verification */}
              <div>
                <h3 className="font-bold text-gray-800 mb-2 uppercase tracking-wider text-[11px]">
                  Uploaded Statutory Documents ({selectedApp.documents.length})
                </h3>
                <div className="space-y-2">
                  {selectedApp.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-gray-200 flex items-center justify-between hover:border-gray-300 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-600">
                          <FileText size={16} />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{doc.name}</p>
                          <p className="text-[11px] text-gray-500">
                            {doc.verified ? 'Scrutinized & Pre-Validated' : 'Requires Officer Stamp'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {doc.verified ? (
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <Check size={12} /> Verified
                          </span>
                        ) : (
                          <button
                            onClick={() => handleVerify(doc.name)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-brand-600 text-white hover:bg-brand-700 transition-colors shadow-xs"
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
                <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200 space-y-2">
                  <label className="block font-bold text-orange-950 text-xs">
                    Officer Clarification / Deficiency Requisition Note
                  </label>
                  <textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Specify missing calculations, revised site setbacks, or required technical attachments..."
                    className="w-full p-3 rounded-xl bg-white border border-orange-200 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:border-orange-400 h-20"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleRaiseQuery(selectedApp.id)}
                      disabled={!adminNote.trim() || actionInProgress === selectedApp.id}
                      className="px-3.5 py-2 rounded-xl text-xs font-bold bg-orange-600 text-white hover:bg-orange-700 transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-xs"
                    >
                      <Send size={13} /> Dispatch Query to Applicant
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer Controls */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
              <button
                onClick={() => setSelectedAppId(null)}
                className="btn-secondary text-xs py-2 px-4"
              >
                Close Docket
              </button>

              {selectedApp.status !== 'approved' && (
                <button
                  onClick={() => handleApprove(selectedApp.id)}
                  disabled={actionInProgress === selectedApp.id}
                  className="btn-primary text-xs py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 max-w-lg w-full rounded-2xl p-6 shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-brand-600" />
                <h3 className="text-sm font-bold text-gray-900">{selectedDocForPreview.name}</h3>
              </div>
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 space-y-1.5">
                <p><strong className="text-gray-900">File Classification:</strong> {selectedDocForPreview.type} ({selectedDocForPreview.size})</p>
                <p><strong className="text-gray-900">Digital Stamp:</strong> 256-bit Hash Verified (UIDAI / MCA Repository)</p>
                <p><strong className="text-gray-900">Date Lodged:</strong> {selectedDocForPreview.uploadDate}</p>
              </div>

              {selectedDocForPreview.extractedData && (
                <div>
                  <p className="font-bold text-gray-900 mb-1.5">Extracted Key Data Attributes:</p>
                  <div className="rounded-xl border border-gray-200 divide-y divide-gray-100 bg-white">
                    {selectedDocForPreview.extractedData.map((d, i) => (
                      <div key={i} className="flex justify-between p-2.5 text-[11px]">
                        <span className="text-gray-500">{d.label}</span>
                        <span className="font-semibold text-gray-900">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setSelectedDocForPreview(null)}
                className="btn-secondary text-xs py-2 px-4"
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
