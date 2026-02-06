'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CalendarCheck, MapPin, Ban, Calendar } from 'lucide-react';

const features = [
  { icon: CalendarCheck, text: 'Selfie Attendance' },
  { icon: MapPin, text: 'GPS Attendance' },
  { icon: Ban, text: 'Block Fake Attendance' },
  { icon: Calendar, text: 'Manage Leaves' },
];

export default function WelcomePage() {
  const router = useRouter();

  return (
    <div className="flex h-full min-h-screen flex-col bg-slate-50 dark:bg-background">
      <main className="flex flex-1 flex-col justify-between p-6">
        <div className="space-y-4 pt-8">
          <h1 className="text-3xl font-bold">Welcome to SalaryBox</h1>
          <p className="text-muted-foreground">Best Attendance App</p>

          <div className="pt-8">
            <Card className="shadow-lg">
              <CardContent className="p-6 space-y-6">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <feature.icon className="h-6 w-6 text-teal-500" />
                    <span className="text-base">{feature.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="sticky bottom-0 space-y-4 border-t bg-card p-4">
        <Button
          onClick={() => router.push('/dashboard/settings/company/create')}
          className="w-full h-12 text-base bg-teal-500 hover:bg-teal-600 text-white"
        >
          Create Company Account <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button variant="link" className="w-full text-base text-teal-600">
          Join Existing Company
        </Button>
      </footer>
    </div>
  );
}
