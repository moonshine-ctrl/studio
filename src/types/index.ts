export type User = {
  id: string;
  name: string;
  nip: string;
  avatar: string;
  departmentId: string;
  role: 'Admin' | 'Approver' | 'Employee';
  annualLeaveBalance: number;
  qrCodeSignature?: string;
  phone?: string;
};

export type Department = {
  id: string;
  name: string;
  headId: string;
  employeeCount: number;
};

export type LeaveType = {
  id: string;
  name: 'Annual' | 'Sick' | 'Maternity' | 'Important Reason' | 'Unpaid' | 'Other';
};

export type LeaveRequest = {
  id: string;
  userId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  medicalCertificate?: string;
  createdAt: Date;
};

export type Notification = {
  id: string;
  userId: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  isRead: boolean;
  createdAt: Date;
  leaveRequestId?: string;
};
