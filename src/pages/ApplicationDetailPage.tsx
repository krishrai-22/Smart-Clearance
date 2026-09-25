import { useState } from 'react';
import {
  ArrowLeft,
  FileText,
  CheckCircle2,
  AlertCircle,
  Eye,
  Building2,
  Calendar,
  Clock,
  Send,
  Upload,
  AlertOctagon,
  Sparkles,
  ShieldCheck,
  Check,
} from 'lucide-react';
import { StatusBadge, StatusDot } from '@/components/StatusBadge';
import { ProgressBar, Breadcrumb } from '@/components/Stepper';
import type { Application } from '@/data/mockData';
import { useApp } from '@/context/AppContext';

interface ApplicationDetailPageProps {
  applicationId: string;
  onBack: () => void;
  onViewDocuments: () => void;
  onEscalate?: (appId: string) => void;
}

export function ApplicationDetailPage({
  applicationId,
  onBack,
  onViewDocuments,
  onEscalate,
}: ApplicationDetailPageProps) {
  const { applications, respondToQuery } = useApp();
  const app = applications.find((a) => a.id === applicationId);

  const [queryResponseText, setQueryResponseText] = useState('');
  const [attachedClarificationDoc, setAttachedClarificationDoc] = useState('');
  const [responseSubmitted, setResponseSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!app) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Application not found.</p>
        <button onClick={onBack} className="btn-primary mt-4">Back to Approvals</button>
      </div>
    );
  }

  const detailItems = [
    { icon: Building2, label: 'Department', value: app.department },
    { icon: FileText, label: 'Application ID', value: app.id },
    { icon: Calendar, label: 'Submission Date', value: app.submittedDate },
    { icon: Clock, label: 'Last Updated', value: app.lastUpdated },
  ];

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryResponseText.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      respondToQuery(app.id, queryResponseText.trim(), attachedClarificationDoc || 'Clarification Response Letter');
      setIsSubmitting(false);
      setResponseSubmitted(true);
    }, 800);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="mb-3">
          <Breadcrumb items={['My Approvals', app.name]} />
        </div>
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4">
          <ArrowLeft size={16} /> Back to Approvals
        </button>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-gray-900">{app.name}</h1>
              <StatusBadge status={app.status} />
            </div>
            <p className="text-gray-600 mt-1">{app.department}</p>
          </div>
          <div className="flex items-center gap-2">
            {onEscalate && (
              <button
                onClick={() => onEscalate(app.id)}
                className="btn-secondary text-rose-600 border-rose-200 hover:bg-rose-50"
              >
                <AlertOctagon size={16} /> File SLA Escalation
              </button>
            )}
            <button onClick={onViewDocuments} className="btn-secondary">
              <Eye size={16} /> View Documents
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Details */}
        <div className="card p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Application Details</h2>
          <div className="space-y-4">
            {detailItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                    <Icon size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-sm font-medium text-gray-900">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Statutory SLA Guarantee */}
          <div className="mt-5 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
            <p className="font-semibold text-blue-900 flex items-center gap-1.5 mb-1">
              <ShieldCheck size={16} className="text-blue-600" /> Statutory SLA: 21 Working Days
            </p>
            <p className="text-blue-800">
              Departmental disposal mandatory under Industrial Facilitation Rules. Delays subject to automated supervisory alert.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Progress</span>
              <span className="font-semibold text-gray-900">{app.progress}%</span>
            </div>
            <ProgressBar value={app.progress} />
            <p className="text-xs text-gray-500 mt-2">
              Current stage: <span className="font-medium text-gray-700">{app.currentStage}</span>
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Parallel Department Timeline</h2>
          <div className="relative">
            {app.timeline.map((step, index) => (
              <div key={step.label} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <StatusDot status={step.status} />
                  {index < app.timeline.length - 1 && (
                    <div className={`w-0.5 h-10 ${step.status === 'done' ? 'bg-brand-500' : 'bg-gray-200'}`} />
                  )}
                </div>
                <div className="pb-4">
                  <p
                    className={`text-sm font-medium ${
                      step.status === 'done'
                        ? 'text-gray-900'
                        : step.status === 'current'
                        ? 'text-brand-700'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.date && (
                    <p
                      className={`text-xs mt-0.5 ${
                        step.status === 'current' ? 'text-brand-500' : 'text-gray-400'
                      }`}
                    >
                      {step.date}
                    </p>
                  )}
                  {step.status === 'current' && (
                    <span className="inline-flex items-center gap-1 mt-1 text-xs text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse" />
                      In Progress
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Required Action / Query Response Box */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div
              className={`card p-4 ${
                app.status === 'query'
                  ? 'bg-amber-50/80 border-amber-200'
                  : 'bg-brand-50 border-brand-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className={`flex-shrink-0 mt-0.5 ${
                    app.status === 'query' ? 'text-amber-600' : 'text-brand-600'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900">Required Action</p>
                  <p className="text-sm text-gray-700 mt-0.5">{app.nextAction}</p>

                  {/* Interactive Query Response Form */}
                  {app.status === 'query' && !responseSubmitted && (
                    <form onSubmit={handleQuerySubmit} className="mt-4 p-4 bg-white rounded-xl border border-amber-200 space-y-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                        <Sparkles size={14} className="text-amber-600" />
                        Official Department Query Response Form
                      </div>
                      <p className="text-xs text-gray-500">
                        Provide the requested technical justification or upload the revised document. Submitting will immediately update the scrutiny docket.
                      </p>

                      <textarea
                        value={queryResponseText}
                        onChange={(e) => setQueryResponseText(e.target.value)}
                        placeholder="State your clarification or load calculation details..."
                        className="input-field text-xs h-20"
                        required
                      />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <label className="inline-flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer hover:text-brand-600">
                          <Upload size={14} />
                          <span>
                            {attachedClarificationDoc || 'Attach Supporting Doc / Layout (PDF)'}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setAttachedClarificationDoc(e.target.files[0].name);
                              }
                            }}
                          />
                        </label>

                        <button
                          type="submit"
                          disabled={isSubmitting || !queryResponseText.trim()}
                          className="btn-primary text-xs py-1.5 px-3 bg-amber-600 hover:bg-amber-700 disabled:opacity-50"
                        >
                          {isSubmitting ? 'Transmitting Response...' : 'Submit Clarification'}
                        </button>
                      </div>
                    </form>
                  )}

                  {responseSubmitted && (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-2 text-xs text-emerald-800">
                      <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0" />
                      <span>
                        Your formal clarification was lodged and transmitted to MSEDCL scrutiny engineers.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submitted Documents & Verification Status */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-semibold text-gray-900">Submitted Documents & Pre-Validation</h2>
            <p className="text-xs text-gray-500">Reused from common verified vault to prevent repetitive physical scrutiny.</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {app.documents.map((doc) => (
            <div key={doc.name} className="card p-4 border-gray-200 bg-gray-50/50">
              <div className="flex items-start justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                  <FileText size={16} className="text-gray-500" />
                </div>
                {doc.verified ? (
                  <CheckCircle2 size={16} className="text-emerald-600" />
                ) : (
                  <Clock size={16} className="text-amber-500" />
                )}
              </div>
              <p className="text-sm font-medium text-gray-900">{doc.name}</p>
              <p className={`text-xs mt-1 font-semibold ${doc.verified ? 'text-emerald-600' : 'text-amber-600'}`}>
                {doc.verified ? 'Verified & Reusable' : 'Pending Scrutiny'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
