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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Printer } from 'lucide-react';
import {
  getLeaveTypeById,
  getUserById,
  leaveRequests,
} from '@/lib/data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

export default function PrintPage() {
  
  const handlePrint = () => {
    // This is a placeholder for the print functionality
    alert('Fungsi cetak belum diimplementasikan.');
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold font-headline">Cetak Surat</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Cetak Surat Cuti & Sakit</CardTitle>
          <CardDescription>
            Buat dan cetak surat keterangan cuti atau sakit untuk karyawan.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
           <div className="grid gap-2 max-w-sm">
              <Label htmlFor="letter-number">Nomor Surat</Label>
              <Input id="letter-number" placeholder="Contoh: 001/HRD/CUTI/2024" />
            </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Karyawan</TableHead>
                <TableHead>Jenis Cuti</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => {
                const user = getUserById(request.userId);
                const leaveType = getLeaveTypeById(request.leaveTypeId);
                if (!user || !leaveType) return null;

                const isPrintable = request.status === 'Approved' || (leaveType.name === 'Sick' && request.status !== 'Rejected');

                return (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{leaveType.name}</TableCell>
                    <TableCell>
                      {format(request.startDate, 'd MMM y')} - {format(request.endDate, 'd MMM y')}
                    </TableCell>
                    <TableCell>
                       <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Pending' ? 'secondary' : 'destructive'}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={handlePrint} disabled={!isPrintable}>
                        <Printer className="mr-2 h-4 w-4" />
                        Cetak Surat
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
