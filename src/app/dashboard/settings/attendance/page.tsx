'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Coffee,
  ScanFace,
  QrCode,
  Fingerprint,
  Users,
  Smartphone,
  CalendarDays,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const SettingsSection = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h2 className="px-4 pb-2 pt-4 text-lg font-semibold text-muted-foreground">
      {title}
    </h2>
    <div className="space-y-1 rounded-lg border bg-card shadow-sm">
        {children}
    </div>
  </div>
);

const SettingsRow = ({
  icon: Icon,
  label,
  children,
  hasNewBadge = false,
  onClick,
  isFirst = false,
  isLast = false,
}: {
  icon: React.ElementType;
  label: string;
  children?: React.ReactNode;
  hasNewBadge?: boolean;
  onClick?: () => void;
  isFirst?: boolean;
  isLast?: boolean;
}) => {
  return (
    <div
      onClick={onClick}
      className={`flex items-center justify-between p-4 ${!isLast ? 'border-b' : ''} ${onClick ? 'cursor-pointer hover:bg-muted/50' : ''}`}
    >
      <div className="flex items-center gap-4">
        <Icon className="h-6 w-6 text-muted-foreground" />
        <div className="flex items-center gap-2">
          <span className="font-medium">{label}</span>
          {hasNewBadge && <Badge variant="destructive">New</Badge>}
        </div>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground">
        {children}
      </div>
    </div>
  );
};

export default function AttendanceSettingsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [autoTrackEnabled, setAutoTrackEnabled] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const handleAutoTrackToggle = (checked: boolean) => {
    if (checked) {
      setIsConfirmDialogOpen(true);
    } else {
      setAutoTrackEnabled(false);
      toast({
        title: 'Auto Tracking Disabled',
        description: 'Live location tracking has been turned off.',
      });
    }
  };

  const handleConfirmTracking = () => {
    setAutoTrackEnabled(true);
    setIsConfirmDialogOpen(false);
    toast({
      title: 'Auto Tracking Enabled',
      description: 'Employee live location will be tracked for 12 hours after punch-in.',
    });
  };

  return (
    <>
      <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
        <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ml-4 text-lg font-semibold">Attendance Settings</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          <div className="space-y-6">
            <SettingsSection title="Shifts and Breaks">
              <SettingsRow
                icon={Clock}
                label="Shifts"
                hasNewBadge
                isFirst
                onClick={() => router.push('/dashboard/settings/attendance/shifts')}
              >
                <ChevronRight className="h-5 w-5" />
              </SettingsRow>
              <SettingsRow
                icon={Coffee}
                label="Breaks"
                hasNewBadge
                isLast
                onClick={() => router.push('/dashboard/settings/attendance/breaks')}
              >
                  <ChevronRight className="h-5 w-5" />
              </SettingsRow>
            </SettingsSection>

            <SettingsSection title="Attendance Modes">
              <SettingsRow 
                  icon={ScanFace} 
                  label="AI Face Recognition" 
                  hasNewBadge 
                  isFirst
                  onClick={() => router.push('/dashboard/settings/attendance/face-recognition')}
              >
                  <Button size="sm" className="h-auto py-1 px-3 text-xs bg-blue-600 hover:bg-blue-700 text-white">Enabled</Button>
              </SettingsRow>
               <SettingsRow icon={QrCode} label="QR Codes" onClick={() => router.push('/dashboard/settings/attendance/qr-code')}>
                  <ChevronRight className="h-5 w-5" />
              </SettingsRow>
               <SettingsRow icon={Fingerprint} label="Biometric Devices" onClick={() => router.push('/dashboard/settings/attendance/biometric-devices')}>
                  <ChevronRight className="h-5 w-5" />
              </SettingsRow>
               <SettingsRow icon={Users} label="Attendance Kiosk" onClick={() => router.push('/dashboard/settings/attendance/kiosk')}>
                  <ChevronRight className="h-5 w-5" />
              </SettingsRow>
               <SettingsRow icon={Smartphone} label="Device Verification" isLast onClick={() => router.push('/dashboard/settings/attendance/device-verification')}>
                  <ChevronRight className="h-5 w-5" />
              </SettingsRow>
            </SettingsSection>
            
             <SettingsSection title="Leaves & Holidays">
               <SettingsRow icon={CalendarDays} label="Leave Requests" isFirst onClick={() => router.push('/dashboard/settings/attendance/leave-requests')}>
                  <ChevronRight className="h-5 w-5" />
              </SettingsRow>
               <SettingsRow icon={CalendarDays} label="Holiday List" onClick={() => router.push('/dashboard/settings/attendance/holiday-list')}>
                  <ChevronRight className="h-5 w-5" />
              </SettingsRow>
               <SettingsRow icon={CalendarDays} label="Custom Paid Leaves" isLast onClick={() => router.push('/dashboard/settings/attendance/custom-paid-leaves')}>
                  <ChevronRight className="h-5 w-5" />
              </SettingsRow>
            </SettingsSection>

            <SettingsSection title="Automation">
              <SettingsRow icon={MapPin} label="Auto-Live Track" isLast>
                <Switch checked={autoTrackEnabled} onCheckedChange={handleAutoTrackToggle} />
              </SettingsRow>
            </SettingsSection>
          </div>
        </main>
      </div>
      <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Enable Auto tracking?</AlertDialogTitle>
                <AlertDialogDescription>
                    Track employee's live location for 12 hours when they punch in
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="flex-col gap-2 pt-2">
                <AlertDialogAction onClick={handleConfirmTracking} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
                  Confirm
                </AlertDialogAction>
                <AlertDialogCancel className="w-full mt-0">
                  Cancel
                </AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
