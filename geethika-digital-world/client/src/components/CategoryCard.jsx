import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ image, title, onClick }) => {
  return (
    <div 
      className="card-romantic group cursor-pointer relative"
      onClick={onClick}
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-valentine-red/80 via-valentine-red/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <div className="flex items-center gap-2 text-white font-semibold">
            <span>Shop Now</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>
      <div className="p-4 text-center bg-card">
        <h3 className="font-body text-sm md:text-base font-semibold text-foreground group-hover:text-valentine-red transition-colors">
          {title}
        </h3>
      </div>
    </div>
  );
};

export default CategoryCard;
