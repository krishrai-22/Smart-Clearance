import { useState } from 'react';
import {
  User,
  Building2,
  MapPin,
  FileText,
  IndianRupee,
  Users,
  Pencil,
  FolderOpen,
  History,
  Mail,
  ShieldCheck,
  Save,
  X,
} from 'lucide-react';
import { Modal } from '@/components/Modal';
import { company, applications } from '@/data/mockData';
import type { PageKey } from '@/components/Sidebar';

interface ProfilePageProps {
  onNavigate: (page: PageKey) => void;
}

export function ProfilePage({ onNavigate }: ProfilePageProps) {
  const infoItems = [
    { icon: Building2, label: 'Company', value: company.name },
    { icon: User, label: 'Industry', value: company.industry },
    { icon: MapPin, label: 'Location', value: company.location },
    { icon: FileText, label: 'Registration ID', value: company.registrationId },
    { icon: IndianRupee, label: 'Investment', value: company.investment },
    { icon: Users, label: 'Employees', value: String(company.employees) },
    { icon: Mail, label: 'Email', value: company.email },
    { icon: ShieldCheck, label: 'Compliance Status', value: '86% — Good Standing' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Industry Profile</h1>
        <p className="text-gray-600 mt-1">Manage your company information and documents.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Profile card */}
        <div className="card p-6 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
            RS
          </div>
          <h2 className="font-bold text-gray-900 text-lg">{company.owner}</h2>
          <p className="text-sm text-gray-500">{company.email}</p>
          <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-50 text-success-700 text-xs font-semibold">
            <ShieldCheck size={14} /> Verified Account
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              <p className="text-xs text-gray-500">Applications</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-success-600">
                {applications.filter((a) => a.status === 'approved').length}
              </p>
              <p className="text-xs text-gray-500">Approved</p>
            </div>
          </div>
        </div>

        {/* Company info */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Company Information</h2>
            <EditProfileButton />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {infoItems.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50">
                  <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
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
        </div>
      </div>

      {/* Action cards */}
      <div className="grid sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigate('documents')}
          className="card card-hover p-5 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center mb-3">
            <FolderOpen size={20} className="text-accent-600" />
          </div>
          <p className="font-semibold text-gray-900">Company Documents</p>
          <p className="text-xs text-gray-500 mt-1">View and manage uploaded files</p>
        </button>
        <button
          onClick={() => onNavigate('approvals')}
          className="card card-hover p-5 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-3">
            <History size={20} className="text-brand-600" />
          </div>
          <p className="font-semibold text-gray-900">Application History</p>
          <p className="text-xs text-gray-500 mt-1">View all past and current applications</p>
        </button>
        <button
          onClick={() => onNavigate('compliance')}
          className="card card-hover p-5 text-left"
        >
          <div className="w-10 h-10 rounded-xl bg-success-50 flex items-center justify-center mb-3">
            <ShieldCheck size={20} className="text-success-600" />
          </div>
          <p className="font-semibold text-gray-900">Compliance Status</p>
          <p className="text-xs text-gray-500 mt-1">Check regulatory compliance score</p>
        </button>
      </div>

      {/* Application History Preview */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Applications</h2>
          <button onClick={() => onNavigate('approvals')} className="text-sm text-brand-600 font-medium hover:text-brand-700">
            View All →
          </button>
        </div>
        <div className="space-y-2">
          {applications.slice(0, 3).map((app) => (
            <div
              key={app.id}
              onClick={() => onNavigate('approvals')}
              className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all cursor-pointer"
            >
              <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center">
                <FileText size={16} className="text-brand-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{app.name}</p>
                <p className="text-xs text-gray-500">{app.id} • {app.submittedDate}</p>
              </div>
              <span className={`text-xs font-semibold capitalize ${
                app.status === 'approved' ? 'text-success-600' :
                app.status === 'query' ? 'text-warning-600' :
                'text-brand-600'
              }`}>
                {app.status === 'review' ? 'Under Review' : app.status.charAt(0).toUpperCase() + app.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EditProfileButton() {
  return (
    <EditProfileModal />
  );
}

function EditProfileModal() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn-secondary text-sm">
        <Pencil size={14} /> Edit Profile
      </button>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Edit Profile">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
            <input type="text" defaultValue={company.name} className="input-field" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Industry</label>
              <input type="text" defaultValue={company.industry} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
              <input type="text" defaultValue={company.location} className="input-field" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Investment</label>
              <input type="text" defaultValue={company.investment} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Employees</label>
              <input type="text" defaultValue={String(company.employees)} className="input-field" />
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button onClick={() => setIsOpen(false)} className="btn-primary flex-1">
              <Save size={16} /> Save Changes
            </button>
            <button onClick={() => setIsOpen(false)} className="btn-secondary">
              <X size={16} /> Cancel
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center">Demo only — changes are not persisted.</p>
        </div>
      </Modal>
    </>
  );
}
