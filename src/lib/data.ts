import type { User, Department, LeaveType, LeaveRequest, Notification } from '@/types';
import { subDays, addDays } from 'date-fns';

export const users: User[] = [
  { id: '1', name: 'Budi Santoso', nip: '199508172021011001', avatar: 'https://picsum.photos/seed/1/100/100', departmentId: 'hr', role: 'Employee', annualLeaveBalance: 12 },
  { id: '2', name: 'Citra Lestari', nip: '199205202019032002', avatar: 'https://picsum.photos/seed/2/100/100', departmentId: 'it', role: 'Approver', annualLeaveBalance: 10 },
  { id: '3', name: 'Doni Firmansyah', nip: '199811102022021003', avatar: 'https://picsum.photos/seed/3/100/100', departmentId: 'finance', role: 'Employee', annualLeaveBalance: 5 },
  { id: '4', name: 'Eka Putri', nip: '199301152018052001', avatar: 'https://picsum.photos/seed/4/100/100', departmentId: 'it', role: 'Approver', annualLeaveBalance: 12 },
  { id: '5', name: 'Fitriani', nip: '199003252017062002', avatar: 'https://picsum.photos/seed/5/100/100', departmentId: 'hr', role: 'Approver', annualLeaveBalance: 8 },
  { id: '6', name: 'Gilang Ramadhan', nip: '199609092021091004', avatar: 'https://picsum.photos/seed/6/100/100', departmentId: 'marketing', role: 'Employee', annualLeaveBalance: 15 },
  { id: '7', name: 'Hana Yulita', nip: '199107212018112003', avatar: 'https://picsum.photos/seed/7/100/100', departmentId: 'finance', role: 'Approver', annualLeaveBalance: 9 },
  { id: '8', name: 'Indra Wijaya', nip: '198912302015021001', avatar: 'https://picsum.photos/seed/8/100/100', departmentId: 'marketing', role: 'Approver', annualLeaveBalance: 11 },
];

export const departments: Department[] = [
  { id: 'hr', name: 'Human Resources', headId: '5', employeeCount: 2 },
  { id: 'it', name: 'Information Technology', headId: '4', employeeCount: 2 },
  { id: 'finance', name: 'Finance', headId: '7', employeeCount: 2 },
  { id: 'marketing', name: 'Marketing', headId: '8', employeeCount: 2 },
];

export const leaveTypes: LeaveType[] = [
  { id: 'annual', name: 'Annual' },
  { id: 'sick', name: 'Sick' },
  { id: 'maternity', name: 'Maternity' },
  { id: 'important', name: 'Important Reason' },
  { id: 'unpaid', name: 'Unpaid' },
  { id: 'other', name: 'Other' },
];

const now = new Date();

export const leaveRequests: LeaveRequest[] = [
  { id: 'req1', userId: '1', leaveTypeId: 'annual', startDate: subDays(now, 5), endDate: subDays(now, 4), days: 2, reason: 'Family vacation', status: 'Approved', createdAt: subDays(now, 10) },
  { id: 'req2', userId: '3', leaveTypeId: 'sick', startDate: subDays(now, 2), endDate: subDays(now, 1), days: 2, reason: 'Flu', status: 'Pending', createdAt: subDays(now, 3), medicalCertificate: undefined },
  { id: 'req3', userId: '6', leaveTypeId: 'annual', startDate: addDays(now, 10), endDate: addDays(now, 14), days: 5, reason: 'Trip to Bali', status: 'Pending', createdAt: subDays(now, 1) },
  { id: 'req4', userId: '1', leaveTypeId: 'important', startDate: subDays(now, 20), endDate: subDays(now, 19), days: 2, reason: 'Family emergency', status: 'Approved', createdAt: subDays(now, 22) },
  { id: 'req5', userId: '2', leaveTypeId: 'annual', startDate: subDays(now, 30), endDate: subDays(now, 28), days: 3, reason: 'Personal matters', status: 'Rejected', createdAt: subDays(now, 35) },
  { id: 'req6', userId: '4', leaveTypeId: 'sick', startDate: subDays(now, 12), endDate: subDays(now, 11), days: 2, reason: 'Medical Checkup', status: 'Approved', createdAt: subDays(now, 15), medicalCertificate: 'path/to/cert.pdf' },
  { id: 'req7', userId: '7', leaveTypeId: 'maternity', startDate: addDays(now, 30), endDate: addDays(now, 120), days: 90, reason: 'Maternity Leave', status: 'Pending', createdAt: subDays(now, 2) },
];

export const notifications: Notification[] = [
    { id: 'notif1', userId: '3', message: 'Your sick leave is approved. Please upload your medical certificate.', type: 'warning', isRead: false, createdAt: subDays(now, 1) },
    { id: 'notif2', userId: '1', message: 'Your leave request has been approved by all approvers.', type: 'success', isRead: true, createdAt: subDays(now, 9) },
    { id: 'notif3', userId: 'admin', message: 'Doni Firmansyah has not uploaded their medical certificate for sick leave.', type: 'warning', isRead: false, createdAt: subDays(now, 1) },
    { id: 'notif4', userId: '2', message: 'Your leave request was rejected.', type: 'info', isRead: false, createdAt: subDays(now, 29) },
];

// Helper functions to get data by ID
export const getUserById = (id: string) => users.find(u => u.id === id);
export const getDepartmentById = (id: string) => departments.find(d => d.id === id);
export const getLeaveTypeById = (id: string) => leaveTypes.find(lt => lt.id === id);
