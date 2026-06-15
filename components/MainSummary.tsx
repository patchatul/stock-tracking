'use client';
import { TrendingUp, TrendingDown } from "lucide-react";
import { mockStocks, calcGainLoss, calcTotalValue } from "../database/stockData";

const sorted = [...mockStocks].sort((a, b) => calcGainLoss(b) - calcGainLoss(a));
const topGainers = sorted.filter(s => calcGainLoss(s) > 0).slice(0, 3);
const topLosers = [...mockStocks].sort((a, b) => calcGainLoss(a) - calcGainLoss(b)).filter(s => calcGainLoss(s) < 0).slice(0, 3);

const TIMELINE_STATS = [
  { label: "Last Week", value: "+$1,248", pct: "+2.1%", up: true },
  { label: "Last Month", value: "+$3,820", pct: "+6.8%", up: true },
  { label: "Last 3M", value: "+$7,540", pct: "+14.2%", up: true },
  { label: "YTD", value: "+$11,390", pct: "+22.4%", up: true },
  { label: "All Time", value: "+$22,100", pct: "+47.8%", up: true },
];

function StockMiniCard({ ticker, gl, isGain }: { ticker: string; gl: number; isGain: boolean }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#0a1a0c] border border-[rgba(0,88,16,0.2)] hover:border-[rgba(0,88,16,0.5)] transition-colors">
      <div className="flex items-center gap-2">
        {isGain
          ? <TrendingUp size={14} className="text-light-green" />
          : <TrendingDown size={14} className="text-red" />
        }
        <span className="text-white text-sm font-bold">{ticker}</span>
      </div>
      <span className={`text-xs font-semibold ${isGain ? "text-light-green" : "text-red"}`}>
        {isGain ? "+" : ""}${gl.toFixed(2)}
      </span>
    </div>
  );
}

export default function MainSummary() {
  return (
    <div className="grid grid-cols-3 gap-4 h-full">
      {/* Top Gainers */}
      <div className="flex flex-col gap-2">
        <p className="text-light-green text-xs font-bold uppercase tracking-widest flex items-center gap-1">
          <TrendingUp size={12} /> Top Gainers
        </p>
        <div className="flex flex-col gap-1.5">
          {topGainers.map(s => (
            <StockMiniCard key={s.id} ticker={s.ticker} gl={calcGainLoss(s)} isGain={true} />
          ))}
        </div>
      </div>

      {/* Top Losers */}
      <div className="flex flex-col gap-2">
        <p className="text-red text-xs font-bold uppercase tracking-widest flex items-center gap-1">
          <TrendingDown size={12} /> Top Losers
        </p>
        <div className="flex flex-col gap-1.5">
          {topLosers.map(s => (
            <StockMiniCard key={s.id} ticker={s.ticker} gl={calcGainLoss(s)} isGain={false} />
          ))}
        </div>
      </div>

      {/* Timeline P&L */}
      <div className="flex flex-col">
        <p className="text-medium-green text-xs font-bold uppercase tracking-widest">Portfolio P&L</p>
        <div className="grid grid-cols-2">
          {TIMELINE_STATS.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between p-2 rounded-lg bg-[#0a1a0c] border border-[rgba(0,88,16,0.2)]">
              <span className="text-medium-green text-xs">{stat.label}</span>
              <div className="flex items-center  flex-col">
                <span className={`text-xs font-semibold ${stat.up ? "text-light-green" : "text-red"}`}>{stat.value}</span>
                <span className={`text-[10px] ${stat.up ? "text-light-green" : "text-red"}`}>{stat.pct}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
