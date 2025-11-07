
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

export default function ApprovalsPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    // In a real app, this would come from an auth context.
    // For this demo, let's assume the approver is Citra Lestari (user '2')
    setCurrentUser(users.find(u => u.id === '2'));
  }, []);

  const requestsToApprove = useMemo(() => {
    if (!currentUser) return [];
    
    // Employee who is a department head can approve requests for their department.
    const userDepartment = initialDepartments.find(d => d.headId === currentUser.id);
    if (!userDepartment) return [];

    return leaveRequests.filter(req => {
        const requestUser = getUserById(req.userId);
        return requestUser?.departmentId === userDepartment.id && req.status === 'Pending';
    });

  }, [leaveRequests, currentUser]);


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
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
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
                    <TableCell colSpan={6} className="h-24 text-center">
                        No pending requests to approve.
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
