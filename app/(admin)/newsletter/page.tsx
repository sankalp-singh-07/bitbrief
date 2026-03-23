'use client';
import { useState, useEffect } from 'react';
import { FileText, Calendar, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNewsletters, NewsletterContent } from '@/hooks/use-newsletters';
import NewsletterPreview from '@/components/newsletter-components/newsletter-preview';
import { CoinsData, fetchCoinsDataCached } from '@/lib/getcoins';

export default function NewsletterHistory() {
	const { newsletters, isLoaded, deleteNewsletter } = useNewsletters();
	const [activeNewsletter, setActiveNewsletter] = useState<NewsletterContent | null>(null);
	const [coinsData, setCoinsData] = useState<CoinsData>({ availableCoins: [], trendingCoins: [] });

	useEffect(() => {
		fetchCoinsDataCached().then((data) => setCoinsData(data)).catch(console.warn);
	}, []);

	if (!isLoaded) return <div className="p-8 text-center text-muted-foreground">Loading history...</div>;

	if (activeNewsletter) {
		return (
			<div className="container mx-auto px-4 py-8">
				<Button variant="ghost" className="mb-6" onClick={() => setActiveNewsletter(null)}>
					← Back to History
				</Button>
				<NewsletterPreview 
					content={activeNewsletter} 
					onClose={() => setActiveNewsletter(null)} 
					availableCoins={coinsData.availableCoins} 
				/>
			</div>
		);
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="mb-8">
				<h1 className="text-4xl font-bold font-serif mb-2">My Newsletters</h1>
				<p className="text-lg text-muted-foreground dark:text-gray-300">Review and download your previously generated market reports.</p>
			</div>

			{newsletters.length === 0 ? (
				<Card className="p-12 text-center bg-muted/20 border-dashed">
					<FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<h3 className="text-xl font-semibold mb-2">No newsletters yet</h3>
					<p className="text-muted-foreground">Head to the dashboard to generate your first curated market report based on your selected coins.</p>
				</Card>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{newsletters.map((nl) => (
						<Card key={nl.id} className="flex flex-col hover:border-primary/50 transition-colors">
							<CardHeader className="pb-4">
								<div className="flex justify-between items-start">
									<Badge variant="outline" className="flex items-center gap-1 font-normal">
										<Calendar className="w-3 h-3" />
										{nl.date}
									</Badge>
									<Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteNewsletter(nl.id)}>
										<Trash2 className="w-4 h-4" />
									</Button>
								</div>
								<CardTitle className="text-xl font-serif mt-4">{nl.title}</CardTitle>
								<p className="text-sm text-muted-foreground font-medium">Issue #{nl.id.substring(0, 5).toUpperCase()}</p>
							</CardHeader>
							<CardContent className="flex-grow">
								<div className="flex flex-wrap gap-2 mt-2">
									{nl.selectedCoins.map(coinId => {
										const coinLabel = coinsData.availableCoins.find(c => c.value === coinId)?.label || coinId;
										return <Badge key={coinId} variant="secondary" className="text-xs text-black">{coinLabel.split(' ')[0]}</Badge>
									})}
								</div>
							</CardContent>
							<CardFooter className="pt-4 border-t border-gray-100 dark:border-gray-800">
								<Button className="w-full" onClick={() => setActiveNewsletter(nl)}>
									Read Report
								</Button>
							</CardFooter>
						</Card>
					))}
				</div>
			)}
		</div>
	);
}
