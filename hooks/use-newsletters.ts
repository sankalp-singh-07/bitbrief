import { useEffect } from 'react';
import { useNewsletterStore } from '@/store/useNewsletterStore';

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
  _id?: string;
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
	timestamp?: number;
  createdAt?: string;
};

export function useNewsletters() {
	const { newsletters, isLoaded, fetchNewsletters, addNewsletter, removeNewsletter } = useNewsletterStore();

	// Load from database on mount via Zustand store
	useEffect(() => {
		if (!isLoaded) {
      fetchNewsletters();
    }
	}, [isLoaded, fetchNewsletters]);

	const saveNewsletter = async (newsletter: Omit<NewsletterContent, 'id' | '_id' | 'timestamp' | 'createdAt'>) => {
    const result = await addNewsletter(newsletter);
    return {
      ...result,
      id: result._id?.toString() || result.id || crypto.randomUUID(),
      timestamp: result.createdAt ? new Date(result.createdAt).getTime() : Date.now(),
    } as NewsletterContent;
	};

	const deleteNewsletter = async (id: string) => {
		await removeNewsletter(id);
	};

  // Map the fetched _id to id so existing components continue rendering keys properly
  const mappedNewsletters = newsletters.map(n => ({
    ...n,
    id: n._id?.toString() || n.id || crypto.randomUUID(),
    timestamp: n.createdAt ? new Date(n.createdAt).getTime() : n.timestamp,
  })) as NewsletterContent[];

	return {
		newsletters: mappedNewsletters,
		isLoaded,
		saveNewsletter,
		deleteNewsletter,
	};
}
