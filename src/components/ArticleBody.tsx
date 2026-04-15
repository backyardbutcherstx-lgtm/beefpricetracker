"use client";

interface ArticleBodyProps {
  content: string;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  return (
    <div className="article-body">
      <style jsx global>{`
        /* Professional Publication Typography */
        .article-body {
          font-family: Georgia, 'Times New Roman', serif;
          color: #2d2d2d;
          font-size: 1.125rem;
          line-height: 1.85;
        }

        /* First paragraph with drop cap */
        .article-body > p:first-of-type::first-letter {
          float: left;
          font-size: 4.25rem;
          line-height: 0.85;
          font-weight: 700;
          margin-right: 0.6rem;
          margin-top: 0.15rem;
          color: #0d2137;
          font-family: Georgia, serif;
        }

        .article-body > p:first-of-type {
          font-size: 1.25rem;
          line-height: 1.8;
        }

        /* Headings with section dividers */
        .article-body h2 {
          font-size: 1.625rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
          padding-top: 1.75rem;
          border-top: 1px solid #d4d4d4;
          font-family: Georgia, serif;
          letter-spacing: -0.01em;
        }

        .article-body > h2:first-child {
          margin-top: 0;
          padding-top: 0;
          border-top: none;
        }

        .article-body h3 {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
          font-family: Georgia, serif;
        }

        /* Paragraphs */
        .article-body p {
          margin-bottom: 1.5rem;
          color: #2d2d2d;
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

        /* Emphasis */
        .article-body em {
          font-style: italic;
        }

        /* Lists */
        .article-body ul,
        .article-body ol {
          margin-bottom: 1.5rem;
          padding-left: 1.75rem;
        }

        .article-body ul {
          list-style-type: disc;
        }

        .article-body ol {
          list-style-type: decimal;
        }

        .article-body li {
          margin-bottom: 0.625rem;
          padding-left: 0.375rem;
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
          font-size: 1.1875rem;
          line-height: 1.75;
          margin-bottom: 0.5rem;
        }

        .article-body blockquote cite {
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

        /* Key stats callout box */
        .article-body .key-stat {
          background: #0d2137;
          color: white;
          padding: 1.5rem 2rem;
          border-radius: 0.5rem;
          margin: 2rem 0;
          font-family: system-ui, -apple-system, sans-serif;
        }

        .article-body .key-stat strong {
          color: #d4a017;
          font-size: 2rem;
          display: block;
          margin-bottom: 0.25rem;
        }

        /* Tip/Info boxes */
        .article-body .tip-box {
          background: #fefce8;
          border-left: 4px solid #d4a017;
          padding: 1.25rem 1.5rem;
          margin: 2rem 0;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 0.9375rem;
          line-height: 1.6;
          border-radius: 0 0.5rem 0.5rem 0;
        }

        .article-body .tip-box strong {
          display: block;
          margin-bottom: 0.5rem;
          color: #92400e;
        }

        /* Table styling */
        .article-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 2rem 0;
          font-family: system-ui, -apple-system, sans-serif;
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
      
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}
