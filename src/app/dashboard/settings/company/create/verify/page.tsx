'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function VerifyCompanyComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const phone = searchParams.get('phone') || '+91 - 9205561904';

  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [timer, setTimer] = useState(56);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOtpSentDialog, setShowOtpSentDialog] = useState(true);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
      inputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length <= 1) {
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };
  
  const handleResendOtp = () => {
      if (timer === 0) {
          setTimer(59);
          setShowOtpSentDialog(true);
          toast({ title: 'OTP Resent', description: 'A new OTP has been sent to your number.' });
      }
  };

  const handleContinue = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Please enter a 6-digit OTP.',
      });
      return;
    }
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Company Created!',
        description: 'Your new company has been successfully created.',
      });
      router.push('/dashboard/settings');
    }, 1000);
  };
  
  const formattedTimer = `00:${timer.toString().padStart(2, '0')}`;

  return (
    <>
      <div className="flex h-full min-h-screen flex-col bg-slate-100 dark:bg-slate-900 text-foreground">
        <header className="flex h-16 shrink-0 items-center px-4">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Go back"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </header>

        <main className="flex flex-1 flex-col p-6">
          <div className="mx-auto max-w-sm text-center">
            <h1 className="text-2xl">Enter OTP sent to</h1>
            <p className="text-2xl font-semibold mt-1">{phone}</p>
          </div>

          <div className="flex justify-center gap-2 md:gap-3 my-8">
            {otp.map((digit, index) => (
              <Input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="tel"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="h-12 w-10 border-0 border-b-2 border-gray-400 bg-transparent rounded-none text-center text-2xl focus:ring-0 focus:border-primary"
              />
            ))}
          </div>
          
          <div className="flex justify-between items-center text-sm max-w-sm mx-auto w-full">
            <Button variant="link" onClick={handleResendOtp} disabled={timer > 0} className="text-muted-foreground hover:text-primary p-0">
              Resend OTP
            </Button>
            <span className="text-muted-foreground">{formattedTimer}</span>
          </div>

        </main>
        <footer className="sticky bottom-0 p-4">
            <Button
              onClick={handleContinue}
              disabled={isSubmitting || otp.join('').length < 6}
              className="w-full h-12 text-base bg-[#165E49] hover:bg-[#114e3b] text-white"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Continue
              <ArrowLeft className="h-5 w-5 rotate-180 ml-2" />
            </Button>
        </footer>
      </div>
      
      <AlertDialog open={showOtpSentDialog} onOpenChange={setShowOtpSentDialog}>
        <AlertDialogContent className="sm:max-w-xs text-center">
          <AlertDialogHeader>
            <AlertDialogTitle>OTP Sent</AlertDialogTitle>
            <AlertDialogDescription>
              OTP sent via WhatsApp. For this prototype, please use the OTP: 123456.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowOtpSentDialog(false)} className="w-full bg-cyan-400 hover:bg-cyan-500 text-black">
              Okay
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export default function VerifyCompanyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VerifyCompanyComponent />
        </Suspense>
    )
}
