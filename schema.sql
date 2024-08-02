DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS blog_tags;

CREATE TABLE IF NOT EXISTS blogs (id INTEGER PRIMARY KEY, notion_page_id TEXT UNIQUE, slug TEXT, heading TEXT, status TEXT, tags TEXT, published_at NUMERIC, created_at NUMERIC, updated_at NUMERIC);
CREATE UNIQUE INDEX blogs_notion_page_id ON blogs (notion_page_id);

CREATE TABLE IF NOT EXISTS blog_tags (id INTEGER PRIMARY KEY, notion_tag_id TEXT, name TEXT UNIQUE, colour TEXT);
CREATE UNIQUE INDEX blog_tags_notion_tag_id ON blog_tags (notion_tag_id);
