'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/store/useUserStore';
import { createTransaction } from '@/app/actions/transaction.actions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Rocket, ShieldCheck, Zap, Loader2, ArrowLeft } from 'lucide-react';

export default function UpgradePage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { upgradePlan, plan } = useUserStore();
  const router = useRouter();

  const handleMockRazorpayPayment = async () => {
    setIsProcessing(true);
    // Simulate Razorpay SDK overlay delay
    setTimeout(async () => {
      try {
        // Trigger actual backend upgrades
        await upgradePlan();
        await createTransaction(10.00, 'SUCCESS', 'msg_' + crypto.randomUUID().split('-')[0]);
        
        setIsSuccess(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 3000);
      } catch (error) {
        console.error('Payment failed', error);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  if (plan === 'PRO') {
    return (
      <div className="min-h-screen flex items-center justify-center -mt-10">
        <div className="text-center space-y-4 max-w-md px-4">
          <ShieldCheck className="w-16 h-16 text-emerald-500 mx-auto" />
          <h2 className="text-2xl font-serif">You&apos;re already a Pro!</h2>
          <p className="text-muted-foreground">Thank you for your active subscription. You already have access to all premium features.</p>
          <Button variant="outline" onClick={() => router.push('/dashboard')} className="mt-4">
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center -mt-10">
        <div className="text-center space-y-6 max-w-md px-4 animate-in fade-in zoom-in duration-500">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto">
            <Check className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-serif font-bold">Payment Successful!</h2>
          <p className="text-muted-foreground">Welcome to BitBrief Pro. Redirecting you to your upgraded dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 lg:py-16 max-w-5xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-4">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </Button>

      <div className="text-center mb-12 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight">Level up your crypto research.</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Stop guessing and start analyzing with our AI-driven insights, limitless tracking, and unrestricted intelligence suite.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
        
        <Card className="border-primary/20 bg-card overflow-hidden shadow-2xl relative order-2 lg:order-1">
          <div className="absolute top-0 right-0 p-4">
            <ShieldCheck className="w-6 h-6 text-emerald-500/50" />
          </div>
          <CardContent className="p-8 sm:p-10">
            <h3 className="text-2xl font-bold mb-2">Pro Tier</h3>
            <p className="text-muted-foreground mb-6">Everything you need to dominate the market.</p>
            
            <div className="flex items-baseline gap-2 mb-8 border-b border-border/50 pb-8">
              <span className="text-5xl font-bold font-serif">$10</span>
              <span className="text-muted-foreground font-medium">/ month</span>
            </div>

            <ul className="space-y-4 mb-8">
              {[
                'Track up to 10 distinct cryptocurrencies',
                'Unlimited active price alerts',
                'Advanced AI Predictive Market Insights',
                'Priority email & ticket support',
                'Early access to new indicators'
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="font-medium text-foreground/90">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              size="lg" 
              className="w-full text-lg h-14 bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20"
              onClick={handleMockRazorpayPayment}
              disabled={isProcessing}
            >
              {isProcessing ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Zap className="w-5 h-5 mr-2" />}
              {isProcessing ? 'Processing secure payment...' : 'Checkout with Razorpay'}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-4 flex justify-center items-center gap-1">
               Test Mode <span className="text-xs opacity-50">(Stripe/Razorpay SDK Ready)</span>
            </p>
          </CardContent>
        </Card>

        <div className="space-y-6 order-1 lg:order-2 px-4 lg:px-8">
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center gap-2"><Rocket className="w-5 h-5 text-amber-500" /> Unlock Potential</h3>
            <p className="text-muted-foreground leading-relaxed">Free users miss critical market movements due to restricted alert triggers. The Pro tier enforces zero limits.</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold flex items-center gap-2"><Zap className="w-5 h-5 text-amber-500" /> Instant Triggers</h3>
            <p className="text-muted-foreground leading-relaxed">Receive SMS/Email routing globally when your targets hit. Pro users get sub-second prioritization over standard polling pools.</p>
          </div>
        </div>

      </div>
    </div>
  );
}
