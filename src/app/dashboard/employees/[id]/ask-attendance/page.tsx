'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';

export default function AskAttendancePage() {
  const router = useRouter();
  const punchInImage = PlaceHolderImages.find(
    (img) => img.id === 'punch-in-screen'
  );

  const handleInvite = () => {
    const message =
      'Hi, you can now mark your attendance on SalaryBox app using this link. Thanks';
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    if (typeof window !== 'undefined') {
      window.open(url, '_blank');
    }
  };

  return (
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
        <h1 className="ml-4 text-lg font-semibold">
          Ask staff to mark attendance
        </h1>
      </header>

      <main className="flex-1 space-y-6 p-4">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <h2 className="text-center text-lg font-semibold">
              Staff can mark attendance in 1-Click
            </h2>
            <p className="text-center text-sm text-muted-foreground">
              Here is how staff can mark attendance in 1-Click
            </p>
            <div className="mt-4 flex justify-center">
              {punchInImage && (
                <Image
                  src={punchInImage.imageUrl}
                  alt={punchInImage.description}
                  width={250}
                  height={500}
                  className="rounded-xl border"
                  data-ai-hint={punchInImage.imageHint}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button
          onClick={handleInvite}
          className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90"
        >
          <MessageSquare className="mr-2 h-6 w-6" />
          INVITE STAFF NOW
        </Button>
      </footer>
    </div>
  );
}
