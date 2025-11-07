import type { User, Department, LeaveType, LeaveRequest, Notification } from '@/types';
import { subDays, addDays, format } from 'date-fns';

export const users: User[] = [
  { id: '1', name: 'Budi Santoso', nip: '199508172021011001', avatar: 'https://picsum.photos/seed/1/100/100', departmentId: 'hr', role: 'Employee', annualLeaveBalance: 12, phone: '6281234567890', golongan: 'III/a', joinDate: new Date('2021-01-15') },
  { id: '2', name: 'Citra Lestari', nip: '199205202019032002', avatar: 'https://picsum.photos/seed/2/100/100', departmentId: 'it', role: 'Employee', annualLeaveBalance: 10, phone: '6281234567891', golongan: 'III/d', joinDate: new Date('2019-03-01') },
  { id: '3', name: 'Doni Firmansyah', nip: '199811102022021003', avatar: 'https://picsum.photos/seed/3/100/100', departmentId: 'finance', role: 'Employee', annualLeaveBalance: 5, phone: '6281234567892', golongan: 'II/c', joinDate: new Date('2022-02-01'), qrCodeSignature: '/qr-code-placeholder.png' },
  { id: '4', name: 'Eka Putri', nip: '199301152018052001', avatar: 'https://picsum.photos/seed/4/100/100', departmentId: 'it', role: 'Employee', annualLeaveBalance: 12, phone: '6281234567893', golongan: 'III/b', joinDate: new Date('2018-05-10') },
  { id: '5', name: 'Fitriani', nip: '199003252017062002', avatar: 'https://picsum.photos/seed/5/100/100', departmentId: 'hr', role: 'Employee', annualLeaveBalance: 8, phone: '6281234567894', golongan: 'IV/a', joinDate: new Date('2017-06-15'), qrCodeSignature: '/qr-code-placeholder.png' },
  { id: '6', name: 'Gilang Ramadhan', nip: '199609092021091004', avatar: 'https://picsum.photos/seed/6/100/100', departmentId: 'marketing', role: 'Employee', annualLeaveBalance: 15, phone: '6281234567895', golongan: 'III/a', joinDate: new Date('2021-09-10') },
  { id: '7', name: 'Hana Yulita', nip: '199107212018112003', avatar: 'https://picsum.photos/seed/7/100/100', departmentId: 'finance', role: 'Employee', annualLeaveBalance: 9, phone: '6281234567896', golongan: 'IV/b', joinDate: new Date('2018-11-01'), qrCodeSignature: '/qr-code-placeholder.png' },
  { id: '8', name: 'Indra Wijaya', nip: '198912302015021001', avatar: 'https://picsum.photos/seed/8/100/100', departmentId: 'marketing', role: 'Employee', annualLeaveBalance: 11, phone: '6281234567897', golongan: 'III/c', joinDate: new Date('2015-02-20') },
  { id: 'admin', name: 'Admin SiRancak', nip: '199001012020121001', avatar: 'https://picsum.photos/seed/admin/100/100', departmentId: 'hr', role: 'Admin', annualLeaveBalance: 0, phone: '6281200000000', golongan: 'IV/c', joinDate: new Date('2020-12-01'), qrCodeSignature: '/qr-code-placeholder.png'},
];

export const departments: Department[] = [
  { id: 'hr', name: 'Human Resources', headId: '5', employeeCount: 2 },
  { id: 'it', name: 'Information Technology', headId: '2', employeeCount: 2 },
  { id: 'finance', name: 'Finance', headId: '7', employeeCount: 2 },
  { id: 'marketing', name: 'Marketing', headId: '8', employeeCount: 2 },
];

export const leaveTypes: LeaveType[] = [
  { id: 'annual', name: 'Cuti Tahunan' },
  { id: 'big', name: 'Cuti Besar' },
  { id: 'sick', name: 'Cuti Sakit' },
  { id: 'maternity', name: 'Cuti Melahirkan' },
  { id: 'important', name: 'Cuti Alasan Penting' },
  { id: 'unpaid', name: 'Cuti di Luar Tanggungan Negara' },
];

