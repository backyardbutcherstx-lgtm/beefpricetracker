-- Create article status enum
CREATE TYPE article_status AS ENUM ('published', 'draft', 'paused', 'deleted');

-- Create content_articles table
CREATE TABLE content_articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  author TEXT,
  headline TEXT,
  subheadline TEXT,
  status article_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX ON content_articles(status);
CREATE INDEX ON content_articles(updated_at DESC);
