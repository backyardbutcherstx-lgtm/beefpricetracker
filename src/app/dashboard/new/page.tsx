"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "@/components/RichTextEditor";

const CATEGORIES = [
  "Market Analysis",
  "Saving Money",
  "Buying Guide",
  "Consumer Guide",
  "Price Analysis",
  "Company Profile",
];

export default function NewArticlePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    headline: "",
    subheadline: "",
    title: "",
    slug: "",
    author: "",
    body: "",
    category: "Market Analysis",
    image_url: "",
    status: "draft",
  });

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleHeadlineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const headline = e.target.value;
    setForm((prev) => ({
      ...prev,
      headline,
      title: prev.title || headline,
      slug: prev.slug || generateSlug(headline),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, status: string = form.status) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to create article");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-navy text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">
              ← Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold">New Article</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => handleSubmit(e, "draft")}
              disabled={saving}
              className="bg-white/10 hover:bg-white/20 text-white font-medium px-4 py-2 rounded text-sm transition disabled:opacity-50"
            >
              Save Draft
            </button>
            <button
              onClick={(e) => handleSubmit(e, "published")}
              disabled={saving}
              className="bg-gold hover:bg-gold/90 text-navy font-semibold px-4 py-2 rounded text-sm transition disabled:opacity-50"
            >
              {saving ? "Publishing..." : "Publish"}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Headline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Headline
            </label>
            <input
              type="text"
              value={form.headline}
              onChange={handleHeadlineChange}
              placeholder="Enter article headline..."
              required
              className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
          </div>

          {/* Subheadline */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subheadline
            </label>
            <textarea
              value={form.subheadline}
              onChange={(e) => setForm({ ...form, subheadline: e.target.value })}
              placeholder="Brief summary or teaser for the article..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy resize-y"
            />
          </div>

          {/* Title & Slug */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SEO Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="SEO-optimized title"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Slug
              </label>
              <div className="flex items-center">
                <span className="text-gray-400 mr-1">/articles/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="article-slug"
                  required
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
                />
              </div>
            </div>
          </div>

          {/* Author & Category */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={form.author}
                onChange={(e) => setForm({ ...form, author: e.target.value })}
                placeholder="Author name and title"
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Featured Image */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Featured Image URL
            </label>
            <input
              type="url"
              value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })}
              placeholder="https://example.com/image.jpg"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            />
            <p className="text-xs text-gray-500 mt-2">
              Enter a URL for the article&apos;s featured image. Leave blank to use a default category image.
            </p>
            {form.image_url && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Preview:</p>
                <img 
                  src={form.image_url} 
                  alt="Featured image preview" 
                  className="max-h-40 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Body */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Article Body
            </label>
            <RichTextEditor
              value={form.body}
              onChange={(value) => setForm({ ...form, body: value })}
            />
          </div>
        </form>
      </main>
    </div>
  );
}
