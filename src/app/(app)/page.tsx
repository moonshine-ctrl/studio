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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FileDown,
  Filter,
  Hourglass,
  CheckCircle,
  XCircle,
  ClipboardList,
  MoreHorizontal,
  FilePen,
  Trash2,
  PlusCircle,
  Calendar as CalendarIcon,
} from 'lucide-react';
import {
  getDepartmentById,
  getLeaveTypeById,
  getUserById,
  leaveRequests as initialLeaveRequests,
  leaveTypes,
} from '@/lib/data';
import { format } from 'date-fns';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { LeaveRequest, User } from '@/types';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { DateRange } from 'react-day-picker';

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

export default function DashboardPage() {
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<LeaveRequest | null>(null);
  const { toast } = useToast();
  
  // This should come from an auth context in a real app
  const currentUserRole: User['role'] = 'Admin';


  const emptyForm: Partial<LeaveRequest> & { startDate?: Date; endDate?: Date } = {
    userId: '1', // Default to Budi Santoso for new requests
    leaveTypeId: 'annual',
    startDate: undefined,
    endDate: undefined,
    days: 1,
    reason: '',
    status: 'Pending',
  };

  const [formState, setFormState] = useState(emptyForm);

  const stats = {
    pending: leaveRequests.filter((r) => r.status === 'Pending').length,
    approved: leaveRequests.filter((r) => r.status === 'Approved').length,
    total: leaveRequests.length,
  };

  const handleOpenForm = (request: LeaveRequest | null = null) => {
    if (request) {
      setEditingRequest(request);
      setFormState({
        ...request,
        startDate: request.startDate,
        endDate: request.endDate,
      });
    } else {
      setEditingRequest(null);
      setFormState(emptyForm);
    }
    setIsFormOpen(true);
  };

  const handleDateSelect = (range: DateRange | undefined) => {
    setFormState({ ...formState, startDate: range?.from, endDate: range?.to });
  };
  
  const handleFormChange = (field: keyof typeof formState, value: string | number) => {
    setFormState({ ...formState, [field]: value });
  };

  const handleSubmit = () => {
    if (!formState.startDate || !formState.endDate || !formState.days || !formState.reason) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please fill all required fields.',
      });
      return;
    }

    if (editingRequest) {
      // Update existing request
      const updatedRequest: LeaveRequest = {
        ...editingRequest,
        ...formState,
        startDate: formState.startDate,
        endDate: formState.endDate,
        days: Number(formState.days),
      };
      setLeaveRequests(leaveRequests.map(r => r.id === updatedRequest.id ? updatedRequest : r));
      toast({ title: 'Success', description: 'Leave request updated.' });
    } else {
      // Add new request
      const newRequest: LeaveRequest = {
        id: `req-${Date.now()}`,
        userId: formState.userId!,
        leaveTypeId: formState.leaveTypeId!,
        startDate: formState.startDate,
        endDate: formState.endDate,
        days: Number(formState.days),
        reason: formState.reason!,
        status: 'Pending',
        createdAt: new Date(),
      };
      setLeaveRequests([newRequest, ...leaveRequests]);
      toast({ title: 'Success', description: 'Leave request submitted.' });
    }
    setIsFormOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Dashboard</h1>
        {currentUserRole !== 'Admin' && (
          <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajukan Cuti
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
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
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
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
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenForm(request)}>
                            <FilePen className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive focus:text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>{editingRequest ? 'Edit' : 'Ajukan'} Cuti</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="leave-type" className="text-right">Jenis Cuti</Label>
              <Select 
                value={formState.leaveTypeId}
                onValueChange={(value) => handleFormChange('leaveTypeId', value)}
              >
                <SelectTrigger id="leave-type" className="col-span-3">
                  <SelectValue placeholder="Pilih Jenis Cuti" />
                </SelectTrigger>
                <SelectContent>
                  {leaveTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date-range" className="text-right">Tanggal</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date-range"
                    variant="outline"
                    className={cn(
                      'col-span-3 justify-start text-left font-normal',
                      !formState.startDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formState.startDate ? (
                      formState.endDate ? (
                        <>
                          {format(formState.startDate, 'LLL dd, y')} -{' '}
                          {format(formState.endDate, 'LLL dd, y')}
                        </>
                      ) : (
                        format(formState.startDate, 'LLL dd, y')
                      )
                    ) : (
                      <span>Pilih tanggal</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={formState.startDate}
                    selected={{ from: formState.startDate, to: formState.endDate }}
                    onSelect={handleDateSelect}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="days" className="text-right">Jumlah Hari</Label>
                <Input
                    id="days"
                    type="number"
                    value={formState.days}
                    onChange={(e) => handleFormChange('days', parseInt(e.target.value, 10) || 0)}
                    className="col-span-3"
                    min="1"
                />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">Alasan</Label>
              <Textarea
                id="reason"
                value={formState.reason}
                onChange={(e) => handleFormChange('reason', e.target.value)}
                className="col-span-3"
                placeholder="Tuliskan alasan cuti Anda"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Batal</Button>
            <Button onClick={handleSubmit}>Kirim</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

    
