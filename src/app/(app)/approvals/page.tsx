
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X } from 'lucide-react';
import {
  getDepartmentById,
  getLeaveTypeById,
  getUserById,
  leaveRequests as initialLeaveRequests,
  departments as initialDepartments,
  users,
} from '@/lib/data';
import { format } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import type { LeaveRequest, User } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { usePathname } from 'next/navigation';

export default function ApprovalsPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const { toast } = useToast();
  const pathname = usePathname();

  // In a real app, this would come from an auth context.
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    // This logic simulates fetching the logged-in user based on the route
    const isAdminRoute = pathname.startsWith('/admin') || pathname === '/';
    if (isAdminRoute) {
      setCurrentUser(users.find(u => u.role === 'Admin'));
    } else {
      // For employee/approver view, we'll use a user who is a department head.
      // User '2' (Citra Lestari) is head of IT. Let's use her for demo.
      // In a real app, you would get the single authenticated user.
      setCurrentUser(users.find(u => u.id === '2'));
    }
  }, [pathname]);

  const requestsToApprove = useMemo(() => {
    if (!currentUser) return [];

    // Admins see all pending requests
    if (currentUser.role === 'Admin') {
      return leaveRequests.filter(req => req.status === 'Pending');
    }
    
    // For non-admins, check if they are a department head
    const headedDepartments = initialDepartments.filter(dept => dept.headId === currentUser.id);
    if (headedDepartments.length === 0) {
      // This user is not a department head, so they have nothing to approve.
      return [];
    }
    const headedDeptIds = headedDepartments.map(d => d.id);

    // Filter requests from employees in the departments they head
    return leaveRequests.filter(req => {
      const employee = getUserById(req.userId);
      // Show request if the employee exists, belongs to a department headed by the current user, and status is Pending
      return employee && headedDeptIds.includes(employee.departmentId) && req.status === 'Pending';
    });
  }, [currentUser, leaveRequests]);


  const handleApprove = (requestId: string) => {
    const updatedRequests = leaveRequests.map(r => r.id === requestId ? { ...r, status: 'Approved' } : r);
    setLeaveRequests(updatedRequests);
    // In a real app, this mutation would be done on the backend
    const originalRequest = initialLeaveRequests.find(r => r.id === requestId);
    if(originalRequest) originalRequest.status = 'Approved';
    
    toast({ title: 'Request Approved', description: 'The leave request has been approved.' });
  };
  
  const handleReject = (requestId: string) => {
    const updatedRequests = leaveRequests.map(r => r.id === requestId ? { ...r, status: 'Rejected' } : r);
    setLeaveRequests(updatedRequests);
     // In a real app, this mutation would be done on the backend
    const originalRequest = initialLeaveRequests.find(r => r.id === requestId);
    if(originalRequest) originalRequest.status = 'Rejected';

    toast({ variant: 'destructive', title: 'Request Rejected', description: 'The leave request has been rejected.' });
  };
  

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Leave Approvals</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            Review and act on the leave requests waiting for your approval.
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
                <TableHead>Reason</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requestsToApprove.length > 0 ? (
                requestsToApprove.map((request) => {
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
                      <TableCell className="max-w-[200px] truncate">{request.reason}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                           <Button size="sm" onClick={() => handleApprove(request.id)}>
                             <Check className="mr-2 h-4 w-4" /> Approve
                           </Button>
                           <Button size="sm" variant="destructive" onClick={() => handleReject(request.id)}>
                             <X className="mr-2 h-4 w-4" /> Reject
                           </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No pending requests for you to approve.
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
