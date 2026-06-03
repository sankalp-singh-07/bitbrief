import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Dashboard',
	description: 'Select research coins, analyze market indicators, and compile AI-powered reports.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
