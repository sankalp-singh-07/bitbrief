import { useState, useEffect } from 'react';

export type NewsletterArticle = {
	title: string;
	content: string;
};

export type QuickStat = {
	metric: string;
	value: string;
	change: string;
};

export type NewsletterContent = {
	id: string;
	title: string;
	date: string;
	subtitle: string;
	mainStory: {
		headline: string;
		content: string;
	};
	articles: NewsletterArticle[];
	quickStats: QuickStat[];
	proInsights: {
		title: string;
		content: string;
		isLocked: boolean;
	}[];
	selectedCoins: string[];
	timestamp: number;
};

const STORAGE_KEY = 'bitbrief_newsletters';

export function useNewsletters() {
	const [newsletters, setNewsletters] = useState<NewsletterContent[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	// Load from local storage on mount
	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				setNewsletters(JSON.parse(stored));
			}
		} catch (error) {
			console.error('Failed to load newsletters from storage:', error);
		} finally {
			setIsLoaded(true);
		}
	}, []);

	const saveNewsletter = (newsletter: Omit<NewsletterContent, 'id' | 'timestamp'>) => {
		const newNewsletter: NewsletterContent = {
			...newsletter,
			id: crypto.randomUUID(),
			timestamp: Date.now(),
		};

		const updatedNewsletters = [newNewsletter, ...newsletters];
		setNewsletters(updatedNewsletters);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNewsletters));
		return newNewsletter;
	};

	const deleteNewsletter = (id: string) => {
		const updatedNewsletters = newsletters.filter((n) => n.id !== id);
		setNewsletters(updatedNewsletters);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedNewsletters));
	};

	return {
		newsletters,
		isLoaded,
		saveNewsletter,
		deleteNewsletter,
	};
}
