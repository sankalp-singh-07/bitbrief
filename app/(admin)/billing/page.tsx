'use client';

import { useEffect, useState } from 'react';
import { getTransactions } from '@/app/actions/transaction.actions';
import { useUserStore } from '@/store/useUserStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Rocket, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface TransactionData {
  _id: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentId?: string;
}

export default function BillingPage() {
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(true);
  const { plan, subscriptionStart, subscriptionExpiry } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    getTransactions().then(data => {
      setTransactions(data);
      setLoading(false);
    }).catch(console.error);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 pl-2">
        <h1 className="text-4xl font-bold font-serif mb-2 flex items-center gap-3">
          <CreditCard className="w-8 h-8" /> Billing Settings
        </h1>
        <p className="text-lg text-muted-foreground dark:text-gray-300">Manage your subscription plan and view payment history.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="md:col-span-2 bg-gradient-to-br from-card to-muted/20 border-border/60 shadow-lg">
          <CardContent className="p-8">
            <h3 className="text-lg font-medium text-muted-foreground mb-2">Current Plan</h3>
            <div className="flex items-end gap-4 mb-6">
              <span className="text-5xl font-bold font-serif tracking-tight">{plan === 'PRO' ? 'Pro' : 'Free'} Tier</span>
              {plan === 'PRO' && <Badge className="mb-2 bg-amber-500 text-black hover:bg-amber-600 font-semibold">Active</Badge>}
            </div>
            {plan === 'FREE' ? (
              <p className="text-muted-foreground mb-6 max-w-md">You are currently on the Free Tier. Upgrade to Pro to track up to 10 coins, unlock unlimited alerts, and access AI Predictive Insights.</p>
            ) : (
              <p className="text-muted-foreground mb-6 max-w-md">Thank you for being a Pro member! You have full access to all BitBrief predictive analytics and unlimited tracking caps.</p>
            )}
            
            {plan === 'PRO' && subscriptionExpiry && (
              <div className="mt-6 pt-6 border-t border-border/50 space-y-3 text-sm">
                <div className="flex flex-col sm:flex-row sm:justify-between max-w-md gap-1 sm:gap-4 text-muted-foreground">
                  <span>Subscription Period:</span>
                  <span className="font-semibold text-foreground">
                    {subscriptionStart ? new Date(subscriptionStart).toLocaleDateString() : 'N/A'} &mdash; {new Date(subscriptionExpiry).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row sm:justify-between max-w-md gap-1 sm:gap-4 text-muted-foreground">
                  <span>Status:</span>
                  <span className="font-semibold text-emerald-500 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Active (3 Months Pass)
                  </span>
                </div>
              </div>
            )}

            {plan === 'FREE' && subscriptionExpiry && (
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm max-w-md space-y-1">
                <p className="font-semibold text-amber-600 dark:text-amber-400">Subscription Expired</p>
                <p className="text-muted-foreground text-xs">
                  Your Pro subscription expired on {new Date(subscriptionExpiry).toLocaleDateString()}. You have been returned to the Free Tier.
                </p>
              </div>
            )}

            {plan === 'FREE' && (
              <Button size="lg" onClick={() => router.push('/upgrade')} className="bg-primary text-primary-foreground font-medium px-8 w-full sm:w-auto">
                <Rocket className="w-4 h-4 mr-2" /> Upgrade to Pro
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <h3 className="text-2xl font-serif mb-4 pl-2">Transaction History</h3>
      {loading ? (
        <div className="p-8 text-center text-muted-foreground">Loading history...</div>
      ) : transactions.length === 0 ? (
        <Card className="p-12 text-center bg-muted/20 border-dashed">
          <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-medium mb-2">No transactions yet</h3>
          <p className="text-muted-foreground">Your billing history will appear here once you upgrade.</p>
        </Card>
      ) : (
        <div className="bg-card rounded-xl border overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border/50">
              <tr>
                <th className="font-medium p-4">Date</th>
                <th className="font-medium p-4">Amount</th>
                <th className="font-medium p-4">Status</th>
                <th className="font-medium p-4 text-right">Payment ID</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((trx) => (
                <tr key={trx._id} className="border-b border-border/30 hover:bg-muted/30 transition-colors last:border-0">
                  <td className="p-4">{new Date(trx.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">${trx.amount.toFixed(2)}</td>
                  <td className="p-4">
                    {trx.status === 'SUCCESS' ? (
                      <span className="flex items-center gap-1 text-emerald-500 font-medium">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    ) : (
                      <span className="text-muted-foreground">{trx.status}</span>
                    )}
                  </td>
                  <td className="p-4 text-right font-mono text-muted-foreground text-xs">{trx.paymentId || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
