export type User = {
  id: string;
  name: string;
  nip: string;
  avatar: string;
  departmentId: string;
  role: 'Admin' | 'Employee';
  annualLeaveBalance: number;
  qrCodeSignature?: string;
  phone?: string;
  golongan?: string;
  joinDate?: Date;
};

export type Department = {
  id: string;
  name: string;
  headId: string;
  employeeCount: number;
};

export type LeaveType = {
  id: string;
  name: 'Cuti Tahunan' | 'Cuti Besar' | 'Cuti Sakit' | 'Cuti Melahirkan' | 'Cuti Alasan Penting' | 'Cuti di Luar Tanggungan Negara';
};

export type LeaveRequest = {
  id: string;
  userId: string;
  leaveTypeId: string;
  startDate: Date;
  endDate: Date;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Cancelled';
  attachment?: 'uploaded' | undefined;
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
