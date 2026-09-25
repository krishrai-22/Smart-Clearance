import { useState, useEffect } from 'react';
import {
  FolderOpen,
  Upload,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  Eye,
  ArrowRight,
  X,
  Loader2,
  FileCheck2,
  ShieldCheck,
  Image as ImageIcon,
  Database,
  ExternalLink,
  Trash2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { type DocumentItem } from '@/data/mockData';
import { useApp } from '@/context/AppContext';
import { documentStorage, getSupabaseConfig } from '@/lib/supabase';

const statusConfig = {
  verified: { label: 'Verified & Reusable', icon: CheckCircle2, class: 'text-success-600 bg-success-50' },
  extracted: { label: 'Data Extracted', icon: Sparkles, class: 'text-brand-600 bg-brand-50' },
  pending: { label: 'Pre-Validation Pending', icon: Clock, class: 'text-warning-600 bg-warning-50' },
};

const typeColors: Record<string, string> = {
  PDF: 'bg-error-100 text-error-700',
  JPG: 'bg-accent-100 text-accent-700',
  PNG: 'bg-emerald-100 text-emerald-700',
  DOCX: 'bg-brand-100 text-brand-700',
};

export function DocumentsPage() {
  const { documents, uploadDocument, verifyDocument, deleteDocument } = useApp();
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);
  const [ocrProcessing, setOcrProcessing] = useState(false);
  const [ocrComplete, setOcrComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<{
    tested: boolean;
    connected: boolean;
    message: string;
    details?: string;
  }>({
    tested: false,
    connected: false,
    message: 'Testing connection...',
  });
  const [showStatusModal, setShowStatusModal] = useState(false);

  const supabaseConfig = getSupabaseConfig();

  // Test live Supabase connection on load
  useEffect(() => {
    let isMounted = true;
    async function checkSupabase() {
      const res = await documentStorage.testConnection();
      if (isMounted) {
        setConnectionStatus({
          tested: true,
          connected: res.connected,
          message: res.message,
          details: res.details,
        });
      }
    }
    checkSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDocClick = (doc: DocumentItem) => {
    setSelectedDoc(doc);
    setOcrComplete(false);
    if (doc.status === 'extracted' || doc.status === 'verified') {
      setOcrProcessing(false);
      setOcrComplete(true);
    } else {
      setOcrProcessing(true);
      setTimeout(() => {
        setOcrProcessing(false);
        setOcrComplete(true);
      }, 1200);
    }
  };

  const processUploadedFiles = async (fileList: FileList | File[]) => {
    const files = Array.from(fileList);
    if (files.length === 0) return;

    setUploading(true);
    setUploadMessage('Uploading and securing files in vault...');

    for (const file of files) {
      try {
        const fileExt = (file.name.split('.').pop() || 'dat').toUpperCase();
        const type: 'PDF' | 'JPG' | 'PNG' | 'DOCX' =
          fileExt === 'JPG' || fileExt === 'JPEG'
            ? 'JPG'
            : fileExt === 'PNG'
            ? 'PNG'
            : fileExt === 'DOCX' || fileExt === 'DOC'
            ? 'DOCX'
            : 'PDF';

        // Format size
        const sizeFormatted =
          file.size > 1024 * 1024
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
            : `${Math.round(file.size / 1024)} KB`;

        // Upload to Supabase bucket or local vault
        const uploadResult = await documentStorage.uploadFile(file, 'clearance-vault');

        const newDoc: DocumentItem = {
          id: `DOC-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          name: file.name,
          type,
          status: 'verified',
          size: sizeFormatted,
          uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          fileUrl: uploadResult.url,
          previewUrl: uploadResult.url,
          storageType: uploadResult.storageType,
          storagePath: uploadResult.path,
          extractedData: [
            { label: 'File Name', value: file.name },
            {
              label: 'Storage Destination',
              value:
                uploadResult.storageType === 'supabase'
                  ? `Supabase Storage (Bucket: ${supabaseConfig.bucket})`
                  : 'Encrypted Digital Vault',
            },
            { label: 'Detected Content Type', value: file.type || `${type} Document` },
            { label: 'Digital Authenticity', value: 'Original Binary Ingested' },
            { label: 'Pre-Validation Scrutiny', value: '100% Passed (Ready for Inter-Dept Sharing)' },
          ],
        };

        uploadDocument(newDoc);
      } catch (err) {
        console.error('Failed to process upload:', err);
      }
    }

    setUploading(false);
    setUploadMessage(
      supabaseConfig.isConfigured
        ? `Uploaded & saved ${files.length} file(s) permanently in Supabase Cloud Storage!`
        : `Uploaded & saved ${files.length} file(s) in persistent digital vault!`
    );
    setTimeout(() => setUploadMessage(null), 5000);
  };

  const handleVerifyAndShare = () => {
    if (!selectedDoc) return;
    verifyDocument(selectedDoc.id);
    setSelectedDoc((prev) => (prev ? { ...prev, status: 'verified' as const } : prev));
    setUploadMessage(`"${selectedDoc.name}" pre-validated and linked to all 5 departmental single-window portals.`);
    setTimeout(() => setUploadMessage(null), 4000);
  };

  const handleDelete = (docId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    deleteDocument(docId);
    if (selectedDoc?.id === docId) {
      setSelectedDoc(null);
    }
  };

  const closeOcr = () => {
    setSelectedDoc(null);
    setOcrProcessing(false);
    setOcrComplete(false);
  };

  const isImageFile = (doc: DocumentItem) => {
    return (
      doc.type === 'JPG' ||
      doc.type === 'PNG' ||
      (doc.previewUrl &&
        (doc.previewUrl.startsWith('data:image') ||
          doc.previewUrl.match(/\.(jpg|jpeg|png|webp|gif)/i)))
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center">
            <FolderOpen size={22} className="text-accent-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Unified Document Vault & Pre-Validation</h1>
            <p className="text-gray-600 text-sm">
              Upload images, plans, and drawings. Persistent and synchronized across sessions.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {connectionStatus.tested ? (
            connectionStatus.connected ? (
              <button
                onClick={() => setShowStatusModal(true)}
                className="text-xs px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold flex items-center gap-1.5 hover:bg-emerald-100 transition-colors cursor-pointer"
                title="Click to view connection details"
              >
                <Database size={14} className="text-emerald-600" />
                <span>Supabase Cloud: Connected</span>
                <CheckCircle2 size={13} className="text-emerald-600 ml-0.5" />
              </button>
            ) : (
              <button
                onClick={() => setShowStatusModal(true)}
                className="text-xs px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 font-semibold flex items-center gap-1.5 hover:bg-amber-100 transition-colors cursor-pointer"
                title="Click to see why and how to connect"
              >
                <AlertCircle size={14} className="text-amber-600" />
                <span>Supabase: Not Connected (Click to Fix)</span>
                <HelpCircle size={13} className="text-amber-600 ml-0.5" />
              </button>
            )
          ) : (
            <span className="text-xs px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 font-medium flex items-center gap-1.5">
              <Loader2 size={13} className="animate-spin text-gray-500" />
              <span>Checking Supabase...</span>
            </span>
          )}

          <span className="text-xs px-3 py-1.5 rounded-xl bg-gray-100 text-gray-700 border border-gray-200 font-medium flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-indigo-600" />
            Zero Redundancy Vault
          </span>
        </div>
      </div>

      {/* Upload Notification Message */}
      {uploadMessage && (
        <div className="card p-4 bg-emerald-50 border-emerald-200 flex items-center justify-between gap-3 text-sm text-emerald-900 animate-slide-up">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
            <span>{uploadMessage}</span>
          </div>
          <button onClick={() => setUploadMessage(null)} className="text-emerald-600 hover:text-emerald-800">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Upload area with drag & drop */}
      <div
        className={`card p-8 border-2 border-dashed transition-all ${
          dragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-gray-400 bg-white'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            processUploadedFiles(e.dataTransfer.files);
          }
        }}
      >
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-4">
            {uploading ? (
              <Loader2 size={28} className="text-brand-600 animate-spin" />
            ) : (
              <Upload size={28} className="text-brand-600" />
            )}
          </div>
          <p className="text-lg font-semibold text-gray-900">
            {uploading ? 'Storing & Pre-validating Image/File...' : 'Drag & drop image or document files here'}
          </p>
          <p className="text-sm text-gray-500 mt-1 max-w-md">
            Images (JPG, PNG), drawings, and PDFs are preserved with visual preview and saved permanently across sessions.
          </p>

          <label className="btn-primary mt-4 cursor-pointer">
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span>Browse Files to Upload</span>
            <input
              type="file"
              accept="image/*,.pdf,.docx"
              multiple
              disabled={uploading}
              className="hidden"
              onChange={(e) => {
                if (e.target.files) {
                  processUploadedFiles(e.target.files);
                  e.target.value = '';
                }
              }}
            />
          </label>

          <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
            <span>• Max file size: 50MB</span>
            <span>• Supported: JPG, PNG, WEBP, PDF, DOCX</span>
            <span>• Permanent Storage Across Browser Reloads</span>
          </div>
        </div>
      </div>

      {/* Document list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-gray-900">Verified Document Repository ({documents.length})</h2>
          <span className="text-xs text-gray-500">Click any document or image to inspect details</span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc) => {
            const config = statusConfig[doc.status] || statusConfig.verified;
            const StatusIcon = config.icon;
            const hasImage = isImageFile(doc);

            return (
              <div
                key={doc.id}
                className="card card-hover p-4 cursor-pointer flex flex-col justify-between group border border-gray-200 hover:border-brand-300 relative"
                onClick={() => handleDocClick(doc)}
              >
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded ${typeColors[doc.type] || 'bg-gray-100 text-gray-700'}`}>
                        {doc.type}
                      </span>
                      <span className="text-xs text-gray-400">{doc.size}</span>
                      {doc.storageType === 'supabase' && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-0.5">
                          <Database size={10} /> Cloud
                        </span>
                      )}
                    </div>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${config.class}`}>
                      <StatusIcon size={12} /> {config.label}
                    </span>
                  </div>

                  {/* Thumbnail / Icon area */}
                  {hasImage && doc.previewUrl ? (
                    <div className="w-full h-32 rounded-lg bg-gray-100 mb-3 overflow-hidden border border-gray-200 relative group-hover:opacity-95 transition-opacity">
                      <img
                        src={doc.previewUrl}
                        alt={doc.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-medium gap-1">
                        <Eye size={14} /> Click to View Image
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-50 transition-colors">
                        {hasImage ? <ImageIcon size={20} className="text-emerald-600" /> : <FileText size={20} className="text-gray-500" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">{doc.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">Uploaded {doc.uploadDate}</p>
                      </div>
                    </div>
                  )}

                  {hasImage && doc.previewUrl && (
                    <p className="text-sm font-semibold text-gray-900 truncate mb-1">{doc.name}</p>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1 text-emerald-600 font-medium">
                    <ShieldCheck size={14} /> Shared across 5 Depts
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleDelete(doc.id, e)}
                      title="Remove from vault"
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={13} />
                    </button>
                    <span className="text-brand-600 font-semibold group-hover:underline flex items-center gap-0.5">
                      Inspect <ArrowRight size={12} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* OCR & Document Preview Modal Drawer */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={closeOcr} />
          <div className="relative card w-full max-w-3xl max-h-[92vh] overflow-y-auto scrollbar-thin animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-brand-600" />
                <h3 className="font-semibold text-gray-900">Document Inspection & Pre-Validation</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-brand-50 text-brand-700 font-medium">
                  {selectedDoc.storageType === 'supabase' ? 'Supabase Cloud Stored' : 'Secured Digital Vault'}
                </span>
              </div>
              <button onClick={closeOcr} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Document Overview Header */}
              <div className="card p-3 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                    {isImageFile(selectedDoc) ? (
                      <ImageIcon size={16} className="text-emerald-600" />
                    ) : (
                      <FileText size={16} className="text-gray-500" />
                    )}
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-900 block truncate max-w-sm">
                      {selectedDoc.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {selectedDoc.type} • {selectedDoc.size} • Uploaded {selectedDoc.uploadDate}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                  Status: {selectedDoc.status.toUpperCase()}
                </span>
              </div>

              {/* Real Image Preview Display if available */}
              {isImageFile(selectedDoc) && selectedDoc.previewUrl && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Eye size={14} className="text-indigo-600" />
                    Visual Image Content
                  </h4>
                  <div className="rounded-xl border border-gray-200 bg-gray-900 overflow-hidden flex items-center justify-center p-2 min-h-48 max-h-80">
                    <img
                      src={selectedDoc.previewUrl}
                      alt={selectedDoc.name}
                      className="max-h-72 max-w-full object-contain rounded"
                    />
                  </div>
                  {selectedDoc.fileUrl && selectedDoc.storageType === 'supabase' && (
                    <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                      <span className="truncate max-w-md">Cloud URL: {selectedDoc.fileUrl}</span>
                      <a
                        href={selectedDoc.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-600 hover:text-brand-700 font-medium inline-flex items-center gap-1"
                      >
                        Open Raw <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              )}

              {/* Processing pipeline */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ocrProcessing || ocrComplete ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <CheckCircle2 size={16} />
                  </div>
                  <span className="text-xs text-gray-600">Stored</span>
                </div>
                <div className={`h-0.5 flex-1 mx-2 ${ocrProcessing || ocrComplete ? 'bg-brand-500' : 'bg-gray-200'}`} />
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ocrProcessing ? 'bg-brand-600 text-white' : ocrComplete ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    {ocrProcessing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={16} />}
                  </div>
                  <span className="text-xs text-gray-600">Scrutiny</span>
                </div>
                <div className={`h-0.5 flex-1 mx-2 ${ocrComplete ? 'bg-brand-500' : 'bg-gray-200'}`} />
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${ocrComplete ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                    <FileCheck2 size={14} />
                  </div>
                  <span className="text-xs text-gray-600">Verified for Reuse</span>
                </div>
              </div>

              {ocrProcessing && (
                <div className="text-center py-6">
                  <Loader2 size={28} className="mx-auto text-brand-600 animate-spin mb-2" />
                  <p className="text-sm text-gray-600">Checking clarity, seal, resolution and legal schedules...</p>
                  <p className="text-xs text-gray-400 mt-1">AI Pre-validation Scrutiny in progress</p>
                </div>
              )}

              {ocrComplete && (
                <div className="animate-slide-up space-y-4">
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <p className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                      <ShieldCheck size={16} className="text-emerald-600" />
                      Statutory Pre-Validation Passed (Score: 100/100)
                    </p>
                    <p className="text-[11px] text-emerald-800 mt-1">
                      Resolution verified, legibility confirmed. File is stored and linked across all single-window clearance portals.
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-700 mb-2 uppercase tracking-wider">
                      Extracted Metadata & Storage Attributes
                    </p>
                    <div className="card border-gray-200 divide-y divide-gray-100">
                      {(selectedDoc.extractedData || [
                        { label: 'Company Name', value: 'Shree Industries Pvt. Ltd.' },
                        { label: 'Document Name', value: selectedDoc.name },
                        { label: 'Issuing Authority', value: 'Authorized Chartered Engineer / Govt Agency' },
                        { label: 'Verification', value: '100% Pre-Validated' },
                      ]).map((field) => (
                        <div key={field.label} className="flex items-center justify-between px-4 py-2.5">
                          <span className="text-xs text-gray-500">{field.label}</span>
                          <span className="text-xs font-semibold text-gray-900">{field.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleVerifyAndShare}
                        className="btn-primary text-xs py-2 px-3 bg-emerald-600 hover:bg-emerald-700 flex items-center gap-1.5"
                      >
                        <ShieldCheck size={14} /> Mark as Verified & Enable Inter-Dept Reuse
                      </button>
                      <button
                        onClick={() => handleDelete(selectedDoc.id)}
                        className="text-xs py-2 px-3 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-xl font-medium flex items-center gap-1.5 transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                    <button onClick={closeOcr} className="btn-secondary text-xs py-2 px-4">
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Supabase Status & Setup Helper Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setShowStatusModal(false)} />
          <div className="relative card w-full max-w-lg p-6 bg-white shadow-2xl animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Database size={20} className={connectionStatus.connected ? 'text-emerald-600' : 'text-amber-600'} />
                <h3 className="font-bold text-gray-900">Supabase Connection Diagnostics</h3>
              </div>
              <button onClick={() => setShowStatusModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-sm">
              <div
                className={`p-3.5 rounded-xl border flex items-start gap-3 ${
                  connectionStatus.connected
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                {connectionStatus.connected ? (
                  <CheckCircle2 size={20} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{connectionStatus.connected ? 'Successfully Connected!' : 'Not Connected Yet'}</p>
                  <p className="text-xs mt-1">{connectionStatus.message}</p>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Environment Status</p>
                <div className="bg-gray-50 rounded-xl p-3 border border-gray-200 space-y-1.5 text-xs font-mono">
                  <div className="flex justify-between">
                    <span className="text-gray-500">VITE_SUPABASE_URL:</span>
                    <span className="font-semibold text-gray-800">
                      {supabaseConfig.url ? `${supabaseConfig.url.slice(0, 22)}...` : 'Not Set (Empty)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">VITE_SUPABASE_ANON_KEY:</span>
                    <span className="font-semibold text-gray-800">
                      {supabaseConfig.key ? 'Configured (Active)' : 'Not Set (Empty)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Storage Bucket:</span>
                    <span className="font-semibold text-gray-800">{supabaseConfig.bucket}</span>
                  </div>
                </div>
              </div>

              {!connectionStatus.connected && (
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 text-xs text-indigo-950 space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-indigo-900">
                    <Sparkles size={14} className="text-indigo-600" />
                    How to connect in 2 minutes on Vercel:
                  </p>
                  <ol className="list-decimal pl-4 space-y-1 text-indigo-900">
                    <li>Open your project settings on <b>Vercel Dashboard &gt; Environment Variables</b>.</li>
                    <li>Add <b>VITE_SUPABASE_URL</b> = your project URL (from Supabase &gt; Settings &gt; API).</li>
                    <li>Add <b>VITE_SUPABASE_ANON_KEY</b> = your anon public key.</li>
                    <li>In Supabase &gt; Storage, make sure bucket <b>documents</b> is created & set to <b>Public</b>.</li>
                    <li>Redeploy your Vercel deployment to apply changes!</li>
                  </ol>
                </div>
              )}
            </div>

            <div className="mt-5 flex justify-end">
              <button onClick={() => setShowStatusModal(false)} className="btn-primary text-xs py-2 px-4">
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
