"use client";

import { useEffect, useRef } from "react";

interface ArticleBodyProps {
  content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const processedRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || processedRef.current) return;
    processedRef.current = true;

    // Process drop caps for first paragraph
    const firstP = containerRef.current.querySelector("p");
    if (firstP && firstP.textContent && firstP.textContent.length > 50) {
      const text = firstP.innerHTML;
      const firstChar = text.charAt(0);
      const rest = text.slice(1);
      firstP.innerHTML = `<span class="drop-cap">${firstChar}</span>${rest}`;
    }

    // Render any charts
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
        /* Professional Publication Typography */
        .article-body {
          font-family: Georgia, 'Times New Roman', serif;
          color: #2d2d2d;
          font-size: 1.125rem;
          line-height: 1.8;
        }

        /* Drop Cap */
        .article-body .drop-cap {
          float: left;
          font-size: 4.5rem;
          line-height: 0.8;
          font-weight: 700;
          margin-right: 0.75rem;
          margin-top: 0.25rem;
          color: #0d2137;
          font-family: Georgia, serif;
        }

        /* Headings with section dividers */
        .article-body h2 {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 2.5rem;
          margin-bottom: 1.25rem;
          padding-top: 2rem;
          border-top: 1px solid #d4d4d4;
          font-family: Georgia, serif;
          letter-spacing: -0.01em;
        }

        .article-body h2:first-of-type {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }

        .article-body h3 {
          font-size: 1.375rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-family: Georgia, serif;
        }

        .article-body h4 {
          font-size: 1.125rem;
          font-weight: 700;
          color: #333;
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          font-family: Georgia, serif;
        }

        /* Paragraphs */
        .article-body p {
          margin-bottom: 1.5rem;
          color: #2d2d2d;
        }

        .article-body p:first-of-type {
          font-size: 1.25rem;
          line-height: 1.75;
        }

        /* Links */
        .article-body a {
          color: #1a5276;
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .article-body a:hover {
          color: #d4a017;
        }

        /* Strong/Bold */
        .article-body strong {
          font-weight: 700;
          color: #1a1a1a;
        }

        /* Lists */
        .article-body ul,
        .article-body ol {
          margin-bottom: 1.5rem;
          padding-left: 1.5rem;
        }

        .article-body ul {
          list-style-type: disc;
        }

        .article-body ol {
          list-style-type: decimal;
        }

        .article-body li {
          margin-bottom: 0.625rem;
          padding-left: 0.5rem;
          color: #2d2d2d;
        }

        .article-body li::marker {
          color: #1a5276;
        }

        /* Blockquotes - Gold accent like reference */
        .article-body blockquote {
          margin: 2rem 0;
          padding: 0 0 0 1.5rem;
          border-left: 4px solid #d4a017;
          font-style: italic;
          color: #1a1a1a;
        }

        .article-body blockquote p {
          font-size: 1.25rem;
          line-height: 1.7;
          margin-bottom: 0.5rem;
        }

        .article-body blockquote cite,
        .article-body blockquote footer {
          display: block;
          font-style: normal;
          font-size: 0.9375rem;
          color: #666;
          margin-top: 0.75rem;
        }

        /* Horizontal Rules / Section Dividers */
        .article-body hr {
          border: none;
          border-top: 1px solid #d4d4d4;
          margin: 2.5rem 0;
        }

        /* Images */
        .article-body figure {
          margin: 2rem 0;
        }

        .article-body figure img {
          width: 100%;
          border-radius: 0.5rem;
        }

        .article-body figcaption {
          font-size: 0.875rem;
          color: #666;
          margin-top: 0.75rem;
          font-style: italic;
          text-align: center;
        }

        /* Stats Grid */
        .article-body .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
          margin: 2rem 0;
        }

        @media (min-width: 640px) {
          .article-body .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        .article-body .stat-card {
          background: #f8f8f6;
          border: 1px solid #e8e8e8;
          border-radius: 0.5rem;
          padding: 1.25rem;
          text-align: center;
        }

        .article-body .stat-label {
          font-size: 0.6875rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #666;
          margin-bottom: 0.375rem;
          font-family: system-ui, sans-serif;
        }

        .article-body .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #0d2137;
          font-family: system-ui, sans-serif;
        }

        .article-body .stat-change {
          font-size: 0.8125rem;
          font-weight: 600;
          margin-top: 0.25rem;
          font-family: system-ui, sans-serif;
        }

        .article-body .stat-change.up {
          color: #c0392b;
        }

        .article-body .stat-change.down {
          color: #1e8449;
        }

        /* Callouts */
        .article-body .callout {
          display: flex;
          gap: 1rem;
          padding: 1.25rem 1.5rem;
          border-radius: 0.5rem;
          margin: 2rem 0;
          font-family: system-ui, sans-serif;
          font-size: 0.9375rem;
          line-height: 1.6;
        }

        .article-body .callout-tip {
          background: #fefce8;
          border: 1px solid #fde047;
        }

        .article-body .callout-warning {
          background: #fff7ed;
          border: 1px solid #fdba74;
        }

        .article-body .callout-info {
          background: #f0f7ff;
          border: 1px solid #93c5fd;
        }

        .article-body .callout-icon {
          font-size: 1.25rem;
          flex-shrink: 0;
        }

        .article-body .callout-content {
          color: #333;
        }

        /* Charts */
        .article-body .article-chart {
          background: #f8f8f6;
          border: 1px solid #e8e8e8;
          border-radius: 0.75rem;
          padding: 1.5rem;
          margin: 2rem 0;
        }

        .article-body .chart-title {
          font-family: system-ui, sans-serif;
          font-weight: 600;
          font-size: 0.875rem;
          color: #1a1a1a;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.025em;
        }

        .article-body .chart-canvas {
          width: 100%;
          height: 220px;
        }

        /* Inline Icons */
        .article-body .inline-icon {
          display: inline-flex;
          align-items: center;
          vertical-align: middle;
          margin: 0 0.25rem;
        }

        /* Key Takeaway Box */
        .article-body .key-takeaway {
          background: #0d2137;
          color: white;
          padding: 1.5rem 2rem;
          border-radius: 0.75rem;
          margin: 2rem 0;
        }

        .article-body .key-takeaway-title {
          font-family: system-ui, sans-serif;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #d4a017;
          margin-bottom: 0.75rem;
        }

        .article-body .key-takeaway p {
          color: #e8e8e8;
          margin-bottom: 0;
          font-size: 1rem;
          line-height: 1.7;
        }

        /* Table */
        .article-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-family: system-ui, sans-serif;
          font-size: 0.9375rem;
        }

        .article-body thead {
          background: #0d2137;
          color: white;
        }

        .article-body th {
          padding: 0.875rem 1rem;
          text-align: left;
          font-weight: 600;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .article-body td {
          padding: 0.875rem 1rem;
          border-bottom: 1px solid #e8e8e8;
        }

        .article-body tbody tr:hover {
          background: #f8f8f6;
        }
      `}</style>
      <div 
        ref={containerRef}
        className="article-body"
        dangerouslySetInnerHTML={{ __html: processContent(content) }}
      />
    </>
  );
}

function processContent(content: string): string {
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
    TrendingUp: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#c0392b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
    TrendingDown: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e8449" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>`,
    DollarSign: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d2137" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`,
    AlertCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`,
    CheckCircle: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1e8449" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
    Info: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a5276" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`,
    Lightbulb: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d4a017" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path><path d="M9 18h6"></path><path d="M10 22h4"></path></svg>`,
    BarChart3: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0d2137" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path></svg>`,
  };
  return icons[iconName] || "";
}

