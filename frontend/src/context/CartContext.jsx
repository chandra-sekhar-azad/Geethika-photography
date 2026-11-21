import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

// Checkout charges
export const HANDLING_AND_PLATFORM_CHARGE = 20;
export const OUTSIDE_ANDHRA_PRADESH_SHIPPING = 70;

const stableStringify = (value) => {
  if (value === undefined) return undefined;
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item) ?? 'null').join(',')}]`;
  return `{${Object.keys(value)
    .sort()
    .filter((key) => value[key] !== undefined)
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(',')}}`;
};

export const getCartItemKey = (item) => [
  String(item.id),
  item.size || '',
  stableStringify(item.customization || null),
].join('|');

const mergeCartItems = (items) => items.reduce((merged, item) => {
  const key = getCartItemKey(item);
  const existingItem = merged.find((candidate) => getCartItemKey(candidate) === key);
  const quantity = Number(item.quantity) || 1;

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    merged.push({ ...item, quantity });
  }
  return merged;
}, []);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState([]);

  // Load cart from localStorage when user changes
  useEffect(() => {
    if (isAuthenticated() && user) {
      const userCartKey = `cart_${user.id || user.email}`;
      const savedCart = localStorage.getItem(userCartKey);
      try {
        setCart(savedCart ? mergeCartItems(JSON.parse(savedCart)) : []);
      } catch {
        setCart([]);
      }
    } else {
      // Clear cart if not authenticated
      setCart([]);
    }
  }, [user, isAuthenticated]);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isAuthenticated() && user) {
      const userCartKey = `cart_${user.id || user.email}`;
      localStorage.setItem(userCartKey, JSON.stringify(cart));
    }
  }, [cart, user, isAuthenticated]);

  const addToCart = (product) => {
    if (!isAuthenticated()) {
      return false; // Return false if not authenticated
    }

    setCart(prevCart => {
      const productKey = getCartItemKey(product);
      const existingItem = prevCart.find((item) => getCartItemKey(item) === productKey);

      if (existingItem) {
        return prevCart.map(item =>
          getCartItemKey(item) === productKey
            ? { ...item, quantity: (Number(item.quantity) || 1) + (Number(product.quantity) || 1) }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: Number(product.quantity) || 1 }];
    });
    return true; // Return true if successfully added
  };

  const removeFromCart = (itemToRemove) => {
    const itemKey = typeof itemToRemove === 'object' ? getCartItemKey(itemToRemove) : itemToRemove;
    setCart(prevCart => 
      prevCart.filter(item => (typeof itemToRemove === 'object' ? getCartItemKey(item) !== itemKey : item.id !== itemKey))
    );
  };

  const updateQuantity = (itemToUpdate, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemToUpdate);
      return;
    }

    const itemKey = typeof itemToUpdate === 'object' ? getCartItemKey(itemToUpdate) : itemToUpdate;

    setCart(prevCart =>
      prevCart.map(item =>
        (typeof itemToUpdate === 'object' ? getCartItemKey(item) === itemKey : item.id === itemKey)
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    if (isAuthenticated() && user) {
      const userCartKey = `cart_${user.id || user.email}`;
      localStorage.removeItem(userCartKey);
    }
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + ((Number(item.finalPrice ?? item.price) || 0) * (Number(item.quantity) || 1)), 0);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + ((Number(item.finalPrice ?? item.price) || 0) * (Number(item.quantity) || 1)), 0);
  };

  const getServiceCharge = () => {
    return cart.length > 0 ? HANDLING_AND_PLATFORM_CHARGE : 0;
  };

  const getShippingCost = (state) => {
    if (cart.length === 0 || !state) return 0;
    return state.trim().toLowerCase() === 'andhra pradesh' ? 0 : OUTSIDE_ANDHRA_PRADESH_SHIPPING;
  };

  const getFinalTotal = (state) => {
    return getCartSubtotal() + getServiceCharge() + getShippingCost(state);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getCartSubtotal,
      getServiceCharge,
      getShippingCost,
      getFinalTotal,
      getCartCount
    }}>
      {children}
    </CartContext.Provider>
  );
};
