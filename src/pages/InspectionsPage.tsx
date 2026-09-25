import { useState } from 'react';
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  FileCheck,
  Plus,
  Shield,
  Download,
  Filter,
} from 'lucide-react';
import { commonInspections, type CommonInspection } from '@/data/mockData';

export function InspectionsPage() {
  const [inspections, setInspections] = useState<CommonInspection[]>(commonInspections);
  const [selectedInspection, setSelectedInspection] = useState<CommonInspection | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState('Chakan Plant Unit 2, Pune');
  const [preferredDate, setPreferredDate] = useState('2026-10-05');
  const [selectedDepts, setSelectedDepts] = useState<string[]>([
    'Maharashtra Fire Services',
    'DISH Maharashtra (Factories)',
  ]);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const availableDepts = [
    { name: 'Maharashtra Fire Services', role: 'Fire NOC & Hydrant Testing' },
    { name: 'DISH Maharashtra (Factories)', role: 'Safety, Machinery Guarding & Welfare' },
    { name: 'MPCB (Pollution Control)', role: 'Air/Water Pollution, ETP & Hazardous Waste' },
    { name: 'MSEDCL (Power Inspector)', role: 'Electrical Substation & Earthing Safety' },
    { name: 'Weights & Measures Dept', role: 'Calibrated Industrial Scales Verification' },
  ];

  const handleToggleDept = (deptName: string) => {
    setSelectedDepts((prev) =>
      prev.includes(deptName) ? prev.filter((d) => d !== deptName) : [...prev, deptName]
    );
  };

  const handleCreateInspection = (e: React.FormEvent) => {
    e.preventDefault();
    const newInsp: CommonInspection = {
      id: `INSP-2026-${Math.floor(100 + Math.random() * 900)}`,
      facility: selectedFacility,
      scheduledDate: `${preferredDate}, 10:00 AM`,
      departments: selectedDepts.map((d) => ({
        name: d,
        officer: 'Designated Officer (Auto-Assigned)',
        status: 'confirmed',
      })),
      status: 'scheduled',
      jointChecklist: [
        { item: 'Combined site safety and boundary setback verification', mandatory: true, verified: false },
        { item: 'Primary utility lines isolation and emergency trip-switch test', mandatory: true, verified: false },
        { item: 'Statutory signage and evacuation floorplans check', mandatory: true, verified: false },
      ],
      notes: 'Unified joint inspection request logged. Multi-department officers notified under Common Inspection Policy.',
    };

    setInspections([newInsp, ...inspections]);
    setShowScheduleModal(false);
    setScheduleSuccess(true);
    setTimeout(() => setScheduleSuccess(false), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
            <CalendarDays size={22} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Common Inspection Planner</h1>
            <p className="text-gray-600">
              Harmonize and synchronize multi-departmental field inspections into a single visit.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowScheduleModal(true)}
          className="btn-primary text-xs py-2 px-3 bg-blue-600 hover:bg-blue-700 flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus size={16} /> Request Joint Inspection
        </button>
      </div>

      {scheduleSuccess && (
        <div className="card p-4 bg-emerald-50 border-emerald-200 flex items-center gap-3">
          <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-900">Joint Inspection Scheduled!</p>
            <p className="text-xs text-emerald-700">
              Department officers have been synchronized. Single unified digital inspection report will be generated.
            </p>
          </div>
        </div>
      )}

      {/* Feature Value Props Card */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs mb-1">
            <Users size={16} /> Zero Business Disruption
          </div>
          <p className="text-xs text-gray-600">
            Departments (Fire, Labour, Pollution, Electricity) conduct one joint visit instead of multiple random visits.
          </p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-700 font-semibold text-xs mb-1">
            <FileCheck size={16} /> Unified Digital Checklist
          </div>
          <p className="text-xs text-gray-600">
            Pre-defined statutory checklist uploaded online within 48 hours with geo-tagged photographic evidence.
          </p>
        </div>
        <div className="card p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
          <div className="flex items-center gap-2 text-amber-700 font-semibold text-xs mb-1">
            <Shield size={16} /> Risk-Based Frequency
          </div>
          <p className="text-xs text-gray-600">
            Low-risk establishments benefit from self-certification, while high-risk units receive coordinated scheduled audits.
          </p>
        </div>
      </div>

      {/* Inspections List */}
      <div className="space-y-4">
        {inspections.map((insp) => (
          <div key={insp.id} className="card p-5 border hover:border-blue-200 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {insp.id}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      insp.status === 'completed'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : insp.status === 'scheduled'
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {insp.status === 'completed' ? 'Inspection Completed' : 'Joint Inspection Scheduled'}
                  </span>
                </div>
                <h2 className="text-base font-bold text-gray-900 mt-1.5 flex items-center gap-2">
                  <MapPin size={16} className="text-gray-400" />
                  {insp.facility}
                </h2>
              </div>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <div className="flex items-center gap-1.5 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200">
                  <Clock size={14} className="text-gray-400" />
                  <span className="font-semibold text-gray-700">{insp.scheduledDate}</span>
                </div>
              </div>
            </div>

            {/* Participating Departments */}
            <div className="mt-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Coordinated Departments ({insp.departments.length})
              </p>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-2">
                {insp.departments.map((dept) => (
                  <div key={dept.name} className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-gray-800">{dept.name}</p>
                      <p className="text-[11px] text-gray-500">Officer: {dept.officer}</p>
                    </div>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" title="Confirmed" />
                  </div>
                ))}
              </div>
            </div>

            {/* Joint Checklist Preview */}
            <div className="mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-600">Common Inspection Checklist</p>
                <span className="text-xs text-gray-500">
                  {insp.jointChecklist.filter((c) => c.verified).length} of {insp.jointChecklist.length} verified
                </span>
              </div>
              <div className="space-y-1.5">
                {insp.jointChecklist.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    {item.verified ? (
                      <CheckCircle2 size={14} className="text-emerald-500 flex-shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-gray-300 flex-shrink-0" />
                    )}
                    <span className={item.verified ? 'text-gray-700' : 'text-gray-500'}>
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-500 italic truncate max-w-md">{insp.notes}</p>
              <button
                onClick={() => setSelectedInspection(insp)}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                View Full Joint Audit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedInspection && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="card max-w-xl w-full p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  {selectedInspection.id}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-1">{selectedInspection.facility}</h2>
              </div>
              <button onClick={() => setSelectedInspection(null)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Joint Checklist Status
                </h3>
                <div className="space-y-2">
                  {selectedInspection.jointChecklist.map((c, i) => (
                    <div key={i} className="p-2.5 rounded-lg border border-gray-200 flex items-center justify-between">
                      <span className="text-xs text-gray-800">{c.item}</span>
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          c.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {c.verified ? 'Passed' : 'Pending Scrutiny'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-xs">
                <p className="font-semibold text-gray-700 mb-1">Inspector Notes</p>
                <p className="text-gray-600">{selectedInspection.notes}</p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setSelectedInspection(null)} className="btn-secondary text-xs">
                Close
              </button>
              <button
                onClick={() => {
                  alert('Downloading official signed Joint Inspection Report (JIR)...');
                  setSelectedInspection(null);
                }}
                className="btn-primary text-xs bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5"
              >
                <Download size={14} /> Download Joint Certificate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Joint Inspection Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleCreateInspection} className="card max-w-lg w-full p-6 animate-scale-in">
            <h2 className="text-lg font-bold text-gray-900">Request Coordinated Inspection</h2>
            <p className="text-xs text-gray-500 mt-1">
              Select industrial site and required departments to synchronize inspectors into a single date.
            </p>

            <div className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">Industrial Facility</label>
                <select
                  value={selectedFacility}
                  onChange={(e) => setSelectedFacility(e.target.value)}
                  className="input-field text-xs"
                >
                  <option value="Chakan Plant Unit 2, Pune">Chakan Plant Unit 2, Pune</option>
                  <option value="Bhosari MIDC Warehouse B, Pune">Bhosari MIDC Warehouse B, Pune</option>
                  <option value="Ranjangaon New Assembly Floor">Ranjangaon New Assembly Floor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">Preferred Joint Date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="input-field text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Select Participating Departments (Joint Scrutiny)
                </label>
                <div className="space-y-2">
                  {availableDepts.map((d) => (
                    <label
                      key={d.name}
                      className={`flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                        selectedDepts.includes(d.name)
                          ? 'border-blue-500 bg-blue-50/50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedDepts.includes(d.name)}
                        onChange={() => handleToggleDept(d.name)}
                        className="mt-0.5 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{d.name}</p>
                        <p className="text-[11px] text-gray-500">{d.role}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={selectedDepts.length === 0}
                className="btn-primary text-xs bg-blue-600 hover:bg-blue-700"
              >
                Confirm Joint Schedule
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
