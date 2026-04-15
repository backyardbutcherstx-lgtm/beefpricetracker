"use client";

import { useEffect, useRef } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  BarChart3,
} from "lucide-react";

interface ArticleBodyProps {
  content: string;
}

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  BarChart3,
};

export default function ArticleBody({ content }: ArticleBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Render icons
    const iconElements = containerRef.current.querySelectorAll("[data-icon]");
    iconElements.forEach((el) => {
      const iconName = el.getAttribute("data-icon");
      if (iconName && ICON_MAP[iconName]) {
        // Icons are rendered via React, so we'll handle this differently
      }
    });

    // Render charts
    const chartElements = containerRef.current.querySelectorAll("[data-chart]");
    chartElements.forEach((el) => {
      const chartType = el.getAttribute("data-chart");
      const dataEl = el.querySelector(".chart-data");
      
      if (chartType === "price-trend" && dataEl) {
        const values = dataEl.getAttribute("data-values")?.split(",").map(Number) || [];
        const labels = dataEl.getAttribute("data-labels")?.split(",") || [];
        renderLineChart(el as HTMLElement, values, labels);
      } else if (chartType === "comparison" && dataEl) {
        const items = JSON.parse(dataEl.getAttribute("data-items") || "[]");
        renderBarChart(el as HTMLElement, items);
      }
    });
  }, [content]);

  return (
    <>
      <style jsx global>{`
        .article-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .article-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .article-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #333;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .article-content p {
          color: #4a4a4a;
          margin-bottom: 1.5rem;
          line-height: 1.75;
        }
        .article-content ul, .article-content ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }
        .article-content ul {
          list-style-type: disc;
        }
        .article-content ol {
          list-style-type: decimal;
        }
        .article-content li {
          color: #4a4a4a;
          margin-bottom: 0.5rem;
          line-height: 1.6;
        }
        .article-content strong {
          font-weight: 600;
          color: #1a1a1a;
        }
        .article-content blockquote {
          border-left: 4px solid #1e3a5f;
          padding-left: 1rem;
          font-style: italic;
          color: #666;
          margin: 1.5rem 0;
        }
        .article-content a {
          color: #1e3a5f;
          text-decoration: underline;
        }
        .article-content a:hover {
          color: #d4a84b;
        }
        .article-content .article-image {
          margin: 2rem 0;
        }
        .article-content .article-image img {
          border-radius: 0.5rem;
          width: 100%;
        }
        .article-content .article-chart {
          background: #f8f9fa;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 2rem 0;
        }
        .article-content .chart-title {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
          font-size: 1rem;
        }
        .article-content .chart-canvas {
          width: 100%;
          height: 200px;
        }
        .article-content .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin: 2rem 0;
        }
        @media (max-width: 640px) {
          .article-content .stats-grid {
            grid-template-columns: 1fr;
          }
        }
        .article-content .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.75rem;
          padding: 1.5rem;
          text-align: center;
        }
        .article-content .stat-value {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .article-content .stat-label {
          font-size: 0.875rem;
          color: #666;
        }
        .article-content .callout {
          display: flex;
          gap: 1rem;
          padding: 1rem 1.25rem;
          border-radius: 0.5rem;
          margin: 1.5rem 0;
        }
        .article-content .callout-tip {
          background: #fefce8;
          border: 1px solid #fde047;
        }
        .article-content .callout-warning {
          background: #fff7ed;
          border: 1px solid #fdba74;
        }
        .article-content .callout-info {
          background: #eff6ff;
          border: 1px solid #93c5fd;
        }
        .article-content .callout-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }
        .article-content .callout-content {
          color: #4a4a4a;
          line-height: 1.6;
        }
        .article-content .inline-icon {
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          margin: 0 0.25rem;
        }
        .article-content hr {
          border: none;
          border-top: 1px solid #e5e7eb;
          margin: 2rem 0;
        }
      `}</style>
      <div 
        ref={containerRef}
        className="article-content text-foreground leading-relaxed"
        dangerouslySetInnerHTML={{ __html: processContent(content) }}
      />
    </>
  );
}

