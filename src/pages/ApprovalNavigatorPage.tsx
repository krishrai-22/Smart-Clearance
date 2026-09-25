import { useState } from 'react';
import {
  Compass,
  Check,
  ArrowRight,
  ArrowLeft,
  MapPin,
  Building2,
  IndianRupee,
  FileCheck2,
  Clock,
  Sparkles,
  Download,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Stepper, ProgressBar } from '@/components/Stepper';
import { StatusBadge } from '@/components/StatusBadge';
import {
  industryTypes,
  states,
  districts,
  industrialAreas,
  navigatorApprovals,
} from '@/data/mockData';
import type { ApprovalStatus } from '@/data/mockData';
import type { PageKey } from '@/components/Sidebar';
import { useApp } from '@/context/AppContext';

interface ApprovalNavigatorPageProps {
  onNavigate?: (page: PageKey) => void;
}

export function ApprovalNavigatorPage({ onNavigate }: ApprovalNavigatorPageProps) {
  const { submitNewApplication } = useApp();
  const [step, setStep] = useState(0);
  const [industryType, setIndustryType] = useState('Manufacturing');
  const [selectedState, setSelectedState] = useState('Maharashtra');
  const [selectedDistrict, setSelectedDistrict] = useState('Pune');
  const [selectedArea, setSelectedArea] = useState('Chakan MIDC');
  const [investment, setInvestment] = useState('12.5');
  const [land, setLand] = useState('5.0');
  const [employees, setEmployees] = useState('140');
  const [electricity, setElectricity] = useState('650');
  const [category, setCategory] = useState('Orange Category (Moderate Pollution)');
  const [results, setResults] = useState<typeof navigatorApprovals | null>(null);
  const [checklistDownloaded, setChecklistDownloaded] = useState(false);
  const [submittedClearances, setSubmittedClearances] = useState<Record<string, string>>({});

  const handleApplySingle = (approval: (typeof navigatorApprovals)[0]) => {
    const created = submitNewApplication({
      name: approval.category,
      department: approval.department,
      documents: approval.documents.map((d) => ({ name: d, verified: true })),
      expectedDays: '15–21 days',
    });
    setSubmittedClearances((prev) => ({ ...prev, [approval.category]: created.id }));
  };

  const steps = ['Industry Type', 'Location', 'Project Details', 'Customized Checklist'];
  const canProceed =
    step === 0
      ? industryType
      : step === 1
      ? selectedState && selectedDistrict && selectedArea
      : step === 2
      ? investment && land && employees && electricity
      : true;

  const handleFind = () => {
    setResults(navigatorApprovals);
    setStep(3);
  };

  const handleReset = () => {
    setStep(0);
    setIndustryType('');
    setSelectedState('');
    setSelectedDistrict('');
    setSelectedArea('');
    setInvestment('');
    setLand('');
    setEmployees('');
    setElectricity('');
    setCategory('');
    setResults(null);
  };

  const downloadCustomizedChecklist = () => {
    setChecklistDownloaded(true);
    setTimeout(() => setChecklistDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Compass size={22} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Regulatory Knowledge Engine & Checklist Generator</h1>
            <p className="text-gray-600">
              Generate a legally customized, multi-departmental approval checklist tailored to your sector, location, project size, and stage.
            </p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <Stepper steps={steps.slice(0, 3)} currentStep={step < 3 ? step : 2} />

        {/* Step 1: Industry Type */}
        {step === 0 && (
          <div className="mt-8 animate-slide-up">
            <h2 className="font-semibold text-gray-900 mb-1">Select Industry Sector & Activity</h2>
            <p className="text-sm text-gray-500 mb-4">
              Determines applicable environmental categorisation (White/Green/Orange/Red) and statutory factory regulations.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {industryTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setIndustryType(type)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    industryType === type
                      ? 'border-brand-500 bg-brand-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <Building2 size={20} className={industryType === type ? 'text-brand-600' : 'text-gray-400'} />
                  <p
                    className={`text-sm font-medium mt-2 ${
                      industryType === type ? 'text-brand-700' : 'text-gray-700'
                    }`}
                  >
                    {type}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 1 && (
          <div className="mt-8 animate-slide-up space-y-4">
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Project Geographic Location</h2>
              <p className="text-sm text-gray-500">
                Identifies local municipal bodies, state pollution control boards, industrial development corporations, and power discoms.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    setSelectedDistrict('');
                    setSelectedArea('');
                  }}
                  className="input-field appearance-none"
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">District</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setSelectedArea('');
                  }}
                  disabled={!selectedState}
                  className="input-field appearance-none disabled:opacity-50"
                >
                  <option value="">Select District</option>
                  {selectedState &&
                    districts[selectedState]?.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Industrial Zone / Area</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  disabled={!selectedDistrict}
                  className="input-field appearance-none disabled:opacity-50"
                >
                  <option value="">Select Zone</option>
                  {selectedDistrict &&
                    industrialAreas[selectedDistrict]?.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Project Details */}
        {step === 2 && (
          <div className="mt-8 animate-slide-up space-y-4">
            <div>
              <h2 className="font-semibold text-gray-900 mb-1">Project Scale, Power & Pollution Thresholds</h2>
              <p className="text-sm text-gray-500">
                Parameters required to calculate High Tension (HT) lines, EIA thresholds, and factory inspectorate categories.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Capital Investment (₹ Crores)</label>
                <input
                  type="text"
                  value={investment}
                  onChange={(e) => setInvestment(e.target.value)}
                  placeholder="e.g. 10.5"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Land Area (Acres)</label>
                <input
                  type="text"
                  value={land}
                  onChange={(e) => setLand(e.target.value)}
                  placeholder="e.g. 4.5"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Estimated Workforce</label>
                <input
                  type="text"
                  value={employees}
                  onChange={(e) => setEmployees(e.target.value)}
                  placeholder="e.g. 120"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Sanctioned Electricity Load (kVA/kW)</label>
                <input
                  type="text"
                  value={electricity}
                  onChange={(e) => setElectricity(e.target.value)}
                  placeholder="e.g. 500"
                  className="input-field"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Pollution Index Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field appearance-none"
                >
                  <option value="Green Category (Low Pollution)">Green Category (Low Pollution — Consent to Operate Expedited)</option>
                  <option value="Orange Category (Moderate Pollution)">Orange Category (Moderate Pollution — CTE/CTO Required)</option>
                  <option value="Red Category (High Pollution)">Red Category (High Pollution — Detailed EIA & Public Hearing)</option>
                  <option value="White Category (Exempted)">White Category (Exempted — Simple Online Intimation)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-40"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {step < 2 ? (
              <button
                onClick={() => canProceed && setStep(step + 1)}
                disabled={!canProceed}
                className="btn-primary disabled:opacity-40"
              >
                Next <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={handleFind}
                disabled={!canProceed}
                className="btn-primary disabled:opacity-40 flex items-center gap-2"
              >
                <Sparkles size={16} /> Run Regulatory Engine & Generate Checklist
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Checklist */}
      {step === 3 && results && (
        <div className="space-y-6 animate-slide-up">
          <div className="card p-6 bg-gradient-to-br from-brand-50 via-white to-purple-50 border-brand-200">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
                  <ShieldCheck size={14} /> Legally Binding Scrutiny Matrix Verified
                </div>
                <h2 className="text-xl font-bold text-gray-900">Customized Master Approval Checklist</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Parameters: <strong>{industryType}</strong> ({category.split(' ')[0]}) • <strong>{selectedArea}</strong>, {selectedDistrict}, {selectedState} • Investment: <strong>₹{investment} Cr</strong> • Power: <strong>{electricity} kW</strong>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadCustomizedChecklist}
                  className="btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
                >
                  <Download size={14} />
                  {checklistDownloaded ? 'Checklist Downloaded!' : 'Download Gazetted PDF Checklist'}
                </button>
                <button onClick={handleReset} className="btn-secondary text-xs py-2 px-3">
                  Reconfigure Parameters
                </button>
              </div>
            </div>

            {/* Parallel Workflows Indicator */}
            <div className="mt-4 pt-4 border-t border-brand-100 grid sm:grid-cols-3 gap-3">
              <div className="p-3 bg-white rounded-xl border border-brand-100 text-xs">
                <p className="text-gray-500 font-medium">Parallel Clearance Tracks</p>
                <p className="text-sm font-bold text-brand-700 mt-0.5">5 Departments Concurrent</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-brand-100 text-xs">
                <p className="text-gray-500 font-medium">Common Verified Docs Reused</p>
                <p className="text-sm font-bold text-emerald-600 mt-0.5">7 Documents Auto-Attached</p>
              </div>
              <div className="p-3 bg-white rounded-xl border border-brand-100 text-xs">
                <p className="text-gray-500 font-medium">Maximum Statutory SLA</p>
                <p className="text-sm font-bold text-purple-700 mt-0.5">30 Working Days Guaranteed</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {results.map((approval, index) => {
              return (
                <div key={index} className="card p-5 card-hover border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center flex-shrink-0">
                      <FileCheck2 size={20} className="text-brand-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-gray-500">#{index + 1}</span>
                          <h3 className="font-bold text-gray-900 text-base">{approval.category}</h3>
                        </div>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Pre-Validated Ready
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-500 mt-0.5">{approval.department}</p>

                      <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div className="lg:col-span-2">
                          <p className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                            Mandatory Documentation Checklist
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {approval.documents.map((doc) => (
                              <span
                                key={doc}
                                className="text-xs px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium border border-gray-200 flex items-center gap-1"
                              >
                                <Check size={12} className="text-emerald-600" />
                                {doc}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider">
                            Statutory Disposal SLA
                          </p>
                          <div className="flex items-center gap-1.5 text-xs text-gray-700 font-medium bg-gray-50 p-2 rounded-lg border border-gray-200">
                            <Clock size={14} className="text-brand-600" />
                            15–21 Working Days max
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between flex-wrap gap-2">
                        {submittedClearances[approval.category] ? (
                          <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                            <Check size={14} className="text-emerald-600" />
                            Submitted as {submittedClearances[approval.category]} (Live in Admin Console)
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleApplySingle(approval)}
                            className="text-xs text-brand-700 font-bold flex items-center gap-1.5 bg-brand-50 hover:bg-brand-100 px-3 py-1.5 rounded-lg border border-brand-200 transition-colors"
                          >
                            <Zap size={14} className="text-brand-600" />
                            1-Click Parallel Submit
                          </button>
                        )}
                        {onNavigate && (
                          <button
                            onClick={() => onNavigate('approvals')}
                            className="btn-primary text-xs py-1.5 px-3"
                          >
                            Track in Dashboard <ArrowRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
