import { useState } from 'react';
import {
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Lightbulb,
  Info,
  Zap,
} from 'lucide-react';
import { applications } from '@/data/mockData';

const riskColors: Record<string, { bar: string; bg: string; text: string; label: string }> = {
  Low: { bar: 'bg-success-500', bg: 'bg-success-50', text: 'text-success-700', label: 'Low Risk' },
  Medium: { bar: 'bg-warning-500', bg: 'bg-warning-50', text: 'text-warning-700', label: 'Medium Risk' },
  High: { bar: 'bg-error-500', bg: 'bg-error-50', text: 'text-error-700', label: 'High Risk' },
};

export function AIInsightsPage() {
  const appsWithRisk = applications.filter((a) => a.delayRisk !== undefined);
  const [selectedId, setSelectedId] = useState(appsWithRisk[0]?.id || '');
  const selected = appsWithRisk.find((a) => a.id === selectedId);

  if (!selected) return null;

  const risk = riskColors[selected.riskLevel || 'Low'];

  const expectedTimeline = [
    { label: 'Expected', days: 7, color: 'bg-gray-300' },
    { label: 'Predicted', days: parseInt(selected.expectedDays?.split('–')[0] || '8'), color: risk.bar },
  ];
  const maxDays = Math.max(...expectedTimeline.map((t) => t.days));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center">
            <Sparkles size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
            <p className="text-gray-600">Approval delay prediction and risk analysis.</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 bg-brand-50 px-3 py-2 rounded-lg w-fit">
          <Info size={14} className="text-brand-500" />
          Prototype simulation of XGBoost + SHAP system — demo/predicted data
        </div>
      </div>

      {/* App selector */}
      <div className="flex gap-2 overflow-x-auto scrollbar-thin">
        {appsWithRisk.map((app) => (
          <button
            key={app.id}
            onClick={() => setSelectedId(app.id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              selectedId === app.id
                ? 'bg-brand-600 text-white shadow-sm'
                : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {app.name}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Delay Risk Card */}
        <div className={`card p-6 ${risk.bg} border-0`}>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className={risk.text} />
            <h2 className="font-semibold text-gray-900">Delay Risk</h2>
          </div>
          <div className="text-center py-4">
            <p className={`text-5xl font-bold ${risk.text}`}>{selected.delayRisk}%</p>
            <p className={`text-sm font-medium mt-2 ${risk.text}`}>{risk.label}</p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200/60">
            <p className="text-xs text-gray-600">Expected Processing Time</p>
            <p className="text-lg font-semibold text-gray-900 mt-0.5">{selected.expectedDays}</p>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Risk Level</span>
              <span className={risk.text}>{selected.delayRisk}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${risk.bar} rounded-full transition-all duration-1000`} style={{ width: `${selected.delayRisk}%` }} />
            </div>
          </div>
        </div>

        {/* Timeline comparison chart */}
        <div className="card p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-1">Timeline Comparison</h2>
          <p className="text-xs text-gray-500 mb-6">Expected vs predicted processing days</p>
          <div className="space-y-6">
            {expectedTimeline.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-medium text-gray-700">{item.label} Timeline</span>
                  <span className="font-semibold text-gray-900">{item.days} days</span>
                </div>
                <div className="w-full h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full ${item.color} rounded-lg transition-all duration-1000 flex items-center justify-end pr-2`}
                    style={{ width: `${(item.days / maxDays) * 100}%` }}
                  >
                    <span className="text-xs text-white font-medium">{item.days}d</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Zap size={14} className="text-brand-500" />
              Predicted delay: +{parseInt(selected.expectedDays?.split('–')[0] || '8') - 7} days beyond standard timeline
            </div>
          </div>
        </div>
      </div>

      {/* SHAP explanation */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-1">
          <h2 className="font-semibold text-gray-900">Why is the risk {selected.riskLevel}?</h2>
          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">SHAP-style explanation</span>
        </div>
        <p className="text-xs text-gray-500 mb-6">Factors contributing to the predicted delay risk</p>
        <div className="space-y-4">
          {(selected.shapFactors || []).map((factor) => {
            const isPositive = factor.value > 0;
            const absValue = Math.abs(factor.value);
            return (
              <div key={factor.label}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-gray-700">{factor.label}</span>
                  <span className={`font-semibold ${isPositive ? 'text-error-600' : 'text-success-600'}`}>
                    {isPositive ? '+' : ''}{factor.value}%
                  </span>
                </div>
                <div className="relative w-full h-7 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className={`h-full rounded-lg transition-all duration-1000 ${
                      isPositive ? 'bg-gradient-to-r from-warning-400 to-error-500' : 'bg-gradient-to-r from-success-400 to-success-500'
                    }`}
                    style={{ width: `${absValue * 3}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
          <Info size={12} />
          Positive values increase delay risk; negative values reduce it.
        </div>
      </div>

      {/* Recommendation */}
      <div className="card p-6 bg-gradient-to-br from-brand-50 to-accent-50 border-brand-100">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
            <Lightbulb size={20} className="text-brand-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-semibold text-gray-900">Recommended Action</h2>
            <p className="text-sm text-gray-700 mt-1">
              {selected.status === 'query'
                ? 'Respond to the department query and upload the missing load certificate to reduce potential delay.'
                : 'Upload the missing inspection document to reduce potential delay.'}
            </p>
            <button className="btn-primary mt-4">
              Resolve Issue <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* All applications summary */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 mb-4">All Applications Risk Summary</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {appsWithRisk.map((app) => {
            const r = riskColors[app.riskLevel || 'Low'];
            return (
              <div
                key={app.id}
                onClick={() => setSelectedId(app.id)}
                className={`card p-4 border cursor-pointer transition-all ${
                  selectedId === app.id ? 'border-brand-300 ring-2 ring-brand-100' : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-900">{app.name}</p>
                  <span className={`text-xs font-semibold ${r.text}`}>{app.delayRisk}%</span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${r.bar} rounded-full`} style={{ width: `${app.delayRisk}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-2">{r.label} • {app.expectedDays}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
