'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';

export default function AskAttendancePage() {
  const router = useRouter();
  const punchInImage = PlaceHolderImages.find(p => p.id === 'punch-in-screen');
  
  const handleInvite = () => {
    // Temporarily disabled to debug build issue
    console.log('Invite staff button clicked.');
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

      <main className="flex-1 flex flex-col items-center justify-center p-6 space-y-8">
        <div className="text-center">
            <p className="text-xl text-primary font-medium">Staff can mark attendance in</p>
            <p className="text-2xl font-bold">1-Click</p>
        </div>
        
        <div className="w-full max-w-[280px]">
            <Card className="rounded-2xl border-4 border-gray-800 dark:border-gray-600 shadow-xl overflow-hidden bg-black">
                <CardContent className="flex aspect-[9/19.5] items-center justify-center p-0 relative">
                    {punchInImage ? (
                        <Image 
                            src={punchInImage.imageUrl} 
                            alt={punchInImage.description} 
                            width={280} 
                            height={607}
                            className="object-contain"
                            data-ai-hint={punchInImage.imageHint} 
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <p>Image not found</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>

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
