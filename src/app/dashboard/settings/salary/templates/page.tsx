'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, MoreVertical, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import Link from 'next/link';

const TemplateItem = ({ name }: { name: string }) => {
    const router = useRouter();

    return (
        <Collapsible>
            <Card>
                <div className="flex items-center justify-between p-4">
                    <CollapsibleTrigger asChild>
                        <div className="flex flex-1 items-center gap-4 cursor-pointer">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback className="bg-orange-500 text-white font-semibold">S</AvatarFallback>
                            </Avatar>
                            <p className="font-medium text-base">{name}</p>
                        </div>
                    </CollapsibleTrigger>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); /* TODO: open menu */ }}>
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>

                <CollapsibleContent>
                    <div className="px-4 pb-4">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => router.push('/dashboard/settings/salary/templates/create')}
                        >
                            View
                        </Button>
                    </div>
                </CollapsibleContent>
            </Card>
        </Collapsible>
    );
};


export default function SalaryTemplatesPage() {
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
        <h1 className="ml-4 text-lg font-semibold">Salary Templates</h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="space-y-3">
          <TemplateItem name="SalaryBox provided breakdown" />
        </div>
      </main>
      <div className="fixed bottom-24 left-0 right-0 flex justify-center">
          <Button asChild className="h-12 px-6 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full shadow-lg">
            <Link href="/dashboard/settings/salary/templates/create">
              <Plus className="mr-2 h-5 w-5" />
              Create Template
            </Link>
          </Button>
      </div>
    </div>
  );
}
