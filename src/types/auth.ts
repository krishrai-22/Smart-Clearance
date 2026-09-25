export type UserRole = 'applicant' | 'admin';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  companyName?: string;
  designation?: string;
  avatarText: string;
}

export const DEMO_USERS: Record<string, AuthUser> = {
  applicant: {
    id: 'USR-APP-01',
    name: 'Rajesh Sharma',
    email: 'rajesh@shreeindustries.in',
    role: 'applicant',
    companyName: 'Shree Industries Pvt. Ltd.',
    designation: 'Managing Director & Promoter',
    avatarText: 'RS',
  },
  admin: {
    id: 'USR-ADM-01',
    name: 'Dr. Sunita Kulkarni, IAS',
    email: 'admin@singlewindow.gov.in',
    role: 'admin',
    department: 'Directorate of Industries & Single Window Clearing Board',
    designation: 'Nodal Scrutiny Commissioner & Chief Clearance Officer',
    avatarText: 'SK',
  },
};
