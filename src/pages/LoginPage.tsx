import { useState } from 'react';
import {
  Shield,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Building2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Award,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { DEMO_USERS, type AuthUser, type UserRole } from '@/types/auth';

interface LoginPageProps {
  onLogin: (user: AuthUser) => void;
  onBack: () => void;
  initialRole?: UserRole;
}

export function LoginPage({ onLogin, onBack, initialRole = 'applicant' }: LoginPageProps) {
  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState(
    initialRole === 'admin' ? DEMO_USERS.admin.email : DEMO_USERS.applicant.email
  );
  const [password, setPassword] = useState('demo2026');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRoleSwitch = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMsg(null);
    if (newRole === 'admin') {
      setEmail(DEMO_USERS.admin.email);
    } else {
      setEmail(DEMO_USERS.applicant.email);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      if (role === 'admin') {
        const adminUser: AuthUser = {
          ...DEMO_USERS.admin,
          email: email.trim() || DEMO_USERS.admin.email,
        };
        onLogin(adminUser);
      } else {
        const applicantUser: AuthUser = {
          ...DEMO_USERS.applicant,
          email: email.trim() || DEMO_USERS.applicant.email,
        };
        onLogin(applicantUser);
      }
    }, 600);
  };

  const handleQuickDemoFill = (targetRole: UserRole) => {
    setRole(targetRole);
    if (targetRole === 'admin') {
      setEmail(DEMO_USERS.admin.email);
      setPassword('adminPass123');
    } else {
      setEmail(DEMO_USERS.applicant.email);
      setPassword('applicantPass123');
    }
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left panel — Hero & Authority Info */}
      <div
        className={`hidden lg:flex lg:w-5/12 relative overflow-hidden transition-all duration-500 ${
          role === 'admin'
            ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-800'
            : 'bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900'
        }`}
      >
        <div className="absolute inset-0 grid-bg opacity-15" />
        <div className="relative flex flex-col justify-between p-12 text-white h-full z-10">
          <div>
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-white/80 hover:text-white transition-colors text-sm mb-8"
            >
              <ArrowLeft size={16} /> Back to portal overview
            </button>
            <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md p-2.5 pr-4 border border-white/20 mb-6">
              <Logo size={40} textClass="text-white" />
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 ${
                role === 'admin'
                  ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                  : 'bg-white/20 text-white border border-white/20'
              }`}
            >
              {role === 'admin' ? (
                <>
                  <Shield size={14} className="text-amber-300" /> Statutory Scrutiny Officer Gateway
                </>
              ) : (
                <>
                  <Building2 size={14} /> Entrepreneur & Industrial Unit Portal
                </>
              )}
            </span>

            <h1 className="text-3xl font-extrabold leading-tight">
              {role === 'admin'
                ? 'Department Clearance & Scrutiny Administration'
                : 'Unified Approvals, Clearances & Incentives Gateway'}
            </h1>
            <p className="mt-3 text-white/80 text-sm leading-relaxed">
              {role === 'admin'
                ? 'Review multi-departmental dossiers, inspect verified uploaded documents, grant statutory sanctions, raise technical clarifications, and monitor SLA timelines.'
                : 'Track parallel approvals across Fire, Labour DISH, Power, Environment, and MIDC with reusable pre-validated dossiers and real-time alerts.'}
            </p>

            <div className="mt-8 space-y-3">
              {(role === 'admin'
                ? [
                    'Multi-Department Docket Scrutiny & Sanction',
                    'Direct Document Vault & Digital Sign Inspection',
                    'Joint Common Inspection Coordination',
                    'SLA Statutory Compliance & Delay Escalations',
                  ]
                : [
                    'Customized Regulatory Checklist Generator',
                    'Upload Once — Reusable Document Pre-Validation',
                    'Parallel Department Scrutiny Tracking',
                    '1-Click Government Schemes & Capital Subsidies',
                  ]
              ).map((feat) => (
                <div key={feat} className="flex items-center gap-2.5 text-xs text-white/90">
                  <CheckCircle2 size={16} className={role === 'admin' ? 'text-amber-400' : 'text-brand-300'} />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/10 text-xs text-white/60">
            Smart India Hackathon • Department of Industry & Internal Trade (DPIIT) Compliant
          </div>
        </div>
      </div>

      {/* Right panel — Dual Role Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Back & Logo */}
          <div className="lg:hidden mb-6 flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <Logo size={28} />
          </div>

          {/* Role Toggle Selector */}
          <div className="card p-1.5 bg-gray-100 border-gray-200 mb-6 flex items-center rounded-xl">
            <button
              type="button"
              onClick={() => handleRoleSwitch('applicant')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                role === 'applicant'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <User size={16} className={role === 'applicant' ? 'text-brand-600' : ''} />
              Applicant / Entrepreneur
            </button>

            <button
              type="button"
              onClick={() => handleRoleSwitch('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                role === 'admin'
                  ? 'bg-slate-900 text-amber-400 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Shield size={16} className={role === 'admin' ? 'text-amber-400' : ''} />
              Department Officer (Admin)
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {role === 'admin' ? 'Department Officer Sign In' : 'Industrial Unit Sign In'}
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {role === 'admin'
                ? 'Authorized access for verification officers, engineers, and nodal collectors.'
                : 'Enter your credentials to access applications, document repository, and subsidies.'}
            </p>
          </div>

          {/* Quick Demo Pre-fill Pill Badges */}
          <div className="mt-4 p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between text-xs text-blue-900 font-semibold mb-1.5">
              <span className="flex items-center gap-1">
                <Sparkles size={14} className="text-blue-600" />
                Quick Demo Switcher:
              </span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoFill('applicant')}
                className={`text-[11px] px-2.5 py-1 rounded-md font-semibold border transition-all ${
                  role === 'applicant'
                    ? 'bg-brand-600 text-white border-brand-700'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Log in as Applicant (Shree Ind.)
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoFill('admin')}
                className={`text-[11px] px-2.5 py-1 rounded-md font-semibold border transition-all ${
                  role === 'admin'
                    ? 'bg-slate-900 text-amber-400 border-slate-900'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                Log in as Officer (IAS Scrutiny)
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="mt-4 p-3 rounded-xl bg-error-50 border border-error-200 flex items-center gap-2 text-xs text-error-700">
              <AlertCircle size={16} className="text-error-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {role === 'admin' ? 'Official Gov Email ID / Officer Code' : 'Registered Business Email ID'}
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={role === 'admin' ? 'officer@singlewindow.gov.in' : 'entrepreneur@industry.com'}
                  className="input-field pl-10 text-xs py-2.5"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="input-field pl-10 pr-10 text-xs py-2.5"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                  defaultChecked
                />
                <span>Remember this terminal</span>
              </label>
              <span className="text-gray-400">Secured 256-bit TLS</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all ${
                role === 'admin'
                  ? 'bg-slate-900 text-amber-400 hover:bg-slate-800 shadow-md'
                  : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md'
              }`}
            >
              {isLoading ? (
                'Authenticating Credentials...'
              ) : (
                <>
                  {role === 'admin' ? 'Enter Officer Scrutiny Console' : 'Access Industrial Workspace'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Role details box */}
          <div className="mt-6 card p-3 bg-gray-50 border-gray-200 text-xs space-y-1.5">
            <p className="font-semibold text-gray-800 flex items-center gap-1.5">
              {role === 'admin' ? (
                <Shield size={14} className="text-amber-600" />
              ) : (
                <Building2 size={14} className="text-brand-600" />
              )}
              {role === 'admin' ? 'Logged Profile Preview (Officer):' : 'Logged Profile Preview (Applicant):'}
            </p>
            <p className="text-gray-600">
              <strong>Name:</strong> {role === 'admin' ? DEMO_USERS.admin.name : DEMO_USERS.applicant.name}
            </p>
            <p className="text-gray-600">
              <strong>Unit / Dept:</strong>{' '}
              {role === 'admin' ? DEMO_USERS.admin.department : DEMO_USERS.applicant.companyName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
