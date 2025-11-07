'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Hourglass,
  CheckCircle,
  XCircle,
  FileText,
  FileWarning,
  FileCheck2,
} from 'lucide-react';
import {
  getLeaveTypeById,
  leaveRequests as initialLeaveRequests,
  users,
} from '@/lib/data';
import { format } from 'date-fns';
import { useState } from 'react';
import type { LeaveRequest, User } from '@/types';

const statusIcons = {
  Pending: <Hourglass className="h-4 w-4 text-yellow-500" />,
  Approved: <CheckCircle className="h-4 w-4 text-green-500" />,
  Rejected: <XCircle className="h-4 w-4 text-red-500" />,
};

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Pending: 'secondary',
  Approved: 'default',
  Rejected: 'destructive',
};

export default function EmployeeDashboardPage() {
  // This should come from an auth context in a real app.
  const [currentUser, setCurrentUser] = useState<User | undefined>(users.find(u => u.id === '1'));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(
    initialLeaveRequests.filter(req => req.userId === currentUser?.id)
  );

  const stats = {
    sisaCuti: currentUser?.annualLeaveBalance || 0,
    cutiDigunakan: leaveRequests
        .filter(r => r.status === 'Approved' && getLeaveTypeById(r.leaveTypeId)?.name === 'Cuti Tahunan')
        .reduce((acc, r) => acc + r.days, 0),
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">My Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sisa Cuti Tahunan</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.sisaCuti} Hari</div>
            <p className="text-xs text-muted-foreground">Sisa cuti yang dapat Anda ambil</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cuti Terpakai</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.cutiDigunakan} Hari</div>
            <p className="text-xs text-muted-foreground">
              Total cuti tahunan yang disetujui
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Request Pending</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{leaveRequests.filter(r => r.status === 'Pending').length}</div>
            <p className="text-xs text-muted-foreground">
              Menunggu persetujuan atasan
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengajuan Cuti Anda</CardTitle>
          <CardDescription>
            Berikut adalah daftar semua permintaan cuti yang pernah Anda ajukan.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Jenis Cuti</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Jumlah Hari</TableHead>
                <TableHead>Alasan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Lampiran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => {
                const leaveType = getLeaveTypeById(request.leaveTypeId);
                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{leaveType?.name}</TableCell>
                    <TableCell>
                      {format(request.startDate, 'd MMM y')} - {format(request.endDate, 'd MMM y')}
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[request.status]}>
                        {request.status}
                      </Badge>
                    </TableCell>
                     <TableCell>
                       {leaveType?.name === 'Cuti Sakit' ? (
                          request.attachment ? (
                            <Badge variant="secondary" className="flex items-center gap-1 w-fit">
                                <FileCheck2 className="h-3 w-3" /> Terunggah
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                <FileWarning className="h-3 w-3" /> Wajib
                            </Badge>
                          )
                       ) : (
                         <span className="text-muted-foreground">-</span>
                       )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
