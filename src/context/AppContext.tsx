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
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return initialDocuments;
  });

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

  // Persist documents
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_DOCS, JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to persist documents to localStorage', e);
    }
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
      title: 'New Clearance Docket Lodged',
      message: `Application ${newApp.id} for "${newApp.name}" submitted successfully to ${newApp.department}.`,
      time: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);

    return newApp;
  };

  // 2. Admin approves application
  const approveApplication = (appId: string, officerName?: string) => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const signer = officerName || 'Dr. Sunita Kulkarni, IAS';

    setApplications((prev) =>
      prev.map((app) => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'approved' as ApprovalStatus,
            progress: 100,
            currentStage: 'Approved & Statutory Sanction Issued',
            nextAction: `Statutory approval certificate granted and digitally signed by ${signer}.`,
            lastUpdated: `Today (${todayStr})`,
            timeline: [
              ...app.timeline.map((step) => ({ ...step, status: 'done' as const })),
              { label: 'Sanction Order Dispatched (Admin Approved)', status: 'done' as const, date: todayStr },
            ],
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
    setDocuments((prev) => [newDoc, ...prev]);

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

  // 7. Mark notification read
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
