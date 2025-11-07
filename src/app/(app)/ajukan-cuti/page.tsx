'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';
import { leaveTypes, users, leaveRequests as initialLeaveRequests, notifications as initialNotifications, getLeaveTypeById } from '@/lib/data';
import type { LeaveRequest, User, Notification } from '@/types';

export default function AjukanCutiPage() {
  const [currentUser, setCurrentUser] = useState<User | undefined>(users.find(u => u.id === '1'));
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [date, setDate] = useState<DateRange | undefined>();
  const [leaveTypeId, setLeaveTypeId] = useState<string>('');
  const [reason, setReason] = useState('');
  const [days, setDays] = useState<number | string>('');
  const [attachment, setAttachment] = useState<File | null>(null);
  const { toast } = useToast();

  const handleAttachmentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachment(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date?.from || !date?.to || !leaveTypeId || !reason || !days) {
      toast({
        variant: 'destructive',
        title: 'Gagal Mengirim',
        description: 'Mohon lengkapi semua isian formulir.',
      });
      return;
    }
    
    const numDays = Number(days);
    if (numDays <= 0) {
        toast({
            variant: 'destructive',
            title: 'Jumlah hari tidak valid',
            description: 'Jumlah hari cuti harus lebih dari 0.',
        });
        return;
    }

    const newRequestId = `req-${Date.now()}`;
    const newRequest: LeaveRequest = {
      id: newRequestId,
      userId: currentUser!.id,
      leaveTypeId: leaveTypeId,
      startDate: date.from,
      endDate: date.to,
      days: numDays,
      reason: reason,
      status: 'Pending',
      createdAt: new Date(),
      attachment: attachment ? attachment.name : undefined,
    };

    setLeaveRequests([newRequest, ...leaveRequests]);
    // In real app, you would also update the data source e.g. via API call
    initialLeaveRequests.unshift(newRequest);

    // Notification logic for sick leave
    const selectedLeaveType = getLeaveTypeById(leaveTypeId);
    if (selectedLeaveType?.name === 'Cuti Sakit' && !attachment) {
      const userNotification: Notification = {
        id: `notif-${Date.now()}-user`,
        userId: currentUser!.id,
        message: `Pengajuan cuti sakit Anda pada ${format(date.from, 'd MMM y')} menunggu unggahan surat keterangan dokter.`,
        type: 'warning',
        isRead: false,
        createdAt: new Date(),
        leaveRequestId: newRequestId,
      };
      const adminNotification: Notification = {
        id: `notif-${Date.now()}-admin`,
        userId: 'admin', // Or dynamically find admin user
        message: `${currentUser?.name} mengajukan cuti sakit tanpa surat keterangan.`,
        type: 'warning',
        isRead: false,
        createdAt: new Date(),
        leaveRequestId: newRequestId,
      };
      initialNotifications.unshift(userNotification, adminNotification);
    }


    toast({
      title: 'Permintaan Terkirim',
      description: 'Permintaan cuti Anda telah berhasil diajukan.',
    });

    // Reset form
    setDate(undefined);
    setLeaveTypeId('');
    setReason('');
    setDays('');
    setAttachment(null);
  };
  
  const selectedLeaveTypeName = getLeaveTypeById(leaveTypeId)?.name;


  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Formulir Pengajuan Cuti</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ajukan Cuti Baru</CardTitle>
          <CardDescription>
            Silakan isi formulir di bawah ini untuk mengajukan cuti.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="leave-type">Jenis Cuti</Label>
                <Select value={leaveTypeId} onValueChange={setLeaveTypeId}>
                  <SelectTrigger id="leave-type">
                    <SelectValue placeholder="Pilih Jenis Cuti" />
                  </SelectTrigger>
                  <SelectContent>
                    {leaveTypes.map(type => (
                      <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-range">Tanggal Cuti</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="date-range"
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !date && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, 'LLL dd, y')} -{' '}
                            {format(date.to, 'LLL dd, y')}
                          </>
                        ) : (
                          format(date.from, 'LLL dd, y')
                        )
                      ) : (
                        <span>Pilih rentang tanggal</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="days">Jumlah Hari</Label>
                <Input 
                    id="days" 
                    type="number" 
                    value={days} 
                    onChange={(e) => setDays(e.target.value)} 
                    placeholder="Contoh: 3"
                />
              </div>

              {selectedLeaveTypeName === 'Cuti Sakit' && (
                <div className="space-y-2">
                    <Label htmlFor="attachment">Surat Keterangan Sakit (Opsional)</Label>
                    <Input 
                        id="attachment" 
                        type="file" 
                        onChange={handleAttachmentChange}
                        accept="application/pdf,image/jpeg,image/png"
                    />
                    <p className="text-xs text-muted-foreground">Anda dapat mengunggah ini nanti jika diperlukan.</p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
                <Label htmlFor="reason">Alasan Cuti</Label>
                <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Tuliskan alasan lengkap Anda di sini..."
                    rows={4}
                />
            </div>
            
            <div className="flex justify-end gap-2">
                <Button variant="outline" type="button" onClick={() => {
                    setDate(undefined);
                    setLeaveTypeId('');
                    setReason('');
                    setDays('');
                    setAttachment(null);
                }}>
                    Batal
                </Button>
                <Button type="submit">Kirim Pengajuan</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