function renderLineChart(container: HTMLElement, values: number[], labels: string[]) {
  const existingCanvas = container.querySelector("canvas");
  if (existingCanvas) return;

  const canvas = document.createElement("canvas");
  canvas.className = "chart-canvas";
  canvas.style.width = "100%";
  canvas.style.height = "220px";
  
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
  const padding = { top: 20, right: 20, bottom: 40, left: 55 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const minVal = Math.floor(Math.min(...values) * 10) / 10 - 0.5;
  const maxVal = Math.ceil(Math.max(...values) * 10) / 10 + 0.5;

  // Grid
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();

    const val = maxVal - ((maxVal - minVal) / 4) * i;
    ctx.fillStyle = "#666";
    ctx.font = "11px system-ui";
    ctx.textAlign = "right";
    ctx.fillText(`$${val.toFixed(2)}`, padding.left - 8, y + 4);
  }

  // Line
  ctx.strokeStyle = "#d4a017";
  ctx.lineWidth = 2.5;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.beginPath();
  values.forEach((val, i) => {
    const x = padding.left + (chartW / (values.length - 1)) * i;
    const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Fill gradient
  ctx.beginPath();
  values.forEach((val, i) => {
    const x = padding.left + (chartW / (values.length - 1)) * i;
    const y = padding.top + chartH - ((val - minVal) / (maxVal - minVal)) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  const lastX = padding.left + chartW;
  const baseY = padding.top + chartH;
  ctx.lineTo(lastX, baseY);
  ctx.lineTo(padding.left, baseY);
  ctx.closePath();
  
  const gradient = ctx.createLinearGradient(0, padding.top, 0, baseY);
  gradient.addColorStop(0, "rgba(212, 160, 23, 0.2)");
  gradient.addColorStop(1, "rgba(212, 160, 23, 0.02)");
  ctx.fillStyle = gradient;
  ctx.fill();

  // Labels
  ctx.fillStyle = "#666";
  ctx.font = "10px system-ui";
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
  canvas.style.height = "220px";

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
  const padding = { top: 30, right: 20, bottom: 50, left: 20 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;

  const maxVal = Math.max(...items.map((i) => i.value)) * 1.15;
  const barWidth = Math.min((chartW / items.length) * 0.6, 60);
  const totalBarSpace = barWidth * items.length;
  const totalGapSpace = chartW - totalBarSpace;
  const gap = totalGapSpace / (items.length + 1);

  items.forEach((item, i) => {
    const x = padding.left + gap + (barWidth + gap) * i;
    const barH = (item.value / maxVal) * chartH;
    const y = padding.top + chartH - barH;

    // Bar with rounded top
    ctx.fillStyle = "#0d2137";
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barH, [4, 4, 0, 0]);
    ctx.fill();

    // Value
    ctx.fillStyle = "#1a1a1a";
    ctx.font = "bold 12px system-ui";
    ctx.textAlign = "center";
    ctx.fillText(`$${item.value.toFixed(2)}`, x + barWidth / 2, y - 8);

    // Label
    ctx.fillStyle = "#666";
    ctx.font = "11px system-ui";
    ctx.fillText(item.label, x + barWidth / 2, height - 15);
  });
}
