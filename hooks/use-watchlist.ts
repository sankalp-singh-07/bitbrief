import { useEffect } from 'react';
import { useWatchlistStore } from '@/store/useWatchlistStore';

export type AlertType = 'above' | 'below';

export type WatchlistAlert = {
	id?: string;
  _id?: string;
	targetPrice: number;
	type: AlertType;
};

export type WatchlistItem = {
	coinId: string;
	addedAt: string | number; // timestamp or ISO string
	priceAtAdd: number;
	alerts: WatchlistAlert[];
};

export function useWatchlist() {
	const { watchlist, isLoaded, fetchWatchlist, addCoin: storeAddCoin, removeCoin: storeRemoveCoin, addAlert: storeAddAlert, removeAlert: storeRemoveAlert } = useWatchlistStore();

	useEffect(() => {
		if (!isLoaded) {
			fetchWatchlist();
		}
	}, [isLoaded, fetchWatchlist]);

	// Adapt the Zustand actions to the exact signature previously used
	const addCoin = (coinId: string, currentPrice: number) => {
		storeAddCoin(coinId, currentPrice);
	};

	const removeCoin = (coinId: string) => {
		storeRemoveCoin(coinId);
	};

	const addAlert = (coinId: string, alert: Omit<WatchlistAlert, 'id' | '_id'>) => {
		storeAddAlert(coinId, alert);
	};

	const removeAlert = (coinId: string, alertId: string) => {
		const item = watchlist.find(w => w.coinId === coinId);
    if (!item) return;
    
		const alertIndex = item.alerts.findIndex(a => a._id === alertId || a.id === alertId);
    if (alertIndex !== -1) {
      storeRemoveAlert(coinId, alertIndex);
    }
	};

	return {
		watchlist: watchlist as WatchlistItem[],
		isLoaded,
		addCoin,
		removeCoin,
		addAlert,
		removeAlert,
	};
}
