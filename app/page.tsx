'use client';
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { ChartNoAxesCombined } from "lucide-react";
import { mockStocks, type Stock } from "@/database/stockData";

export default function Home() {
  const [collapsed, setCollapsed] = useState(false);
  const [stocks] = useState<Stock[]>(mockStocks);

  return (
    <div className="flex flex-col flex-1 h-screen w-screen overflow-hidden  items-center justify-center">
      <header className="flex items-center justify-between shrink-0 px-10 py-4  z-20 border-b border-dark-green/50 w-full ">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-dark-green flex items-center justify-center">
            <ChartNoAxesCombined size={16} className="text-light-green" />
          </div>
          <button className="font-bold  ">StockTracking</button>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-medium-green text-[10px] uppercase tracking-widest">Total Portfolio</p>
            <p className="text-white text-sm font-bold">
              {/* ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
              $0.00
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-white text-[10px] uppercase tracking-widest">Total Contribution</p>
            <p className="text-white text-sm font-bold">
              {/* ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
              $0.00
            </p>
          </div>
          <div className="text-right hidden sm:block">
          {/* <div className={`text-right hidden sm:block }> ${isGain ? "text-[#69f0ae]" : "text-[#ff6b6b]"}` */}
            <p className="text-[10px] uppercase tracking-widest opacity-70">All-time P&L </p>
            <p className="text-sm font-bold">
              $0.00
              {/* {isGain ? "+" : ""}${totalGL.toFixed(2)} ({isGain ? "+" : ""}{totalGLPct}%) */}
            </p>
          </div>
          </div>
      </header>
      <main className="flex flex-1 w-full flex-col justify-between items-start">
        <Sidebar
          collapsed={collapsed}
          onToggle={() => setCollapsed(!collapsed)}
          stocks={stocks}
          onAddStock={() => {}}
          onSelectStock={() => {}}
        />
      </main>
      <footer className="flex items-center justify-center w-full h-10 border-t border-dark-green/50">
        <p className="text-[10px] text-dark-green/80">© 2026 StockTracking. All rights reserved to Patcharalak Tulyakul. Mock Number.</p>
      </footer>
    </div>
  );
}
