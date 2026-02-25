import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const SimpleProductCard = ({ image, price, onClick }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div
      className="group cursor-pointer relative rounded-xl overflow-hidden border transition-all duration-300 hover:-translate-y-1 bg-white"
      style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 10px rgba(26,43,53,0.06)' }}
      onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 32px rgba(61,138,138,0.15)'}
      onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(26,43,53,0.06)'}
      onClick={onClick}
    >
      {/* Wishlist Heart */}
      <button
        className="absolute top-3 right-3 z-10 bg-white/95 p-2 rounded-full shadow-md transition-all hover:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
      >
        <Heart
          className={`w-4 h-4 transition-all ${isLiked ? 'fill-current' : ''}`}
          style={{ color: isLiked ? 'var(--color-teal-500)' : 'var(--color-text-light)' }}
        />
      </button>

      <div className="aspect-[4/3] overflow-hidden relative" style={{ backgroundColor: 'var(--color-teal-50)' }}>
        <img
          src={image || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop'}
          alt="Gift product"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop';
          }}
        />
        {/* Dark navy gradient overlay on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{ background: 'linear-gradient(to top, rgba(18,42,60,0.25), transparent)' }} />
      </div>

      <div className="p-3 text-center space-y-2.5">
        <p className="font-display text-lg md:text-xl font-semibold" style={{ color: 'var(--color-teal-500)' }}>
          ₹{Math.round(price)}
        </p>
        <button
          className="btn-primary w-full text-xs py-2 inline-flex items-center justify-center gap-1.5"
          onClick={(e) => { e.stopPropagation(); onClick && onClick(); }}
        >
          <ShoppingCart className="w-3.5 h-3.5" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleProductCard;
