import { Heart, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

const SimpleProductCard = ({ image, price, onClick }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <div 
      className="card-romantic group cursor-pointer relative"
      onClick={onClick}
    >
      {/* Wishlist Heart */}
      <button
        className="absolute top-3 right-3 z-10 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
        onClick={(e) => {
          e.stopPropagation();
          setIsLiked(!isLiked);
        }}
      >
        <Heart 
          className={`w-5 h-5 transition-all ${
            isLiked 
              ? 'fill-orange-primary text-orange-primary' 
              : 'text-gray-400 hover:text-orange-primary'
          }`}
        />
      </button>

      <div className="aspect-[4/3] overflow-hidden relative bg-gray-100">
        <img
          src={image || 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop'}
          alt="Gift product"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1513885535751-8b9238bd345a?w=400&h=300&fit=crop';
          }}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      
      <div className="p-4 text-center bg-card space-y-3">
        <p className="font-display text-xl md:text-2xl font-bold text-orange-primary">
          ₹{Math.round(price)}
        </p>
        <button className="btn-romantic w-full text-sm py-2.5 inline-flex items-center justify-center gap-2 group-hover:shadow-xl">
          <ShoppingCart className="w-4 h-4" />
          <span>Add to Cart</span>
        </button>
      </div>
    </div>
  );
};

export default SimpleProductCard;
