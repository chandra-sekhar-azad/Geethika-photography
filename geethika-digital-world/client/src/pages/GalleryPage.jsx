import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const GalleryPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState(null);
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`);
      const data = await response.json();
      
      if (data.images && data.images.length > 0) {
        setImages(data.images);
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(data.images.map(img => img.category))];
        setCategories(uniqueCategories);
      }
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
    <div className="min-h-screen bg-background">
      <div className="relative bg-gradient-to-r from-valentine-pink/30 to-valentine-red/20 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-valentine-red mb-2 sm:mb-4 italic">
            Our Gallery
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700">
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
              className={`px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-full font-semibold transition-all shadow-md text-xs sm:text-sm md:text-base ${
                selectedCategory === category
                  ? 'bg-valentine-red text-white shadow-lg scale-105'
                  : 'bg-white text-gray-700 hover:bg-valentine-pink/20 hover:scale-105'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valentine-red"></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No images available in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="group relative overflow-hidden rounded-xl sm:rounded-2xl shadow-lg cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl border border-valentine-pink/20"
              >
                <img
                  src={`${import.meta.env.VITE_API_URL}${image.image_url}`}
                  alt={image.title}
                  className="w-full h-56 sm:h-64 md:h-72 lg:h-80 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white">
                    <p className="text-xs sm:text-sm font-semibold mb-1 capitalize">{image.category}</p>
                    <h3 className="text-base sm:text-lg md:text-xl font-bold">{image.title}</h3>
                    {image.description && (
                      <p className="text-xs sm:text-sm mt-1 opacity-90">{image.description}</p>
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
          className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 text-white hover:text-gray-300 transition-colors z-10"
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <div className="max-w-5xl w-full">
            <img
              src={`${import.meta.env.VITE_API_URL}${selectedImage.image_url}`}
              alt={selectedImage.title}
              className="w-full h-auto rounded-lg"
            />
            <div className="text-white text-center mt-3 sm:mt-4">
              <p className="text-xs sm:text-sm mb-1 capitalize">{selectedImage.category}</p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold">{selectedImage.title}</h3>
              {selectedImage.description && (
                <p className="text-sm sm:text-base mt-2 opacity-90">{selectedImage.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