const now = new Date();

export const leaveRequests: LeaveRequest[] = [
  { id: 'req1', userId: '1', leaveTypeId: 'annual', startDate: subDays(now, 5), endDate: subDays(now, 4), days: 2, reason: 'Family vacation', status: 'Approved', createdAt: subDays(now, 10) },
  { id: 'req2', userId: '3', leaveTypeId: 'sick', startDate: subDays(now, 2), endDate: subDays(now, 1), days: 2, reason: 'Sakit, butuh istirahat', status: 'Approved', createdAt: subDays(now, 3), attachment: undefined },
  { id: 'req3', userId: '6', leaveTypeId: 'annual', startDate: addDays(now, 10), endDate: addDays(now, 14), days: 5, reason: 'Trip to Bali', status: 'Pending', createdAt: subDays(now, 1) },
  { id: 'req4', userId: '1', leaveTypeId: 'important', startDate: subDays(now, 20), endDate: subDays(now, 19), days: 2, reason: 'Family emergency', status: 'Approved', createdAt: subDays(now, 22) },
  { id: 'req5', userId: '2', leaveTypeId: 'annual', startDate: subDays(now, 30), endDate: subDays(now, 28), days: 3, reason: 'Personal matters', status: 'Rejected', createdAt: subDays(now, 35) },
  { id: 'req6', userId: '4', leaveTypeId: 'sick', startDate: subDays(now, 12), endDate: subDays(now, 11), days: 2, reason: 'Medical Checkup', status: 'Approved', createdAt: subDays(now, 15), attachment: 'uploaded' },
  { id: 'req7', userId: '7', leaveTypeId: 'maternity', startDate: addDays(now, 30), endDate: addDays(now, 120), days: 90, reason: 'Maternity Leave', status: 'Pending', createdAt: subDays(now, 2) },
];

export const notifications: Notification[] = [
    { id: 'notif1', userId: '3', message: 'Reminder: Jangan lupa untuk mengisi form surat keterangan sakit Anda.', type: 'warning', isRead: true, createdAt: subDays(now, 1), leaveRequestId: 'req2' },
    { id: 'notif2', userId: '1', message: 'Permintaan cuti tahunan Anda telah disetujui.', type: 'success', isRead: true, createdAt: subDays(now, 9), leaveRequestId: 'req1' },
    { id: 'notif3', userId: 'admin', message: 'Doni Firmansyah belum melengkapi form untuk cuti sakit pada ' + format(subDays(now, 2), 'd MMM y'), type: 'warning', isRead: true, createdAt: subDays(now, 0), leaveRequestId: 'req2' },
    { id: 'notif4', userId: '8', message: 'Permintaan cuti dari Gilang Ramadhan menunggu persetujuan Anda.', type: 'warning', isRead: false, createdAt: subDays(now, 1), leaveRequestId: 'req3' },
    { id: 'notif5', userId: '2', message: 'Permintaan cuti Anda ditolak.', type: 'info', isRead: false, createdAt: subDays(now, 29), leaveRequestId: 'req5' },
    { id: 'notif6', userId: '2', message: 'Permintaan cuti dari Eka Putri menunggu persetujuan Anda.', type: 'warning', isRead: false, createdAt: subDays(now, 1), leaveRequestId: 'req6' },
];


export const settings = {
    sickLeaveFormUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSc_b_a-M9bA9gQlLd6v_iJbA4J/viewform'
}

// Helper functions to get data by ID
export const getUserById = (id: string) => users.find(u => u.id === id);
export const getDepartmentById = (id: string) => departments.find(d => d.id === id);
export const getLeaveTypeById = (id: string) => leaveTypes.find(lt => lt.id === id);
export const getLeaveRequestById = (id: string) => leaveRequests.find(lr => lr.id === id);
