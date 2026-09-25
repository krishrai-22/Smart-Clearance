import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  applications as initialApplications,
  documents as initialDocuments,
  notifications as initialNotifications,
  type Application,
  type DocumentItem,
  type NotificationItem,
  type ApprovalStatus,
} from '@/data/mockData';
import { documentVaultDB, documentStorage, getSupabaseConfig } from '@/lib/supabase';

interface NewApplicationPayload {
  name: string;
  department: string;
  category?: string;
  documents: { name: string; verified: boolean }[];
  expectedDays?: string;
}

interface AppContextType {
  applications: Application[];
  documents: DocumentItem[];
  notifications: NotificationItem[];
  unreadNotificationCount: number;
  submitNewApplication: (payload: NewApplicationPayload) => Application;
  approveApplication: (appId: string, officerName?: string) => void;
  raiseApplicationQuery: (appId: string, queryNote: string, officerName?: string) => void;
  respondToQuery: (appId: string, responseNote: string, attachedDocName?: string) => void;
  verifyDocument: (docIdOrName: string) => void;
  uploadDocument: (doc: DocumentItem) => void;
  deleteDocument: (docId: string) => void;
  markNotificationAsRead: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_APPS = 'smartclearance_apps_v1';
const LOCAL_STORAGE_KEY_DOCS = 'smartclearance_docs_v1';
const LOCAL_STORAGE_KEY_NOTIFS = 'smartclearance_notifs_v1';

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Synchronized applications state
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_APPS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return initialApplications;
  });

  // Synchronized documents state
  const [documents, setDocuments] = useState<DocumentItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_DOCS);
      if (saved) {
        const parsed: DocumentItem[] = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return initialDocuments;
  });

  // Hydrate from IndexedDB and Supabase Storage on launch so data persists across browser sessions
  useEffect(() => {
    let isMounted = true;

    async function hydratePersistentDocuments() {
      try {
        // 1. Check IndexedDB for any large images or uploaded documents
        const savedIndexedDocs = (await documentVaultDB.getAllDocuments()) as unknown as DocumentItem[];

        // 2. Check remote Supabase Storage for files uploaded by this or other sessions
        let remoteSupabaseDocs: DocumentItem[] = [];
        const config = getSupabaseConfig();
        if (config.isConfigured) {
          try {
            const remoteFiles = await documentStorage.listRemoteFiles('clearance-vault');
            remoteSupabaseDocs = remoteFiles.map((file) => {
              const fileExt = (file.name.split('.').pop() || 'dat').toUpperCase();
              const type: 'PDF' | 'JPG' | 'PNG' | 'DOCX' =
                fileExt === 'JPG' || fileExt === 'JPEG'
                  ? 'JPG'
                  : fileExt === 'PNG'
                  ? 'PNG'
                  : fileExt === 'DOCX'
                  ? 'DOCX'
                  : 'PDF';

              return {
                id: `SUPA-${file.name}`,
                name: file.name.replace(/^\d+-/, ''),
                type,
                status: 'verified' as const,
                size: file.size > 1024 * 1024 ? `${(file.size / 1024 / 1024).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`,
                uploadDate: 'Synced from Supabase',
                fileUrl: file.url,
                previewUrl: file.url,
                storageType: 'supabase' as const,
                storagePath: file.path,
                extractedData: [
                  { label: 'File Name', value: file.name },
                  { label: 'Storage Source', value: `Supabase Cloud Bucket (${config.bucket})` },
                  { label: 'Cloud Public URL', value: file.url },
                  { label: 'Pre-Validation Scrutiny', value: '100% Passed (Statutory Cloud Vault)' },
                ],
              };
            });
          } catch (e) {
            console.warn('Could not sync remote Supabase files:', e);
          }
        }

        if (!isMounted) return;

        // Merge: existing in state, IndexedDB docs, remote Supabase docs, initial mock docs
        setDocuments((currentDocs) => {
          const map = new Map<string, DocumentItem>();

          // Base initial docs
          initialDocuments.forEach((d) => map.set(d.id, d));
          // Current in-memory docs
          currentDocs.forEach((d) => map.set(d.id, d));
          // IndexedDB docs
          if (Array.isArray(savedIndexedDocs)) {
            savedIndexedDocs.forEach((d) => map.set(d.id, d));
          }
          // Supabase storage docs
          remoteSupabaseDocs.forEach((d) => map.set(d.id, d));

          return Array.from(map.values());
        });
      } catch (err) {
        console.error('Error hydrating persistent documents:', err);
      }
    }

    hydratePersistentDocuments();

    return () => {
      isMounted = false;
    };
  }, []);

  // Synchronized notifications state
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_NOTIFS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return initialNotifications;
  });

  // Persist applications
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_APPS, JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to persist applications to localStorage', e);
    }
  }, [applications]);

  // Persist documents across localStorage and IndexedDB (no quota overflow on large base64 images)
  useEffect(() => {
    try {
      // Clean docs representation for localStorage (omit heavy base64 to avoid quota limits)
      const lightweightDocs = documents.map((doc) => {
        if (doc.previewUrl && doc.previewUrl.startsWith('data:') && doc.previewUrl.length > 50000) {
          return {
            ...doc,
            previewUrl: doc.fileUrl && !doc.fileUrl.startsWith('data:') ? doc.fileUrl : undefined,
          };
        }
        return doc;
      });
      localStorage.setItem(LOCAL_STORAGE_KEY_DOCS, JSON.stringify(lightweightDocs));
    } catch (e) {
      console.warn('LocalStorage quota limit reached, saving full data into IndexedDB vault:', e);
    }

    // Always preserve all documents into IndexedDB
    documents.forEach((doc) => {
      documentVaultDB.saveDocument(doc as unknown as Record<string, unknown>);
    });
  }, [documents]);

  // Persist notifications
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_NOTIFS, JSON.stringify(notifications));
    } catch (e) {
      console.error('Failed to persist notifications to localStorage', e);
    }
  }, [notifications]);

  // 1. User submits a new application
  const submitNewApplication = (payload: NewApplicationPayload): Application => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const deptPrefix = payload.department.split(' ')[0].substring(0, 4).toUpperCase();
    const newId = `SC-${deptPrefix}-2026-${randomSuffix}`;

    const newApp: Application = {
      id: newId,
      name: payload.name,
      department: payload.department,
      status: 'review',
      submittedDate: todayStr,
      progress: 25,
      currentStage: 'Under Scrutiny (Forwarded to Nodal Officer)',
      nextAction: 'Department verification officer reviewing initial document attachments.',
      lastUpdated: todayStr,
      delayRisk: 18,
      riskLevel: 'Low',
      expectedDays: payload.expectedDays || '7–10 days',
      timeline: [
        { label: 'Application Submitted', status: 'done', date: todayStr },
        { label: 'Documents Pre-Screened', status: 'done', date: todayStr },
        { label: 'Under Scrutiny', status: 'current', date: 'In Progress' },
        { label: 'Joint Inspection', status: 'pending' },
        { label: 'Statutory Sanction', status: 'pending' },
      ],
      documents: payload.documents.map((d) => ({ name: d.name, verified: d.verified })),
      shapFactors: [
        { label: 'Complete documentation', value: -10 },
        { label: 'Pre-validated CAF dossier', value: -8 },
      ],
    };

    setApplications((prev) => [newApp, ...prev]);

    // Push notification to applicant & admin
    const newNotification: NotificationItem = {
      id: `NOTIF-${Date.now()}`,
      type: 'update',
      title: 'New Clearance Application Filed',
      message: `${payload.name} submitted under ${payload.department}. Ref: ${newId}`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    return newApp;
  };

  // 2. Admin approves an application
  const approveApplication = (appId: string, officerName?: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const signer = officerName || 'Divisional Competent Authority';

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'approved' as ApprovalStatus,
            progress: 100,
            currentStage: 'Statutory Clearance Granted (Certificate Issued)',
            nextAction: `Final approval order signed by ${signer}. Download digitally signed certificate.`,
            lastUpdated: `Today (${todayStr})`,
            delayRisk: 0,
            riskLevel: 'Low' as const,
            timeline: app.timeline.map((step) => ({ ...step, status: 'done' as const })),
            documents: app.documents.map((d) => ({ ...d, verified: true })),
          };
        }
        return app;
      })
    );

    const newNotification: NotificationItem = {
      id: `NOTIF-APP-${Date.now()}`,
      type: 'update',
      title: 'Clearance Sanction Granted!',
      message: `Your clearance application ${appId} has been approved by ${signer}. Certificate is now available.`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // 3. Admin raises a query
  const raiseApplicationQuery = (appId: string, queryNote: string, officerName?: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const signer = officerName || 'Scrutiny Officer';

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'query' as ApprovalStatus,
            currentStage: 'Clarification Demanded by Scrutiny Officer',
            nextAction: queryNote,
            lastUpdated: `Today (${todayStr})`,
            timeline: [
              ...app.timeline.map((step) =>
                step.status === 'current' ? { ...step, status: 'done' as const } : step
              ),
              { label: 'Official Query Raised', status: 'current' as const, date: todayStr },
            ],
          };
        }
        return app;
      })
    );

    const newNotification: NotificationItem = {
      id: `NOTIF-QRY-${Date.now()}`,
      type: 'action',
      title: 'Deficiency Query Raised',
      message: `${signer} raised a clarification query on ${appId}: "${queryNote}". Please provide response.`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // 4. User responds to query
  const respondToQuery = (appId: string, responseNote: string, attachedDocName?: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          const updatedDocs = attachedDocName
            ? [...app.documents, { name: attachedDocName, verified: true }]
            : app.documents;

          return {
            ...app,
            status: 'review' as ApprovalStatus,
            currentStage: 'Applicant Clarification Submitted (Under Scrutiny)',
            nextAction: `Applicant provided response: "${responseNote.slice(0, 60)}...". Officer scrutiny resumed.`,
            lastUpdated: `Today (${todayStr})`,
            documents: updatedDocs,
            timeline: [
              ...app.timeline.map((step) =>
                step.label === 'Official Query Raised' ? { ...step, status: 'done' as const } : step
              ),
              { label: 'Clarification Received', status: 'current' as const, date: todayStr },
            ],
          };
        }
        return app;
      })
    );

    const newNotification: NotificationItem = {
      id: `NOTIF-RES-${Date.now()}`,
      type: 'update',
      title: 'Clarification Submitted',
      message: `Applicant response submitted for ${appId}. Assigned to officer for final scrutiny.`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  // 5. Admin or user verifies document
  const verifyDocument = (docIdOrName: string) => {
    setDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docIdOrName || doc.name === docIdOrName
          ? { ...doc, status: 'verified' as const }
          : doc
      )
    );

    setApplications((prev) =>
      prev.map((app) => ({
        ...app,
        documents: app.documents.map((d) =>
          d.name === docIdOrName ? { ...d, verified: true } : d
        ),
      }))
    );
  };

  // 6. User uploads document
  const uploadDocument = (newDoc: DocumentItem) => {
    setDocuments((prev) => {
      const filtered = prev.filter((d) => d.id !== newDoc.id);
      return [newDoc, ...filtered];
    });

    // Save directly to IndexedDB
    documentVaultDB.saveDocument(newDoc as unknown as Record<string, unknown>);

    // Check if this document can auto-verify in any applications
    setApplications((prev) =>
      prev.map((app) => ({
        ...app,
        documents: app.documents.map((d) =>
          d.name.toLowerCase().includes(newDoc.name.toLowerCase()) ||
          newDoc.name.toLowerCase().includes(d.name.toLowerCase())
            ? { ...d, verified: true }
            : d
        ),
      }))
    );
  };

  // 7. Delete document
  const deleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    documentVaultDB.deleteDocument(docId);
  };

  // 8. Mark notification read
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        applications,
        documents,
        notifications,
        unreadNotificationCount,
        submitNewApplication,
        approveApplication,
        raiseApplicationQuery,
        respondToQuery,
        verifyDocument,
        uploadDocument,
        deleteDocument,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
