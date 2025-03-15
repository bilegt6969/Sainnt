import { create } from 'zustand'

const useCartStore = create((set) => ({
  cart: [],
  addToCart: (product, size, price) =>
    set((state) => {
      const existingItem = state.cart.find(
        (item) => item.product.id === product.id && item.size === size,
      )
      if (existingItem) {
        return {
          cart: state.cart.map((item) =>
            item.product.id === product.id && item.size === size
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          ),
        }
      }
      return {
        cart: [...state.cart, { product, size, price, quantity: 1 }],
      }
    }),
  removeFromCart: (productId, size) =>
    set((state) => ({
      cart: state.cart.filter((item) => !(item.product.id === productId && item.size === size)),
    })),
  clearCart: () => set({ cart: [] }),
}))

export default useCartStore
