import { useState, useEffect, useCallback } from 'react';
import {
  Landmark,
  ArrowRight,
  Building2,
  Plug,
  Flame,
  Leaf,
  ShieldCheck,
  Info,
  Zap,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Loader2,
  X,
} from 'lucide-react';
import { Modal } from '@/components/Modal';
import { portalApi, type GovernmentPortal, type ServiceRequest } from '@/lib/supabase';

const categoryIcons: Record<string, typeof Landmark> = {
  'State Government': Landmark,
  'Industrial Safety': ShieldCheck,
  'Power & Energy': Plug,
  'Land & Infrastructure': Building2,
  'Fire Safety': Flame,
  'Environment': Leaf,
  'Central Government': Building2,
};

const categoryColors: Record<string, string> = {
  'State Government': 'from-brand-500 to-brand-700',
  'Industrial Safety': 'from-warning-400 to-warning-600',
  'Power & Energy': 'from-accent-400 to-accent-600',
  'Land & Infrastructure': 'from-success-400 to-success-600',
  'Fire Safety': 'from-error-400 to-error-600',
  'Environment': 'from-success-400 to-accent-600',
  'Central Government': 'from-brand-500 to-accent-600',
};

const statusConfig: Record<string, { label: string; badge: string; icon: typeof CheckCircle2 }> = {
  approved: { label: 'Approved', badge: 'badge-approved', icon: CheckCircle2 },
  review: { label: 'Under Review', badge: 'badge-review', icon: Loader2 },
  query: { label: 'Query Raised', badge: 'badge-query', icon: AlertTriangle },
  pending: { label: 'Pending', badge: 'badge-pending', icon: Info },
  rejected: { label: 'Rejected', badge: 'badge-overdue', icon: AlertTriangle },
};

interface GovernmentServicesPageProps {
  onNavigateToApprovals: () => void;
}

