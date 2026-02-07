import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, Upload, Heart, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState({
    image: null,
    imagePreview: null,
    textInputs: {},
    selectedSize: null,
  });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
    } catch (error) {
      console.error('Failed to fetch product:', error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-valentine-red"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <button onClick={() => navigate('/shop')} className="btn-primary">
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const finalPrice = product.discount 
    ? product.price - (product.price * product.discount / 100)
    : product.price;

  const calculatePrice = () => {
    let price = finalPrice;
    if (customization.selectedSize && product.customization_options?.sizes) {
      const sizeOption = product.customization_options.sizes.find(
        s => s.name === customization.selectedSize
      );
      if (sizeOption) {
        price = product.discount
          ? sizeOption.price - (sizeOption.price * product.discount / 100)
          : sizeOption.price;
      }
    }
    return price;
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

  const handleTextInput = (label, value) => {
    setCustomization({
      ...customization,
      textInputs: {
        ...customization.textInputs,
        [label]: value,
      },
    });
  };

  const validateCustomization = () => {
    // Check if user is logged in
    if (!isAuthenticated()) {
      // Redirect to login with return path
      navigate('/login', { state: { from: { pathname: `/product/${product.id}` } } });
      return false;
    }

    // Validate customization if product is customizable
    if (product.customizable && product.customization_options) {
      // Check if image upload is required
      if (product.customization_options.imageUpload && !customization.image) {
        alert('Please upload an image for customization');
        return false;
      }

      // Check if text inputs are filled (if any)
      if (product.customization_options.textInput) {
        const missingInputs = product.customization_options.textInput.filter(
          label => !customization.textInputs[label] || customization.textInputs[label].trim() === ''
        );
        if (missingInputs.length > 0) {
          alert(`Please fill in: ${missingInputs.join(', ')}`);
          return false;
        }
      }

      // Check if size is selected (if sizes are available)
      if (product.customization_options.sizes && !customization.selectedSize) {
        alert('Please select a size');
        return false;
      }
    }

    return true;
  };

  const createCartItem = () => {
    return {
      id: product.id,
      name: product.name,
      image: product.image || product.image_url,
      image_url: product.image || product.image_url,
      basePrice: product.price,
      finalPrice: calculatePrice(),
      quantity,
      customization: product.customizable ? {
        image: customization.imagePreview,
        imageFile: customization.image,
        textInputs: customization.textInputs,
        size: customization.selectedSize,
      } : null,
    };
  };

  const handleAddToCart = () => {
    if (!validateCustomization()) return;

    const cartItem = createCartItem();
    const success = addToCart(cartItem);
    if (success) {
      // Show success message or navigate to cart
      navigate('/cart');
    }
  };

  const handleBuyNow = () => {
    if (!validateCustomization()) return;

    const cartItem = createCartItem();
    const success = addToCart(cartItem);
    if (success) {
      // Directly navigate to checkout page
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-background py-6 sm:py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden border border-valentine-pink/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Product Image */}
            <div className="relative">
              <img
                src={product.image_url || product.image}
                alt={product.name}
                className="w-full h-64 sm:h-80 md:h-96 lg:h-full object-cover"
              />
              {product.valentine_special && (
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-valentine-red text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
                  💝 Valentine Special
                </div>
              )}
              {product.discount && (
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-green-500 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-semibold text-xs sm:text-sm">
                  {product.discount}% OFF
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-4 sm:p-6 md:p-8">
              <h1 className="text-2xl sm:text-3xl font-display font-bold mb-3 sm:mb-4">{product.name}</h1>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{product.description}</p>

              {/* Price */}
              <div className="mb-4 sm:mb-6">
                {product.discount ? (
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <span className="text-2xl sm:text-3xl font-bold text-valentine-red">
                      ₹{calculatePrice()}
                    </span>
                    <span className="text-lg sm:text-xl text-gray-500 line-through">
                      ₹{product.price}
                    </span>
                    <span className="bg-green-100 text-green-700 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-semibold">
                      Save {product.discount}%
                    </span>
                  </div>
                ) : (
                  <span className="text-2xl sm:text-3xl font-bold text-valentine-red">
                    ₹{calculatePrice()}
                  </span>
                )}
              </div>

              {/* Customization Options */}
              {product.customizable && product.customization_options && (
                <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4">
                  <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Customize Your Product</h3>

                  {/* Image Upload */}
                  {product.customization_options.imageUpload && (
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2">
                        Upload Your Image <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-3 sm:p-4 text-center hover:border-valentine-red transition-colors">
                        {customization.imagePreview ? (
                          <div className="relative">
                            <img
                              src={customization.imagePreview}
                              alt="Preview"
                              className="max-h-32 sm:max-h-40 mx-auto rounded"
                            />
                            <button
                              onClick={() => setCustomization({ ...customization, image: null, imagePreview: null })}
                              className="mt-2 text-xs sm:text-sm text-red-500 hover:underline"
                            >
                              Remove Image
                            </button>
                          </div>
                        ) : (
                          <label className="cursor-pointer">
                            <Upload className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-xs sm:text-sm text-gray-600 mb-1">Click to upload your image</p>
                            <p className="text-[10px] sm:text-xs text-gray-500">Required for customization</p>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageUpload}
                              className="hidden"
                              required
                            />
                          </label>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                        💡 Upload the image you want printed/customized on this product
                      </p>
                    </div>
                  )}

                  {/* Text Inputs */}
                  {product.customization_options.textInput && (
                    <div className="space-y-2 sm:space-y-3">
                      {product.customization_options.textInput.map((label) => (
                        <div key={label}>
                          <label className="block text-xs sm:text-sm font-semibold mb-1">
                            {label} <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={customization.textInputs[label] || ''}
                            onChange={(e) => handleTextInput(label, e.target.value)}
                            className="w-full px-3 py-2 sm:px-4 sm:py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-valentine-red focus:border-transparent"
                            placeholder={`Enter ${label.toLowerCase()}`}
                            required
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Size Selection */}
                  {product.customization_options.sizes && (
                    <div>
                      <label className="block text-xs sm:text-sm font-semibold mb-2">
                        Select Size <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {product.customization_options.sizes.map((size) => (
                          <button
                            key={size.name}
                            onClick={() => setCustomization({ ...customization, selectedSize: size.name })}
                            className={`px-2 py-2 sm:px-4 sm:py-2 rounded-lg border-2 transition-colors ${
                              customization.selectedSize === size.name
                                ? 'border-valentine-red bg-valentine-red text-white'
                                : 'border-gray-300 hover:border-valentine-red'
                            }`}
                          >
                            <div className="text-xs sm:text-sm font-semibold">{size.name}</div>
                            <div className="text-[10px] sm:text-xs">₹{size.price}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Quantity */}
              <div className="mb-4 sm:mb-6">
                <label className="block text-xs sm:text-sm font-semibold mb-2">Quantity</label>
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 hover:border-valentine-red transition-colors text-lg sm:text-xl"
                  >
                    -
                  </button>
                  <span className="text-lg sm:text-xl font-semibold w-10 sm:w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-gray-300 hover:border-valentine-red transition-colors text-lg sm:text-xl"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total Price */}
              <div className="mb-4 sm:mb-6 bg-gray-50 p-3 sm:p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-semibold">Total Price:</span>
                  <span className="text-xl sm:text-2xl font-bold text-valentine-red">
                    ₹{calculatePrice() * quantity}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  className="btn-secondary flex items-center justify-center space-x-2 text-sm sm:text-base py-3 sm:py-4"
                >
                  <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Add to Cart</span>
                </button>

                {/* Buy Now Button */}
                <button
                  onClick={handleBuyNow}
                  className="btn-primary flex items-center justify-center space-x-2 text-sm sm:text-base py-3 sm:py-4"
                >
                  <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
