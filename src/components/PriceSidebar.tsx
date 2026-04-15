"use client";

import { useEffect, useRef } from "react";

type PriceData = {
  label: string;
  value: string;
  unit: string;
  change: number;
  trend: "up" | "down";
};

const priceData: PriceData[] = [
  { label: "LIVE CATTLE (JUN)", value: "198.45", unit: "¢/lb", change: 2.15, trend: "up" },
  { label: "FEEDER CATTLE (AUG)", value: "264.80", unit: "¢/lb", change: -1.30, trend: "down" },
  { label: "BOXED BEEF CUTOUT", value: "328.14", unit: "$/cwt", change: 5.62, trend: "up" },
  { label: "CORN (JUL)", value: "456.50", unit: "¢/bu", change: -3.25, trend: "down" },
];

const chartData = [
  { month: "Oct", value: 178.2 },
  { month: "Nov", value: 181.5 },
  { month: "Dec", value: 179.8 },
  { month: "Jan", value: 185.3 },
  { month: "Feb", value: 189.2 },
  { month: "Mar", value: 192.8 },
  { month: "Apr", value: 198.45 },
];

function TrendIcon({ trend }: { trend: "up" | "down" }) {
  if (trend === "up") {
    return (
      <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
        <path d="M2 8L6 4L8 6L10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 2H10V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    );
  }
  return (
    <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none">
      <path d="M2 4L6 8L8 6L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7 10H10V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MiniChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 10, bottom: 30, left: 40 };

    const values = chartData.map(d => d.value);
    const minVal = Math.min(...values) - 5;
    const maxVal = Math.max(...values) + 5;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
    ctx.lineWidth = 1;
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (i / gridLines) * (height - padding.top - padding.bottom);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const value = maxVal - (i / gridLines) * (maxVal - minVal);
      ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
      ctx.font = "10px system-ui";
      ctx.textAlign = "right";
      ctx.fillText(value.toFixed(1), padding.left - 5, y + 3);
    }

    // Draw line
    const xStep = (width - padding.left - padding.right) / (chartData.length - 1);
    
    ctx.beginPath();
    ctx.strokeStyle = "#d4a017";
    ctx.lineWidth = 2;
    
    chartData.forEach((point, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + ((maxVal - point.value) / (maxVal - minVal)) * (height - padding.top - padding.bottom);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw area fill
    ctx.beginPath();
    chartData.forEach((point, i) => {
      const x = padding.left + i * xStep;
      const y = padding.top + ((maxVal - point.value) / (maxVal - minVal)) * (height - padding.top - padding.bottom);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(padding.left + (chartData.length - 1) * xStep, height - padding.bottom);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.closePath();
    
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, "rgba(212, 160, 23, 0.3)");
    gradient.addColorStop(1, "rgba(212, 160, 23, 0.05)");
    ctx.fillStyle = gradient;
    ctx.fill();

    // X-axis labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.font = "10px system-ui";
    ctx.textAlign = "center";
    chartData.forEach((point, i) => {
      const x = padding.left + i * xStep;
      ctx.fillText(point.month, x, height - 10);
    });

  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[140px]"
      style={{ display: "block" }}
    />
  );
}

export default function PriceSidebar() {
  const now = new Date();
  const lastUpdated = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }) + " - " + now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  });

  return (
    <aside className="w-full lg:w-[320px] space-y-6">
      {/* Price Snapshot */}
      <div className="bg-navy-dark text-white rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
            <h3 className="text-xs font-bold tracking-wider text-white/90">PRICE SNAPSHOT</h3>
          </div>
        </div>
        
        <div className="divide-y divide-white/10">
          {priceData.map((item) => (
            <div key={item.label} className="px-5 py-4">
              <div className="text-[10px] font-medium tracking-wider text-white/60 mb-1">
                {item.label}
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-2xl font-bold text-white">{item.value}</span>
                  <span className="text-xs text-white/50 ml-1">{item.unit}</span>
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  item.trend === "up" ? "text-price-up" : "text-teal-light"
                }`}>
                  <TrendIcon trend={item.trend} />
                  <span>{item.change > 0 ? "+" : ""}{item.change.toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="px-5 py-3 border-t border-white/10">
          <p className="text-[10px] text-white/40">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Futures Chart */}
      <div className="bg-navy-dark text-white rounded-lg overflow-hidden">
        <div className="px-5 py-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold tracking-wider text-white/90">LIVE CATTLE FUTURES</h3>
              <p className="text-[10px] text-white/50 mt-0.5">6-month trend · ¢/lb</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-white">198.45</div>
              <div className="text-xs font-medium text-price-up">+11.36%</div>
            </div>
          </div>
        </div>
        <div className="px-2 py-3">
          <MiniChart />
        </div>
      </div>
    </aside>
  );
}
