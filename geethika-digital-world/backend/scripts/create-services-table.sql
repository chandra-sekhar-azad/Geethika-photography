-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  image_public_id VARCHAR(255),
  price_range VARCHAR(100),
  features TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- Insert sample services
INSERT INTO services (name, slug, description, price_range, features, is_active) VALUES
('Photography Services', 'photography-services', 'Professional photography for all occasions', '₹5,000 - ₹25,000', ARRAY['Professional equipment', 'Experienced photographers', 'High-resolution images', 'Same-day delivery available'], true),
('Videography Services', 'videography-services', 'Cinematic videography and editing', '₹10,000 - ₹50,000', ARRAY['4K video recording', 'Professional editing', 'Drone shots available', 'Quick turnaround'], true),
('Event Decoration', 'event-decoration', 'Beautiful decorations for your special events', '₹8,000 - ₹40,000', ARRAY['Custom themes', 'Balloon decorations', 'Floral arrangements', 'Stage setup'], true)
ON CONFLICT (slug) DO NOTHING;

SELECT 'Services table created successfully!' as message;
