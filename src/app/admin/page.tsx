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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Hourglass,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  FileWarning,
  FileCheck2,
} from 'lucide-react';
import {
  getDepartmentById,
  getLeaveTypeById,
  getUserById,
  leaveRequests as initialLeaveRequests,
} from '@/lib/data';
import { format } from 'date-fns';
import { useState } from 'react';
import type { LeaveRequest } from '@/types';


const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Pending: 'secondary',
  Approved: 'default',
  Rejected: 'destructive',
};

export default function DashboardPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  
  const stats = {
    pending: leaveRequests.filter((r) => r.status === 'Pending').length,
    approved: leaveRequests.filter((r) => r.status === 'Approved').length,
    total: leaveRequests.length,
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Admin Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All leave requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Hourglass className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">
              This year
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Leave Requests</CardTitle>
          <CardDescription>
            An overview of the latest leave requests from all departments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead className="hidden md:table-cell">Department</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attachment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => {
                const user = getUserById(request.userId);
                const leaveType = getLeaveTypeById(request.leaveTypeId);
                if (!user || !leaveType) return null;
                const department = getDepartmentById(user.departmentId);

                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="profile person" />
                          <AvatarFallback>
                            {user.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {department?.name}
                    </TableCell>
                    <TableCell>{leaveType.name}</TableCell>
                    <TableCell>
                      {format(request.startDate, 'MMM d, y')} - {format(request.endDate, 'MMM d, y')}
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[request.status]}>
                        {request.status}
                      </Badge>
                    </TableCell>
                     <TableCell>
                       {leaveType?.name === 'Cuti Sakit' ? (
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                <FileWarning className="h-3 w-3" /> Via Form
                            </Badge>
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
