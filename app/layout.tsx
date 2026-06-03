import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { ClerkProvider } from '@clerk/nextjs';

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
	display: 'swap',
});

const poppins = Poppins({
	variable: '--font-poppins',
	subsets: ['latin'],
	weight: ['400', '500', '600'],
	display: 'swap',
});

export const metadata: Metadata = {
	title: {
		default: 'bitBrief - AI-Powered Cryptocurrency Research',
		template: '%s | bitBrief'
	},
	description: 'Optimize your portfolio tracking and stay ahead of the crypto market. Get real-time price alerts, machine learning-driven analytics, and personalized portfolio newsletter reports.',
	keywords: ['cryptocurrency tracker', 'crypto research', 'AI price forecasting', 'bitcoin alerts', 'ethereum analysis', 'bitbrief', 'crypto reports'],
	authors: [{ name: 'bitBrief Team' }],
	creator: 'bitBrief',
	openGraph: {
		type: 'website',
		locale: 'en_US',
		url: 'https://bitbrief.com',
		title: 'bitBrief - AI-Powered Cryptocurrency Research',
		description: 'Optimize your portfolio tracking and stay ahead of the crypto market. Get real-time price alerts, machine learning-driven analytics, and personalized portfolio newsletter reports.',
		siteName: 'bitBrief',
		images: [
			{
				url: 'https://bitbrief.com/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'bitBrief Research Platform'
			}
		]
	},
	twitter: {
		card: 'summary_large_image',
		title: 'bitBrief - AI-Powered Cryptocurrency Research',
		description: 'Optimize your portfolio tracking and stay ahead of the crypto market. Get real-time price alerts, machine learning-driven analytics, and personalized portfolio newsletter reports.',
		creator: '@bitbrief',
		images: ['https://bitbrief.com/og-image.jpg']
	},
	robots: {
		index: true,
		follow: true
	}
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
			<body className="antialiased font-sans">
				<ClerkProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</ClerkProvider>
			</body>
		</html>
	);
}
