"use client";
import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  SlidersHorizontal,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import {
  sortStocks,
  calcGainLoss,
  calcInvestment,
  type Stock,
  type SortOption,
  calcTotalValue,
} from "@/database/stockData";

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Top Gainer", value: "top-gainer" },
  { label: "Top Loser", value: "top-loser" },
  { label: "Oldest", value: "oldest" },
  { label: "Newest", value: "newest" },
  { label: "Self Priority", value: "self-priority" },
  { label: "Hold", value: "hold" },
  { label: "Buy", value: "buy" },
  { label: "Sell", value: "sell" },
  { label: "Individual", value: "individual" },
  { label: "ETF", value: "etf" },
  { label: "Mutual Fund", value: "mutual" },
];

const TAG_COLORS: Record<string, string> = {
  Hold: "bg-[#4682B7] text-[#BFE9FF]",
  Buy: "bg-[#003D0A] text-[#69F0AE]",
  Sell: "bg-[#3D0000] text-red",
};

function StockRow({ stock, onClick }: { stock: Stock; onClick: () => void }) {
  const gainLoss = calcGainLoss(stock);
  const totalValue = calcTotalValue(stock);
  const invest = calcInvestment(stock);
  const isGain = gainLoss >= 0;
  return (
    <div
      onClick={onClick}
      className="border-b border-medium-green/30 px-3 py-3 hover:bg-dark-green/30 active:bg-medium-green/50 transition-colors cursor-pointer"
    >
      {/*1st row*/}
      <div className="flex items-center justify-between gap-1 mb-1">
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-sm tracking-wider">
            {stock.ticker}
          </span>
          <span
            className={`text-[10px] px-1.5 rounded ${TAG_COLORS[stock.tag]}`}
          >
            {stock.tag}
          </span>
        </div>
        <span className="text-white text-xs font-semibold">
          Total ${totalValue.toFixed(2)}
        </span>
      </div>
      {/*2nd row*/}
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-gray-400 font-medium">
          Cur ${stock.currentPrice.toFixed(2)}
        </span>
        <span className="text-medium-green">Invested ${invest.toFixed(2)}</span>
      </div>
      {/*3rd row*/}
      <div className="flex items-center justify-between mt-1">
        <span className="text-gray-400 text-[11px]">
          Avg ${stock.avgPrice.toFixed(2)}
        </span>
        <span className="text-medium-green text-[11px] ">
          Shares {stock.sharesOwned.toFixed(2)}
        </span>
        <span
          className={`text-[11px] font-semibold flex items-center gap-0.5 ${isGain ? "text-light-green" : "text-red"}`}
        >
          {isGain ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
          {isGain ? "+" : ""}${gainLoss.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

interface Props {
  collapsed: boolean;
  onToggle: () => void;
  stocks: Stock[];
  onAddStock: () => void;
  onSelectStock: (stock: Stock) => void;
}

export default function Sidebar({
  collapsed,
  onToggle,
  stocks = [],
  onAddStock,
  onSelectStock,
}: Props) {
  const [sort, setSort] = useState<SortOption>("top-gainer");
  const [showSortMenu, setShowSortMenu] = useState(false);
  const sorted = sortStocks(stocks, sort);

  return (
    <div
      className="relative shrink-0 flex"
      style={{ width: collapsed ? 16 : 260, transition: "width 0.3s" }}
    >
      {/* Sidebar panel */}
      <div
        className="flex flex-col h-full border-r border-dark-green/50 overflow-hidden"
        style={{ width: collapsed ? 0 : 260, transition: "width 0.3s" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-2 py-3 shrink-0">
          <span className="text-white font-bold text-sm tracking-wide whitespace-nowrap">
            My Stocks
          </span>
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="p-1.5 rounded hover:bg-dark-green/50 text-medium-green transition-colors"
                title="Sort & Filter"
              >
                <SlidersHorizontal size={14} />
              </button>
              {showSortMenu && (
                <div className="absolute top-full right-0 mt-1 w-44 bg-[#0a1a0c] border border-medium-green/50 rounded-lg shadow-2xl z-50 py-1 overflow-hidden">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSort(opt.value);
                        setShowSortMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${sort === opt.value ? "bg-dark-green/60 text-light-green" : "text-white  hover:bg-dark-green/30"}`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* onAddStock later*/}
            <button
              onClick={onAddStock}
              className="p-1.5 mr-3 rounded hover:bg-dark-green/50 text-medium-green transition-colors"
              title="Add Stock"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>

        {/* Active sorted name */}
        <div className="px-4 py-1 shrink-0 bg-dark-green/60">
          <span className="text-light-green text-xs">
            {SORT_OPTIONS.find((option) => option.value === sort)?.label}
          </span>
        </div>

        {/* Stock list */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide">
          {sorted.map((stock) => (
            <StockRow
              key={stock.id}
              stock={stock}
              onClick={() => onSelectStock(stock)}
            />
          ))}
        </div>
      </div>

      {/* < > Toggle button — always visible, anchored to right edge of wrapper */}
      <button
        onClick={onToggle}
        className="absolute top-2.5 -right-3.5 z-30 w-7 h-7 rounded-full bg-dark-green border border-medium-green flex items-center justify-center text-white hover:bg-medium-green transition-colors shadow-lg"
      >
        {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
      </button>
    </div>
  );
}
