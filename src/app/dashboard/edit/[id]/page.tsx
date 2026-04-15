"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Article = {
  id: string;
  headline: string;
  subheadline: string | null;
  title: string;
  slug: string;
  author: string;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
};

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    headline: "",
    subheadline: "",
    title: "",
    slug: "",
    author: "",
    status: "draft",
  });

  useEffect(() => {
    async function fetchArticle() {
      try {
        const res = await fetch(`/api/articles/${id}`);
        if (!res.ok) throw new Error("Article not found");
        const data = await res.json();
        const article: Article = data.article;
        setForm({
          headline: article.headline || "",
          subheadline: article.subheadline || "",
          title: article.title || "",
          slug: article.slug || "",
          author: article.author || "",
          status: article.status || "draft",
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent, status: string = form.status) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });

      if (!res.ok) {
        throw new Error("Failed to update article");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <p className="text-gray-500">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-navy text-white px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-sm text-white/70 hover:text-white">
              ← Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold">Edit Article</h1>
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
              {saving ? "Saving..." : form.status === "published" ? "Update" : "Publish"}
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
              onChange={(e) => setForm({ ...form, headline: e.target.value })}
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

          {/* Author */}
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

          {/* Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </form>
      </main>
    </div>
  );
}
