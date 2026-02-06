'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ScanFace, CalendarDays, Banknote, Check, Shield } from 'lucide-react';

const includedFeatures = [
  { icon: ScanFace, text: 'AI Powered Attendance' },
  { icon: CalendarDays, text: 'Scheduling & Rostering' },
  { icon: Banknote, text: 'Automated Payroll & Statutory Compliances' },
  { icon: Check, text: 'Real-time Insights' },
];

const guarantees = [
    { icon: CalendarDays, text: 'Cancel anytime' },
    { icon: Shield, text: '100% Risk free' },
];

export default function TrialPage() {
  const router = useRouter();

  const handleContinue = () => {
    router.push('/dashboard');
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
      <main className="flex-1 p-6">
        <div className="text-center mt-8">
          <h1 className="text-3xl font-bold">
            Experience the Future of <br />
            <span className="text-accent">Staff Management</span>
          </h1>

          <div className="my-8">
            <p className="text-5xl font-bold flex items-center justify-center">
              <span className="text-4xl">₹</span>1
              <span className="text-xl font-normal text-muted-foreground ml-2">for 3 days</span>
            </p>
            <div className="flex items-center justify-center gap-1 mt-2 text-green-600 font-semibold">
                <Check className="h-5 w-5" />
                <span>Instant 100% Refund</span>
            </div>
          </div>
        </div>

        <div className="my-12">
            <h2 className="text-lg font-medium text-muted-foreground mb-4">What's included</h2>
            <div className="space-y-4">
                {includedFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
                           <feature.icon className="h-5 w-5 text-accent" />
                        </div>
                        <span className="text-base font-medium">{feature.text}</span>
                    </div>
                ))}
            </div>
        </div>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4 space-y-4">
        <div className="flex justify-around">
            {guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-center gap-2 text-muted-foreground">
                    <guarantee.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{guarantee.text}</span>
                </div>
            ))}
        </div>
        <Button onClick={handleContinue} className="w-full h-12 text-base bg-accent hover:bg-accent/90 text-accent-foreground">
          Continue
        </Button>
        <p className="text-center text-xs text-muted-foreground">
            By continuing you agree to our Terms & Conditions.
        </p>
      </footer>
    </div>
  );
}
