import { useState, useEffect } from 'react';
import { X, Images } from 'lucide-react';

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
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/gallery`);
        if (response.ok) {
          const data = await response.json();
          if (data.images && data.images.length > 0) {
            setImages(data.images);
            const uniqueCategories = ['All', ...new Set(data.images.map(img => img.category))];
            setCategories(uniqueCategories);
            return;
          }
        }
      } catch (e) {
        console.log('API fetch failed, using empty state');
      }
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
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>

      {/* Page Header */}
      <div className="relative py-10 sm:py-14 md:py-18 border-b" style={{ backgroundColor: 'var(--color-bg-hero)', borderColor: 'rgba(168,213,213,0.4)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Images className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: 'var(--color-teal-500)' }} />
            <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl tracking-wide" style={{ color: 'var(--color-text-dark)' }}>
              Our Gallery
            </h1>
          </div>
          <p className="font-body text-sm sm:text-base md:text-lg ml-10 sm:ml-12" style={{ color: 'var(--color-text-mid)' }}>
            Explore our portfolio of beautiful moments captured
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14">

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-8 sm:mb-10 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-body font-semibold transition-all text-xs sm:text-sm uppercase tracking-widest border"
              style={
                selectedCategory === category
                  ? {
                    backgroundColor: 'var(--color-navy-800)',
                    color: 'white',
                    borderColor: 'var(--color-navy-800)',
                    boxShadow: '0 4px 14px rgba(18,42,60,0.2)',
                    transform: 'scale(1.05)',
                  }
                  : {
                    backgroundColor: 'white',
                    color: 'var(--color-text-mid)',
                    borderColor: 'rgba(168,213,213,0.5)',
                  }
              }
              onMouseEnter={e => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.borderColor = 'var(--color-teal-400)';
                  e.currentTarget.style.color = 'var(--color-teal-500)';
                }
              }}
              onMouseLeave={e => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.borderColor = 'rgba(168,213,213,0.5)';
                  e.currentTarget.style.color = 'var(--color-text-mid)';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: 'var(--color-teal-400)' }}></div>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20">
            <Images className="w-14 h-14 mx-auto mb-4 opacity-30" style={{ color: 'var(--color-teal-400)' }} />
            <p className="font-body text-base sm:text-lg" style={{ color: 'var(--color-text-mid)' }}>
              No images available in this category yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="group relative overflow-hidden rounded-xl cursor-pointer border transition-all duration-300 hover:-translate-y-1 bg-white"
                style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 10px rgba(26,43,53,0.06)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 14px 36px rgba(61,138,138,0.15)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(26,43,53,0.06)'}
              >
                <div className="overflow-hidden" style={{ backgroundColor: 'var(--color-teal-50)' }}>
                  <img
                    src={image.image_url?.startsWith('http') ? image.image_url : `${import.meta.env.VITE_API_URL}${image.image_url}`}
                    alt={image.title}
                    className="w-full h-52 sm:h-60 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4"
                  style={{ background: 'linear-gradient(to top, rgba(18,42,60,0.75), rgba(18,42,60,0.15), transparent)' }}>
                  <p className="font-body font-semibold text-xs uppercase tracking-widest mb-1 translate-y-3 group-hover:translate-y-0 transition-transform duration-300"
                    style={{ color: 'var(--color-teal-200)' }}>{image.category}</p>
                  <h3 className="font-display font-semibold text-base sm:text-lg text-white translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {image.title}
                  </h3>
                  {image.description && (
                    <p className="font-body text-xs sm:text-sm mt-1 line-clamp-2 translate-y-3 group-hover:translate-y-0 transition-transform duration-300 delay-100"
                      style={{ color: 'rgba(255,255,255,0.7)' }}>
                      {image.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
          style={{ backgroundColor: 'rgba(10,26,38,0.92)' }}
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 p-2 rounded-full transition-all"
            style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: 'white' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(91,163,163,0.4)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
            aria-label="Close"
          >
            <X className="w-7 h-7 sm:w-8 sm:h-8" />
          </button>

          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image_url?.startsWith('http') ? selectedImage.image_url : `${import.meta.env.VITE_API_URL}${selectedImage.image_url}`}
              alt={selectedImage.title}
              className="w-full h-auto max-h-[75vh] object-contain rounded-xl shadow-2xl border"
              style={{ borderColor: 'rgba(168,213,213,0.2)' }}
            />
            <div className="text-center mt-5">
              <p className="font-body font-semibold text-xs uppercase tracking-widest mb-2" style={{ color: 'var(--color-teal-300)' }}>
                {selectedImage.category}
              </p>
              <h3 className="font-display font-semibold text-xl sm:text-2xl md:text-3xl text-white tracking-wide">
                {selectedImage.title}
              </h3>
              {selectedImage.description && (
                <p className="font-body text-sm sm:text-base mt-2 max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {selectedImage.description}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
