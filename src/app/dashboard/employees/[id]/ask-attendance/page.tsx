'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent } from '@/components/ui/card';

const WhatsAppIcon = () => (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className="mr-2 h-6 w-6"
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52s-.67-.149-.67-.149-2.203-1.043-2.589-1.043c-.387.001-.833.208-1.218.666-.386.458-1.12.933-1.12 2.268s1.144 2.622 1.318 2.82c.174.198 2.422 3.795 5.866 5.178.866.347 1.545.556 2.086.715.756.223 1.442.198 1.996.12.595-.08 1.758-.715 2.006-1.413.248-.698.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    </svg>
  );

export default function AskAttendancePage() {
  const router = useRouter();
  const punchInImage = PlaceHolderImages.find(p => p.id === 'punch-in-screen');
  
  const handleInvite = () => {
    if (typeof window === 'undefined') return;
    
    const message = encodeURIComponent(
      "Hi! You have been invited to join your company on PayEase. Please download the app and mark your attendance daily. Download from here: https://payease.app/download"
    );
    window.open(`https://wa.me/?text=${message}`, '_blank');
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
        
        <Carousel className="w-full max-w-[280px]">
            <CarouselContent>
                <CarouselItem>
                    <div className="p-1">
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
                </CarouselItem>
            </CarouselContent>
        </Carousel>

      </main>

      <footer className="sticky bottom-0 border-t bg-card p-4">
        <Button 
          onClick={handleInvite}
          className="w-full h-12 text-base bg-green-500 hover:bg-green-600 text-white"
        >
          <WhatsAppIcon />
          INVITE STAFF NOW
        </Button>
      </footer>
    </div>
  );
}
