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
import { departments, users } from '@/lib/data';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold font-headline">Settings</h1>

      <Tabs defaultValue="approval">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="approval">Approval Flows</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="mt-6">
            <Card>
                <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>General application settings will be here.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Coming soon.</p>
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
                        <Button className="mt-4">Save Changes</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-6">
             <Card>
                <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>Notification settings will be here, including WhatsApp integration.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Coming soon.</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
