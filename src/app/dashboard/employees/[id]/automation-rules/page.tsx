'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';

const RuleRow = ({
  label,
  children,
  isLast = false,
}: {
  label: string;
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <div
    className={`flex items-center justify-between p-4 ${
      !isLast ? 'border-b' : ''
    }`}
  >
    <p className="font-medium text-base">{label}</p>
    {children}
  </div>
);

export default function AutomationRulesPage() {
  const router = useRouter();

  return (
    <div className="flex h-full flex-col bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-primary px-4 text-primary-foreground">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
          className="hover:bg-primary-foreground/10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Automation Rules</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <Card>
          <CardContent className="p-0">
            <RuleRow label="Auto Present at day start">
              <Switch />
            </RuleRow>

            <RuleRow label="Present on Punch In">
              <Switch defaultChecked />
            </RuleRow>

            <RuleRow label="Auto half day if late by">
              <Button variant="ghost" className="text-muted-foreground">
                Not Set
              </Button>
            </RuleRow>

            <RuleRow label="Mandatory half day hours">
              <Button variant="ghost" className="text-muted-foreground">
                Not Set
              </Button>
            </RuleRow>

            <RuleRow label="Mandatory full day hours" isLast={true}>
              <Button variant="ghost" className="text-muted-foreground">
                Not Set
              </Button>
            </RuleRow>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
