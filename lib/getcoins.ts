interface CoinMarketData {
	id: string;
	symbol: string;
	name: string;
	market_cap_rank: number;
	current_price: number;
	market_cap: number;
	total_volume: number;
	price_change_percentage_24h: number;
	high_24h: number;
	low_24h: number;
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
	price: number;
	change24h: number;
	marketCap: number;
	volume: number;
	high24h: number;
	low24h: number;
	rank: number;
}

interface CoinsData {
	availableCoins: CoinOption[];
	trendingCoins: string[];
}

export const fetchCoinsData = async (): Promise<CoinsData> => {
	try {
		const [coinsResponse, trendingResponse] = await Promise.all([
			fetch(
				'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1'
			),
			fetch('https://api.coingecko.com/api/v3/search/trending'),
		]);

		if (!coinsResponse.ok || !trendingResponse.ok) {
			throw new Error('CoinGecko API returned an error response');
		}

		const coins: CoinMarketData[] = await coinsResponse.json();
		const trending: TrendingResponse = await trendingResponse.json();

		return {
			availableCoins: coins.map((coin: CoinMarketData) => ({
				value: coin.id,
				label: `${coin.name} (${coin.symbol.toUpperCase()})`,
				price: coin.current_price,
				change24h: coin.price_change_percentage_24h,
				marketCap: coin.market_cap,
				volume: coin.total_volume,
				high24h: coin.high_24h,
				low24h: coin.low_24h,
				rank: coin.market_cap_rank
			})),
			trendingCoins: trending.coins
				.slice(0, 5)
				.map((coin: TrendingCoin) => coin.item.id),
		};
	} catch (error) {
		console.warn('Handling CoinGecko fetch failure with fallback:', error);
		throw error;
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
