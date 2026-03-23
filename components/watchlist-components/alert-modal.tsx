'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Target, TrendingUp, TrendingDown, Lock } from 'lucide-react';
import { AlertType } from '@/hooks/use-watchlist';

interface AlertModalProps {
	isOpen: boolean;
	onClose: () => void;
	coinId: string | null;
	coinName?: string;
	currentPrice?: number;
	currentAlertCount: number;
	isProUser: boolean;
	onSave: (alert: { targetPrice: number; type: AlertType }) => void;
}

export default function AlertModal({ isOpen, onClose, coinName, currentPrice, currentAlertCount, isProUser, onSave }: AlertModalProps) {
	const [targetPrice, setTargetPrice] = useState<string>('');
	const [type, setType] = useState<AlertType>('above');
	
	const maxAlerts = isProUser ? Infinity : 2;
	const isLimitReached = !isProUser && currentAlertCount >= maxAlerts;

	const handleSave = () => {
		const price = parseFloat(targetPrice);
		if (isNaN(price) || price <= 0) return;
		onSave({ targetPrice: price, type });
		setTargetPrice('');
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent className="sm:max-w-[425px] bg-background border-border">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2 font-serif text-2xl">
						<Target className="w-5 h-5 text-primary" />
						Set Price Alert
					</DialogTitle>
					<DialogDescription>
						Get notified when {coinName?.split(' ')[0] || 'this coin'} crosses your target price.
					</DialogDescription>
				</DialogHeader>

				<div className="py-6 space-y-6">
					{isLimitReached ? (
						<div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-center space-y-3">
							<Lock className="w-8 h-8 text-destructive mx-auto" />
							<h4 className="font-semibold text-destructive">Alert Limit Reached</h4>
							<p className="text-sm text-muted-foreground">
								Free users can only set {maxAlerts} alerts per coin. Upgrade to Pro for unlimited alerts and advanced triggers.
							</p>
							<Button className="w-full mt-2" variant="default">Upgrade to Pro</Button>
						</div>
					) : (
						<>
							<div className="space-y-3">
								<label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Trigger Type</label>
								<div className="grid grid-cols-2 gap-3">
									<Button 
										variant={type === 'above' ? 'default' : 'outline'} 
										className={`h-12 border-2 ${type === 'above' ? 'border-primary' : 'border-border'} transition-all`}
										onClick={() => setType('above')}
									>
										<TrendingUp className="w-4 h-4 mr-2" />
										Price goes above
									</Button>
									<Button 
										variant={type === 'below' ? 'default' : 'outline'} 
										className={`h-12 border-2 ${type === 'below' ? 'border-primary' : 'border-border'} transition-all`}
										onClick={() => setType('below')}
									>
										<TrendingDown className="w-4 h-4 mr-2" />
										Price goes below
									</Button>
								</div>
							</div>

							<div className="space-y-3">
								<div className="flex justify-between items-center">
									<label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Target Price ($)</label>
									{currentPrice && (
										<span className="text-xs text-muted-foreground">Current: ${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 6 })}</span>
									)}
								</div>
								<div className="relative">
									<span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
									<Input 
										type="number" 
										step="any"
										placeholder="0.00" 
										className="pl-8 h-12 text-lg font-medium bg-background/50 focus-visible:ring-primary/50"
										value={targetPrice}
										onChange={(e) => setTargetPrice(e.target.value)}
									/>
								</div>
							</div>
						</>
					)}
				</div>

				{!isLimitReached && (
					<DialogFooter>
						<Button variant="ghost" onClick={onClose}>Cancel</Button>
						<Button onClick={handleSave} disabled={!targetPrice || parseFloat(targetPrice) <= 0}>
							Create Alert
						</Button>
					</DialogFooter>
				)}
			</DialogContent>
		</Dialog>
	);
}
