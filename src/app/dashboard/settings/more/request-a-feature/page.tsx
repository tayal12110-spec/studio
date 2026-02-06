'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Icons } from '@/components/icons';

const FormCard = ({
  title,
  children,
  required = false,
}: {
  title: string;
  children: React.ReactNode;
  required?: boolean;
}) => (
  <Card>
    <CardContent className="p-4 space-y-2">
      <Label>
        {title}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {children}
    </CardContent>
  </Card>
);

export default function RequestFeaturePage() {
  const router = useRouter();
  const { toast } = useToast();

  const [featureRequest, setFeatureRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!featureRequest.trim()) {
      toast({
        variant: 'destructive',
        title: 'Feature request is required.',
      });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      toast({
        title: 'Feature Request Submitted',
        description: 'Thank you for your feedback!',
      });
      setIsSubmitting(false);
      router.back();
    }, 1000);
  };

  const clearForm = () => {
    setFeatureRequest('');
  };

  return (
    <div className="flex h-full min-h-screen flex-col bg-[#f0ebf8] dark:bg-background">
      <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Go back"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Request Feature</h1>
      </header>

      <form onSubmit={handleSubmit}>
        <main className="flex-1 space-y-4 p-4">
          <Card className="overflow-hidden">
            <div className="h-2.5 bg-purple-600"></div>
            <CardContent className="p-4">
              <h2 className="text-2xl font-bold">Request a Feature</h2>
              <p className="mt-2 text-muted-foreground">
                Customise the App. Tell us what features you would like to see.
              </p>
              <hr className="my-4" />
              <p className="text-sm">
                <Link href="#" className="text-blue-600 hover:underline">
                  Sign in to Google
                </Link>{' '}
                to save your progress.{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Learn more
                </Link>
              </p>
              <p className="mt-4 text-sm text-destructive">
                * Indicates required question
              </p>
            </CardContent>
          </Card>

          <FormCard title="Company Code" required>
            <Input value="ULEHLB" readOnly className="border-0 bg-transparent px-0" />
          </FormCard>

          <FormCard title="SalaryBox Identifier">
            <Input value="SBMDEVXUIF" readOnly className="border-0 bg-transparent px-0" />
          </FormCard>

          <FormCard title="Platform">
            <Input value="Android" readOnly className="border-0 bg-transparent px-0" />
          </FormCard>

          <FormCard title="Please share your feature request in detail">
            <Textarea
              value={featureRequest}
              onChange={(e) => setFeatureRequest(e.target.value)}
              placeholder="Your answer"
              className="bg-transparent"
            />
          </FormCard>

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit
            </Button>
            <Button type="button" variant="link" className="text-purple-600" onClick={clearForm}>
              Clear form
            </Button>
          </div>
          
           <div className="pt-8 text-center text-xs text-muted-foreground space-y-4">
                <p>Never submit passwords through Google Forms.</p>
                <p>
                    This form was created inside SalaryBox.
                    <br />
                    Does this form look suspicious?{' '}
                    <Link href="#" className="underline">Report</Link>
                </p>
                <div className="flex items-center justify-center gap-1 text-2xl font-semibold">
                    <Icons.logo className="h-6 w-6 text-muted-foreground" /> Google Forms
                </div>
            </div>
        </main>
      </form>
    </div>
  );
}
