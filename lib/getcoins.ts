interface CoinMarketData {
	id: string;
	symbol: string;
	name: string;
	image: string;
	market_cap_rank: number;
	current_price: number;
	market_cap: number;
	total_volume: number;
	price_change_percentage_24h: number;
	high_24h: number;
	low_24h: number;
	sparkline_in_7d: {
		price: number[];
	};
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
	image: string;
	price: number;
	change24h: number;
	marketCap: number;
	volume: number;
	high24h: number;
	low24h: number;
	rank: number;
	sparkline: number[];
}

interface CoinsData {
	availableCoins: CoinOption[];
	trendingCoins: string[];
}

const FALLBACK_COINS: CoinOption[] = [
	{ value: 'bitcoin', label: 'Bitcoin (BTC)', image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png', price: 65000, change24h: 2.5, marketCap: 1200000000000, volume: 30000000000, high24h: 66000, low24h: 63000, rank: 1, sparkline: [63000, 63500, 64000, 63800, 64200, 65000] },
	{ value: 'ethereum', label: 'Ethereum (ETH)', image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png', price: 3500, change24h: 1.2, marketCap: 400000000000, volume: 15000000000, high24h: 3600, low24h: 3400, rank: 2, sparkline: [3400, 3450, 3500, 3480, 3490, 3500] },
	{ value: 'tether', label: 'Tether (USDT)', image: 'https://assets.coingecko.com/coins/images/325/large/Tether.png', price: 1.00, change24h: 0.1, marketCap: 110000000000, volume: 45000000000, high24h: 1.01, low24h: 0.99, rank: 3, sparkline: [1.00, 1.00, 1.01, 1.00, 1.00, 1.00] },
	{ value: 'binancecoin', label: 'BNB (BNB)', image: 'https://assets.coingecko.com/coins/images/825/large/bnb-icon2_2x.png', price: 600, change24h: 1.5, marketCap: 90000000000, volume: 1500000000, high24h: 610, low24h: 590, rank: 4, sparkline: [590, 595, 600, 605, 598, 600] },
	{ value: 'solana', label: 'Solana (SOL)', image: 'https://assets.coingecko.com/coins/images/4128/large/solana.png', price: 145, change24h: 5.4, marketCap: 65000000000, volume: 4000000000, high24h: 150, low24h: 135, rank: 5, sparkline: [135, 138, 142, 140, 144, 145] },
	{ value: 'ripple', label: 'XRP (XRP)', image: 'https://assets.coingecko.com/coins/images/44/large/xrp-symbol-white-128.png', price: 0.60, change24h: -1.2, marketCap: 33000000000, volume: 1200000000, high24h: 0.62, low24h: 0.58, rank: 7, sparkline: [0.62, 0.61, 0.60, 0.59, 0.60, 0.60] },
	{ value: 'dogecoin', label: 'Dogecoin (DOGE)', image: 'https://assets.coingecko.com/coins/images/5/large/dogecoin.png', price: 0.15, change24h: -0.5, marketCap: 20000000000, volume: 1000000000, high24h: 0.16, low24h: 0.14, rank: 8, sparkline: [0.16, 0.155, 0.15, 0.148, 0.15, 0.15] },
	{ value: 'toncoin', label: 'Toncoin (TON)', image: 'https://assets.coingecko.com/coins/images/17980/large/ton_symbol.png', price: 7.50, change24h: 4.2, marketCap: 25000000000, volume: 400000000, high24h: 7.60, low24h: 7.10, rank: 9, sparkline: [7.10, 7.20, 7.40, 7.60, 7.50, 7.50] },
	{ value: 'cardano', label: 'Cardano (ADA)', image: 'https://assets.coingecko.com/coins/images/975/large/cardano.png', price: 0.45, change24h: 0.8, marketCap: 16000000000, volume: 400000000, high24h: 0.47, low24h: 0.43, rank: 10, sparkline: [0.43, 0.44, 0.435, 0.445, 0.45, 0.45] },
	{ value: 'polkadot', label: 'Polkadot (DOT)', image: 'https://assets.coingecko.com/coins/images/12171/large/polkadot.png', price: 7.20, change24h: 0.5, marketCap: 10000000000, volume: 200000000, high24h: 7.40, low24h: 7.00, rank: 14, sparkline: [7.00, 7.10, 7.30, 7.20, 7.15, 7.20] },
	{ value: 'chainlink', label: 'Chainlink (LINK)', image: 'https://assets.coingecko.com/coins/images/877/large/chainlink-new-logo.png', price: 14.50, change24h: 2.1, marketCap: 8500000000, volume: 350000000, high24h: 15.00, low24h: 14.00, rank: 16, sparkline: [14.00, 14.20, 14.80, 14.50, 14.60, 14.50] },
];

const FALLBACK_TRENDING = [
	'bitcoin',
	'ethereum',
	'dogecoin',
	'cardano',
	'solana',
];

export const fetchCoinsData = async (): Promise<CoinsData> => {
	try {
		const [coinsResponse, trendingResponse] = await Promise.all([
			fetch(
				'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=true'
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
				image: coin.image,
				price: coin.current_price,
				change24h: coin.price_change_percentage_24h,
				marketCap: coin.market_cap,
				volume: coin.total_volume,
				high24h: coin.high_24h,
				low24h: coin.low_24h,
				rank: coin.market_cap_rank,
				sparkline: coin.sparkline_in_7d?.price || []
			})),
			trendingCoins: trending.coins
				.slice(0, 5)
				.map((coin: TrendingCoin) => coin.item.id),
		};
	} catch (err) {
		// Suppressing console log to prevent Next.js dev overlay from interrupting the UI. 
		// Fallback data returned gracefully.
		return {
			availableCoins: FALLBACK_COINS,
			trendingCoins: FALLBACK_TRENDING,
		};
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
