'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import {
  leaveRequests,
  users,
  departments,
  leaveTypes,
  getUserById,
  getDepartmentById,
  getLeaveTypeById
} from '@/lib/data';
import { LeaveLetter } from '@/components/leave-letter';
import { Skeleton } from '@/components/ui/skeleton';

export default function PrintLeaveRequestPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { id } = params;
  const letterNumber = searchParams.get('letterNumber') || '.......................';

  const request = leaveRequests.find((r) => r.id === id);
  const user = request ? getUserById(request.userId) : undefined;
  const department = user
    ? getDepartmentById(user.departmentId)
    : undefined;
  const leaveType = request
    ? getLeaveTypeById(request.leaveTypeId)
    : undefined;
    
  const approver = user && department ? users.find(u => u.id === department.headId) : undefined;
  const headOfAgency = users.find(u => u.role === 'Admin');


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
    headOfAgency,
  };


  return (
    <div className="bg-white text-black">
      <LeaveLetter {...letterData} />
    </div>
  );
}
