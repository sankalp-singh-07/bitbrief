'use client';

import { useEffect, useState } from 'react';
import { getTransactions } from '@/app/actions/transaction.actions';
import { useUserStore } from '@/store/useUserStore';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CreditCard, Rocket, CheckCircle2, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function BillingPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { plan } = useUserStore();
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
              {plan === 'PRO' && <Badge className="mb-2 bg-amber-500 text-black hover:bg-amber-600">Active</Badge>}
            </div>
            {plan === 'FREE' ? (
              <p className="text-muted-foreground mb-6 max-w-md">You are currently on the Free Tier. Upgrade to Pro to track up to 10 coins, unlock unlimited alerts, and access AI Predictive Insights.</p>
            ) : (
              <p className="text-muted-foreground mb-6 max-w-md">Thank you for being a Pro member! You have full access to all BitBrief predictive analytics and unlimited tracking caps.</p>
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
