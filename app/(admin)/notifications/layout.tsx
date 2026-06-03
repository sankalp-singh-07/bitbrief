import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Notifications & Alerts',
	description: 'Configure and monitor your system messages and price alert triggers.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
