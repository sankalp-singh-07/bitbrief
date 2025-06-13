'use client';
import { useState } from 'react';
import { TrendingUp, Sparkles, X, Download, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import SelectCoins from '@/components/dashboard-components/selectCoins';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

const availableCoins = [
	{ value: 'bitcoin', label: 'Bitcoin (BTC)' },
	{ value: 'ethereum', label: 'Ethereum (ETH)' },
	{ value: 'dogecoin', label: 'Dogecoin (DOGE)' },
	{ value: 'cardano', label: 'Cardano (ADA)' },
	{ value: 'solana', label: 'Solana (SOL)' },
	{ value: 'polkadot', label: 'Polkadot (DOT)' },
	{ value: 'chainlink', label: 'Chainlink (LINK)' },
	{ value: 'litecoin', label: 'Litecoin (LTC)' },
	{ value: 'polygon', label: 'Polygon (MATIC)' },
	{ value: 'avalanche', label: 'Avalanche (AVAX)' },
];

const trendingCoins = ['bitcoin', 'ethereum', 'dogecoin', 'cardano', 'solana'];

const DUMMY_USER_DATA = {
	email: 'user@example.com',
};

const DUMMY_NEWSLETTER_CONTENT = {
	title: 'Weekly Crypto Insights',
	date: 'June 13, 2025',
	subtitle: 'Market Analysis & Price Movements',
	mainStory: {
		headline: 'Cryptocurrency Markets Show Strong Momentum This Week',
		content:
			'Bitcoin leads the charge as institutional adoption continues to drive market sentiment. Technical indicators suggest bullish momentum across major altcoins with increased trading volumes and positive whale activity.',
	},
	articles: [
		{
			title: 'Bitcoin Breaks Key Resistance',
			content:
				'BTC successfully broke through the $45,000 resistance level with strong volume support. Market analysts predict potential continuation to $50,000 if current momentum maintains.',
		},
		{
			title: 'Ethereum Network Updates',
			content:
				'Recent protocol improvements show promising scalability enhancements. Network activity has increased 25% week-over-week with reduced gas fees attracting more developers.',
		},
		{
			title: 'Altcoin Season Indicators',
			content:
				'Several altcoins are showing signs of outperforming Bitcoin. Market dominance shifts suggest a potential altcoin rally in the coming weeks.',
		},
	],
	quickStats: [
		{ metric: 'Total Market Cap', value: '$2.1T', change: '+3.2%' },
		{ metric: 'Bitcoin Dominance', value: '42.5%', change: '-1.1%' },
		{ metric: 'Fear & Greed Index', value: '68', change: 'Greed' },
	],
};

type NewsletterPreviewProps = {
	coins: string[];
	onClose: () => void;
};

const NewsletterPreview = ({ coins, onClose }: NewsletterPreviewProps) => {
	const downloadPDF = () => {
		console.log('Downloading PDF for coins:', coins);
		alert('PDF download would start here!');
	};

	const sendEmail = () => {
		console.log('Sending email to:', DUMMY_USER_DATA.email);
		alert(`Newsletter would be sent to ${DUMMY_USER_DATA.email}!`);
	};

	return (
		<Card className="w-full max-w-5xl mx-auto">
			<CardHeader className="border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<div className="text-center">
							<CardTitle className="text-4xl font-bold font-serif mb-2">
								BitBrief
							</CardTitle>
							<p className="text-sm text-gray-500 uppercase tracking-wide">
								{DUMMY_NEWSLETTER_CONTENT.date} • Issue #247
							</p>
							<p className="text-lg font-medium mt-1">
								{DUMMY_NEWSLETTER_CONTENT.subtitle}
							</p>
						</div>
					</div>
					<Button
						variant="ghost"
						size="icon"
						onClick={onClose}
						className="shrink-0"
					>
						<X className="w-5 h-5" />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="p-8">
				<div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
					<h1 className="text-3xl font-bold font-serif leading-tight mb-3">
						{DUMMY_NEWSLETTER_CONTENT.mainStory.headline}
					</h1>
					<p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
						{DUMMY_NEWSLETTER_CONTENT.mainStory.content}
					</p>
				</div>

				<div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
					<h2 className="text-xl font-bold font-serif mb-4 text-center">
						Your Portfolio Analysis
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{coins.map((coinValue) => {
							const coin = availableCoins.find(
								(c) => c.value === coinValue
							);
							return (
								<div
									key={coinValue}
									className="bg-white dark:bg-gray-900 p-4 rounded"
								>
									<h3 className="font-semibold text-lg">
										{coin?.label}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Detailed analysis included in this
										week's report
									</p>
								</div>
							);
						})}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
					{DUMMY_NEWSLETTER_CONTENT.articles.map((article, index) => (
						<div key={index} className="space-y-3">
							<h3 className="text-xl font-bold font-serif border-b border-gray-200 dark:border-gray-700 pb-2">
								{article.title}
							</h3>
							<p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
								{article.content}
							</p>
						</div>
					))}
				</div>

				<div className="border-2 border-gray-300 dark:border-gray-600 p-6 mb-6">
					<h2 className="text-xl font-bold font-serif text-center mb-4">
						Market Statistics
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						{DUMMY_NEWSLETTER_CONTENT.quickStats.map(
							(stat, index) => (
								<div key={index} className="text-center">
									<h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500">
										{stat.metric}
									</h4>
									<p className="text-2xl font-bold mt-1">
										{stat.value}
									</p>
									<p className="text-sm text-green-600 dark:text-green-400">
										{stat.change}
									</p>
								</div>
							)
						)}
					</div>
				</div>

				<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
					<p className="text-center text-xs text-gray-500 mb-4">
						This newsletter was generated for your selected
						cryptocurrencies: {coins.join(', ')}
					</p>

					<div className="flex flex-col sm:flex-row gap-3 justify-center">
						<Button
							onClick={downloadPDF}
							className="flex items-center gap-2 px-6"
						>
							<Download className="w-4 h-4" />
							Download PDF
						</Button>
						<Button
							variant="outline"
							onClick={sendEmail}
							className="flex items-center gap-2 px-6"
						>
							<Mail className="w-4 h-4" />
							Send to Email
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

const Dashboard = () => {
	const [selectedCoins, setSelectedCoins] = useState<string[]>([]);
	const [showNewsletter, setShowNewsletter] = useState(false);
	const [isProUser] = useState(false);

	console.log(selectedCoins);

	const maxCoins = isProUser ? 10 : 3;

	const handleGenerateNewsletter = () => {
		console.log('Generating newsletter for selected coins:', selectedCoins);
		setShowNewsletter(true);
	};

	const handleTrendingCoinClick = (coin: string) => {
		if (!selectedCoins.includes(coin) && selectedCoins.length < maxCoins) {
			setSelectedCoins([...selectedCoins, coin]);
		}
	};

	return (
		<div
			className={`min-h-screen ${
				!showNewsletter ? 'flex items-center justify-center' : ''
			}`}
		>
			<div className="container mx-auto px-4 py-8 max-w-6xl">
				<div
					className={`text-center ${
						!showNewsletter ? 'space-y-8' : 'space-y-8'
					}`}
				>
					<div className="space-y-4">
						<h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground">
							Welcome to BitBrief
						</h1>
						<p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
							Pick coins, view summaries, and download reports —
							all in one place. Get AI-powered insights for
							smarter crypto decisions.
						</p>
					</div>

					<div className="w-full max-w-4xl mx-auto border-2 px-4 py-6 sm:py-8 border-foreground/50 rounded-2xl bg-foreground/5 space-y-6">
						<div className="flex flex-col sm:flex-row sm:gap-3 sm:justify-center sm:items-center space-y-4 sm:space-y-0">
							<h1 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
								Select your research coins:
							</h1>
							<div className="flex justify-center">
								<SelectCoins
									availableCoins={availableCoins}
									selectedCoins={selectedCoins}
									onSelectCoins={setSelectedCoins}
									maxCoins={maxCoins}
								/>
							</div>
						</div>

						{selectedCoins.length > 0 && (
							<div className="space-y-3">
								<h4 className="text-sm font-medium text-center">
									Selected Coins:
								</h4>
								<div className="flex justify-center">
									<div className="flex flex-wrap gap-2 justify-center max-w-lg">
										{selectedCoins.map((coin) => {
											const coinLabel =
												availableCoins.find(
													(c) => c.value === coin
												)?.label || coin;
											return (
												<Badge
													key={coin}
													variant="default"
													className="text-sm flex items-center gap-2"
												>
													{coinLabel}
													<button
														className="ml-1 text-xs hover:text-red-500"
														onClick={() =>
															setSelectedCoins(
																selectedCoins.filter(
																	(item) =>
																		item !==
																		coin
																)
															)
														}
													>
														×
													</button>
												</Badge>
											);
										})}
									</div>
								</div>
							</div>
						)}

						<div className="space-y-3">
							<div className="flex flex-col sm:flex-row sm:justify-center sm:items-center sm:gap-4 space-y-2 sm:space-y-0">
								<h4 className="text-sm flex items-center justify-center gap-1">
									<TrendingUp className="w-4 h-4" />
									Trending:
								</h4>
								<div className="flex flex-wrap gap-2 justify-center">
									{trendingCoins.map((coin) => (
										<Badge
											key={coin}
											variant="outline"
											className="px-2 py-1 text-sm capitalize text-foreground font-light cursor-pointer hover:bg-foreground hover:text-background transition-colors"
											onClick={() =>
												handleTrendingCoinClick(coin)
											}
										>
											{coin}
										</Badge>
									))}
								</div>
							</div>
						</div>
					</div>

					{selectedCoins.length > 0 && !showNewsletter && (
						<div className="flex justify-center">
							<Button
								variant="default"
								size="lg"
								className="text-white px-6 sm:px-8 py-3 text-base sm:text-lg dark:text-black cursor-pointer"
								onClick={handleGenerateNewsletter}
							>
								<Sparkles className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
								Generate Newsletter
							</Button>
						</div>
					)}

					{showNewsletter && (
						<NewsletterPreview
							coins={selectedCoins}
							onClose={() => setShowNewsletter(false)}
						/>
					)}
				</div>
			</div>
		</div>
	);
};

export default Dashboard;
