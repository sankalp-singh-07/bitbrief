import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Market Reports & Newsletters',
	description: 'Review your previously compiled AI-driven cryptocurrency portfolio newsletters and reports.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
