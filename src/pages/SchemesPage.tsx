import { useState } from 'react';
import {
  Gift,
  CheckCircle2,
  Clock,
  TrendingUp,
  FileCheck2,
  ArrowRight,
  ShieldCheck,
  Search,
  Filter,
  DollarSign,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { schemesAndIncentives, type SchemeIncentive } from '@/data/mockData';

export function SchemesPage() {
  const [schemes, setSchemes] = useState<SchemeIncentive[]>(schemesAndIncentives);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<SchemeIncentive | null>(null);
  const [applyingScheme, setApplyingScheme] = useState<SchemeIncentive | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState<string | null>(null);

  const categories = ['All', 'Capital Subsidy', 'Interest Subvention', 'Green Incentive', 'Export Support'];

  const filteredSchemes = schemes.filter((s) => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.benefits.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalEligibleSubsidy = '₹2.50 Cr+';

  const handleApply = (scheme: SchemeIncentive) => {
    setSchemes((prev) =>
      prev.map((item) => (item.id === scheme.id ? { ...item, status: 'Applied' as const } : item))
    );
    setAppliedSuccess(scheme.name);
    setApplyingScheme(null);
    setTimeout(() => setAppliedSuccess(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
            <Gift size={22} className="text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Incentives & Government Schemes</h1>
            <p className="text-gray-600">
              AI-matched subsidies, capital grants, and interest subvention mapped to your industrial profile.
            </p>
          </div>
        </div>
        <div className="card px-4 py-2 bg-gradient-to-r from-purple-50 to-brand-50 border-purple-200 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
            <TrendingUp size={18} className="text-purple-700" />
          </div>
          <div>
            <p className="text-xs text-purple-700 font-medium">Estimated Claimable Benefits</p>
            <p className="text-lg font-bold text-purple-900">{totalEligibleSubsidy}</p>
          </div>
        </div>
      </div>

      {appliedSuccess && (
        <div className="card p-4 bg-emerald-50 border-emerald-200 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Application Lodged Successfully!</p>
            <p className="text-xs text-emerald-700">
              Application for <strong>{appliedSuccess}</strong> has been transmitted with pre-filled verified KYC documents.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search schemes or benefits..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-9 py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Schemes Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => (
          <div key={scheme.id} className="card p-5 border hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                  {scheme.category}
                </span>
                <div className="flex items-center gap-1.5 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-700">
                    {scheme.matchingScore}% Match
                  </span>
                </div>
              </div>

              <h2 className="text-base font-bold text-gray-900 mt-2">{scheme.name}</h2>
              <p className="text-xs text-gray-500 mb-3">{scheme.ministry}</p>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-3 space-y-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Key Benefit</p>
                  <p className="text-xs font-medium text-gray-800">{scheme.benefits}</p>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">Max Support Ceiling</p>
                  <p className="text-sm font-bold text-brand-600">{scheme.maxSubsidy}</p>
                </div>
              </div>

              <div className="text-xs text-gray-600 space-y-1">
                <p>
                  <span className="font-semibold text-gray-700">Eligibility: </span>
                  {scheme.eligibility}
                </p>
                <p className="text-gray-500">
                  <span className="font-semibold text-gray-700">Application Deadline: </span>
                  {scheme.deadline}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  scheme.status === 'Eligible'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : scheme.status === 'Applied'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : scheme.status === 'Under Review'
                    ? 'bg-purple-50 text-purple-700 border border-purple-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                {scheme.status}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="btn-ghost text-xs py-1.5 px-2.5"
                >
                  View Criteria
                </button>
                {scheme.status === 'Eligible' && (
                  <button
                    onClick={() => setApplyingScheme(scheme)}
                    className="btn-primary text-xs py-1.5 px-3 bg-purple-600 hover:bg-purple-700"
                  >
                    1-Click Apply
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Criteria Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card max-w-lg w-full p-6 animate-scale-in">
            <h2 className="text-lg font-bold text-gray-900">{selectedScheme.name}</h2>
            <p className="text-xs text-gray-500 mt-1">{selectedScheme.ministry}</p>

            <div className="mt-4 space-y-3">
              <div className="p-3 bg-purple-50 rounded-xl border border-purple-100">
                <p className="text-xs font-semibold text-purple-900">Verified Auto-Precheck:</p>
                <ul className="text-xs text-purple-800 mt-1 space-y-1 list-disc list-inside">
                  <li>MSME Udyam Registration: Matched (MH26D0019284)</li>
                  <li>Industrial Taluka: Eligible Area Classification</li>
                  <li>Investment Scale: In range (&gt; ₹1.5 Cr verified via balance sheet)</li>
                  <li>Common KYC Documents: 100% pre-validated in Document Vault</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-700">Detailed Criteria</h3>
                <p className="text-xs text-gray-600 mt-1">{selectedScheme.eligibility}</p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-gray-700">Disbursement Mechanism</h3>
                <p className="text-xs text-gray-600 mt-1">
                  Direct Benefit Transfer (DBT) directly into industrial escrow account post joint physical inspection and expenditure audit.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setSelectedScheme(null)} className="btn-secondary text-xs">
                Close
              </button>
              {selectedScheme.status === 'Eligible' && (
                <button
                  onClick={() => {
                    const s = selectedScheme;
                    setSelectedScheme(null);
                    setApplyingScheme(s);
                  }}
                  className="btn-primary text-xs bg-purple-600 hover:bg-purple-700"
                >
                  Proceed to 1-Click Apply
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 1-Click Apply Confirmation Modal */}
      {applyingScheme && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card max-w-md w-full p-6 animate-scale-in">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center mb-3">
              <FileCheck2 size={24} className="text-purple-600" />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Pre-Validated Submission</h2>
            <p className="text-xs text-gray-600 mt-1">
              Apply for <strong>{applyingScheme.name}</strong> using existing verified repository records.
            </p>

            <div className="mt-4 p-3 bg-gray-50 rounded-xl space-y-2 text-xs border border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Applicant Unit:</span>
                <span className="font-semibold text-gray-800">Shree Industries Pvt. Ltd.</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Pre-attached Documents:</span>
                <span className="font-semibold text-emerald-600">4 Verified Docs Attached</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Direct Subsidy Estimate:</span>
                <span className="font-semibold text-purple-700">{applyingScheme.maxSubsidy}</span>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setApplyingScheme(null)} className="btn-secondary text-xs">
                Cancel
              </button>
              <button
                onClick={() => handleApply(applyingScheme)}
                className="btn-primary text-xs bg-purple-600 hover:bg-purple-700"
              >
                Confirm & Submit Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
