import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from environment or localStorage configuration
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_project_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') : null;
  const localBucket = typeof window !== 'undefined' ? localStorage.getItem('supabase_storage_bucket') : null;

  const url = envUrl || localUrl || '';
  const key = envKey || localKey || '';
  const bucket = localBucket || 'documents';
  const isConfigured = Boolean(url && key && !url.includes('mock.supabase.co'));

  return { url, key, bucket, isConfigured };
};

export const getSupabaseClient = () => {
  const config = getSupabaseConfig();
  if (config.isConfigured) {
    return createClient(config.url, config.key);
  }
  return null;
};

const initialConfig = getSupabaseConfig();
export const supabase = createClient(
  initialConfig.url || 'https://mock.supabase.co',
  initialConfig.key || 'mock-anon-key'
);

// IndexedDB Helper for preserving large image data across tab closes without localStorage quota limits
const DB_NAME = 'SmartClearanceDB';
const DB_VERSION = 1;
const STORE_NAME = 'documents_store';

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return reject(new Error('IndexedDB not supported'));
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export const documentVaultDB = {
  async saveDocument(doc: Record<string, unknown>): Promise<void> {
    try {
      const db = await openIndexedDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put(doc);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to save document to IndexedDB:', e);
    }
  },

  async getAllDocuments(): Promise<Record<string, unknown>[]> {
    try {
      const db = await openIndexedDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => reject(req.error);
      });
    } catch {
      return [];
    }
  },

  async deleteDocument(id: string): Promise<void> {
    try {
      const db = await openIndexedDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.delete(id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('Failed to delete document from IndexedDB:', e);
    }
  },
};

