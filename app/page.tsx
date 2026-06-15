"use client";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { ChartNoAxesCombined } from "lucide-react";
import { mockStocks, type Stock } from "@/database/stockData";
import { AddStock } from "@/components/AddStock";
import MainChart from "@/components/MainChart";
import MainSummary from "@/components/MainSummary";
import { StockDetail } from "@/components/StockDetail";

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddStock, setShowAddStock] = useState(false);

  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  useEffect(() => {
    document.body.style.overflow = showAddStock ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [showAddStock]);

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
            <p className="text-medium-green text-[10px] uppercase tracking-widest">
              Total Portfolio
            </p>
            <p className="text-white text-sm font-bold">
              {/* ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
              $0.00
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-white text-[10px] uppercase tracking-widest">
              Total Contribution
            </p>
            <p className="text-white text-sm font-bold">
              {/* ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} */}
              $0.00
            </p>
          </div>
          <div className="text-right hidden sm:block">
            {/* <div className={`text-right hidden sm:block }> ${isGain ? "text-[#69f0ae]" : "text-[#ff6b6b]"}` */}
            <p className="text-[10px] uppercase tracking-widest opacity-70">
              All-time P&L{" "}
            </p>
            <p className="text-sm font-bold">
              $0.00
              {/* {isGain ? "+" : ""}${totalGL.toFixed(2)} ({isGain ? "+" : ""}{totalGLPct}%) */}
            </p>
          </div>
        </div>
      </header>
      {/* Body */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Sidebar — always rendered so toggle button stays visible */}
        <Sidebar
          collapsed={!sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
          stocks={mockStocks}
          onAddStock={() => setShowAddStock(true)}
          onSelectStock={(stock) => {
            setSelectedStock(stock);
          }}
        />

        {/* Main content */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {selectedStock ? (
            <StockDetail
              stock={selectedStock}
              onBack={() => setSelectedStock(null)}
            />
          ) : (
            <>
              {/* Chart area */}
              <div className="flex-1 min-h-0 p-5 pb-3">
                <div className="h-full bg-[#0a1a0c] border border-[rgba(0,88,16,0.25)] rounded-2xl p-5">
                  <MainChart />
                </div>
              </div>

              {/* Bottom stats */}
              <div className="shrink-0 px-5 pb-5" style={{ height: 200 }}>
                <div className="h-full bg-[#0a1a0c] border border-[rgba(0,88,16,0.25)] rounded-2xl p-4">
                  <MainSummary />
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      <footer className="flex items-center justify-center w-full h-10 border-t border-dark-green/50">
        <p className="text-[10px] text-dark-green/80">
          © 2026 StockTracking. All rights reserved to Patcharalak Tulyakul.
          Mock Data.
        </p>
      </footer>
      {showAddStock && <AddStock onClose={() => setShowAddStock(false)} />}
    </div>
  );
}
