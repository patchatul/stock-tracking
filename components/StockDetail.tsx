'use client';
import { useState } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Plus, Calendar, DollarSign, Hash } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, ReferenceLine, Legend,
} from "recharts";
import { type Stock, calcGainLoss, calcTotalValue, calcInvestment } from "../database/stockData";

// Mock market comparison data
function buildComparisonData(stock: Stock) {
  const points = 30;
  const data = [];
  let myVal = stock.avgPrice;
  let marketVal = stock.avgPrice * 0.98;
  const now = new Date();
  for (let i = points; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    myVal = Math.max(myVal + (Math.random() - 0.44) * (stock.currentPrice * 0.015), stock.avgPrice * 0.8);
    marketVal = Math.max(marketVal + (Math.random() - 0.45) * (stock.currentPrice * 0.013), stock.avgPrice * 0.75);
    data.push({
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      myPerf: Math.round(myVal * 100) / 100,
      market: Math.round(marketVal * 100) / 100,
    });
  }
  // Force the last point to match current price
  if (data.length) {
    data[data.length - 1].myPerf = stock.currentPrice;
  }
  return data;
}

interface InvestEntry {
  id: string;
  date: string;
  price: number;
  shares: number;
  action: "Buy" | "Sell";
}

function mockEntries(stock: Stock): InvestEntry[] {
  return [
    { id: "e1", date: stock.addedAt.toLocaleDateString(), price: stock.avgPrice * 0.96, shares: Math.round(stock.sharesOwned * 0.4), action: "Buy" },
    { id: "e2", date: new Date(stock.addedAt.getTime() + 30 * 86400000).toLocaleDateString(), price: stock.avgPrice * 1.01, shares: Math.round(stock.sharesOwned * 0.35), action: "Buy" },
    { id: "e3", date: new Date(stock.addedAt.getTime() + 90 * 86400000).toLocaleDateString(), price: stock.avgPrice * 0.99, shares: Math.round(stock.sharesOwned * 0.25), action: "Buy" },
  ];
}

interface AddEntryForm {
  date: string;
  price: string;
  shares: string;
  action: "Buy" | "Sell";
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a1a0c] border border-[rgba(0,88,16,0.5)] rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-[#6aaf72] mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }} className="font-semibold">
          {p.name}: ${p.value.toFixed(2)}
        </p>
      ))}
    </div>
  );
}

interface Props {
  stock: Stock;
  onBack: () => void;
}

