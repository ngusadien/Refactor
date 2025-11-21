import { createSlice } from '@reduxjs/toolkit';
import { STORAGE_KEYS } from '../../constants';

// Load cart from localStorage
const loadCartFromStorage = () => {
  try {
    const cartStr = localStorage.getItem(STORAGE_KEYS.USER + '_cart');
    return cartStr ? JSON.parse(cartStr) : [];
  } catch {
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (cart) => {
  try {
    localStorage.setItem(STORAGE_KEYS.USER + '_cart', JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart:', error);
  }
};

// Calculate totals from cart items
const calculateTotals = (items) => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return { totalItems, totalPrice };
};

// Initialize state with items from localStorage and calculated totals
const getInitialState = () => {
  const items = loadCartFromStorage();
  const totals = calculateTotals(items);
  return {
    items,
    totalItems: totals.totalItems,
    totalPrice: totals.totalPrice,
  };
};

const initialState = getInitialState();

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const productId = product._id || product.id;
      const existingItem = state.items.find(item => item.id === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id: productId,
          title: product.title,
          price: product.price,
          image: product.image,
          description: product.description,
          category: product.category,
          quantity,
        });
      }

      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      saveCartToStorage(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      const totals = calculateTotals(state.items);
      state.totalItems = totals.totalItems;
      state.totalPrice = totals.totalPrice;
      saveCartToStorage(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);

      if (item) {
        item.quantity = Math.max(1, quantity);
        const totals = calculateTotals(state.items);
        state.totalItems = totals.totalItems;
        state.totalPrice = totals.totalPrice;
        saveCartToStorage(state.items);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      saveCartToStorage([]);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
