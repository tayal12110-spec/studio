'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, RefreshCw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, CollectionReference } from 'firebase/firestore';
import type { Branch } from '../../../../data';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function QrCodePage() {
  const router = useRouter();
  const firestore = useFirestore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeBranch, setActiveBranch] = useState<string | null>(null);

  const branchesCol = useMemoFirebase(
    () => (firestore ? collection(firestore, 'branches') : null),
    [firestore]
  ) as CollectionReference | null;

  const { data: branches, isLoading } = useCollection<Branch>(branchesCol);

  const filteredBranches = branches?.filter(branch =>
    branch.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const generateQrCodeUrl = (branchId: string, timestamp: number) => {
    // Adding a timestamp to ensure the URL is unique and bypasses caching if needed
    const data = `payease-branch-punch-in:${branchId}?ts=${timestamp}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
  };
  
  const handleGenerate = (branchId: string) => {
      setActiveBranch(branchId);
      // We force a re-render by updating state, and the URL will get a new timestamp.
      // This simulates generating a "new" QR code.
  }

  return (
    <div className="flex h-full min-h-screen flex-col bg-background">
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
        <h1 className="ml-4 text-lg font-semibold">QR Code Punch In</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for a branch"
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {filteredBranches?.map((branch) => (
              <AccordionItem value={branch.id} key={branch.id} className="border-b">
                 <AccordionTrigger className="p-4 hover:no-underline">
                     <div className="text-left">
                        <p className="font-semibold text-base">{branch.name}</p>
                        <p className="text-sm text-muted-foreground">{branch.address}</p>
                     </div>
                </AccordionTrigger>
                <AccordionContent className="p-4 pt-0">
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <div className="relative h-48 w-48 rounded-lg border p-2">
                             {activeBranch === branch.id ? (
                                <Image
                                    src={generateQrCodeUrl(branch.id, Date.now())}
                                    alt={`QR Code for ${branch.name}`}
                                    width={180}
                                    height={180}
                                    key={Date.now()} // Force re-render of image
                                    data-ai-hint="qr code"
                                />
                             ) : (
                                 <div className="h-full w-full bg-muted/50 flex items-center justify-center text-muted-foreground text-sm">
                                     Generate QR to view
                                 </div>
                             )}
                        </div>
                        <Button className="bg-accent text-accent-foreground hover:bg-accent/90" onClick={() => handleGenerate(branch.id)}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Generate QR code
                        </Button>
                    </div>
                </AccordionContent>
              </AccordionItem>
            ))}
             {filteredBranches?.length === 0 && (
                <div className="py-20 text-center text-muted-foreground">
                    No branches found.
                </div>
             )}
          </Accordion>
        )}
      </main>
    </div>
  );
}
