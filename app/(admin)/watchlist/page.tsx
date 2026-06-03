'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, TrendingUp } from 'lucide-react';
import { useWatchlist } from '@/hooks/use-watchlist';
import { CoinsData } from '@/lib/getcoins';
import { getCoinsData } from '@/app/actions/coins.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import WatchlistCard from '@/components/watchlist-components/watchlist-card';
import AlertModal from '@/components/watchlist-components/alert-modal';
import { useUserStore } from '@/store/useUserStore';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function WatchlistPage() {
	const { watchlist, isLoaded, addCoin, removeCoin, addAlert } = useWatchlist();
	const [coinsData, setCoinsData] = useState<CoinsData>({ availableCoins: [], trendingCoins: [] });
	const [searchQuery, setSearchQuery] = useState('');
	const [alertCoinId, setAlertCoinId] = useState<string | null>(null);
	
	const { plan } = useUserStore();
	const router = useRouter();
	const isProUser = plan === 'PRO';
	const maxCoins = isProUser ? 10 : 3;

	useEffect(() => {
		getCoinsData().then(setCoinsData).catch(console.error);
	}, []);

	const filteredAvailableCoins = coinsData.availableCoins
		.filter(c => !watchlist.some(w => w.coinId === c.value))
		.filter(c => c.label.toLowerCase().includes(searchQuery.toLowerCase()));

	const handleAddCoin = (coinId: string, price: number) => {
		if (watchlist.length >= maxCoins) return;
		addCoin(coinId, price);
		setSearchQuery('');
	};

	if (!isLoaded) {
		return (
			<div className="container mx-auto px-4 py-8 max-w-7xl space-y-10 animate-pulse">
				<div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
					<div className="space-y-3">
						<Skeleton className="h-12 w-64 rounded-lg" />
						<Skeleton className="h-6 w-48 rounded-lg" />
					</div>
					<Skeleton className="h-20 w-80 rounded-2xl" />
				</div>
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{[1, 2, 3].map(i => (
						<div key={i} className="border border-border/40 p-6 rounded-2xl bg-card space-y-6">
							<div className="flex gap-3 items-center">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="space-y-2 flex-1">
									<Skeleton className="h-5 w-24 rounded" />
									<Skeleton className="h-4 w-12 rounded" />
								</div>
							</div>
							<div className="space-y-2">
								<Skeleton className="h-4 w-28 rounded" />
								<Skeleton className="h-10 w-48 rounded" />
							</div>
							<Skeleton className="h-16 w-full rounded-lg" />
							<div className="grid grid-cols-2 gap-4">
								<Skeleton className="h-10 w-full rounded" />
								<Skeleton className="h-10 w-full rounded" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-7xl animate-in fade-in duration-500">
			{/* Top Header Section */}
			<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-6">
				<div>
					<h1 className="text-4xl sm:text-5xl font-bold font-serif mb-3 tracking-tight">Intelligence Watchlist</h1>
					<p className="text-lg text-muted-foreground flex items-center gap-2">
						Track your assets with AI-precision. 
						<Badge variant={isProUser ? "default" : "secondary"} className="text-xs">
							{isProUser ? 'Pro Tier' : 'Free Tier'}
						</Badge>
					</p>
				</div>

				<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 bg-card/80 p-5 rounded-2xl border border-border shadow-xl backdrop-blur-md w-full md:max-w-md">
					<div className="flex-1 space-y-2">
						<div className="flex justify-between items-center text-sm">
							<span className="font-semibold text-foreground">Watchlist Capacity</span>
							<span className="font-bold text-primary">{watchlist.length} / {maxCoins} slots</span>
						</div>
						<div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/30">
							<div 
								className={`h-full rounded-full ${
									watchlist.length >= maxCoins 
										? 'bg-amber-500' 
										: watchlist.length / maxCoins > 0.7 
										? 'bg-amber-400' 
										: 'bg-primary'
								} transition-all duration-500`} 
								style={{ width: `${Math.min(100, (watchlist.length / maxCoins) * 100)}%` }}
							/>
						</div>
						<p className="text-xs text-muted-foreground">
							{isProUser 
								? 'Premium capacity active (10 coins max).' 
								: `${maxCoins - watchlist.length} of ${maxCoins} slots remaining. Upgrade to unlock 10 slots.`}
						</p>
					</div>
					{!isProUser && (
						<Button 
							size="sm" 
							variant="default" 
							className="bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-black font-semibold shadow-md transition-all self-center sm:self-auto shrink-0"
							onClick={() => router.push('/upgrade')}
						>
							Upgrade to Pro
						</Button>
					)}
				</div>
			</div>

			{/* Empty / Add State */}
			{watchlist.length === 0 ? (
				<div className="flex flex-col items-center justify-center p-12 sm:p-24 border border-dashed border-border/60 rounded-3xl bg-white/5 backdrop-blur-sm shadow-inner text-center">
					<div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
						<TrendingUp className="w-10 h-10 text-primary" />
					</div>
					<h2 className="text-3xl font-serif font-bold mb-4">Build Your Watchlist</h2>
					<p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
						Track coins, receive instant volatility alerts, and stay ahead of the market with personalized deep-learning insights.
					</p>
					
					<div className="w-full max-w-md relative">
						<Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
						<Input 
							placeholder="Search coins (e.g. Bitcoin)..." 
							className="pl-12 h-14 text-lg rounded-full bg-background/80 shadow-lg border-primary/20 focus-visible:ring-primary"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
						
						{searchQuery && (
							<div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-2xl overflow-y-auto max-h-64 z-50 overflow-x-hidden">
								{filteredAvailableCoins.length === 0 ? (
									<div className="p-4 text-center text-sm text-muted-foreground">No coins found matching &quot;{searchQuery}&quot;</div>
								) : (
									filteredAvailableCoins.map(coin => (
										<button 
											key={coin.value}
											className="w-full text-left px-4 py-3 hover:bg-muted flex justify-between items-center transition-colors"
											onClick={() => handleAddCoin(coin.value, coin.price)}
										>
											<span className="font-medium">{coin.label}</span>
											<span className="text-sm text-muted-foreground">${coin.price.toLocaleString()}</span>
										</button>
									))
								)}
							</div>
						)}
					</div>
				</div>
			) : (
				<>
					{/* Add Coin Bar (When populated) */}
					{watchlist.length < maxCoins && (
						<div className="mb-10 relative z-40 max-w-md">
							<div className="relative">
								<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
								<Input 
									placeholder="Add another coin to track..." 
									className="pl-10 rounded-full bg-background/50 border-white/10 focus-visible:ring-primary/50"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
								{searchQuery && (
									<div className="absolute top-full left-0 right-0 mt-2 bg-popover border shadow-xl rounded-xl z-50 overflow-y-auto max-h-60 overflow-x-hidden">
										{filteredAvailableCoins.length > 0 ? filteredAvailableCoins.map(coin => (
											<button 
												key={coin.value}
												className="w-full text-left px-4 py-3 hover:bg-muted flex items-center justify-between text-sm transition-colors border-b last:border-0 border-border/50"
												onClick={() => handleAddCoin(coin.value, coin.price)}
											>
												<span className="font-medium">{coin.label}</span>
												<div className="flex items-center gap-3">
													<span className="text-muted-foreground">${coin.price.toLocaleString()}</span>
													<Plus className="w-4 h-4 text-primary" />
												</div>
											</button>
										)) : (
											<div className="p-4 text-center text-sm text-muted-foreground">No matches found.</div>
										)}
									</div>
								)}
							</div>
						</div>
					)}

					{/* Populated Grid layout */}
					<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 relative z-10">
						{watchlist.map(item => {
							const coinData = coinsData.availableCoins.find(c => c.value === item.coinId);
							if (!coinData) return null; // Defensive check
							
							return (
								<WatchlistCard 
									key={item.coinId} 
									item={item} 
									coinData={coinData} 
									onRemove={removeCoin}
									onAddAlert={() => setAlertCoinId(item.coinId)}
									isProUser={isProUser}
								/>
							);
						})}
					</div>

					<AlertModal 
						isOpen={!!alertCoinId}
						onClose={() => setAlertCoinId(null)}
						coinId={alertCoinId}
						coinName={coinsData.availableCoins.find(c => c.value === alertCoinId)?.label}
						currentPrice={coinsData.availableCoins.find(c => c.value === alertCoinId)?.price}
						currentAlertCount={watchlist.find(w => w.coinId === alertCoinId)?.alerts.length || 0}
						isProUser={isProUser}
						onSave={(alert) => {
							if (alertCoinId) {
								addAlert(alertCoinId, alert);
							}
							setAlertCoinId(null);
						}}
					/>
				</>
			)}
		</div>
	);
}
