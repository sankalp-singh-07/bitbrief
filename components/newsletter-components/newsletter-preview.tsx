'use client';
import { X, Download, Mail, Lock, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import { NewsletterContent } from '@/hooks/use-newsletters';

type NewsletterPreviewProps = {
	content: NewsletterContent;
	onClose?: () => void;
	availableCoins: { value: string; label: string }[];
};

const NewsletterPreview = ({
	content,
	onClose,
	availableCoins,
}: NewsletterPreviewProps) => {
	const downloadPDF = () => {
		console.log('Downloading PDF for newsletter:', content.id);
		alert('PDF download would start here!');
	};

	const sendEmail = () => {
		alert(`Newsletter would be sent to your email!`);
	};

	return (
		<Card className="w-full max-w-5xl mx-auto">
			<CardHeader className="border-b border-gray-200 dark:border-gray-700">
				<div className="flex items-center justify-between">
					<div className="flex-1">
						<div className="text-center">
							<CardTitle className="text-4xl font-bold font-serif mb-2">
								{content.title}
							</CardTitle>
							<p className="text-sm text-gray-500 uppercase tracking-wide">
								{content.date} • Issue #{content.id.substring(0, 5).toUpperCase()}
							</p>
							<p className="text-lg font-medium mt-1">
								{content.subtitle}
							</p>
						</div>
					</div>
					{onClose && (
						<Button
							variant="ghost"
							size="icon"
							onClick={onClose}
							className="shrink-0"
						>
							<X className="w-5 h-5" />
						</Button>
					)}
				</div>
			</CardHeader>

			<CardContent className="p-8">
				<div className="border-b border-gray-200 dark:border-gray-700 pb-6 mb-6">
					<h1 className="text-3xl font-bold font-serif leading-tight mb-3">
						{content.mainStory.headline}
					</h1>
					<p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
						{content.mainStory.content}
					</p>
				</div>

				<div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
					<h2 className="text-xl font-bold font-serif mb-4 text-center">
						Your Portfolio Analysis
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{content.selectedCoins.map((coinValue) => {
							const coin = availableCoins.find(
								(c) => c.value === coinValue
							);
							return (
								<div
									key={coinValue}
									className="bg-white dark:bg-gray-900 p-4 rounded"
								>
									<h3 className="font-semibold text-lg">
										{coin?.label || coinValue}
									</h3>
									<p className="text-sm text-gray-600 dark:text-gray-400">
										Detailed analysis included in this
										report
									</p>
								</div>
							);
						})}
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
					{content.articles.map((article, index) => (
						<div key={index} className="space-y-3">
							<h3 className="text-xl font-bold font-serif border-b border-gray-200 dark:border-gray-700 pb-2">
								{article.title}
							</h3>
							<p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-line">
								{article.content}
							</p>
						</div>
					))}
				</div>

				{content.quickStats.length > 0 && (
					<div className="border-2 border-gray-300 dark:border-gray-600 p-6 mb-6">
						<h2 className="text-xl font-bold font-serif text-center mb-4">
							Performance Statistics
						</h2>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{content.quickStats.map((stat, index) => (
								<div key={index} className="text-center">
									<h4 className="font-semibold text-sm uppercase tracking-wide text-gray-500">
										{stat.metric}
									</h4>
									<p className="text-2xl font-bold mt-1">
										{stat.value}
									</p>
									<p className={`text-sm ${stat.change.startsWith('-') ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
										{stat.change}
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				{(content.proInsights && content.proInsights.length > 0) && (
					<div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-100 dark:border-blue-900/40 p-6 rounded-lg mb-6">
						<div className="flex items-center gap-2 mb-6">
							<h2 className="text-2xl font-bold font-serif text-blue-900 dark:text-blue-100">
								Pro Insights 
							</h2>
							<Badge variant="default" className="bg-blue-600 hover:bg-blue-700">Premium</Badge>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
							{content.proInsights.map((insight, index) => (
								<div key={index} className={`space-y-3 relative p-4 rounded bg-white/60 dark:bg-black/20 ${insight.isLocked ? 'pointer-events-none' : ''}`}>
									<div className="flex items-center gap-2">
										{insight.isLocked ? <Lock className="w-4 h-4 text-muted-foreground" /> : <Unlock className="w-4 h-4 text-blue-500" />}
										<h3 className="text-lg font-bold font-serif text-gray-900 dark:text-gray-100">
											{insight.title}
										</h3>
									</div>
									<p className={`text-sm leading-relaxed text-gray-700 dark:text-gray-300 ${insight.isLocked ? 'blur-[4px] opacity-70 select-none' : ''}`}>
										{insight.content}
									</p>
									{insight.isLocked && (
										<div className="absolute inset-0 flex items-center justify-center">
											<Button variant="default" className="pointer-events-auto bg-blue-600 text-white hover:bg-blue-700 shadow-lg" onClick={() => alert('Upgrade flow initiated!')}>
												Upgrade to Read
											</Button>
										</div>
									)}
								</div>
							))}
						</div>
					</div>
				)}

				<div className="border-t border-gray-200 dark:border-gray-700 pt-6">
					<p className="text-center text-xs text-gray-500 mb-4">
						This newsletter was generated for your selected
						cryptocurrencies: {content.selectedCoins.join(', ')}
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

export default NewsletterPreview;
