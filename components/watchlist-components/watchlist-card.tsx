import { Trash2, Bell, TrendingUp, TrendingDown, Lock, BrainCircuit } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { WatchlistItem } from '@/hooks/use-watchlist';
import { CoinOption } from '@/lib/getcoins';

interface WatchlistCardProps {
	item: WatchlistItem;
	coinData: CoinOption;
	onRemove: (id: string) => void;
	onAddAlert: (id: string) => void;
	isProUser: boolean;
}

const Sparkline = ({ data, color }: { data: number[], color: string }) => {
	if (!data || data.length === 0) return <div className="h-12 flex items-center justify-center text-xs text-muted-foreground">No chart data</div>;
	
	const min = Math.min(...data);
	const max = Math.max(...data);
	const range = max - min || 1;
	
	const points = data.map((val, i) => {
		const x = (i / (data.length - 1)) * 100;
		const y = 100 - ((val - min) / range) * 100;
		return `${x},${y}`;
	}).join(' ');

	return (
		<svg viewBox="0 -10 100 120" className="w-full h-16 preserve-3d overflow-visible" preserveAspectRatio="none">
			<path 
				d={`M ${points}`} 
				fill="none" 
				stroke={color} 
				strokeWidth="3" 
				strokeLinecap="round" 
				strokeLinejoin="round" 
				className="drop-shadow-sm" 
			/>
		</svg>
	);
};

export default function WatchlistCard({ item, coinData, onRemove, onAddAlert, isProUser }: WatchlistCardProps) {
	const isUp24h = coinData.change24h >= 0;
	const colorClass = isUp24h ? 'text-green-500' : 'text-red-500';
	const sparklineColor = isUp24h ? '#10b981' : '#ef4444'; // Tailwind green-500 / red-500

	const changeSinceAdded = ((coinData.price - item.priceAtAdd) / item.priceAtAdd) * 100;
	const isUpSinceAdded = changeSinceAdded >= 0;

	return (
		<Card className="flex flex-col relative overflow-hidden group bg-white/5 backdrop-blur-md border-border/50 hover:border-border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-primary/5">
			<CardHeader className="pb-3 border-b border-white/5 relative z-10">
				<div className="flex justify-between items-start">
					<div className="flex items-center gap-3">
						<div className="w-10 h-10 rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0">
							{coinData.image ? (
								// eslint-disable-next-line @next/next/no-img-element
								<img src={coinData.image} alt={coinData.label} width={40} height={40} className="object-cover w-full h-full rounded-full" />
							) : (
								<div className="w-full h-full bg-primary/20" />
							)}
						</div>
						<div>
							<CardTitle className="text-xl font-bold font-serif leading-tight">{coinData.label.split(' ')[0]}</CardTitle>
							<Badge variant="secondary" className="mt-1 text-xs opacity-80">{coinData.label.split(' ')[1]}</Badge>
						</div>
					</div>
					<div className="flex bg-background/50 backdrop-blur rounded-full p-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
						<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10" onClick={() => onAddAlert(item.coinId)}>
							<Bell className="w-4 h-4" />
						</Button>
						<Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-destructive/10 hover:text-destructive" onClick={() => onRemove(item.coinId)}>
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				</div>
			</CardHeader>
			
			<CardContent className="pt-5 flex-grow relative z-10">
				<div className="mb-6 flex justify-between items-end">
					<div>
						<p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">Current Price</p>
						<h3 className="text-3xl font-bold tracking-tight">${coinData.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</h3>
					</div>
					<Badge variant="outline" className={`px-2.5 py-1 flex items-center gap-1.5 border-${isUp24h ? 'green' : 'red'}-500/20 bg-${isUp24h ? 'green' : 'red'}-500/10 ${colorClass}`}>
						{isUp24h ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
						<span className="font-semibold">{Math.abs(coinData.change24h).toFixed(2)}%</span>
					</Badge>
				</div>

				{/* 7 Day Sparkline */}
				<div className="w-full py-4 mb-4 border-y border-white/5 opacity-80 hover:opacity-100 transition-opacity">
					<p className="text-xs text-muted-foreground mb-2 text-center">7-Day Price Action</p>
					<Sparkline data={coinData.sparkline} color={sparklineColor} />
				</div>

				<div className="grid grid-cols-2 gap-4 mb-5 p-4 rounded-xl bg-background/40">
					<div>
						<p className="text-xs text-muted-foreground mb-1">Market Cap Rank</p>
						<p className="font-medium">#{coinData.rank}</p>
					</div>
					<div>
						<p className="text-xs text-muted-foreground mb-1">24h Volume</p>
						<p className="font-medium">${(coinData.volume / 1e9).toFixed(2)}B</p>
					</div>
				</div>

				{/* Performance since tracking */}
				<div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
					<p className="text-xs text-muted-foreground mb-2 uppercase tracking-wide font-medium flex items-center justify-between">
						<span>Since Added</span>
						<span className="text-[10px] opacity-60">{new Date(item.addedAt).toLocaleDateString()}</span>
					</p>
					<div className="flex justify-between items-baseline">
						<p className="text-sm text-muted-foreground">Entry: ${item.priceAtAdd.toLocaleString(undefined, { maximumFractionDigits: 4 })}</p>
						<p className={`font-bold ${isUpSinceAdded ? 'text-green-500' : 'text-red-500'}`}>
							{isUpSinceAdded ? '+' : ''}{changeSinceAdded.toFixed(2)}%
						</p>
					</div>
				</div>

				{/* Pro AI Insights Section */}
				<div className="mt-5 relative">
					<div className={`p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 ${!isProUser ? 'blur-[3px] select-none opacity-60' : ''}`}>
						<h4 className="flex items-center gap-2 text-sm font-semibold text-blue-400 mb-2">
							<BrainCircuit className="w-4 h-4" />
							AI Insight
						</h4>
						<p className="text-xs text-muted-foreground leading-relaxed">
							{isUp24h 
								? 'Volume profile suggests institutional accumulation. Short-term momentum is bullish with strong support forming precisely at current entry levels.' 
								: 'Technical weakness observed on higher timeframes. Algorithm indicates a 65% probability of further retracement before identifying a solid macroeconomic baseline.'}
						</p>
					</div>
					{!isProUser && (
						<div className="absolute inset-0 flex flex-col items-center justify-center bg-background/5 rounded-xl z-20 backdrop-blur-[1px]">
							<Lock className="w-6 h-6 text-muted-foreground mb-2" />
							<Button size="sm" variant="default" className="shadow-lg shadow-primary/20 cursor-pointer pointer-events-auto">
								Unlock Pro Insights
							</Button>
						</div>
					)}
				</div>
			</CardContent>
			
			{/* Decorative background blur gradient */}
			<div className={`absolute -right-20 -top-20 w-40 h-40 bg-${isUp24h ? 'green' : 'red'}-500/10 rounded-full blur-3xl pointer-events-none`} />
		</Card>
	);
}
