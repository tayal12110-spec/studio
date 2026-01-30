'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const admins = [
  {
    name: 'cg',
    phone: '+91 9717471142',
    isOwner: true,
  },
];

export default function AdminsPage() {
  const router = useRouter();

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
        <h1 className="ml-4 text-lg font-semibold">Add Admins</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        {admins.map((admin, index) => (
          <div
            key={index}
            className="flex items-center justify-between rounded-lg bg-card p-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="text-xl bg-red-500 text-white">
                    {admin.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {admin.isOwner && (
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-400">
                    <Star className="h-3 w-3 fill-white text-white" />
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold">{admin.name}</p>
                <p className="text-sm text-muted-foreground">{admin.phone}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        ))}
      </main>

      <div className="fixed bottom-24 right-6 z-10 md:bottom-6">
        <Button className="h-12 rounded-full bg-accent px-6 text-base text-accent-foreground shadow-lg hover:bg-accent/90">
          <Plus className="mr-2 h-5 w-5" />
          Add Admin
        </Button>
      </div>
    </div>
  );
}