export function StockDetail({ stock, onBack }: Props) {
  const gl = calcGainLoss(stock);
  const totalValue = calcTotalValue(stock);
  const invested = calcInvestment(stock);
  const isGain = gl >= 0;
  const glPct = (((stock.currentPrice - stock.avgPrice) / stock.avgPrice) * 100).toFixed(2);

  const chartData = buildComparisonData(stock);
  const [entries, setEntries] = useState<InvestEntry[]>(mockEntries(stock));
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState<AddEntryForm>({
    date: new Date().toISOString().slice(0, 10),
    price: "",
    shares: "",
    action: "Buy",
  });

  function handleAddEntry(e: React.FormEvent) {
    e.preventDefault();
    setEntries(prev => [{
      id: Date.now().toString(),
      date: form.date,
      price: parseFloat(form.price),
      shares: parseFloat(form.shares),
      action: form.action,
    }, ...prev]);
    setForm({ date: new Date().toISOString().slice(0, 10), price: "", shares: "", action: "Buy" });
    setShowAddForm(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#050d06]">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-[rgba(0,88,16,0.25)] shrink-0">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[#6aaf72] hover:text-[#69f0ae] transition-colors text-sm"
        >
          <ArrowLeft size={15} />
          Back
        </button>
        <div className="h-4 w-px bg-[rgba(0,88,16,0.4)]" />
        <div className="flex items-baseline gap-3">
          <span className="text-white font-bold text-xl tracking-wider">{stock.ticker}</span>
          <span className="text-[#6aaf72] text-sm">{stock.name}</span>
          <span className="text-[10px] px-2 py-0.5 rounded bg-[#0d2610] text-[#6aaf72] border border-[rgba(0,88,16,0.3)] uppercase tracking-wider">{stock.type}</span>
        </div>
        <div className="ml-auto flex items-center gap-6">
          <div className="text-right">
            <p className="text-[#6aaf72] text-[10px] uppercase tracking-widest">Current Price</p>
            <p className="text-white font-bold">${stock.currentPrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[#6aaf72] text-[10px] uppercase tracking-widest">My Avg Price</p>
            <p className="text-white font-bold">${stock.avgPrice.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[#6aaf72] text-[10px] uppercase tracking-widest">Investment</p>
            <p className="text-white font-bold">${invested.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[#6aaf72] text-[10px] uppercase tracking-widest">Total Gain / Loss</p>
            <p className={`font-bold flex items-center gap-1 justify-end ${isGain ? "text-[#69f0ae]" : "text-[#ff6b6b]"}`}>
              {isGain ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
              {isGain ? "+" : ""}${gl.toFixed(2)} ({isGain ? "+" : ""}{glPct}%)
            </p>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 min-h-0 gap-4 p-4">
        {/* Left: charts */}
        <div className="flex flex-col flex-1 min-w-0 gap-4">
          {/* My VOO performance chart */}
          <div className="flex-1 min-h-0 bg-[#0a1a0c] border border-[rgba(0,88,16,0.25)] rounded-2xl p-4 flex flex-col">
            <p className="text-white font-bold text-sm mb-3 shrink-0">
              My {stock.ticker} Performance vs Market
              <span className="text-[#6aaf72] text-xs font-normal ml-2">Hover on chart to see buy/sell events</span>
            </p>
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 10, bottom: 0 }}>
                  <defs>
                    <linearGradient id="myGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#005810" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#005810" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="mktGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1565c0" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1565c0" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,88,16,0.12)" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#6aaf72", fontSize: 10 }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                  <YAxis tick={{ fill: "#6aaf72", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v}`} width={50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend wrapperStyle={{ fontSize: 11, color: "#6aaf72", paddingTop: 8 }} />
                  <Area type="monotone" dataKey="myPerf" name="My Performance" stroke="#69f0ae" strokeWidth={2} fill="url(#myGrad)" dot={false} activeDot={{ r: 4, fill: "#69f0ae" }} />
                  <Area type="monotone" dataKey="market" name="Market" stroke="#42a5f5" strokeWidth={1.5} fill="url(#mktGrad)" dot={false} activeDot={{ r: 3, fill: "#42a5f5" }} />
                  {/* Mark buy events */}
                  {entries.map((entry, i) => (
                    <ReferenceLine key={entry.id} x={entry.date} stroke={entry.action === "Buy" ? "#69f0ae" : "#ff6b6b"} strokeDasharray="3 3" strokeOpacity={0.6} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right: investment log */}
        <div className="w-80 flex flex-col gap-3 shrink-0">
          {/* Investment list */}
          <div className="flex-1 min-h-0 bg-[#0a1a0c] border border-[rgba(0,88,16,0.25)] rounded-2xl p-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <p className="text-white font-bold text-sm">Investment History</p>
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1 text-xs px-2.5 py-1.5 bg-[#005810] hover:bg-[#00881a] text-white rounded-lg transition-colors font-medium"
              >
                <Plus size={12} /> Add Entry
              </button>
            </div>

            {/* Add form */}
            {showAddForm && (
              <form onSubmit={handleAddEntry} className="mb-3 p-3 rounded-xl bg-[#0d2610] border border-[rgba(0,88,16,0.3)] flex flex-col gap-2.5 shrink-0">
                <p className="text-[#6aaf72] text-xs font-semibold uppercase tracking-wider">New Entry</p>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#6aaf72] text-[10px] uppercase tracking-wider block mb-1">Action</label>
                    <select
                      value={form.action}
                      onChange={e => setForm(f => ({ ...f, action: e.target.value as "Buy" | "Sell" }))}
                      className="w-full bg-[#050d06] border border-[rgba(0,88,16,0.3)] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#005810]"
                    >
                      <option>Buy</option>
                      <option>Sell</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[#6aaf72] text-[10px] uppercase tracking-wider block mb-1">Date</label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                      className="w-full bg-[#050d06] border border-[rgba(0,88,16,0.3)] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#005810]"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#6aaf72] text-[10px] uppercase tracking-wider block mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={form.price}
                      onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                      className="w-full bg-[#050d06] border border-[rgba(0,88,16,0.3)] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#005810] placeholder-[#1a4d1e]"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[#6aaf72] text-[10px] uppercase tracking-wider block mb-1">Shares</label>
                    <input
                      type="number"
                      step="0.001"
                      placeholder="0"
                      value={form.shares}
                      onChange={e => setForm(f => ({ ...f, shares: e.target.value }))}
                      className="w-full bg-[#050d06] border border-[rgba(0,88,16,0.3)] rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none focus:border-[#005810] placeholder-[#1a4d1e]"
                      required
                    />
                  </div>
                </div>
                {form.price && form.shares && (
                  <p className="text-[#6aaf72] text-[10px]">
                    Total: ${(parseFloat(form.price) * parseFloat(form.shares)).toFixed(2)}
                  </p>
                )}
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 bg-[#005810] hover:bg-[#00881a] text-white rounded-lg py-1.5 text-xs font-semibold transition-colors">
                    Save
                  </button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-[#1a0000] hover:bg-[#2d0000] text-[#ff6b6b] rounded-lg py-1.5 text-xs font-semibold transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Log list */}
            <div className="flex-1 overflow-y-auto flex flex-col gap-2" style={{ scrollbarWidth: "none" }}>
              {entries.map((entry) => (
                <div key={entry.id} className="rounded-xl bg-[#0d2610] border border-[rgba(0,88,16,0.2)] px-3 py-2.5">
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${entry.action === "Buy" ? "bg-[#003d0a] text-[#69f0ae]" : "bg-[#3d0000] text-[#ff6b6b]"}`}>
                      {entry.action}
                    </span>
                    <div className="flex items-center gap-1 text-[#6aaf72] text-[10px]">
                      <Calendar size={9} />
                      {entry.date}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-white text-xs">
                      <DollarSign size={10} className="text-[#6aaf72]" />
                      {entry.price.toFixed(2)} / share
                    </div>
                    <div className="flex items-center gap-1 text-[#a5d6a7] text-xs">
                      <Hash size={10} className="text-[#6aaf72]" />
                      {entry.shares} shares
                    </div>
                  </div>
                  <div className="mt-1 text-right text-[10px] text-[#6aaf72]">
                    Total: ${(entry.price * entry.shares).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary card */}
          <div className="bg-[#0a1a0c] border border-[rgba(0,88,16,0.25)] rounded-2xl p-4 shrink-0">
            <p className="text-[#6aaf72] text-xs uppercase tracking-widest mb-3">Position Summary</p>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <div>
                <p className="text-[#6aaf72] text-[10px]">Shares Owned</p>
                <p className="text-white font-semibold">{stock.sharesOwned}</p>
              </div>
              <div>
                <p className="text-[#6aaf72] text-[10px]">Market Value</p>
                <p className="text-white font-semibold">${totalValue.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[#6aaf72] text-[10px]">Cost Basis</p>
                <p className="text-white font-semibold">${invested.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-[#6aaf72] text-[10px]">Return</p>
                <p className={`font-semibold ${isGain ? "text-[#69f0ae]" : "text-[#ff6b6b]"}`}>
                  {isGain ? "+" : ""}{glPct}%
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
