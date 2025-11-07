'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { departments, users, settings as appSettings } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { useState } from 'react';

export default function SettingsPage() {
  const { toast } = useToast();
  const [sickLeaveFormUrl, setSickLeaveFormUrl] = useState(appSettings.sickLeaveFormUrl);

  const handleSaveChanges = () => {
    toast({
      title: 'Changes Saved!',
      description: 'Your settings have been updated.',
    });
  };
  
  const handleGeneralSave = () => {
      // In a real app, you'd save this to a backend.
      appSettings.sickLeaveFormUrl = sickLeaveFormUrl;
      handleSaveChanges();
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold font-headline">Settings</h1>

      <Tabs defaultValue="approval">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="approval">Approval Flows</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>Atur link eksternal dan konfigurasi umum aplikasi.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="sick-leave-url">URL Google Form Surat Sakit</Label>
                        <Input 
                            id="sick-leave-url"
                            value={sickLeaveFormUrl}
                            onChange={(e) => setSickLeaveFormUrl(e.target.value)}
                            placeholder="https://docs.google.com/forms/..."
                        />
                         <p className="text-xs text-muted-foreground">
                            Tautan ini akan digunakan saat karyawan mengajukan cuti sakit.
                        </p>
                    </div>
                    <Button onClick={handleGeneralSave}>Save General Settings</Button>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="approval" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Flow Configuration</CardTitle>
              <CardDescription>
                Set up 1 to 3 levels of approvers for each department.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {departments.map((dept) => (
                  <AccordionItem key={dept.id} value={dept.id}>
                    <AccordionTrigger className="text-base font-medium">
                      {dept.name}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-6 p-2">
                        <div className="grid gap-3">
                          <Label htmlFor={`approver1-${dept.id}`}>
                            Approver Level 1
                          </Label>
                          <Select defaultValue={dept.headId}>
                            <SelectTrigger id={`approver1-${dept.id}`}>
                              <SelectValue placeholder="Select an approver" />
                            </SelectTrigger>
                            <SelectContent>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor={`approver2-${dept.id}`}>
                            Approver Level 2
                          </Label>
                          <Select>
                            <SelectTrigger id={`approver2-${dept.id}`}>
                              <SelectValue placeholder="Select an approver" />
                            </SelectTrigger>
                            <SelectContent>
                               <SelectItem value="none">None</SelectItem>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-3">
                          <Label htmlFor={`approver3-${dept.id}`}>
                            Approver Level 3
                          </Label>
                          <Select>
                            <SelectTrigger id={`approver3-${dept.id}`}>
                              <SelectValue placeholder="Select an approver" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button className="mt-4" onClick={handleSaveChanges}>Save Changes</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
