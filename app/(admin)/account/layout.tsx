import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Account Settings',
	description: 'Manage your profile, security, and linked identities securely on bitBrief.',
};

export default function Layout({ children }: { children: React.ReactNode }) {
	return <>{children}</>;
}
