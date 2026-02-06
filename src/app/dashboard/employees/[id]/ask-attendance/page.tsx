'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function AskAttendancePage() {
  const router = useRouter();
  const punchInImage = PlaceHolderImages.find(p => p.id === 'punch-in-screen');

  const handleInvite = () => {
    // Temporarily disabled to debug build issue
    if (typeof window !== 'undefined') {
        const message = "Hi, you can now mark your attendance on SalaryBox app. Download now: https://play.google.com/store/apps/details?id=com.salarybox.app";
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
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
        <h1 className="ml-4 text-lg font-semibold">Ask staff to mark attendance</h1>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        {punchInImage && (
             <Image 
                src={punchInImage.imageUrl} 
                alt={punchInImage.description} 
                width={280} 
                height={607}
                className="object-contain rounded-2xl border-4 border-gray-800 dark:border-gray-600 shadow-xl"
                data-ai-hint={punchInImage.imageHint} 
            />
        )}
      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button 
          onClick={handleInvite}
          className="w-full h-12 text-base bg-green-500 hover:bg-green-600 text-white"
        >
          <MessageSquare className="mr-2 h-6 w-6" />
          INVITE STAFF NOW
        </Button>
      </footer>
    </div>
  );
}
