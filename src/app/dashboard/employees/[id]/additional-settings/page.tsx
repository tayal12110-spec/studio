'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useDoc, useFirestore, useMemoFirebase, updateDocumentNonBlocking } from '@/firebase';
import { doc, DocumentReference } from 'firebase/firestore';
import type { Employee } from '../../../data';
import { useToast } from '@/hooks/use-toast';

const SettingRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <span className="font-medium">{label}</span>
        {children}
      </CardContent>
    </Card>
  );
};

export default function AdditionalSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const employeeId = params.id as string;
  const firestore = useFirestore();
  const { toast } = useToast();

  const employeeRef = useMemoFirebase(
    () => (firestore && employeeId ? doc(firestore, 'employees', employeeId) : null),
    [firestore, employeeId]
  ) as DocumentReference<Employee> | null;

  const { data: employee, isLoading } = useDoc<Employee>(employeeRef);

  const [locationTracking, setLocationTracking] = useState(false);
  const [crmLite, setCrmLite] = useState(false);

  useEffect(() => {
    if (employee) {
      setLocationTracking(employee.canUseLocationTracking ?? false);
      setCrmLite(employee.canUseCrmLite ?? false);
    }
  }, [employee]);

  const handleSwitchChange = (key: 'canUseLocationTracking' | 'canUseCrmLite', checked: boolean) => {
    if (!employeeRef) return;

    if (key === 'canUseLocationTracking') {
      setLocationTracking(checked);
    } else {
      setCrmLite(checked);
    }

    updateDocumentNonBlocking(employeeRef, { [key]: checked });
    
    toast({
      title: 'Setting updated',
      description: `The setting has been updated.`,
    });
  };

  return (
    <div className="flex h-full flex-col bg-slate-50 dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()} className="hover:bg-primary-foreground/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Additional Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-3">
            <SettingRow label="Can use Location Tracking">
              <Switch
                checked={locationTracking}
                onCheckedChange={(checked) => handleSwitchChange('canUseLocationTracking', checked)}
              />
            </SettingRow>
            <SettingRow label="Can use CRM Lite">
              <Switch
                checked={crmLite}
                onCheckedChange={(checked) => handleSwitchChange('canUseCrmLite', checked)}
              />
            </SettingRow>
          </div>
        )}
      </main>
    </div>
  );
}
