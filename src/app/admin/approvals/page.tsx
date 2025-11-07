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
  getDepartmentById,
  getLeaveTypeById,
  getUserById,
  leaveRequests as initialLeaveRequests,
} from '@/lib/data';
import { format } from 'date-fns';
import { useState, useMemo } from 'react';
import type { LeaveRequest } from '@/types';

export default function ApprovalsPage() {
  const [leaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);

  const requestsToApprove = useMemo(() => {
    // Admin sees all pending requests for monitoring purposes
    return leaveRequests.filter(req => req.status === 'Pending');
  }, [leaveRequests]);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Pending Requests</CardTitle>
          <CardDescription>
            All pending leave requests across departments. Admin role is for monitoring only.
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
                <TableHead>Status</TableHead>
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
                        <Badge variant="secondary">{request.status}</Badge>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                        No pending requests.
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
