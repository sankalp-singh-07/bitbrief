import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Intelligence Watchlist',
	description: 'Track and monitor your selected cryptocurrencies with AI price triggers and volatility alerts.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
