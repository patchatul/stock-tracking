"use client";
import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid} from "recharts";
import { chartDataByRange, type TimeRange } from "../database/stockData";

const TIME_RANGES: TimeRange[] = ["1D", "1W", "1M", "3M", "6M", "YTD", "1Y", "ALL"];

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0a1a0c] border border-[rgba(0,88,16,0.5)] rounded-lg px-3 py-2 shadow-xl">
      <p className="text-[#6aaf72] text-xs mb-0.5">{label}</p>
      <p className="text-white text-sm font-bold">
        ${payload[0].value.toLocaleString()}
      </p>
    </div>
  );
}

export default function MainChart() {
  const [range, setRange] = useState<TimeRange>("1M");
  const data = chartDataByRange[range];
  const first = data[0]?.value ?? 0;
  const last = data[data.length - 1]?.value ?? 0;
  const change = last - first;
  const pct = ((change / first) * 100).toFixed(2);
  const isUp = change >= 0;

  return (
    <div className="flex flex-col h-full">
      {/* Title row */}
      <div className="flex items-end justify-between mb-4 shrink-0">
        <div>
          <p className="text-[#6aaf72] text-xs uppercase tracking-widest mb-1">
            Portfolio Value
          </p>
          <p className="text-white text-3xl font-bold">
            ${last.toLocaleString()}
          </p>
          <p
            className={`text-sm font-semibold mt-0.5 ${isUp ? "text-light-green" : "text-red"}`}
          >
            {isUp ? "▲" : "▼"} {isUp ? "+" : ""}${change.toFixed(0)} (
            {isUp ? "+" : ""}
            {pct}%)
          </p>
        </div>
        {/* Time range buttons */}
        <div className="flex gap-1">
          {TIME_RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                range === r
                  ? "bg-dark-green text-white"
                  : "text-[#6aaf72] hover:bg-[#0d2610] hover:text-[#a5d6a7]"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 5, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#005810" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#005810" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(0,88,16,0.15)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: "#6aaf72", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "#6aaf72", fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={isUp ? "#69f0ae" : "#ff6b6b"}
              strokeWidth={2}
              fill="url(#stockGradient)"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#69f0ae",
                stroke: "#005810",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
