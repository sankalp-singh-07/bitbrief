import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Billing & Subscriptions',
	description: 'Manage your active subscription plan, check expiry details, and view payment transaction history.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
