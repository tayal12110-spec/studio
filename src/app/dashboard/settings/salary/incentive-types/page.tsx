'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

type IncentiveType = {
  name: string;
};

const IncentiveTypeItem = ({ incentiveType }: { incentiveType: IncentiveType }) => (
    <Card>
        <CardContent className="p-4">
            <p className="font-semibold">{incentiveType.name}</p>
        </CardContent>
    </Card>
);

export default function IncentiveTypesPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [incentiveTypes, setIncentiveTypes] = useState<IncentiveType[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [incentiveName, setIncentiveName] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleAddIncentiveType = () => {
    setIncentiveName('');
    setIsSheetOpen(true);
  };
  
  const handleSave = () => {
    if (!incentiveName.trim()) {
      toast({
        variant: 'destructive',
        title: 'Incentive type name is required.',
      });
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      setIncentiveTypes(prev => [...prev, { name: incentiveName }]);
      toast({
        title: 'Incentive Type Added',
        description: `"${incentiveName}" has been added.`,
      });
      setIsSaving(false);
      setIsSheetOpen(false);
    }, 500);
  };

  return (
    <>
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
          <h1 className="ml-4 text-lg font-semibold">Incentive Types</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4">
          {incentiveTypes.length === 0 ? (
            <div className="flex flex-1 h-full flex-col items-center justify-center p-6 text-center">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">No Incentive Types Added</h2>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Add Incentive Types to better categorize your incentives and make it easier to manage.
                </p>
              </div>
            </div>
          ) : (
             <div className="space-y-3">
              {incentiveTypes.map((incentive, index) => (
                <IncentiveTypeItem key={index} incentiveType={incentive} />
              ))}
            </div>
          )}
        </main>

        <footer className="sticky bottom-0 shrink-0 border-t bg-card p-4">
          <Button
            onClick={handleAddIncentiveType}
            className="w-full h-12 text-base bg-accent text-accent-foreground hover:bg-accent/90 rounded-full"
          >
            <Plus className="mr-2 h-5 w-5" />
            Add Incentive Type
          </Button>
        </footer>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="bottom" className="mx-auto w-full rounded-t-2xl p-0 sm:max-w-md">
          <SheetHeader className="p-4 flex flex-row items-center gap-2 border-b">
            <SheetClose asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
            </SheetClose>
            <SheetTitle className="text-lg font-semibold">Add Incentive Type</SheetTitle>
          </SheetHeader>
          <div className="p-6">
            <Label htmlFor="incentive-name">Incentive Type Name</Label>
            <Input
              id="incentive-name"
              value={incentiveName}
              onChange={(e) => setIncentiveName(e.target.value)}
              placeholder="eg. Performance Bonus"
              className="mt-1"
            />
          </div>
          <SheetFooter className="grid grid-cols-2 gap-4 p-4 pt-0">
            <SheetClose asChild>
                <Button variant="outline" className="h-11">
                    Cancel
                </Button>
            </SheetClose>
            <Button
              onClick={handleSave}
              disabled={isSaving || !incentiveName.trim()}
              className="h-11 bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
