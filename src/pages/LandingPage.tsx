import {
  Compass,
  FileText,
  Clock,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  Layers,
  Zap,
  Eye,
  CheckCircle2,
  Building2,
  FileCheck2,
  Shield,
  User,
} from 'lucide-react';
import { Logo } from '@/components/Logo';
import { CircularProgress } from '@/components/CircularProgress';
import { StatusBadge } from '@/components/StatusBadge';
import { ProgressBar } from '@/components/Stepper';
import type { UserRole } from '@/types/auth';

interface LandingPageProps {
  onGetStarted: (role?: UserRole) => void;
  onExplore: () => void;
}

const features = [
  {
    icon: Compass,
    title: 'Checklist Generator & Knowledge Engine',
    description: 'Customized approval checklist across departments based on industry sector, location, and project size.',
    color: 'from-brand-500 to-brand-700',
  },
  {
    icon: FileText,
    title: 'Pre-Validated Dossier & Vault',
    description: 'Upload once, screen with AI, and reuse verified KYC, land, and technical layout documents across all departments.',
    color: 'from-accent-500 to-accent-700',
  },
  {
    icon: Clock,
    title: 'Parallel Workflows & Common Inspections',
    description: 'Coordinate concurrent department reviews and schedule unified joint inspections with a single digital report.',
    color: 'from-warning-400 to-warning-600',
  },
  {
    icon: ShieldCheck,
    title: 'Incentives & SLA Escalation',
    description: 'Direct matching to state capital subsidies and automated 3-tier escalation under the Public Services Guarantee.',
    color: 'from-success-400 to-success-600',
  },
];

const whyReasons = [
  { icon: Layers, title: 'One Unified Platform', description: 'Replace multiple government portals with a single, centralized dashboard.' },
  { icon: TrendingDown, title: 'Reduced Approval Complexity', description: 'Navigate complex multi-department workflows with clear, guided steps.' },
  { icon: Eye, title: 'Transparent Application Tracking', description: 'See exactly where each application stands and what happens next.' },
  { icon: FileText, title: 'Intelligent Document Management', description: 'OCR-powered extraction reduces manual data entry and errors.' },
  { icon: ShieldCheck, title: 'Proactive Compliance Monitoring', description: 'Never miss a deadline with automated alerts and reminders.' },
  { icon: Zap, title: 'Faster Approvals', description: 'AI-powered predictions help you address issues before they cause delays.' },
];

export function LandingPage({ onGetStarted, onExplore }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-4">
          <Logo />
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => onGetStarted('admin')}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 transition-colors flex items-center gap-1.5 border border-slate-700 shadow-xs"
            >
              <Shield size={14} className="text-amber-400" />
              <span>Officer Portal</span>
            </button>
            <button
              onClick={() => onGetStarted('applicant')}
              className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
            >
              <User size={14} /> Applicant Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden grid-bg">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50/50 via-white to-white" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-100 mb-6">
                <Building2 size={14} className="text-brand-600" />
                <span className="text-xs font-semibold text-brand-700">Smart India Hackathon 2026</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                Streamline Industrial <span className="text-gradient">Approvals</span> & Compliance
              </h1>
              <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-xl">
                Unified clearance & compliance platform for entrepreneurs and government scrutiny departments.
              </p>
              <p className="mt-3 text-sm font-medium text-brand-600">
                One Platform. Every Approval. Zero Confusion.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onGetStarted('applicant')}
                  className="btn-primary text-base px-6 py-3.5 flex items-center justify-center gap-2"
                >
                  <User size={18} /> Applicant Login (Entrepreneur)
                </button>
                <button
                  onClick={() => onGetStarted('admin')}
                  className="px-6 py-3.5 rounded-xl text-base font-bold bg-slate-900 text-amber-400 hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 border border-slate-700 shadow-md"
                >
                  <Shield size={18} className="text-amber-400" /> Officer Scrutiny Login (Admin)
                </button>
              </div>

              <div className="mt-6 flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Dual-role verified
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Department Scrutiny Ready
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Statutory SLA Guarantees
                </span>
              </div>
            </div>

            {/* Public National Single Window Clearance Overview */}
            <div className="relative animate-scale-in">
              <div className="card p-6 shadow-xl border border-gray-150 bg-white">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center">
                      <ShieldCheck size={20} className="text-brand-600" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">National Single Window System</p>
                      <p className="text-xs text-gray-500">Government Industrial Gateway • Live Statistics</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    Active Portal
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="card p-3 bg-brand-50/70 border-brand-100">
                    <p className="text-[11px] text-brand-600 font-medium">Departments</p>
                    <p className="text-xl font-bold text-brand-700">32+</p>
                    <p className="text-[10px] text-brand-500 mt-0.5">Central & State</p>
                  </div>
                  <div className="card p-3 bg-emerald-50/70 border-emerald-100">
                    <p className="text-[11px] text-emerald-600 font-medium">Clearances</p>
                    <p className="text-xl font-bold text-emerald-700">140+</p>
                    <p className="text-[10px] text-emerald-600 mt-0.5">Digital Approvals</p>
                  </div>
                  <div className="card p-3 bg-indigo-50/70 border-indigo-100">
                    <p className="text-[11px] text-indigo-600 font-medium">SLA Protected</p>
                    <p className="text-xl font-bold text-indigo-700">100%</p>
                    <p className="text-[10px] text-indigo-600 mt-0.5">Statutory Guarantee</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                        <CheckCircle2 size={16} className="text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Synchronized Joint Inspections</p>
                        <p className="text-[11px] text-gray-500">Fire, Labour, Environment in 1 visit</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">Enabled</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/80 border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center">
                        <FileCheck2 size={16} className="text-brand-600" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">Single Common Application (CAF)</p>
                        <p className="text-[11px] text-gray-500">Upload once, reuse across all departments</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-brand-700 bg-brand-100/70 px-2 py-0.5 rounded">Standard</span>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Zap size={15} className="text-amber-500" />
                    <span>Average processing time reduced by <strong>45%</strong></span>
                  </div>
                  <span className="text-[11px] text-brand-600 font-bold">DPIIT Compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Everything You Need for Effortless Approvals</h2>
            <p className="mt-4 text-gray-600">
              A comprehensive suite of intelligent tools designed specifically for Indian industrial units and regulatory departments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="card p-6 card-hover">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg">{feature.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose SmartClearance */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose SmartClearance?</h2>
            <p className="mt-4 text-gray-600">
              Designed from the ground up to solve real compliance challenges faced by Indian entrepreneurs.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyReasons.map((reason) => {
              const Icon = reason.icon;
              return (
                <div key={reason.title} className="card p-6 border border-gray-200">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center mb-4">
                    <Icon size={20} className="text-brand-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-base">{reason.title}</h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{reason.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white rounded-lg p-1.5">
                <Logo size={24} />
              </div>
              <span className="text-xs text-gray-300">
                Smart India Hackathon • Unified Industrial Clearance & Compliance Platform
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => onGetStarted('applicant')}
                className="text-xs text-white hover:text-brand-300 underline"
              >
                Applicant Login
              </button>
              <span>•</span>
              <button
                onClick={() => onGetStarted('admin')}
                className="text-xs text-amber-400 hover:text-amber-300 underline"
              >
                Officer (Admin) Login
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
