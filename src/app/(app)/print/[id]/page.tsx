'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  leaveRequests,
  users,
  departments,
  leaveTypes,
} from '@/lib/data';
import { LeaveLetter } from '@/components/leave-letter';
import { Skeleton } from '@/components/ui/skeleton';

export default function PrintLeaveRequestPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const letterNumber = searchParams.get('letterNumber') || '.......................';

  const request = leaveRequests.find((r) => r.id === id);
  const user = request ? users.find((u) => u.id === request.userId) : undefined;
  const department = user
    ? departments.find((d) => d.id === user.departmentId)
    : undefined;
  const leaveType = request
    ? leaveTypes.find((lt) => lt.id === request.leaveTypeId)
    : undefined;
    
  const approver = user ? users.find(u => u.id === department?.headId) : undefined;

  useEffect(() => {
    if (request && user && department && leaveType) {
      setTimeout(() => {
        window.print();
      }, 500);
    }
  }, [request, user, department, leaveType]);

  if (!request || !user || !department || !leaveType) {
    return (
      <div className="p-10 bg-white">
        <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }
  
  const letterData = {
    request,
    user,
    department,
    leaveType,
    letterNumber,
    approver,
    headOfAgency: users.find(u => u.role === 'Admin') // Assuming one admin as head
  };


  return (
    <div className="bg-white text-black">
      <LeaveLetter {...letterData} />
    </div>
  );
}
