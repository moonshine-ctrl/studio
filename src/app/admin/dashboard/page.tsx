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
  Ban,
  PauseCircle,
} from 'lucide-react';
import {
  getDepartmentById,
  getLeaveTypeById,
  getUserById,
  leaveRequests as initialLeaveRequests,
  users as initialUsers,
  logHistory,
} from '@/lib/data';
import { format } from 'date-fns';
import { useState } from 'react';
import type { LeaveRequest, User } from '@/types';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const statusColors: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' | 'warning' } = {
  Pending: 'secondary',
  Approved: 'default',
  Rejected: 'destructive',
  Cancelled: 'outline',
  Suspended: 'warning',
};

const statusIcons: { [key: string]: React.ReactNode } = {
  Pending: <Hourglass className="h-4 w-4" />,
  Approved: <CheckCircle className="h-4 w-4" />,
  Rejected: <XCircle className="h-4 w-4" />,
  Cancelled: <Ban className="h-4 w-4" />,
  Suspended: <PauseCircle className="h-4 w-4" />,
};

export default function DashboardPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();
  
  const [requestToCancel, setRequestToCancel] = useState<LeaveRequest | null>(null);
  const [isCancelAlertOpen, setIsCancelAlertOpen] = useState(false);
  const [password, setPassword] = useState('');

  const stats = {
    pending: leaveRequests.filter((r) => r.status === 'Pending').length,
    approved: leaveRequests.filter((r) => r.status === 'Approved').length,
    total: leaveRequests.length,
  };

  const handleCancelClick = (request: LeaveRequest) => {
    setRequestToCancel(request);
    if (request.status === 'Approved' || request.status === 'Suspended') {
      setIsCancelAlertOpen(true);
    } else if (request.status === 'Pending') {
      // For pending requests, cancel directly without password
      performCancellation(request);
    }
  };

  const performCancellation = (request: LeaveRequest) => {
     const userToUpdate = users.find(u => u.id === request.userId);
     if (!userToUpdate) return;
     
     const adminUser = initialUsers.find(u => u.role === 'Admin');

     // Update leave request status
    const updatedRequests = leaveRequests.map(r =>
      r.id === request.id ? { ...r, status: 'Cancelled' as const } : r
    );
    setLeaveRequests(updatedRequests);
    const originalRequest = initialLeaveRequests.find(r => r.id === request.id);
    if (originalRequest) originalRequest.status = 'Cancelled';

    const leaveType = getLeaveTypeById(request.leaveTypeId);

    if (leaveType?.name === 'Cuti Tahunan' && (request.status === 'Approved' || request.status === 'Suspended')) {
      // Restore leave balance only for annual leave that was already approved or suspended
      const updatedUsers = users.map(u =>
        u.id === userToUpdate.id
          ? { ...u, annualLeaveBalance: u.annualLeaveBalance + request.days }
          : u
      );
      setUsers(updatedUsers);
      const originalUser = initialUsers.find(u => u.id === userToUpdate.id);
      if (originalUser) originalUser.annualLeaveBalance += request.days;
    }
    
    // Add to log
    logHistory.unshift({
      id: `log-${Date.now()}`,
      date: new Date(),
      user: adminUser?.name || 'Admin',
      activity: `Cancelled leave request for ${userToUpdate.name} (${leaveType?.name}, ${request.days} days).`,
    });

    toast({
      title: 'Leave Request Cancelled',
      description: `The request from ${userToUpdate.name} has been cancelled.`,
    });
    
    // Reset states
    setIsCancelAlertOpen(false);
    setPassword('');
    setRequestToCancel(null);
  }

  const handleConfirmCancel = () => {
    const adminUser = initialUsers.find(u => u.role === 'Admin');
    if (password !== adminUser?.password) {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'Incorrect password. Cancellation aborted.',
      });
      return;
    }
    if (requestToCancel) {
      performCancellation(requestToCancel);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-6 max-w-7xl mx-auto">
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveRequests.map((request) => {
                  const user = getUserById(request.userId);
                  const leaveType = getLeaveTypeById(request.leaveTypeId);
                  if (!user || !leaveType) return null;
                  const department = getDepartmentById(user.departmentId);
                  const isCancellable = request.status === 'Pending' || request.status === 'Approved' || request.status === 'Suspended';

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
                        <Badge variant={statusColors[request.status]} className="flex items-center gap-1 w-fit">
                          {statusIcons[request.status]}
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {leaveType?.name === 'Cuti Sakit' ? (
                              <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                  <FileWarning className="h-3 w-3" /> Required
                              </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {isCancellable && (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCancelClick(request)}
                            >
                              <Ban className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
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

      <AlertDialog open={isCancelAlertOpen} onOpenChange={setIsCancelAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will cancel an approved or suspended leave request. The employee's leave balance (if applicable) will be restored. This action cannot be undone. Please enter your password to confirm.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Label htmlFor="password">Admin Password</Label>
            <Input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password to confirm"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPassword('')}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel} disabled={!password}>
              Confirm Cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
