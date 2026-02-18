import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    // In a real app, you would fetch from API
    // For now, let's use some dummy data or just fetch if endpoint exists
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      // Fallback to dummy data if API fails or is not implemented yet
      // This is just for demonstration if the API is not ready
      const dummyImages = [
        { id: 1, title: 'Wedding Photography', category: 'Wedding', image_url: '/images/wedding1.jpg', description: 'Captured moments from a beautiful wedding' },
        { id: 2, title: 'Event Decoration', category: 'Events', image_url: '/images/event1.jpg', description: 'Stunning floral decoration for reception' },
        { id: 3, title: 'Custom Gift', category: 'Gifts', image_url: '/images/gift1.jpg', description: 'Personalized photo frame' },
        // ... more images
      ];

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            setImages(data.images);
            // Extract unique categories
            const uniqueCategories = ['All', ...new Set(data.images.map(img => img.category))];
            setCategories(uniqueCategories);
            return;
          }
        }
      } catch (e) {
        console.log('API fetch failed, using fallback or empty state');
      }

      // If API fails, setImages([]) or dummy data depending on requirement. 
      // Proceeding with empty state as originally implemented in case of no data
      setImages([]);

    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(img => img.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="relative bg-black/50 py-8 sm:py-12 md:py-16 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-2 sm:mb-4 uppercase tracking-wide">
            Our Gallery
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-400">
            Explore our portfolio of beautiful moments captured
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-12">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full font-semibold transition-all shadow-md text-xs sm:text-sm md:text-base uppercase tracking-wider ${selectedCategory === category
                ? 'bg-orange-primary text-black shadow-lg shadow-orange-primary/20 scale-105'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-105 border border-gray-700'
                }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-primary"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No images available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border border-gray-800 hover:border-orange-primary/50"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${image.image_url}`}
                  alt={image.title}
                  className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs sm:text-sm font-semibold mb-1 capitalize text-orange-primary">{image.category}</p>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold uppercase tracking-wide">{image.title}</h3>
                    {image.description && (
                      <p className="text-xs sm:text-sm mt-1 text-gray-300 line-clamp-2">{image.description}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-400 hover:text-white transition-colors z-10"
          >
            <X className="w-8 h-8 sm:w-10 sm:h-10" />
          </button>
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={`${import.meta.env.VITE_API_URL}${selectedImage.image_url}`}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg shadow-2xl border border-gray-800"
            />
            <div className="text-center mt-4 sm:mt-6">
              <p className="text-sm font-semibold text-orange-primary mb-1 capitalize tracking-wider">{selectedImage.category}</p>
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white uppercase tracking-wide">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-base text-gray-400 mt-2 max-w-2xl mx-auto">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
