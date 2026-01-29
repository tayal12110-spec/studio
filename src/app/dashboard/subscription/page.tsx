'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';


const plans = [
    {
        name: 'Starter',
        price: '$49',
        description: 'For small teams just getting started.',
        features: ['Up to 10 employees', 'Basic payroll processing', 'Standard reporting', 'Email support'],
        isCurrent: false,
    },
    {
        name: 'Professional',
        price: '$99',
        description: 'For growing businesses that need more power.',
        features: ['Up to 50 employees', 'Advanced payroll features', 'Custom reporting', 'Priority email support', 'Tax calculation'],
        isCurrent: true,
        isFeatured: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        description: 'For large organizations with complex needs.',
        features: ['Unlimited employees', 'Dedicated account manager', 'API access', '24/7 phone support', 'Custom integrations'],
        isCurrent: false,
    }
];

export default function SubscriptionPage() {
    const { toast } = useToast();
    const router = useRouter();

    const handleChoosePlan = (planName: string) => {
        toast({
            title: 'Redirecting to checkout...',
            description: `You have selected the ${planName} plan.`,
        });
        // In a real app, you would redirect to Razorpay here.
    };

    return (
    <div className="flex flex-col">
       <header className="flex h-16 shrink-0 items-center border-b bg-card px-4">
        <Button variant="ghost" size="icon" aria-label="Go back" onClick={() => router.back()}>
            <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="ml-4 text-lg font-semibold">Subscriptions & Billing</h1>
      </header>
      <main className="flex-1 p-4 md:p-6">
        <div className="text-center mb-12">
            <h2 className="font-headline text-3xl font-bold tracking-tight">Simple, Transparent Pricing</h2>
            <p className="text-muted-foreground mt-2">Choose the plan that's right for your business.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => (
                <Card key={plan.name} className={`flex flex-col ${plan.isFeatured ? 'border-primary ring-2 ring-primary' : ''}`}>
                    <CardHeader>
                        <CardTitle className='font-headline'>{plan.name}</CardTitle>
                        <CardDescription>{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className='flex-grow'>
                        <div className="mb-6">
                            <span className="text-4xl font-bold">{plan.price}</span>
                            <span className="text-muted-foreground">{plan.price.startsWith('$') ? '/month' : ''}</span>
                        </div>
                        <ul className="space-y-3">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center">
                                    <Check className="h-4 w-4 mr-2 text-primary" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full"
                            variant={plan.isCurrent ? 'outline' : 'default'}
                            onClick={() => handleChoosePlan(plan.name)}
                            disabled={plan.isCurrent}
                        >
                            {plan.isCurrent ? 'Current Plan' : 'Choose Plan'}
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
      </main>
    </div>
    );
}
