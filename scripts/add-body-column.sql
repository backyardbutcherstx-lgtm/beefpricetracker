-- Add body column to content_articles table
ALTER TABLE content_articles 
ADD COLUMN IF NOT EXISTS body TEXT;
