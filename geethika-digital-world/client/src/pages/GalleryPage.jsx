import { useState } from 'react';
import { X } from 'lucide-react';

const galleryImages = [
  {
    id: 1,
    category: 'Wedding Photography',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
    title: 'Beautiful Wedding Ceremony',
  },
  {
    id: 2,
    category: 'Couple Photoshoot',
    image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800',
    title: 'Romantic Couple Session',
  },
  {
    id: 3,
    category: 'Event Decor',
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800',
    title: 'Elegant Event Setup',
  },
  {
    id: 4,
    category: 'Wedding Photography',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?w=800',
    title: 'Wedding Moments',
  },
  {
    id: 5,
    category: 'Couple Photoshoot',
    image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800',
    title: 'Love Story',
  },
  {
    id: 6,
    category: 'Event Decor',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800',
    title: 'Floral Arrangements',
  },
  {
    id: 7,
    category: 'Wedding Photography',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800',
    title: 'Special Moments',
  },
  {
    id: 8,
    category: 'Couple Photoshoot',
    image: 'https://images.unsplash.com/photo-1529634597447-89a7c5d8c7f4?w=800',
    title: 'Engagement Session',
  },
  {
    id: 9,
    category: 'Event Decor',
    image: 'https://images.unsplash.com/photo-1478146896981-b80fe463b330?w=800',
    title: 'Venue Decoration',
  },
];

const categories = ['All', 'Wedding Photography', 'Couple Photoshoot', 'Event Decor'];

const GalleryPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = selectedCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-valentine-red mb-4 italic">
            Our Gallery
          </h1>
          <p className="text-lg text-gray-700">
            Explore our portfolio of beautiful moments captured
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-8 py-3 rounded-full font-semibold transition-all shadow-md ${
                selectedCategory === category
                  ? 'bg-valentine-red text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-valentine-pink/20 hover:scale-105'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map((image) => (
            <div
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border border-valentine-pink/20"
            >
              <img
                src={image.image}
                alt={image.title}
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <p className="text-sm font-semibold mb-1">{image.category}</p>
                  <h3 className="text-xl font-bold">{image.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-5xl w-full">
            <img
              src={selectedImage.image}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="text-white text-center mt-4">
              <p className="text-sm mb-1">{selectedImage.category}</p>
              <h3 className="text-2xl font-bold">{selectedImage.title}</h3>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
