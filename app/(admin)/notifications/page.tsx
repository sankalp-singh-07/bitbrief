'use client';

import { useEffect } from 'react';
import { useNotificationStore } from '@/store/useNotificationStore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCircle2 } from 'lucide-react';

export default function NotificationsPage() {
  const { notifications, isLoaded, fetchNotifications, readNotification, readAll } = useNotificationStore();

  useEffect(() => {
    if (!isLoaded) fetchNotifications();
  }, [isLoaded, fetchNotifications]);

  if (!isLoaded) return <div className="p-8 text-center text-muted-foreground">Loading notifications...</div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold font-serif mb-2 flex items-center gap-3">
            <Bell className="w-8 h-8" /> Notifications
          </h1>
          <p className="text-lg text-muted-foreground dark:text-gray-300">Stay up to date with alerts and system events.</p>
        </div>
        {notifications.some(n => !n.isRead) && (
          <Button variant="outline" onClick={readAll} className="flex gap-2 items-center">
            <CheckCircle2 className="w-4 h-4" /> Mark All as Read
          </Button>
        )}
			</div>
      
      {notifications.length === 0 ? (
        <Card className="p-12 text-center bg-muted/20 border-dashed">
          <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">You're all caught up!</h3>
          <p className="text-muted-foreground">No new notifications right now.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <Card key={n._id} className={`transition-all ${n.isRead ? 'opacity-60 bg-muted/20' : 'border-primary/50 bg-primary/5 shadow-md flex-row'}`}>
              <CardContent className="p-4 flex justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">{n.type}</span>
                    <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-sm md:text-base leading-relaxed">{n.message}</p>
                </div>
                {!n.isRead && (
                  <Button variant="ghost" size="sm" onClick={() => readNotification(n._id)} className="shrink-0 text-xs h-8">
                    Mark Read
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
