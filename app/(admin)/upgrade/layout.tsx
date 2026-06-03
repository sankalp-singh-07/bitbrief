import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Upgrade to Pro',
	description: 'Level up your cryptocurrency research. Unlock unlimited alerts, 10 watchlist slots, and AI Predictive Insights.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
