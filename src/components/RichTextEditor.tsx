"use client";

import { useState, useRef } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Quote,
  Image,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  Link as LinkIcon,
  Minus,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const ICONS = [
  { name: "TrendingUp", icon: TrendingUp, label: "Trending Up" },
  { name: "TrendingDown", icon: TrendingDown, label: "Trending Down" },
  { name: "DollarSign", icon: DollarSign, label: "Dollar Sign" },
  { name: "AlertCircle", icon: AlertCircle, label: "Alert" },
  { name: "CheckCircle", icon: CheckCircle, label: "Check" },
  { name: "Info", icon: Info, label: "Info" },
  { name: "Lightbulb", icon: Lightbulb, label: "Tip" },
  { name: "BarChart3", icon: BarChart3, label: "Chart" },
];

export default function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [showChartBuilder, setShowChartBuilder] = useState(false);
  const [showImageUrl, setShowImageUrl] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageAlt, setImageAlt] = useState("");

  const insertAtCursor = (before: string, after: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    
    onChange(newText);
    
    // Set cursor position after insertion
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const wrapSelection = (tag: string, className?: string) => {
    const classAttr = className ? ` class="${className}"` : "";
    insertAtCursor(`<${tag}${classAttr}>`, `</${tag}>`);
  };

  const insertBlock = (html: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newText = value.substring(0, start) + "\n\n" + html + "\n\n" + value.substring(start);
    onChange(newText);
  };

  const insertIcon = (iconName: string) => {
    insertAtCursor(`<span data-icon="${iconName}" class="inline-icon"></span>`);
    setShowIconPicker(false);
  };

  const insertImage = () => {
    if (imageUrl) {
      insertBlock(`<figure class="article-image">
  <img src="${imageUrl}" alt="${imageAlt || 'Article image'}" class="rounded-lg w-full" />
  ${imageAlt ? `<figcaption class="text-sm text-gray-500 mt-2 text-center">${imageAlt}</figcaption>` : ""}
</figure>`);
      setImageUrl("");
      setImageAlt("");
      setShowImageUrl(false);
    }
  };

  const insertChart = (chartType: "price-trend" | "comparison" | "stats") => {
    const chartData = {
      "price-trend": `<div data-chart="price-trend" class="article-chart">
  <div class="chart-title">Beef Price Trend (2024-2026)</div>
  <div class="chart-data" data-values="5.99,6.25,6.49,6.75,7.10,7.45,7.89,8.15,8.49" data-labels="Jan 24,Apr 24,Jul 24,Oct 24,Jan 25,Apr 25,Jul 25,Oct 25,Jan 26"></div>
</div>`,
      "comparison": `<div data-chart="comparison" class="article-chart">
  <div class="chart-title">Price Comparison by Cut</div>
  <div class="chart-data" data-items='[{"label":"Ground Beef","value":8.49},{"label":"Chuck Roast","value":7.99},{"label":"Ribeye","value":18.99},{"label":"Sirloin","value":12.49}]'></div>
</div>`,
      "stats": `<div class="stats-grid">
  <div class="stat-card">
    <div class="stat-value text-red-600">+23%</div>
    <div class="stat-label">Price Increase YoY</div>
  </div>
  <div class="stat-card">
    <div class="stat-value text-navy">$8.49</div>
    <div class="stat-label">Avg Ground Beef/lb</div>
  </div>
  <div class="stat-card">
    <div class="stat-value text-green-600">30%</div>
    <div class="stat-label">Bulk Buying Savings</div>
  </div>
</div>`,
    };
    insertBlock(chartData[chartType]);
    setShowChartBuilder(false);
  };

  const insertCallout = (type: "tip" | "warning" | "info") => {
    const callouts = {
      tip: `<div class="callout callout-tip">
  <div class="callout-icon">💡</div>
  <div class="callout-content">
    <strong>Pro Tip:</strong> Your tip content here...
  </div>
</div>`,
      warning: `<div class="callout callout-warning">
  <div class="callout-icon">⚠️</div>
  <div class="callout-content">
    <strong>Important:</strong> Your warning content here...
  </div>
</div>`,
      info: `<div class="callout callout-info">
  <div class="callout-icon">ℹ️</div>
  <div class="callout-content">
    Your informational content here...
  </div>
</div>`,
    };
    insertBlock(callouts[type]);
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 bg-gray-50 p-2 flex flex-wrap gap-1">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-300">
          <button
            type="button"
            onClick={() => wrapSelection("strong")}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Bold"
          >
            <Bold size={16} />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("em")}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Italic"
          >
            <Italic size={16} />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("u")}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Underline"
          >
            <Underline size={16} />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-300">
          <button
            type="button"
            onClick={() => wrapSelection("h2", "text-2xl font-bold text-gray-900 mt-10 mb-4")}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Heading 2"
          >
            <Heading1 size={16} />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("h3", "text-xl font-semibold text-gray-900 mt-8 mb-3")}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Heading 3"
          >
            <Heading2 size={16} />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("h4", "text-lg font-semibold text-gray-800 mt-6 mb-2")}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Heading 4"
          >
            <Heading3 size={16} />
          </button>
        </div>

        {/* Lists & Quote */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-300">
          <button
            type="button"
            onClick={() => insertBlock(`<ul class="list-disc pl-6 mb-6 space-y-2 text-gray-700">\n  <li>Item 1</li>\n  <li>Item 2</li>\n  <li>Item 3</li>\n</ul>`)}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Bullet List"
          >
            <List size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertBlock(`<ol class="list-decimal pl-6 mb-6 space-y-2 text-gray-700">\n  <li>Step 1</li>\n  <li>Step 2</li>\n  <li>Step 3</li>\n</ol>`)}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Numbered List"
          >
            <ListOrdered size={16} />
          </button>
          <button
            type="button"
            onClick={() => wrapSelection("blockquote", "border-l-4 border-navy pl-4 italic text-gray-600 my-6")}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Quote"
          >
            <Quote size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertBlock(`<hr class="my-8 border-gray-200" />`)}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Divider"
          >
            <Minus size={16} />
          </button>
        </div>

        {/* Media & Rich Content */}
        <div className="flex items-center gap-1 px-2 border-r border-gray-300">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowImageUrl(!showImageUrl)}
              className="p-2 hover:bg-gray-200 rounded transition"
              title="Insert Image"
            >
              <Image size={16} />
            </button>
            {showImageUrl && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 z-10 w-72">
                <input
                  type="text"
                  placeholder="Image URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                />
                <input
                  type="text"
                  placeholder="Alt text / caption"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                />
                <button
                  type="button"
                  onClick={insertImage}
                  className="w-full bg-navy text-white py-2 rounded text-sm hover:bg-navy/90"
                >
                  Insert Image
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => {
              const url = prompt("Enter link URL:");
              if (url) wrapSelection(`a href="${url}" class="text-navy underline hover:text-gold"`, "</a>");
            }}
            className="p-2 hover:bg-gray-200 rounded transition"
            title="Insert Link"
          >
            <LinkIcon size={16} />
          </button>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowIconPicker(!showIconPicker)}
              className="p-2 hover:bg-gray-200 rounded transition flex items-center gap-1"
              title="Insert Icon"
            >
              <TrendingUp size={16} />
            </button>
            {showIconPicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 grid grid-cols-4 gap-1 w-48">
                {ICONS.map((icon) => (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => insertIcon(icon.name)}
                    className="p-2 hover:bg-gray-100 rounded transition flex items-center justify-center"
                    title={icon.label}
                  >
                    <icon.icon size={18} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Charts & Callouts */}
        <div className="flex items-center gap-1 px-2">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowChartBuilder(!showChartBuilder)}
              className="p-2 hover:bg-gray-200 rounded transition"
              title="Insert Chart"
            >
              <BarChart3 size={16} />
            </button>
            {showChartBuilder && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-2 z-10 w-48">
                <button
                  type="button"
                  onClick={() => insertChart("price-trend")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                >
                  Price Trend Chart
                </button>
                <button
                  type="button"
                  onClick={() => insertChart("comparison")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                >
                  Comparison Chart
                </button>
                <button
                  type="button"
                  onClick={() => insertChart("stats")}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 rounded text-sm"
                >
                  Stats Grid
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => insertCallout("tip")}
            className="p-2 hover:bg-gray-200 rounded transition text-yellow-600"
            title="Insert Tip"
          >
            <Lightbulb size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertCallout("warning")}
            className="p-2 hover:bg-gray-200 rounded transition text-orange-600"
            title="Insert Warning"
          >
            <AlertCircle size={16} />
          </button>
          <button
            type="button"
            onClick={() => insertCallout("info")}
            className="p-2 hover:bg-gray-200 rounded transition text-blue-600"
            title="Insert Info"
          >
            <Info size={16} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your article content here..."
        rows={25}
        className="w-full px-4 py-3 focus:outline-none resize-y font-mono text-sm leading-relaxed"
      />

      {/* Help Text */}
      <div className="border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500">
        Use the toolbar to format text, add images, charts, and callouts. HTML tags are supported.
      </div>
    </div>
  );
}
