interface CoinMarketData {
	id: string;
	symbol: string;
	name: string;
	market_cap_rank: number;
	current_price: number;
	market_cap: number;
}

interface TrendingCoinItem {
	id: string;
	name: string;
	symbol: string;
	market_cap_rank: number;
}

interface TrendingCoin {
	item: TrendingCoinItem;
}

interface TrendingResponse {
	coins: TrendingCoin[];
}

interface CoinOption {
	value: string;
	label: string;
}

interface CoinsData {
	availableCoins: CoinOption[];
	trendingCoins: string[];
}

export const fetchCoinsData = async (): Promise<CoinsData> => {
	try {
		const coinsResponse = await fetch(
			'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
		);
		const coins: CoinMarketData[] = await coinsResponse.json();

		const trendingResponse = await fetch(
			'https://api.coingecko.com/api/v3/search/trending'
		);
		const trending: TrendingResponse = await trendingResponse.json();

		return {
			availableCoins: coins.map((coin: CoinMarketData) => ({
				value: coin.id,
				label: `${coin.name} (${coin.symbol.toUpperCase()})`,
			})),
			trendingCoins: trending.coins
				.slice(0, 5)
				.map((coin: TrendingCoin) => coin.item.id),
		};
	} catch (error) {
		console.error('Error fetching coins:', error);
		return { availableCoins: [], trendingCoins: [] };
	}
};

let coinsCache: CoinsData | null = null;
let cacheTime: number | null = null;
const CACHE_DURATION = 10 * 60 * 1000;

export const fetchCoinsDataCached = async (): Promise<CoinsData> => {
	const now = Date.now();

	if (coinsCache && cacheTime && now - cacheTime < CACHE_DURATION) {
		return coinsCache;
	}

	const data = await fetchCoinsData();
	coinsCache = data;
	cacheTime = now;

	return data;
};

export type { CoinsData, CoinOption };
