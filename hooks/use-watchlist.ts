import { useState, useEffect } from 'react';

export type AlertType = 'above' | 'below';

export type WatchlistAlert = {
	id: string;
	targetPrice: number;
	type: AlertType;
};

export type WatchlistItem = {
	coinId: string;
	addedAt: number; // timestamp
	priceAtAdd: number;
	alerts: WatchlistAlert[];
};

const STORAGE_KEY = 'bitbrief_premium_watchlist';

export function useWatchlist() {
	const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
	const [isLoaded, setIsLoaded] = useState(false);

	useEffect(() => {
		try {
			const stored = localStorage.getItem(STORAGE_KEY);
			if (stored) {
				setWatchlist(JSON.parse(stored));
			}
		} catch (error) {
			console.error('Failed to load premium watchlist:', error);
		} finally {
			setIsLoaded(true);
		}
	}, []);

	const saveWatchlist = (newList: WatchlistItem[]) => {
		setWatchlist(newList);
		localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));
	};

	const addCoin = (coinId: string, currentPrice: number) => {
		if (watchlist.some(item => item.coinId === coinId)) return;
		const newItem: WatchlistItem = {
			coinId,
			addedAt: Date.now(),
			priceAtAdd: currentPrice,
			alerts: [],
		};
		saveWatchlist([...watchlist, newItem]);
	};

	const removeCoin = (coinId: string) => {
		saveWatchlist(watchlist.filter(item => item.coinId !== coinId));
	};

	const addAlert = (coinId: string, alert: Omit<WatchlistAlert, 'id'>) => {
		const newList = watchlist.map(item => {
			if (item.coinId === coinId) {
				return {
					...item,
					alerts: [...item.alerts, { ...alert, id: crypto.randomUUID() }]
				};
			}
			return item;
		});
		saveWatchlist(newList);
	};

	const removeAlert = (coinId: string, alertId: string) => {
		const newList = watchlist.map(item => {
			if (item.coinId === coinId) {
				return {
					...item,
					alerts: item.alerts.filter(a => a.id !== alertId)
				};
			}
			return item;
		});
		saveWatchlist(newList);
	};

	return {
		watchlist,
		isLoaded,
		addCoin,
		removeCoin,
		addAlert,
		removeAlert,
	};
}