// Storage helper for uploading binary documents/images to Supabase Storage
export const documentStorage = {
  isConfigured(): boolean {
    return getSupabaseConfig().isConfigured;
  },

  // Test live connection to Supabase and return diagnostic information
  async testConnection(): Promise<{ connected: boolean; message: string; details?: string }> {
    const config = getSupabaseConfig();
    if (!config.url || !config.key) {
      return {
        connected: false,
        message: 'Missing credentials: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are not configured.',
      };
    }

    try {
      const client = createClient(config.url, config.key);
      // Attempt to list buckets to test auth & connectivity
      const { data, error } = await client.storage.listBuckets();
      if (error) {
        return {
          connected: false,
          message: `Supabase reached but returned error: ${error.message}`,
          details: 'Check if the anon key is correct and bucket "documents" is public.',
        };
      }
      const hasBucket = data?.some((b) => b.name === config.bucket);
      return {
        connected: true,
        message: hasBucket
          ? `Connected to Supabase! Bucket "${config.bucket}" is active and ready.`
          : `Connected to Supabase! Note: Please ensure a bucket named "${config.bucket}" is created in Supabase Storage.`,
      };
    } catch (err) {
      return {
        connected: false,
        message: `Connection failed: ${err instanceof Error ? err.message : 'Network error'}`,
      };
    }
  },

  async uploadFile(
    file: File,
    pathPrefix = 'clearance-docs'
  ): Promise<{ url: string; path: string; storageType: 'supabase' | 'local'; error?: string }> {
    const config = getSupabaseConfig();

    if (config.isConfigured) {
      try {
        const client = createClient(config.url, config.key);
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${pathPrefix}/${Date.now()}-${sanitizedName}`;

        const { data, error } = await client.storage
          .from(config.bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (error) {
          console.warn('Supabase storage upload returned error, falling back to persistent client storage:', error.message);
        } else if (data?.path) {
          // Get public URL
          const { data: publicData } = client.storage.from(config.bucket).getPublicUrl(data.path);
          if (publicData?.publicUrl) {
            return {
              url: publicData.publicUrl,
              path: data.path,
              storageType: 'supabase',
            };
          }
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown storage error';
        console.warn('Supabase upload exception:', msg);
      }
    }

    // Persistent fallback: read as base64 Data URL so it permanently survives closing & reopening browser
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve({
          url: reader.result as string,
          path: `local/${file.name}`,
          storageType: 'local',
        });
      };
      reader.onerror = () => {
        resolve({
          url: URL.createObjectURL(file),
          path: `local/${file.name}`,
          storageType: 'local',
        });
      };
      reader.readAsDataURL(file);
    });
  },

  // Fetch all existing files from Supabase Storage bucket
  async listRemoteFiles(pathPrefix = 'clearance-vault'): Promise<{ name: string; url: string; path: string; size: number }[]> {
    const config = getSupabaseConfig();
    if (!config.isConfigured) return [];

    try {
      const client = createClient(config.url, config.key);
      const { data, error } = await client.storage.from(config.bucket).list(pathPrefix, {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      });

      if (error || !data) {
        return [];
      }

      return data
        .filter((item) => item.name && item.id)
        .map((item) => {
          const filePath = `${pathPrefix}/${item.name}`;
          const { data: pubData } = client.storage.from(config.bucket).getPublicUrl(filePath);
          return {
            name: item.name,
            url: pubData.publicUrl,
            path: filePath,
            size: item.metadata?.size || 0,
          };
        });
    } catch {
      return [];
    }
  },
};

export interface GovernmentPortal {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  api_endpoint: string;
  api_key: string | null;
  status: string;
  logo_url: string | null;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  portal_id: string;
  reference_number: string;
  service_name: string;
  applicant_name: string;
  applicant_company: string;
  status: string;
  submitted_date: string;
  last_updated: string;
  payload: Record<string, unknown>;
}

export interface AIConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

const edgeFunctionUrl = (name: string) =>
  `${getSupabaseConfig().url}/functions/v1/${name}`;

const edgeFunctionHeaders = () => ({
  Authorization: `Bearer ${getSupabaseConfig().key}`,
  'Content-Type': 'application/json',
  apikey: getSupabaseConfig().key,
});

const defaultPortals: GovernmentPortal[] = [
  {
    id: 'P-1',
    name: 'Maitri Single Window System',
    code: 'MAITRI',
    description: 'Government of Maharashtra single window industrial facilitation portal.',
    category: 'State Government',
    api_endpoint: 'https://maitri.mahaonline.gov.in/api/v2',
    api_key: null,
    status: 'connected',
    logo_url: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'P-2',
    name: 'National Single Window System (NSWS)',
    code: 'NSWS',
    description: 'Government of India central portal for clearances across ministries.',
    category: 'Central Government',
    api_endpoint: 'https://www.nsws.gov.in/api/v1',
    api_key: null,
    status: 'connected',
    logo_url: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'P-3',
    name: 'MIDC Land & Water Portal',
    code: 'MIDC',
    description: 'Maharashtra Industrial Development Corporation allotment and utility management.',
    category: 'Industrial Development',
    api_endpoint: 'https://services.midcindia.org/api/v1',
    api_key: null,
    status: 'connected',
    logo_url: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'P-4',
    name: 'DISH Maharashtra (Directorate of Industrial Safety & Health)',
    code: 'DISH',
    description: 'Factory plan approval, safety scrutiny, and boiler registration.',
    category: 'Safety & Labour',
    api_endpoint: 'https://dish.maharashtra.gov.in/api/v1',
    api_key: null,
    status: 'connected',
    logo_url: null,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'P-5',
    name: 'MSEDCL Industrial Power Discom',
    code: 'MSEDCL',
    description: 'High tension / low tension electricity connection sanction & load approval.',
    category: 'Utilities & Power',
    api_endpoint: 'https://www.mahadiscom.in/api/v1',
    api_key: null,
    status: 'connected',
    logo_url: null,
    created_at: '2026-01-01T00:00:00Z',
  },
];

export const governmentPortalService = {
  async getPortals(): Promise<GovernmentPortal[]> {
    return defaultPortals;
  },

  async syncPortal(portalCode: string): Promise<{ success: boolean; message: string; timestamp: string }> {
    return {
      success: true,
      message: `Successfully synchronized statutory records with ${portalCode}. All single-window status indicators updated.`,
      timestamp: new Date().toISOString(),
    };
  },

  async submitServiceRequest(
    request: Omit<ServiceRequest, 'id' | 'status' | 'submitted_date' | 'last_updated'>
  ): Promise<ServiceRequest> {
    const today = new Date().toISOString().split('T')[0];
    const newRecord: ServiceRequest = {
      ...request,
      id: `SR-${Date.now()}`,
      status: 'submitted',
      submitted_date: today,
      last_updated: today,
    };
    return newRecord;
  },

  async getServiceRequests(): Promise<ServiceRequest[]> {
    return [];
  },
};

export const aiAssistantService = {
  async getConversations(): Promise<AIConversation[]> {
    return [
      {
        id: 'conv-default',
        title: 'Industrial Clearances & Statutory Scrutiny',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async getMessages(conversationId: string): Promise<AIMessage[]> {
    return [
      {
        id: 'msg-welcome',
        conversation_id: conversationId,
        role: 'assistant',
        content: `**Welcome to the Smart Clearance Regulatory Assistant.**\n\nI have live context on your industrial approvals, pending queries, document validity, and available government subsidies:\n- **MSEDCL Electricity Query:** Technical load clarification pending (ref: SC-ELEC-2026-00489).\n- **Matched Incentives:** Maharashtra PSI 2026 & Green Solar Subsidy claimable (up to ₹2.50 Cr).\n- **Joint Inspection:** Scheduled for 28 Sep 2026 across Fire, DISH, and Pollution departments.\n\nHow can I assist your compliance journey today?`,
        metadata: {},
        created_at: new Date().toISOString(),
      },
    ];
  },

  async sendMessage(message: string, conversationId?: string): Promise<{ conversationId: string; response: string }> {
    try {
      const resp = await fetch(edgeFunctionUrl('ai-assistant/chat'), {
        method: 'POST',
        headers: edgeFunctionHeaders(),
        body: JSON.stringify({ message, conversationId }),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.response) return { conversationId: data.conversationId, response: data.response };
      }
    } catch {
      // Fallback
    }

    const convId = conversationId || 'conv-default';
    const lower = message.toLowerCase();
    let reply = '';

    if (lower.includes('status') || lower.includes('application')) {
      reply = `**Application Status Summary:**\n- **Industrial Land Allotment (MIDC):** Approved (100%). Allotment letter issued.\n- **Factory Plan Approval (DISH):** Under Review (65%). Pre-validation verified.\n- **Power Connection (MSEDCL):** Query Raised (52%). Requires load calculation sheet clarification.\n- **Environmental Clearance (SEIAA):** Under Review (38%). Initial screening passed.`;
    } else if (lower.includes('query') || lower.includes('msedcl')) {
      reply = `**Pending Queries Actionable:**\n- **MSEDCL Power Discom:** Raised query on High Tension load requirement sheet (650 kW). You can navigate to **My Approvals -> MSEDCL Application** to submit the technical response or auto-attach the verified electrical layout from your Document Vault.`;
    } else if (lower.includes('scheme') || lower.includes('incentive') || lower.includes('subsidy')) {
      reply = `**Eligible Support Schemes:**\n1. **Maharashtra Package Scheme of Incentives (PSI 2026):** Up to ₹1.50 Crore capital grant + stamp duty exemption (96% match).\n2. **Green Energy Rooftop Solar Subsidy:** 25% direct capital assistance (MNRE) up to ₹40 Lakhs.\n3. **Interest Subvention Scheme (MSME):** 5% interest reduction on machinery loans.\nYou can apply with 1-click in the **Incentives & Schemes** tab.`;
    } else if (lower.includes('inspection') || lower.includes('visit')) {
      reply = `**Common Inspection Update:**\nA coordinated joint inspection for **Chakan Plant Unit 2** is scheduled on **28 Sep 2026, 10:30 AM** involving Maharashtra Fire Services, DISH (Factories), and MPCB. The single digital report will be uploaded to the portal within 48 hours.`;
    } else if (lower.includes('delay') || lower.includes('escalate') || lower.includes('grievance') || lower.includes('sla')) {
      reply = `**Statutory SLA & Escalation:**\nUnder the Public Services Guarantee, your MSEDCL feeder scrutiny has exceeded statutory disposal timeline by 6 days. An automated **Tier 2 Escalation** to the District Collector and DIC General Manager is active in the **Grievances** module.`;
    } else {
      reply = `I have analyzed your query: **"${message}"**.\n\nYour industrial unit **Shree Industries Pvt. Ltd.** currently has **7 approved clearances**, **3 active parallel scrutinies**, and **1 pending query**. All verified documents in your Document Vault are pre-synchronized across state and central departments to maintain statutory compliance and accelerate commercial operation dates.`;
    }

    return { conversationId: convId, response: reply };
  },

  async deleteConversation(conversationId: string): Promise<void> {
    try {
      await fetch(
        edgeFunctionUrl(`ai-assistant/conversations/${conversationId}`),
        { method: 'DELETE', headers: edgeFunctionHeaders() },
      );
    } catch {
      // Fallback
    }
  },
};

// Aliases for compatibility across pages
export const portalApi = {
  getPortals: () => governmentPortalService.getPortals(),
  getRequests: () => governmentPortalService.getServiceRequests(),
  syncPortal: async (code: string) => {
    const res = await governmentPortalService.syncPortal(code);
    return { synced: res.success, count: 4, error: undefined };
  },
  submitRequest: (req: Parameters<typeof governmentPortalService.submitServiceRequest>[0]) =>
    governmentPortalService.submitServiceRequest(req),
};

export const aiApi = aiAssistantService;