export function GovernmentServicesPage({ onNavigateToApprovals }: GovernmentServicesPageProps) {
  const [selectedService, setSelectedService] = useState<GovernmentPortal | null>(null);
  const [portals, setPortals] = useState<GovernmentPortal[]>([]);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<{ portal: string; message: string; success: boolean } | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [portalData, requestData] = await Promise.all([
        portalApi.getPortals(),
        portalApi.getRequests(),
      ]);
      setPortals(portalData);
      setRequests(requestData);
      setError(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to load data';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSync = async (portal: GovernmentPortal) => {
    setSyncing(portal.code);
    setSyncResult(null);
    try {
      const result = await portalApi.syncPortal(portal.code);
      if (result.synced) {
        setSyncResult({
          portal: portal.name,
          message: `Successfully synced ${result.count} request(s) from ${portal.name}.`,
          success: true,
        });
        await loadData();
      } else {
        setSyncResult({
          portal: portal.name,
          message: result.error || `Could not sync with ${portal.name}. The external portal may be offline.`,
          success: false,
        });
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Sync failed';
      setSyncResult({ portal: portal.name, message: msg, success: false });
    } finally {
      setSyncing(null);
    }
  };

  const getPortalRequests = (portalId: string) => requests.filter((r) => r.portal_id === portalId);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={28} className="animate-spin text-brand-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
              <Landmark size={22} className="text-brand-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Government Services</h1>
              <p className="text-gray-600">Access important industrial services from one place.</p>
            </div>
          </div>
        </div>
        <div className="card p-6 bg-error-50 border-error-200">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-error-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-error-900">Connection Error</p>
              <p className="text-sm text-error-700 mt-1">{error}</p>
              <button onClick={loadData} className="btn-primary mt-3 text-sm">
                <RefreshCw size={14} /> Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <Landmark size={22} className="text-brand-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Government Services</h1>
            <p className="text-gray-600">Access important industrial services from one place.</p>
          </div>
        </div>
      </div>

      {/* API status banner */}
      <div className="card p-4 bg-gradient-to-r from-brand-50 to-accent-50 border-brand-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-brand-100 flex items-center justify-center flex-shrink-0">
            <Zap size={18} className="text-brand-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">REST API Integration Active</p>
            <p className="text-xs text-gray-600">
              Connected to {portals.length} government portals · {requests.length} service requests tracked ·
              <span className="text-brand-600 font-medium ml-1">Real-time sync enabled</span>
            </p>
          </div>
          <button
            onClick={loadData}
            className="btn-secondary text-xs px-3 py-2"
          >
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      {/* Sync result notification */}
      {syncResult && (
        <div className={`card p-4 ${syncResult.success ? 'bg-success-50 border-success-200' : 'bg-warning-50 border-warning-200'} animate-slide-up`}>
          <div className="flex items-start gap-3">
            {syncResult.success ? (
              <CheckCircle2 size={20} className="text-success-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertTriangle size={20} className="text-warning-600 flex-shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{syncResult.portal}</p>
              <p className="text-sm text-gray-600 mt-0.5">{syncResult.message}</p>
            </div>
            <button onClick={() => setSyncResult(null)} className="text-gray-400 hover:text-gray-600">
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Service cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {portals.map((portal, i) => {
          const Icon = categoryIcons[portal.category] || Landmark;
          const color = categoryColors[portal.category] || 'from-brand-500 to-brand-700';
          const portalReqs = getPortalRequests(portal.id);
          const activeCount = portalReqs.filter((r) => r.status !== 'approved' && r.status !== 'rejected').length;

          return (
            <div
              key={portal.id}
              className="card card-hover p-6 animate-slide-up"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
                  <Icon size={24} className="text-white" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                  portal.status === 'active'
                    ? 'bg-success-50 text-success-700'
                    : portal.status === 'maintenance'
                    ? 'bg-warning-50 text-warning-700'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {portal.status}
                </span>
              </div>
              <h3 className="font-semibold text-gray-900">{portal.name}</h3>
              <p className="text-sm text-gray-600 mt-1 mb-3">{portal.description}</p>
              <div className="flex items-center gap-2 mb-4">
                <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {portal.category}
                </span>
                {activeCount > 0 && (
                  <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700">
                    {activeCount} active
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedService(portal)}
                  className="btn-secondary flex-1 text-sm"
                >
                  View Service <ArrowRight size={14} />
                </button>
                <button
                  onClick={() => handleSync(portal)}
                  disabled={syncing === portal.code}
                  className="btn-secondary text-sm px-3"
                  title="Sync with portal"
                >
                  {syncing === portal.code ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Service modal */}
      <Modal
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.name}
      >
        {selectedService && (
          <div className="space-y-4">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${categoryColors[selectedService.category] || 'from-brand-500 to-brand-700'} flex items-center justify-center`}>
              {(() => {
                const Icon = categoryIcons[selectedService.category] || Landmark;
                return <Icon size={32} className="text-white" />;
              })()}
            </div>
            <p className="text-sm text-gray-600">{selectedService.description}</p>

            {/* API endpoint info */}
            <div className="card p-4 bg-gray-50">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink size={16} className="text-brand-600" />
                <p className="text-sm font-semibold text-gray-900">REST API Endpoint</p>
              </div>
              <code className="text-xs text-gray-600 break-all">{selectedService.api_endpoint}</code>
              <p className="text-xs text-gray-400 mt-2">
                Use this endpoint to integrate with {selectedService.name} programmatically.
              </p>
            </div>

            {/* Service requests for this portal */}
            {(() => {
              const portalReqs = getPortalRequests(selectedService.id);
              if (portalReqs.length === 0) {
                return (
                  <div className="card p-4 bg-gray-50">
                    <p className="text-sm text-gray-500 text-center py-2">No active service requests for this portal.</p>
                  </div>
                );
              }
              return (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Service Requests ({portalReqs.length})</p>
                  {portalReqs.map((req) => {
                    const status = statusConfig[req.status] || statusConfig.pending;
                    const StatusIcon = status.icon;
                    return (
                      <div key={req.id} className="card p-3 flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{req.service_name}</p>
                          <p className="text-xs text-gray-500">{req.reference_number}</p>
                        </div>
                        <span className={`status-badge ${status.badge}`}>
                          <StatusIcon size={12} className={req.status === 'review' ? 'animate-spin' : ''} />
                          {status.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              );
            })()}

            <div className="card p-4 bg-brand-50 border-brand-100">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={16} className="text-brand-600" />
                <p className="text-sm font-semibold text-gray-900">Available Actions</p>
              </div>
              <ul className="text-sm text-gray-600 space-y-1.5">
                <li>• Track existing applications in real-time</li>
                <li>• Submit new applications via REST API</li>
                <li>• Sync data from the external portal</li>
                <li>• Download approved documents</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedService(null);
                  onNavigateToApprovals();
                }}
                className="btn-primary flex-1"
              >
                View My Applications <ArrowRight size={16} />
              </button>
              <button onClick={() => setSelectedService(null)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
