-- Create files table for organizing snippets
CREATE TABLE IF NOT EXISTS files (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create code_snippets table
CREATE TABLE IF NOT EXISTS code_snippets (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  code TEXT,
  language VARCHAR(50) DEFAULT 'javascript',
  screenshot_url TEXT,
  file_id INTEGER REFERENCES files(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert some default files
INSERT INTO files (name, description) VALUES 
  ('JavaScript Utils', 'Utility functions and helpers'),
  ('React Components', 'Reusable React components'),
  ('CSS Snippets', 'Useful CSS code snippets'),
  ('Python Scripts', 'Python automation and scripts')
ON CONFLICT DO NOTHING;
