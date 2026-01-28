'use client';

import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ScanFace,
  QrCode,
  Crosshair,
  ScanLine,
  Fingerprint,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';

const SettingRow = ({
  icon: Icon,
  label,
  children,
  isHeader = false,
}: {
  icon?: React.ElementType;
  label: string;
  children: React.ReactNode;
  isHeader?: boolean;
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      {Icon && <Icon className="h-5 w-5 text-muted-foreground" />}
      <p className={`${isHeader ? 'font-medium' : ''} text-base`}>
        {label}
      </p>
    </div>
    {children}
  </div>
);

export default function AttendanceModesPage() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Attendance Modes</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="p-0">
              <div className="p-4">
                <SettingRow label="Allow punch in from Staff App" isHeader>
                  <Switch id="allow-punch-in" defaultChecked />
                </SettingRow>
              </div>
              <Separator />
              <div className="space-y-4 p-4">
                <SettingRow icon={ScanFace} label="Selfie Attendance">
                  <Switch id="selfie-attendance" />
                </SettingRow>
                <SettingRow icon={QrCode} label="QR Attendance">
                  <Switch id="qr-attendance" />
                </SettingRow>
                <SettingRow icon={Crosshair} label="GPS Attendance">
                  <Switch id="gps-attendance" defaultChecked />
                </SettingRow>
              </div>
            </CardContent>
          </Card>

          <div>
            <h2 className="px-1 py-2 text-base font-medium text-muted-foreground">
              Mark attendance from
            </h2>
            <RadioGroup defaultValue="anywhere" className="space-y-3">
              <div className="rounded-lg border bg-card has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <Label
                  htmlFor="office"
                  className="flex cursor-pointer items-center gap-3 p-4"
                >
                  <RadioGroupItem value="office" id="office" />
                  <span className="font-normal">From Office</span>
                </Label>
              </div>
              <div className="rounded-lg border bg-card has-[:checked]:border-primary has-[:checked]:bg-primary/10">
                <Label
                  htmlFor="anywhere"
                  className="flex cursor-pointer items-center gap-3 p-4"
                >
                  <RadioGroupItem value="anywhere" id="anywhere" />
                  <span className="font-normal">From Anywhere</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <ScanLine className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-medium">Attendance Kiosk</p>
                <a href="#" className="text-sm text-primary hover:underline">
                  Manage kiosk devices
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center gap-4 p-4">
              <Fingerprint className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-medium">Biometric Attendance</p>
                <a href="#" className="text-sm text-primary hover:underline">
                  Manage biometric devices
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
