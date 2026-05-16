export type StaffRole = 'loan_officer' | 'processor' | 'reviewer' | 'manager';

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: StaffRole;
  department: string;
  dateJoined: Date;
  status: 'active' | 'inactive';
  assignedLoans?: string[]; // Loan IDs
}

export const staffRoleLabels: Record<StaffRole, string> = {
  loan_officer: 'Loan Officer',
  processor: 'Loan Processor',
  reviewer: 'Loan Reviewer',
  manager: 'Department Manager',
};

export const staffDepartments = [
  'Personal Loans',
  'Mortgages',
  'Business Loans',
  'Auto Loans',
  'Customer Service',
];