function processContent(content: string): string {
  // Replace icon placeholders with SVG icons
  let processed = content;
  
  // Process inline icons
  processed = processed.replace(
    /<span data-icon="(\w+)" class="inline-icon"><\/span>/g,
    (_, iconName) => {
      const iconSvg = getIconSvg(iconName);
      return `<span class="inline-icon">${iconSvg}</span>`;
    }
  );

  return processed;
}

function getIconSvg(iconName: string): string {
  const icons: Record<string, string> = {
    TrendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
    TrendingDown: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>`,
    DollarSign: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    AlertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    CheckCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    Info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    Lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>`,
    BarChart3: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e3a5f" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>`,
  };
  return icons[iconName] || "";
}

function renderLineChart(container: HTMLElement, values: number[], labels: string[]) {
  const existingCanvas = container.querySelector("canvas");
  if (existingCanvas) return; // Already rendered

  const canvas = document.createElement("canvas");
  canvas.className = "chart-canvas";
  canvas.style.width = "100%";
  canvas.style.height = "200px";
  
  const dataEl = container.querySelector(".chart-data");
  if (dataEl) {
    dataEl.replaceWith(canvas);
  } else {
    container.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx || values.length === 0) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minVal = Math.floor(Math.min(...values) * 10) / 10 - 0.5;
  const maxVal = Math.ceil(Math.max(...values) * 10) / 10 + 0.5;

  // Grid
  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    const val = maxVal - ((maxVal - minVal) / 4) * i;
    ctx.fillStyle = "#666";
    ctx.font = "11px sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(`$${val.toFixed(2)}`, padding.left - 8, y + 4);
  }

  // Line
  ctx.strokeStyle = "#1e3a5f";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.beginPath();
  values.forEach((val, i) => {
    const x = padding.left + (chartW / (values.length - 1)) * i;
    const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Fill
  const lastX = padding.left + chartW;
  const baseY = padding.top + chartH;
  ctx.lineTo(lastX, baseY);
  ctx.lineTo(padding.left, baseY);
  ctx.closePath();
  ctx.fillStyle = "#1e3a5f15";
  ctx.fill();

  // Labels
  ctx.fillStyle = "#666";
  ctx.font = "10px sans-serif";
  ctx.textAlign = "center";
  labels.forEach((label, i) => {
    if (i % 2 === 0 || i === labels.length - 1) {
      const x = padding.left + (chartW / (labels.length - 1)) * i;
      ctx.fillText(label, x, height - 10);
    }
  });
}

function renderBarChart(container: HTMLElement, items: { label: string; value: number }[]) {
  const existingCanvas = container.querySelector("canvas");
  if (existingCanvas) return;

  const canvas = document.createElement("canvas");
  canvas.className = "chart-canvas";
  canvas.style.width = "100%";
  canvas.style.height = "200px";

  const dataEl = container.querySelector(".chart-data");
  if (dataEl) {
    dataEl.replaceWith(canvas);
  } else {
    container.appendChild(canvas);
  }

  const ctx = canvas.getContext("2d");
  if (!ctx || items.length === 0) return;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  const width = rect.width;
  const height = rect.height;
  const padding = { top: 20, right: 20, bottom: 50, left: 50 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...items.map((i) => i.value)) * 1.1;
  const barWidth = (chartW / items.length) * 0.6;
  const gap = (chartW / items.length) * 0.4;

  items.forEach((item, i) => {
    const x = padding.left + (chartW / items.length) * i + gap / 2;
    const barH = (item.value / maxVal) * chartH;
    const y = padding.top + chartH - barH;

    // Bar
    ctx.fillStyle = "#1e3a5f";
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Value
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`$${item.value.toFixed(2)}`, x + barWidth / 2, y - 6);

    // Label
    ctx.fillStyle = "#666";
    ctx.font = "10px sans-serif";
    ctx.fillText(item.label, x + barWidth / 2, height - 10);
  });
}
