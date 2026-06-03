export type StockType =  "Individual" | "ETF" | "Mutual Fund";
export type StockTag = "Hold" | "Buy" | "Sell";

export interface Stock {
  id: string;
  ticker: string;
  name: string;
  currentPrice: number;
  avgPrice: number;
  sharesOwned: number;
  type: StockType;
  tag: StockTag;
  addedAt: Date;
}

export const mockStocks: Stock[] = [
  { id: "1", ticker: "VOO", name: "Vanguard S&P 500 ETF", currentPrice: 512.48, avgPrice: 480.20, sharesOwned: 12, type: "ETF", tag: "Hold", addedAt: new Date("2023-01-15") },
  { id: "2", ticker: "AAPL", name: "Apple Inc.", currentPrice: 189.30, avgPrice: 165.50, sharesOwned: 25, type: "Individual", tag: "Hold", addedAt: new Date("2022-11-10") },
  { id: "3", ticker: "TSLA", name: "Tesla Inc.", currentPrice: 174.20, avgPrice: 220.80, sharesOwned: 15, type: "Individual", tag: "Sell", addedAt: new Date("2023-03-22") },
  { id: "4", ticker: "QQQ", name: "Invesco QQQ Trust", currentPrice: 438.90, avgPrice: 410.00, sharesOwned: 8, type: "ETF", tag: "Buy", addedAt: new Date("2023-06-05") },
  { id: "5", ticker: "MSFT", name: "Microsoft Corp.", currentPrice: 415.60, avgPrice: 380.25, sharesOwned: 10, type: "Individual", tag: "Hold", addedAt: new Date("2022-08-19") },
  { id: "6", ticker: "OPEN", name: "Opendoor Technologies", currentPrice: 2.84, avgPrice: 4.50, sharesOwned: 200, type: "Individual", tag: "Hold", addedAt: new Date("2023-09-12") },
  { id: "7", ticker: "FXAIX", name: "Fidelity 500 Index Fund", currentPrice: 181.44, avgPrice: 172.00, sharesOwned: 30, type: "Mutual Fund", tag: "Buy", addedAt: new Date("2022-05-01") },
  { id: "8", ticker: "NVDA", name: "NVIDIA Corp.", currentPrice: 875.40, avgPrice: 620.00, sharesOwned: 5, type: "Individual", tag: "Hold", addedAt: new Date("2023-02-28") },
  { id: "9", ticker: "SPY", name: "SPDR S&P 500 ETF", currentPrice: 524.10, avgPrice: 498.75, sharesOwned: 7, type: "ETF", tag: "Hold", addedAt: new Date("2021-12-20") },
  { id: "10", ticker: "AMZN", name: "Amazon.com Inc.", currentPrice: 185.70, avgPrice: 142.30, sharesOwned: 18, type: "Individual", tag: "Hold", addedAt: new Date("2022-07-08") },
];

export function calcGainLoss(stock: Stock): number {
  return (stock.currentPrice - stock.avgPrice) * stock.sharesOwned;
}

export function calcTotalValue(stock: Stock): number {
  return stock.currentPrice * stock.sharesOwned;
}

export function calcInvestment(stock: Stock): number {
  return stock.avgPrice * stock.sharesOwned;
}

export type SortOption = "top-gainer" | "top-loser" | "oldest" | "newest" | "self-priority" | "hold" | "buy" | "sell" | "individual" | "etf" | "mutual";

export function sortStocks(stocks: Stock[], sort: SortOption): Stock[] {
  const s = Array.isArray(stocks) ? [...stocks] : [];
  switch (sort) {
    case "top-gainer": 
        return s.sort((a, b) => calcGainLoss(b) - calcGainLoss(a));
    case "top-loser": 
        return s.sort((a, b) => calcGainLoss(a) - calcGainLoss(b));
    case "oldest": 
        return s.sort((a, b) => a.addedAt.getTime() - b.addedAt.getTime());
    case "newest": 
        return s.sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime());
    case "self-priority": return s.sort((a, b) => calcTotalValue(b) - calcTotalValue(a));
    case "hold": 
        return s.filter(x => x.tag === "Hold").concat(s.filter(x => x.tag !== "Hold"));
    case "buy": 
        return s.filter(x => x.tag === "Buy").concat(s.filter(x => x.tag !== "Buy"));
    case "sell": 
        return s.filter(x => x.tag === "Sell").concat(s.filter(x => x.tag !== "Sell"));
    case "individual": 
        return s.filter(x => x.type === "Individual").concat(s.filter(x => x.type !== "Individual"));
    case "etf": 
        return s.filter(x => x.type === "ETF").concat(s.filter(x => x.type !== "ETF"));
    case "mutual": 
        return s.filter(x => x.type === "Mutual Fund").concat(s.filter(x => x.type !== "Mutual Fund"));
    default: 
        return s;
  }
}

export type TimeRange = "1D" | "1W" | "1M" | "3M" | "6M" | "1Y" | "YTD" | "ALL";

function generateChartData(days: number, startValue: number, volatility: number) {
  const data = [];
  let value = startValue;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    value = Math.max(value + (Math.random() - 0.45) * volatility, startValue * 0.7);
    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      value: Math.round(value * 100) / 100,
    });
  }
  return data;
}

export const chartDataByRange: Record<TimeRange, { date: string; value: number }[]> = {
  "1D": generateChartData(1, 58400, 300),
  "1W": generateChartData(7, 57200, 500),
  "1M": generateChartData(30, 54800, 800),
  "3M": generateChartData(90, 51000, 1200),
  "6M": generateChartData(180, 47500, 1800),
  "1Y": generateChartData(365, 44000, 2000),
  "YTD": generateChartData(152, 48000, 1600),
  "ALL": generateChartData(730, 38000, 2500),
};
