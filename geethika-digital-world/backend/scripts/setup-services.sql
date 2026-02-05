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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_services_slug ON services(slug);

-- Insert initial services
INSERT INTO services (name, slug, description, price_range, image_url, is_active)
VALUES 
  ('Photography', 'photography', 'Professional photography services for all occasions - weddings, pre-wedding shoots, couple photoshoots, events, and more. Capture your special moments with our expert photographers.', '₹5,999 - ₹25,000', '/services/photography.jpg', true),
  ('Videography', 'videography', 'Cinematic videography services to capture your special moments in motion. From wedding films to event coverage, we create stunning videos that tell your story.', '₹10,000 - ₹30,000', '/services/videography.jpg', true),
  ('Event Decor', 'event-decor', 'Beautiful decoration services for all your events - birthdays, weddings, anniversaries, and more. We transform your venue into a magical space.', '₹5,000 - ₹50,000', '/services/event-decor.png', true),
  ('Home Redecor', 'home-redecor', 'Transform your home with our professional interior design and redecoration services. From single rooms to complete home makeovers.', '₹15,000 - ₹75,000', '/services/home-redecor.jpg', true),
  ('Shop Redecor', 'shop-redecor', 'Professional shop and store interior design services to attract customers and enhance your business space. Custom designs for retail spaces.', '₹25,000 - ₹1,00,000', '/services/shop-redecor.jpg', true),
  ('Return Gifts', 'return-gifts', 'Unique and personalized return gifts for all occasions. Make your guests feel special with our curated collection of memorable gifts.', '₹50 - ₹500 per piece', NULL, true)
ON CONFLICT (slug) DO NOTHING;
