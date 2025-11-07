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
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, PauseCircle } from 'lucide-react';
import {
  getDepartmentById,
  getLeaveTypeById,
  getUserById,
  leaveRequests as initialLeaveRequests,
  users as initialUsers,
  users,
  logHistory,
  departmentApprovalFlows,
} from '@/lib/data';
import { format } from 'date-fns';
import { useState, useMemo, useEffect } from 'react';
import type { LeaveRequest, User } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function ApprovalsPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<User | undefined>();

  useEffect(() => {
    const loggedInUserId = sessionStorage.getItem('loggedInUserId');
    const user = users.find(u => u.id === (loggedInUserId || '2')); // fallback to citra
    setCurrentUser(user);
  }, []);

  const requestsToApprove = useMemo(() => {
    if (!currentUser) return [];
    // An employee sees requests where they are the nextApproverId
    return leaveRequests.filter(req => req.status === 'Pending' && req.nextApproverId === currentUser.id);
  }, [leaveRequests, currentUser]);

  const handleDecision = (requestId: string, decision: 'Approved' | 'Rejected' | 'Suspended') => {
    const requestIndex = leaveRequests.findIndex(r => r.id === requestId);
    if (requestIndex === -1 || !currentUser) return;
    
    const originalRequest = leaveRequests[requestIndex];

    // If rejected or suspended, the flow stops.
    if (decision === 'Rejected' || decision === 'Suspended') {
        const updatedRequests = leaveRequests.map(r => r.id === requestId ? { ...r, status: decision, nextApproverId: undefined } : r);
        setLeaveRequests(updatedRequests);
        const masterRequest = initialLeaveRequests.find(r => r.id === requestId);
        if (masterRequest) {
            masterRequest.status = decision;
            masterRequest.nextApproverId = undefined;
        }

    } else if (decision === 'Approved') {
        const employee = getUserById(originalRequest.userId);
        if (!employee) return;

        const approvalFlow = departmentApprovalFlows[employee.departmentId] || [];
        const currentApproverIndex = approvalFlow.indexOf(currentUser.id);
        
        const nextApproverId = (currentApproverIndex !== -1 && currentApproverIndex < approvalFlow.length - 1)
            ? approvalFlow[currentApproverIndex + 1]
            : undefined;

        const newStatus = nextApproverId ? 'Pending' : 'Approved';

        const updatedRequests = leaveRequests.map(r => 
            r.id === requestId 
            ? { ...r, status: newStatus, nextApproverId: nextApproverId } 
            : r
        );
        setLeaveRequests(updatedRequests);

        const masterRequest = initialLeaveRequests.find(r => r.id === requestId);
        if (masterRequest) {
            masterRequest.status = newStatus;
            masterRequest.nextApproverId = nextApproverId;
        }

        // Deduct leave balance only on final approval
        if (newStatus === 'Approved') {
            const leaveType = getLeaveTypeById(originalRequest.leaveTypeId);
            if (leaveType?.name === 'Cuti Tahunan') {
                 const updatedUsers = allUsers.map(u => 
                    u.id === employee.id 
                    ? { ...u, annualLeaveBalance: u.annualLeaveBalance - originalRequest.days } 
                    : u
                );
                setAllUsers(updatedUsers);
                const originalUser = initialUsers.find(u => u.id === employee.id);
                if (originalUser) originalUser.annualLeaveBalance -= originalRequest.days;
            }
        }
    }
    
    const employee = getUserById(originalRequest.userId);

    // Add to log
    logHistory.unshift({
      id: `log-${Date.now()}`,
      date: new Date(),
      user: currentUser?.name || 'Approver',
      activity: `${decision} leave request for ${employee?.name || 'N/A'}.`,
    });

    toast({
      title: `Request ${decision}`,
      description: `The leave request has been ${decision.toLowerCase()}.`,
      variant: decision === 'Rejected' ? 'destructive' : 'default',
    });
  };

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
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
                           <Button size="sm" onClick={() => handleDecision(request.id, 'Approved')}>
                             <Check className="mr-2 h-4 w-4" /> Approve
                           </Button>
                           <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-500 hover:bg-yellow-50 hover:text-yellow-700" onClick={() => handleDecision(request.id, 'Suspended')}>
                             <PauseCircle className="mr-2 h-4 w-4" /> Suspend
                           </Button>
                           <Button size="sm" variant="destructive" onClick={() => handleDecision(request.id, 'Rejected')}>
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
