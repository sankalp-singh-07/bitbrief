import { cn } from '@/lib/utils';
import { Marquee } from '@/components/magicui/marquee';

const reviews = [
	{
		name: 'Smart Summarization',
		body: 'AI-powered newsletters that condense market trends into human-friendly briefs.',
		icon: '🧠',
	},
	{
		name: 'Instant Insights',
		body: 'Generate a full report in seconds — no research needed.',
		icon: '⚡',
	},
	{
		name: 'Pro-Level Analysis',
		body: 'Unlock deeper, longer reports with daily email delivery.',
		icon: '💼',
	},
	{
		name: 'Effortless Delivery',
		body: 'Schedule daily briefings sent straight to your inbox.',
		icon: '📬',
	},
	{
		name: 'Personal Watchlist',
		body: 'Track the coins you care about and generate tailored reports instantly.',
		icon: '🧾',
	},
];

const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
	icon,
	name,
	body,
}: {
	icon: string;
	name: string;
	body: string;
}) => {
	return (
		<figure
			className={cn(
				'relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4',
				'border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]',
				'dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]'
			)}
		>
			<div className="flex flex-row items-center gap-2">
				<h1>{icon}</h1>
				<div className="flex flex-col">
					<figcaption className="text-sm font-medium dark:text-white">
						{name}
					</figcaption>
				</div>
			</div>
			<blockquote className="mt-2 text-sm">{body}</blockquote>
		</figure>
	);
};

export function MarqueeDemo() {
	return (
		<div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
			<Marquee pauseOnHover className="[--duration:40s]">
				{firstRow.map((review) => (
					<ReviewCard key={review.name} {...review} />
				))}
			</Marquee>
			<Marquee reverse pauseOnHover className="[--duration:40s]">
				{secondRow.map((review) => (
					<ReviewCard key={review.name} {...review} />
				))}
			</Marquee>
			<div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
			<div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div>
		</div>
	);
}
