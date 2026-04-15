"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import useSWR from "swr";

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

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ContentDashboard() {
  const { data, error, isLoading, mutate } = useSWR<{ articles: Article[] }>(
    "/api/articles",
    fetcher
  );

  const [filter, setFilter] = useState<"all" | "draft" | "published" | "archived">("all");

  const articles = data?.articles || [];
  const filteredArticles = filter === "all" 
    ? articles 
    : articles.filter((a) => a.status === filter);

  const counts = {
    all: articles.length,
    draft: articles.filter((a) => a.status === "draft").length,
    published: articles.filter((a) => a.status === "published").length,
    archived: articles.filter((a) => a.status === "archived").length,
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    await fetch(`/api/articles/${id}`, { method: "DELETE" });
    mutate();
  };

  const handleStatusChange = async (id: number, status: string) => {
    await fetch(`/api/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    mutate();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]">
      {/* Header */}
      <header className="bg-navy text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm text-white/70 hover:text-white">
              ← Back to Site
            </Link>
            <h1 className="text-xl font-bold">Content Dashboard</h1>
          </div>
          <Link
            href="/dashboard/new"
            className="bg-gold hover:bg-gold/90 text-navy font-semibold px-4 py-2 rounded text-sm transition"
          >
            + New Article
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "All Articles", value: counts.all, key: "all" },
            { label: "Drafts", value: counts.draft, key: "draft" },
            { label: "Published", value: counts.published, key: "published" },
            { label: "Archived", value: counts.archived, key: "archived" },
          ].map((stat) => (
            <button
              key={stat.key}
              onClick={() => setFilter(stat.key as typeof filter)}
              className={`p-4 rounded-lg border text-left transition ${
                filter === stat.key
                  ? "bg-navy text-white border-navy"
                  : "bg-white border-gray-200 hover:border-navy/30"
              }`}
            >
              <p className={`text-2xl font-bold ${filter === stat.key ? "text-white" : "text-navy"}`}>
                {stat.value}
              </p>
              <p className={`text-sm ${filter === stat.key ? "text-white/70" : "text-gray-500"}`}>
                {stat.label}
              </p>
            </button>
          ))}
        </div>

        {/* Articles Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="font-semibold text-navy">
              {filter === "all" ? "All Articles" : `${filter.charAt(0).toUpperCase() + filter.slice(1)} Articles`}
            </h2>
          </div>

          {isLoading ? (
            <div className="px-6 py-12 text-center text-gray-500">Loading articles...</div>
          ) : error ? (
            <div className="px-6 py-12 text-center text-red-500">Failed to load articles</div>
          ) : filteredArticles.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              No articles found.{" "}
              <Link href="/dashboard/new" className="text-gold hover:underline">
                Create your first article
              </Link>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-semibold">Headline</th>
                  <th className="px-6 py-3 font-semibold">Author</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Updated</th>
                  <th className="px-6 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredArticles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <Link
                        href={`/dashboard/edit/${article.id}`}
                        className="font-medium text-navy hover:text-gold transition"
                      >
                        {article.headline}
                      </Link>
                      <p className="text-xs text-gray-400 mt-0.5">/{article.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{article.author}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={article.status}
                        onChange={(e) => handleStatusChange(article.id, e.target.value)}
                        className={`text-xs font-medium px-2 py-1 rounded border-none cursor-pointer ${
                          article.status === "published"
                            ? "bg-green-100 text-green-700"
                            : article.status === "draft"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(article.updated_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/articles/${article.slug}`}
                          target="_blank"
                          className="text-sm text-teal hover:text-teal/80 transition"
                        >
                          View
                        </Link>
                        <Link
                          href={`/dashboard/edit/${article.id}`}
                          className="text-sm text-navy hover:text-gold transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(article.id)}
                          className="text-sm text-red-500 hover:text-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
