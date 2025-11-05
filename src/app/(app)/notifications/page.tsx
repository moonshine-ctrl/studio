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
import { notifications } from '@/lib/data';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, Mail } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Notification } from '@/types';


export default function NotificationsPage() {
  const [notifData, setNotifData] = useState<Notification[]>(notifications);

  const markAsRead = (id: string) => {
    setNotifData(notifData.map(n => n.id === id ? {...n, isRead: true} : n));
  }

  const markAllAsRead = () => {
    setNotifData(notifData.map(n => ({...n, isRead: true})));
  }

  const notificationVariants = {
    info: 'bg-blue-100 dark:bg-blue-900/50',
    warning: 'bg-yellow-100 dark:bg-yellow-900/50',
    success: 'bg-green-100 dark:bg-green-900/50',
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-headline">Notifications</h1>
        <Button onClick={markAllAsRead}>
          <Check className="mr-2 h-4 w-4" />
          Mark all as read
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Notifications</CardTitle>
          <CardDescription>
            Here are all your recent notifications.
          </CardDescription>
        </CardHeader>
        <CardContent>
           {notifData.length > 0 ? (
            <div className="space-y-4">
              {notifData.map((notification) => (
                <div 
                  key={notification.id}
                  className={cn(
                    "flex items-start gap-4 rounded-lg border p-4 transition-colors",
                    !notification.isRead && notificationVariants[notification.type],
                    !notification.isRead && 'font-semibold',
                  )}
                >
                  <div className="flex-shrink-0">
                    <Badge variant={notification.isRead ? 'outline' : 'default'} className="p-2">
                       <Mail className="h-5 w-5"/>
                    </Badge>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(notification.createdAt, "PPP 'at' p")}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)}>
                      Mark as read
                    </Button>
                  )}
                </div>
              ))}
            </div>
           ) : (
            <div className="text-center py-12 text-muted-foreground">
                <p>You have no notifications.</p>
            </div>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
