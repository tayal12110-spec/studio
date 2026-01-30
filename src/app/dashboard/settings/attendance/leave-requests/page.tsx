'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function LeaveRequestsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

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
        <h1 className="ml-4 text-lg font-semibold">Leave Requests</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        <Tabs defaultValue="pending">
          <TabsList className="w-full h-auto justify-start rounded-none bg-card p-0 border-b">
            <TabsTrigger
              value="pending"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:font-semibold text-muted-foreground"
            >
              PENDING REQUESTS
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:font-semibold text-muted-foreground"
            >
              HISTORY
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="m-0">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search employee"
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex h-[50vh] items-center justify-center text-center">
                <p className="text-muted-foreground">No Pending Requests</p>
            </div>
          </TabsContent>

          <TabsContent value="history" className="m-0">
            <div className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                    placeholder="Search employee"
                    className="pl-10"
                    />
                </div>
            </div>
            <div className="flex h-[50vh] items-center justify-center text-center">
              <p className="text-muted-foreground">No leave history found.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
