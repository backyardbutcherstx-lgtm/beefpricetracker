"use client";
import { useEffect, useRef } from "react";

interface PricePoint {
  date: string;
  value: number;
}

interface PriceChartProps {
  data: PricePoint[];
  label: string;
  color?: string;
}

export default function PriceChart({
  data,
  label,
  color = "#2E75B6",
}: PriceChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Clear
    ctx.clearRect(0, 0, width, height);

    // Calculate bounds
    const values = data.map((d) => d.value);
    const minVal = Math.floor(Math.min(...values) * 10) / 10 - 0.2;
    const maxVal = Math.ceil(Math.max(...values) * 10) / 10 + 0.2;

    // Draw grid lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartH / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Y-axis labels
      const val = maxVal - ((maxVal - minVal) / 4) * i;
      ctx.fillStyle = "#666";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "right";
      ctx.fillText(`$${val.toFixed(2)}`, padding.left - 8, y + 4);
    }

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.beginPath();
    data.forEach((point, i) => {
      const x = padding.left + (chartW / (data.length - 1)) * i;
      const y =
        padding.top + chartH - ((point.value - minVal) / (maxVal - minVal)) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill area under line
    const lastX = padding.left + chartW;
    const baseY = padding.top + chartH;
    ctx.lineTo(lastX, baseY);
    ctx.lineTo(padding.left, baseY);
    ctx.closePath();
    ctx.fillStyle = color + "15";
    ctx.fill();

    // Draw dots on last 3 points
    data.slice(-3).forEach((point, idx) => {
      const i = data.length - 3 + idx;
      const x = padding.left + (chartW / (data.length - 1)) * i;
      const y =
        padding.top + chartH - ((point.value - minVal) / (maxVal - minVal)) * chartH;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "#fff";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    // X-axis labels (show every 4th month)
    ctx.fillStyle = "#666";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "center";
    data.forEach((point, i) => {
      if (i % 4 === 0 || i === data.length - 1) {
        const x = padding.left + (chartW / (data.length - 1)) * i;
        const date = new Date(point.date);
        const label = date.toLocaleDateString("en-US", {
          month: "short",
          year: "2-digit",
        });
        ctx.fillText(label, x, height - 10);
      }
    });
  }, [data, label, color]);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-600 mb-2">{label}</h3>
      <canvas
        ref={canvasRef}
        className="w-full"
        style={{ height: "200px" }}
      />
    </div>
  );
}
