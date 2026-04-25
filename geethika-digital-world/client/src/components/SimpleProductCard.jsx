import { Heart } from 'lucide-react';
import { useState } from 'react';

const SimpleProductCard = ({ image, title, description, price, onClick }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div 
      className="card-premium group cursor-pointer h-full flex flex-col"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="aspect-square overflow-hidden relative bg-gray-50">
        <img
          src={image || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=400&fit=crop'}
          alt={title || "Gift product"}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Wishlist Heart */}
        <button
          className="absolute top-4 right-4 z-10 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-sm transition-all hover:bg-white hover:scale-110"
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isLiked ? 'fill-[var(--color-primary)] text-[var(--color-primary)]' : 'text-gray-400'}`}
          />
        </button>

        {/* Badge (Optional) */}
        <div className="absolute top-4 left-4">
          <span className="bg-[var(--color-primary)] text-white text-[10px] font-bold px-2 py-1 rounded-sm uppercase tracking-tighter">New</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="font-display font-bold text-lg text-gray-900 mb-1 group-hover:text-[var(--color-primary)] transition-colors">
          {title || "Custom Gift Item"}
        </h3>
        <p className="text-gray-500 font-body text-xs line-clamp-2 mb-4 leading-relaxed">
          {description || "Personalized gifts crafted with love for your special ones."}
        </p>
        
        <div className="mt-auto flex items-center justify-between gap-4">
          <p className="font-display font-bold text-lg text-[var(--color-primary)]">
            ₹{Math.round(price)}
          </p>
          <button
            className="btn-accent !px-4 !py-2 !text-[10px] !rounded-sm whitespace-nowrap"
            onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
          >
            Customize Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default SimpleProductCard;
