import { useState } from 'react';
import { Sidebar, type PageKey } from '@/components/Sidebar';
import { TopBar } from '@/components/TopBar';
import { LandingPage } from '@/pages/LandingPage';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MyApprovalsPage } from '@/pages/MyApprovalsPage';
import { ApplicationDetailPage } from '@/pages/ApplicationDetailPage';
import { ApprovalNavigatorPage } from '@/pages/ApprovalNavigatorPage';
import { DocumentsPage } from '@/pages/DocumentsPage';
import { SchemesPage } from '@/pages/SchemesPage';
import { InspectionsPage } from '@/pages/InspectionsPage';
import { GrievancesPage } from '@/pages/GrievancesPage';
import { AIInsightsPage } from '@/pages/AIInsightsPage';
import { CompliancePage } from '@/pages/CompliancePage';
import { GovernmentServicesPage } from '@/pages/GovernmentServicesPage';
import { AIAssistantPage } from '@/pages/AIAssistantPage';
import { NotificationsPage } from '@/pages/NotificationsPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { AdminDashboardPage } from '@/pages/AdminDashboardPage';
import { DEMO_USERS, type AuthUser, type UserRole } from '@/types/auth';
import { useApp } from '@/context/AppContext';

type AppState = 'landing' | 'login' | 'app';

function App() {
  const { unreadNotificationCount } = useApp();
  const [appState, setAppState] = useState<AppState>('landing');
  const [currentUser, setCurrentUser] = useState<AuthUser>(DEMO_USERS.applicant);
  const [loginRoleTarget, setLoginRoleTarget] = useState<UserRole>('applicant');
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<string | null>(null);

  const handleStartLogin = (role?: UserRole) => {
    setLoginRoleTarget(role || 'applicant');
    setAppState('login');
  };

  const handleLogin = (user: AuthUser) => {
    setCurrentUser(user);
    setAppState('app');
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setAppState('landing');
    setCurrentPage('dashboard');
    setSelectedApplicationId(null);
  };

  const handleNavigate = (page: PageKey) => {
    setCurrentPage(page);
    setSelectedApplicationId(null);
  };

  const handleViewApplication = (id: string) => {
    setSelectedApplicationId(id);
    setCurrentPage('approvals');
  };

  const handleEscalateApplication = (id: string) => {
    setSelectedApplicationId(null);
    setCurrentPage('grievances');
  };

  // Quick switch role between applicant and officer admin
  const handleSwitchToAdmin = () => {
    setCurrentUser(DEMO_USERS.admin);
  };

  const handleSwitchToApplicant = () => {
    setCurrentUser(DEMO_USERS.applicant);
  };

  if (appState === 'landing') {
    return (
      <LandingPage
        onGetStarted={handleStartLogin}
        onExplore={() => handleStartLogin('applicant')}
      />
    );
  }

  if (appState === 'login') {
    return (
      <LoginPage
        onLogin={handleLogin}
        onBack={() => setAppState('landing')}
        initialRole={loginRoleTarget}
      />
    );
  }

  // Admin Officer View
  if (currentUser.role === 'admin') {
    return (
      <AdminDashboardPage
        adminUser={currentUser}
        onLogout={handleLogout}
        onViewApplicantView={handleSwitchToApplicant}
      />
    );
  }

  // Entrepreneur / Applicant View
  const renderPage = () => {
    if (currentPage === 'approvals' && selectedApplicationId) {
      return (
        <ApplicationDetailPage
          applicationId={selectedApplicationId}
          onBack={() => setSelectedApplicationId(null)}
          onViewDocuments={() => {
            setSelectedApplicationId(null);
            setCurrentPage('documents');
          }}
          onEscalate={handleEscalateApplication}
        />
      );
    }

    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage onNavigate={handleNavigate} onViewApplication={handleViewApplication} />;
      case 'approvals':
        return <MyApprovalsPage onViewApplication={handleViewApplication} />;
      case 'navigator':
        return <ApprovalNavigatorPage onNavigate={handleNavigate} />;
      case 'documents':
        return <DocumentsPage />;
      case 'schemes':
        return <SchemesPage />;
      case 'inspections':
        return <InspectionsPage />;
      case 'grievances':
        return <GrievancesPage />;
      case 'compliance':
        return <CompliancePage />;
      case 'ai-insights':
        return <AIInsightsPage />;
      case 'services':
        return <GovernmentServicesPage onNavigateToApprovals={() => handleNavigate('approvals')} />;
      case 'ai-assistant':
        return <AIAssistantPage />;
      case 'notifications':
        return <NotificationsPage onNavigate={handleNavigate} onReadChange={() => {}} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      default:
        return <DashboardPage onNavigate={handleNavigate} onViewApplication={handleViewApplication} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        notificationCount={unreadNotificationCount}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          currentUser={currentUser}
          onMenuClick={() => setSidebarOpen(true)}
          onNavigate={handleNavigate}
          notificationCount={unreadNotificationCount}
          onLogout={handleLogout}
          onSwitchToAdmin={handleSwitchToAdmin}
        />
        <main className={`flex-1 overflow-x-hidden ${currentPage === 'ai-assistant' ? 'p-0' : 'p-4 sm:p-6 lg:p-8'}`}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
