'use client'

import useCartStore from '../../../app/store/cartStore'
import Link from 'next/link'
import Image from 'next/image'

// Define the CartItem type
interface CartItem {
  product: {
    id: string
    name: string
    image_url?: string
  }
  size: string
  quantity: number
  price: number
}

export default function BagPage() {
  const { cart, removeFromCart, clearCart } = useCartStore()

  // Explicitly type the `sum` and `item` parameters
  const total = cart.reduce((sum: number, item: CartItem) => sum + item.price * item.quantity, 0)

  return (
    <div className="p-8 bg-black rounded-2xl border border-neutral-700 text-white">
      <h1 className="text-3xl font-bold mb-8">Your Bag</h1>
      {cart.length === 0 ? (
        <p>Your bag is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item: CartItem, index: number) => (
            <div
              key={index}
              className="flex justify-between items-center p-4 bg-neutral-800 border border-neutral-700 rounded-2xl"
            >
              {/* Product Image */}
              <div className="flex items-center space-x-4">
                <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-neutral-700 flex items-center justify-center">
                  {item.product.image_url ? (
                    <Image
                      src={item.product.image_url}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-neutral-400 text-sm">No Image</span>
                  )}
                </div>

                {/* Product Details */}
                <div>
                  <h2 className="text-xl font-semibold">{item.product.name}</h2>
                  <p className="text-neutral-400">Size: {item.size}</p>
                  <p className="text-neutral-400">Quantity: {item.quantity}</p>
                  <p className="text-neutral-400">
                    Price: MNT {(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => removeFromCart(item.product.id, item.size)}
                className="px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors duration-200"
              >
                Remove
              </button>
            </div>
          ))}

          {/* Total and Clear Bag */}
          <div className="mt-8">
            <p className="text-2xl font-bold">Total: MNT {total.toLocaleString()}</p>
            <button
              onClick={clearCart}
              className="px-4 py-2 bg-red-600 text-white rounded-full mt-4 hover:bg-red-700 transition-colors duration-200"
            >
              Clear Bag
            </button>
          </div>
        </div>
      )}

      {/* Continue Shopping Link */}
      <Link
        href="/"
        className="mt-8 inline-block text-blue-500 hover:text-blue-400 transition-colors duration-200"
      >
        Continue Shopping
      </Link>
    </div>
  )
}
