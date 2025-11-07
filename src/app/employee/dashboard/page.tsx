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
  CalendarDays,
  CheckCircle,
  FileWarning,
  Hourglass,
  XCircle,
} from 'lucide-react';
import {
  getLeaveTypeById,
  getUserById,
  leaveRequests as initialLeaveRequests,
  users as allUsers
} from '@/lib/data';
import { format } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import type { LeaveRequest, User } from '@/types';

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  Pending: 'secondary',
  Approved: 'default',
  Rejected: 'destructive',
};

const statusIcons = {
  Pending: <Hourglass className="h-4 w-4 text-yellow-500" />,
  Approved: <CheckCircle className="h-4 w-4 text-green-500" />,
  Rejected: <XCircle className="h-4 w-4 text-red-500" />,
};

export default function EmployeeDashboardPage() {
  const [currentUser, setCurrentUser] = useState<User | undefined>();
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);

  useEffect(() => {
    // In a real app, this would come from an auth context.
    const user = allUsers.find(u => u.id === '1'); 
    setCurrentUser(user);
    if (user) {
      setLeaveRequests(initialLeaveRequests.filter(req => req.userId === user.id));
    }
  }, []);

  const stats = useMemo(() => {
    if (!currentUser) return { pending: 0, approved: 0, balance: 0 };
    return {
        pending: leaveRequests.filter((r) => r.status === 'Pending').length,
        approved: leaveRequests.filter((r) => r.status === 'Approved').length,
        balance: currentUser.annualLeaveBalance,
    }
  }, [leaveRequests, currentUser]);

  if (!currentUser) {
    return <div>Loading...</div>; // Or a skeleton loader
  }

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">My Dashboard</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leave Balance</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.balance} Days</div>
            <p className="text-xs text-muted-foreground">Annual leave remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
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
            <CardTitle className="text-sm font-medium">Approved Requests</CardTitle>
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
          <CardTitle>My Leave History</CardTitle>
          <CardDescription>
            An overview of your past and current leave requests.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Leave Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Attachment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
             {leaveRequests.length > 0 ? leaveRequests.map((request) => {
                const leaveType = getLeaveTypeById(request.leaveTypeId);
                if (!leaveType) return null;

                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{leaveType.name}</TableCell>
                    <TableCell>
                      {format(request.startDate, 'MMM d, y')} - {format(request.endDate, 'MMM d, y')}
                    </TableCell>
                    <TableCell>{request.days}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                    <TableCell>
                      <Badge variant={statusColors[request.status]} className="flex items-center gap-1 w-fit">
                        {statusIcons[request.status]}
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                       {leaveType.name === 'Cuti Sakit' ? (
                            <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                <FileWarning className="h-3 w-3" /> Via Form
                            </Badge>
                       ) : (
                         <span className="text-muted-foreground">-</span>
                       )}
                    </TableCell>
                  </TableRow>
                );
              }) : (
                 <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                        You have not made any leave requests.
                    </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
