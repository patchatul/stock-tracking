'use client';
import { useState } from "react";
import { X } from "lucide-react";

interface Props {
  onClose: () => void;
}

const STOCK_TYPES = ["Individual", "ETF","Mutual Fund"];
const TAGS = ["Hold", "Buy", "Sell"];
const TAG_COLORS: Record<string, string> = {
  Hold: "bg-[#4682B7] text-[#BFE9FF]",
  Buy: "bg-[#003D0A] text-[#69F0AE]",
  Sell: "bg-[#3D0000] text-[#FF6B6B]",
};

export function AddStock({ onClose }: Props) {
  const [ticker, setTicker] = useState("");
  const [date, setDate] = useState("");
  const [price, setPrice] = useState("");
  const [shares, setShares] = useState("");
  const [type, setType] = useState("Individual");
  const [tag, setTag] = useState("Hold");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm  ">
      <div className="bg-background border border-dark-green rounded-2xl p-6 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold">Add New Stock</h2>
          <button onClick={onClose} className="text-medium-green hover:text-white hover:bg-medium-green/50 p-1 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-medium-green text-xs uppercase tracking-wider block mb-1">Ticker Symbol</label>
                    <input
                    type="text"
                    value={ticker}
                    onChange={e => setTicker(e.target.value.toUpperCase())}
                    placeholder="e.g. AAPL"
                    className="w-full bg-dark-green/30 border border-dark-green rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400"
                    required
                    />
                </div>
                <div>
                    <label className="text-medium-green text-xs uppercase tracking-wider block mb-1">Date invetsed</label>
                    <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="w-full bg-dark-green/30 border border-dark-green rounded-lg px-3 py-2 text-white text-sm "
                    required
                    />
                </div>
                <div>
                    <label className="text-medium-green text-xs uppercase tracking-wider block mb-1">Average Price</label>
                    <input
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    placeholder="$0.00"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full bg-dark-green/30 border border-dark-green  rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 "
                    required
                    />
                </div>
                <div>
                    <label className="text-medium-green text-xs uppercase tracking-wider block mb-1">Shares Owned</label>
                    <input
                    value={shares}
                    onChange={e => setShares(e.target.value)}
                    placeholder="0"
                    type="number"
                    step="0.01"
                    min="0"
                    className="w-full bg-dark-green/30 border border-dark-green rounded-lg px-3 py-2 text-white text-sm placeholder-gray-400 "
                    required
                    />
                </div>
                <div>
                    <label className="text-medium-green text-xs uppercase tracking-wider block mb-1">Type</label>
                    <select
                        value={type}
                        onChange={e => setType(e.target.value)}
                        className="w-full bg-dark-green/30 border border-dark-green rounded-lg px-3 py-2 text-white text-sm "
                    >
                        {STOCK_TYPES.map(t => <option className="bg-dark-green/80 text-black font-semibold" key={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="text-medium-green text-xs uppercase tracking-wider block mb-1">Tag</label>
                    <div className="flex flex-wrap gap-2">
                        {TAGS.map((t) => (
                        <button
                            type="button"
                            key={t}
                            onClick={() => setTag(t)}
                            className={`rounded-full px-3 py-2 text-xs font-semibold transition-colors ${tag === t ? TAG_COLORS[t] : "bg-gray-500 text-white hover:bg-dark-green/50"}`}
                        >
                            {t}
                        </button>
                        ))}
                    </div>
                </div>
            </div>
          <button
            type="submit"
            className="w-full bg-[#00881a] hover:bg-green-600 text-white rounded-lg py-2.5 text-sm font-semibold transition-colors mt-1"
          >
            Add Stock
          </button>
        </form>
      </div>
    </div>
  );
}
