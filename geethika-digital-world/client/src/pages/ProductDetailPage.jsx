import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Upload, Star, ChevronRight, Minus, Plus, MessageSquare, Truck, ShieldCheck, ArrowRight, Edit3 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import ProductCard from '../components/ProductCard';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [customization, setCustomization] = useState({
    image: null,
    imagePreview: null,
    message: '',
  });

  useEffect(() => {
    fetchProduct();
    fetchRelatedProducts();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products?limit=4`);
      if (response.ok) {
        const data = await response.json();
        setRelatedProducts(data.products.filter(p => p.id !== id));
      }
    } catch (error) {
      console.error('Failed to fetch related products:', error);
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCustomization({
        ...customization,
        image: file,
        imagePreview: URL.createObjectURL(file),
      });
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      navigate('/login', { state: { from: { pathname: `/product/${product.id}` } } });
      return;
    }

    const cartItem = {
      id: product.id,
      name: product.name,
      image: product.image_url || product.image,
      price: product.price,
      quantity,
      customization: product.customizable ? {
        image: customization.imagePreview,
        message: customization.message,
      } : null,
    };

    addToCart(cartItem);
    navigate('/cart');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-gray-100 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h2 className="text-2xl font-display font-bold mb-4">Product not found</h2>
        <button onClick={() => navigate('/shop')} className="btn-primary">Back to Shop</button>
      </div>
    </div>
  );

  const images = [
    product.image_url || product.image,
    'https://images.unsplash.com/photo-1514228742587-6b1558fbed50?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=600&h=600&fit=crop',
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-white py-4">
        <div className="container-custom">
          <nav className="flex items-center gap-2 text-xs font-body font-bold tracking-widest text-gray-400 uppercase">
            <Link to="/shop" className="hover:text-[var(--color-primary)] transition-colors">Shop</Link>
            <ChevronRight className="w-3 h-3" />
            <Link to={`/shop/${product.category_slug || 'all'}`} className="hover:text-[var(--color-primary)] transition-colors">
              {product.category_name || 'Custom Gifts'}
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24">
          {/* Product Media */}
          <div className="flex gap-6">
            {/* Thumbnails */}
            <div className="hidden md:flex flex-col gap-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-[var(--color-primary)]' : 'border-gray-100'}`}
                >
                  <img src={img} className="w-full h-full object-cover" alt="Product thumbnail" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="relative flex-1 aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 shadow-2xl shadow-gray-200">
              <img src={images[selectedImage]} className="w-full h-full object-cover" alt={product.name} />
              <div className="absolute top-6 left-6">
                <span className="bg-gray-900 text-white text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-widest">
                  Best Seller
                </span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="animate-slide-up">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-gray-900 mb-4 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-display font-bold text-[var(--color-primary)]">₹{product.price}</span>
              <div className="flex items-center gap-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3 h-3 ${i < 4 ? 'fill-[#F7D060] text-[#F7D060]' : 'text-gray-200'}`} />
                  ))}
                </div>
                <span className="text-xs text-gray-400 font-body font-bold">(124 Reviews)</span>
              </div>
            </div>

            <p className="text-gray-500 font-body text-lg leading-relaxed mb-12">
              {product.description || "A high-quality personalized item crafted just for you. The perfect way to preserve your favorite memories and share them with the world."}
            </p>

            {/* Customization */}
            {product.customizable && (
              <div className="space-y-10 mb-12">
                {/* 1. Image Upload */}
                <div>
                  <h4 className="text-xs font-body font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">1. Personalize with image</h4>
                  <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 bg-gray-50/50 hover:bg-gray-50 hover:border-purple-200 transition-all text-center">
                    {customization.imagePreview ? (
                      <div className="relative group inline-block">
                        <img src={customization.imagePreview} className="max-h-40 rounded-xl shadow-lg" alt="Upload preview" />
                        <button 
                          onClick={() => setCustomization({...customization, image: null, imagePreview: null})}
                          className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                        >
                          <Plus className="w-4 h-4 rotate-45" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer block group">
                        <div className="w-14 h-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                          <Upload className="w-6 h-6 text-[var(--color-primary)]" />
                        </div>
                        <p className="text-sm font-body font-bold text-gray-700 mb-1">Upload Photo</p>
                        <p className="text-[10px] text-gray-400 font-body">High resolution JPG or PNG recommended</p>
                        <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                      </label>
                    )}
                  </div>
                </div>

                {/* 2. Custom Message */}
                <div>
                  <h4 className="text-xs font-body font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">2. Add a custom message</h4>
                  <textarea
                    placeholder="Write your heartfelt note here..."
                    value={customization.message}
                    onChange={(e) => setCustomization({...customization, message: e.target.value})}
                    className="w-full bg-gray-50 border-none rounded-2xl p-6 font-body text-sm text-gray-700 focus:ring-2 focus:ring-purple-100 h-32 resize-none transition-all"
                  />
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-10">
              <h4 className="text-xs font-body font-bold tracking-[0.2em] text-gray-400 uppercase mb-4">Quantity</h4>
              <div className="inline-flex items-center bg-gray-50 rounded-full px-2 py-1">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-body font-bold text-gray-900">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-gray-900"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <button 
                onClick={handleAddToCart}
                className="py-4 bg-[#8E447E] text-white rounded-xl font-body font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#7A3B6D] transition-all shadow-lg active:scale-95"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
              <button 
                onClick={handleAddToCart}
                className="py-4 bg-[#F7D060] text-gray-900 rounded-xl font-body font-bold text-sm flex items-center justify-center hover:bg-[#EAB308] transition-all shadow-lg active:scale-95"
              >
                <span>Customize & Order</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-8 text-[10px] font-body font-bold text-gray-400 uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#10B981]" />
                <span>Ships in 2-3 days</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-24">
          <div className="flex gap-12 border-b border-gray-100 mb-12">
            {[
              { id: 'description', label: 'Product Description' },
              { id: 'reviews', label: 'Customer Reviews (124)' },
              { id: 'shipping', label: 'Shipping & Returns' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 text-[10px] font-body font-bold tracking-widest uppercase transition-all relative ${activeTab === tab.id ? 'text-[var(--color-primary)]' : 'text-gray-400 hover:text-gray-600'}`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-primary)]" />}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
            <div className="lg:col-span-2">
              {activeTab === 'description' && (
                <div className="animate-fade-in">
                  <h3 className="text-3xl font-display font-bold text-gray-900 mb-6 italic">Unveil the Magic of Memories</h3>
                  <p className="text-gray-500 font-body leading-relaxed mb-10">
                    Our {product.name} is crafted from premium grade materials with a specialized finish. When at room temperature, the item appears as a sleek, matte vessel—perfectly inconspicuous. As you interact with it, the coating becomes transparent, revealing a vibrant, high-definition photo of your choice.
                  </p>
                  <div className="grid grid-cols-2 gap-y-10">
                    <div>
                      <h5 className="text-[10px] font-body font-bold tracking-widest text-gray-400 uppercase mb-2">Material</h5>
                      <p className="text-sm font-body text-gray-700">High-Quality Ceramic, BPA Free</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-body font-bold tracking-widest text-gray-400 uppercase mb-2">Capacity</h5>
                      <p className="text-sm font-body text-gray-700">11oz (325ml)</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-body font-bold tracking-widest text-gray-400 uppercase mb-2">Care</h5>
                      <p className="text-sm font-body text-gray-700">Handwash recommended to preserve coating</p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-body font-bold tracking-widest text-gray-400 uppercase mb-2">Print Tech</h5>
                      <p className="text-sm font-body text-gray-700">Thermodynamic Sublimation</p>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'reviews' && (
                <div className="animate-fade-in text-center py-20 bg-gray-50 rounded-2xl">
                  <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                  <p className="text-gray-400 font-body">Detailed reviews coming soon...</p>
                </div>
              )}
              {activeTab === 'shipping' && (
                <div className="animate-fade-in text-gray-500 font-body leading-relaxed">
                  <h3 className="text-2xl font-display font-bold text-gray-900 mb-4">Fast & Secure Shipping</h3>
                  <p className="mb-4">We ship worldwide from our Eluru studio. Orders are typically processed within 24-48 hours.</p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>Domestic (India): 3-5 business days</li>
                    <li>International: 7-14 business days</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Sidebar / What Curators Say */}
            <div className="bg-[#F9FAFB] rounded-2xl p-10">
              <h4 className="text-xl font-display font-bold text-gray-900 mb-8">What Curators Say</h4>
              <div className="space-y-8 mb-10">
                <div className="border-b border-gray-100 pb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-body font-bold text-sm text-gray-900">Elena R.</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#F7D060] text-[#F7D060]" />)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic font-body leading-relaxed">
                    "Bought this for my mother's birthday with a photo of the grandkids. She cried when she saw it! The quality is amazing."
                  </p>
                </div>
                <div className="pb-8">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-body font-bold text-sm text-gray-900">Mark T.</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-[#F7D060] text-[#F7D060]" />)}
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 italic font-body leading-relaxed">
                    "The photo reveal is so smooth. A great conversation piece for my home office."
                  </p>
                </div>
              </div>
              <button className="text-[10px] font-body font-bold tracking-widest text-[var(--color-primary)] uppercase hover:underline">
                Read All 124 Reviews
              </button>
            </div>
          </div>
        </div>

        {/* You May Also Love */}
        <div>
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-2">You May Also Love</h2>
              <p className="text-gray-400 font-body text-sm">Curated sentimental gifts to complete your collection.</p>
            </div>
            <Link to="/shop" className="group flex items-center gap-2 text-xs font-body font-bold tracking-widest text-[var(--color-primary)] uppercase">
              <span>View Entire Shop</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {relatedProducts.length > 0 ? (
              relatedProducts.map(p => (
                <ProductCard key={p.id} product={p} />
              ))
            ) : (
              // Fallback cards if no related products
              [1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-50 aspect-square rounded-2xl animate-pulse" />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;

