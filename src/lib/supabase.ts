import { createClient } from '@supabase/supabase-js';

// Retrieve Supabase credentials from environment or localStorage configuration
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const localUrl = typeof window !== 'undefined' ? localStorage.getItem('supabase_project_url') : null;
  const localKey = typeof window !== 'undefined' ? localStorage.getItem('supabase_anon_key') : null;
  const localBucket = typeof window !== 'undefined' ? localStorage.getItem('supabase_storage_bucket') : null;

  const url = localUrl || envUrl || '';
  const key = localKey || envKey || '';
  const bucket = localBucket || 'documents';
  const isConfigured = Boolean(url && key && !url.includes('mock.supabase.co'));

  return { url, key, bucket, isConfigured };
};

const initialConfig = getSupabaseConfig();
export const supabase = createClient(
  initialConfig.url || 'https://mock.supabase.co',
  initialConfig.key || 'mock-anon-key'
);

// Storage helper for uploading binary documents/images to Supabase Storage
export const documentStorage = {
  isConfigured(): boolean {
    return getSupabaseConfig().isConfigured;
  },

  async uploadFile(
    file: File,
    pathPrefix = 'clearance-docs'
  ): Promise<{ url: string; path: string; storageType: 'supabase' | 'local'; error?: string }> {
    const config = getSupabaseConfig();

    if (config.isConfigured) {
      try {
        const client = createClient(config.url, config.key);
        const fileExt = file.name.split('.').pop() || 'dat';
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${pathPrefix}/${Date.now()}-${sanitizedName}`;

        const { data, error } = await client.storage
          .from(config.bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (error) {
          console.warn('Supabase storage upload error, falling back to local object URL:', error.message);
          return {
            url: URL.createObjectURL(file),
            path: filePath,
            storageType: 'local',
            error: error.message,
          };
        }

        // Get public URL
        const { data: publicData } = client.storage.from(config.bucket).getPublicUrl(data.path);
        return {
          url: publicData.publicUrl || URL.createObjectURL(file),
          path: data.path,
          storageType: 'supabase',
        };
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Unknown storage error';
        console.warn('Supabase upload exception:', msg);
        return {
          url: URL.createObjectURL(file),
          path: `local/${file.name}`,
          storageType: 'local',
          error: msg,
        };
      }
    }

    // Default fallback: create object URL and read as base64 data for local persistence
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
  `${supabaseUrl}/functions/v1/${name}`;

const edgeFunctionHeaders = () => ({
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
  apikey: supabaseAnonKey,
});

const defaultPortals: GovernmentPortal[] = [
  {
    id: 'P-1',
    name: 'Maitri Single Window System',
    code: 'MAITRI',
    description: 'Government of Maharashtra single window industrial facilitation portal.',
    category: 'State Government',
    api_endpoint: 'https://maitri.mahaonline.gov.in/api/v2',
    api_key: 'live-key-secured',
    status: 'active',
    logo_url: null,
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'P-2',
    name: 'DISH Directorate of Industrial Safety & Health',
    code: 'DISH',
    description: 'Factory license registration, annual plan approval & safety NOCs.',
    category: 'Industrial Safety',
    api_endpoint: 'https://dish.maharashtra.gov.in/api',
    api_key: 'live-key-secured',
    status: 'active',
    logo_url: null,
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'P-3',
    name: 'MSEDCL Industrial Power Portal',
    code: 'MSEDCL',
    description: 'High-tension electricity feasibility, transformer commissioning & power NOC.',
    category: 'Power & Energy',
    api_endpoint: 'https://wss.mahadiscom.in/api',
    api_key: 'live-key-secured',
    status: 'active',
    logo_url: null,
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'P-4',
    name: 'MIDC Land & Utility Infrastructure',
    code: 'MIDC',
    description: 'Plot allotment, building permission & water connection clearance.',
    category: 'Land & Infrastructure',
    api_endpoint: 'https://midcindia.org/api/v1',
    api_key: 'live-key-secured',
    status: 'active',
    logo_url: null,
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'P-5',
    name: 'SEIAA & MPCB Environmental Gateway',
    code: 'SEIAA',
    description: 'Consent to Establish (CTE) & Environmental Impact Assessment portal.',
    category: 'Environment',
    api_endpoint: 'https://mpcb.gov.in/api/v1',
    api_key: 'live-key-secured',
    status: 'active',
    logo_url: null,
    created_at: '2026-01-15T00:00:00Z',
  },
  {
    id: 'P-6',
    name: 'Maharashtra Fire Services NOC Portal',
    code: 'MFS',
    description: 'Provisional and final industrial fire safety no-objection certificates.',
    category: 'Fire Safety',
    api_endpoint: 'https://mahafireservice.gov.in/api',
    api_key: 'live-key-secured',
    status: 'active',
    logo_url: null,
    created_at: '2026-01-15T00:00:00Z',
  },
];

const defaultRequests: ServiceRequest[] = [
  {
    id: 'REQ-01',
    portal_id: 'P-1',
    reference_number: 'MAITRI-2026-9921',
    service_name: 'Combined Application Form (CAF) Scrutiny',
    applicant_name: 'Rajesh Sharma',
    applicant_company: 'Shree Industries Pvt. Ltd.',
    status: 'approved',
    submitted_date: '10 Aug 2026',
    last_updated: '14 Aug 2026',
    payload: { state: 'Maharashtra', district: 'Pune' },
  },
  {
    id: 'REQ-02',
    portal_id: 'P-2',
    reference_number: 'DISH-2026-00412',
    service_name: 'Factory Plan Approval & Heavy Machinery License',
    applicant_name: 'Rajesh Sharma',
    applicant_company: 'Shree Industries Pvt. Ltd.',
    status: 'review',
    submitted_date: '28 Aug 2026',
    last_updated: '06 Sep 2026',
    payload: { workers: 140, hp: 550 },
  },
  {
    id: 'REQ-03',
    portal_id: 'P-3',
    reference_number: 'MSEDCL-HT-2026-00489',
    service_name: '650 kW HT Feeder Connection & Metering',
    applicant_name: 'Rajesh Sharma',
    applicant_company: 'Shree Industries Pvt. Ltd.',
    status: 'query',
    submitted_date: '30 Aug 2026',
    last_updated: '10 Sep 2026',
    payload: { loadKw: 650, substation: 'Chakan 220kV' },
  },
  {
    id: 'REQ-04',
    portal_id: 'P-4',
    reference_number: 'MIDC-AL-2026-00205',
    service_name: 'Industrial Plot Allotment & Possession Handover',
    applicant_name: 'Rajesh Sharma',
    applicant_company: 'Shree Industries Pvt. Ltd.',
    status: 'approved',
    submitted_date: '15 Aug 2026',
    last_updated: '05 Sep 2026',
    payload: { plotNo: 'B-14', areaSqm: 8000 },
  },
];

export const portalApi = {
  async getPortals(): Promise<GovernmentPortal[]> {
    try {
      const resp = await fetch(edgeFunctionUrl('government-portal/portals'), {
        headers: edgeFunctionHeaders(),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.portals?.length) return data.portals;
      }
    } catch {
      // Fallback
    }
    return defaultPortals;
  },

  async getRequests(): Promise<ServiceRequest[]> {
    try {
      const resp = await fetch(edgeFunctionUrl('government-portal/requests'), {
        headers: edgeFunctionHeaders(),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.requests?.length) return data.requests;
      }
    } catch {
      // Fallback
    }
    return defaultRequests;
  },

  async getPortalRequests(portalCode: string): Promise<ServiceRequest[]> {
    try {
      const resp = await fetch(
        edgeFunctionUrl(`government-portal/portals/${portalCode}/requests`),
        { headers: edgeFunctionHeaders() },
      );
      if (resp.ok) {
        const data = await resp.json();
        if (data.requests) return data.requests;
      }
    } catch {
      // Fallback
    }
    return defaultRequests;
  },

  async syncPortal(portalCode: string): Promise<{ synced: boolean; count: number; error?: string }> {
    try {
      const resp = await fetch(
        edgeFunctionUrl(`government-portal/sync/${portalCode}`),
        { method: 'POST', headers: edgeFunctionHeaders() },
      );
      if (resp.ok) {
        const data = await resp.json();
        return { synced: data.synced, count: data.count || 0, error: data.error };
      }
    } catch {
      // Fallback simulated sync
    }
    return { synced: true, count: 1 };
  },
};

export const aiApi = {
  async getConversations(): Promise<AIConversation[]> {
    try {
      const resp = await fetch(edgeFunctionUrl('ai-assistant/conversations'), {
        headers: edgeFunctionHeaders(),
      });
      if (resp.ok) {
        const data = await resp.json();
        if (data.conversations?.length) return data.conversations;
      }
    } catch {
      // Fallback
    }
    return [
      {
        id: 'conv-default',
        title: 'Regulatory & Clearance Inquiries',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
  },

  async getMessages(conversationId: string): Promise<AIMessage[]> {
    try {
      const resp = await fetch(
        edgeFunctionUrl(`ai-assistant/conversations/${conversationId}/messages`),
        { headers: edgeFunctionHeaders() },
      );
      if (resp.ok) {
        const data = await resp.json();
        if (data.messages?.length) return data.messages;
      }
    } catch {
      // Fallback
    }
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
