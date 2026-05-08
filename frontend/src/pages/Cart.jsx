
import React, { useState } from 'react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft,
  Tag
} from 'lucide-react';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Velvet Milk Cleanser",
      price: 48,
      quantity: 1,
      image: "https://picsum.photos/id/1015/300/300",
      variant: "150ml"
    },
    {
      id: 2,
      name: "Dew Drop Serum",
      price: 65,
      quantity: 2,
      image: "https://picsum.photos/id/106/300/300",
      variant: "30ml"
    },
  ]);

  const [promoCode, setPromoCode] = useState("");
  const [isApplied, setIsApplied] = useState(false);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = 0;
  const discount = isApplied ? subtotal * 0.15 : 0;
  const total = subtotal - discount + shipping;

  return (
    <div className="min-h-screen bg-[#fdfaf7] py-10 px-6 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </button>
          <h1 className="text-4xl font-semibold text-gray-900 ml-6">Your Cart</h1>
          <span className="text-sm text-gray-500 mt-3">({cartItems.length} items)</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              {cartItems.length > 0 ? (
                <div className="space-y-8">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-6 border-b border-gray-100 pb-8 last:border-none last:pb-0">
                      <div className="w-28 h-28 bg-gray-50 rounded-2xl overflow-hidden shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-semibold text-xl text-gray-900">{item.name}</h3>
                            {item.variant && (
                              <p className="text-gray-500 text-sm mt-1">{item.variant}</p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center border border-gray-200 rounded-2xl">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-3 hover:bg-gray-100 rounded-l-2xl transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-6 font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-3 hover:bg-gray-100 rounded-r-2xl transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.price} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <p className="text-2xl text-gray-400">Your cart is empty</p>
                  <button className="mt-6 bg-gray-900 text-white px-8 py-3.5 rounded-2xl">
                    Browse Products
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-6">
              <h2 className="text-2xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-emerald-600">Free</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-lg text-emerald-600">
                    <span>Discount (15%)</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="h-px bg-gray-100 my-4" />

                <div className="flex justify-between text-2xl font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-8">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Tag className="w-4 h-4" />
                  <span>PROMO CODE</span>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  />
                  <button
                    onClick={() => setIsApplied(true)}
                    className="px-6 bg-gray-900 text-white rounded-2xl hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Checkout Button */}
              <button className="w-full mt-10 bg-linear-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white py-4 rounded-3xl text-lg font-medium transition-all active:scale-95">
                Proceed to Checkout
              </button>

              <p className="text-center text-xs text-gray-500 mt-6">
                Secure checkout • 30-day money back guarantee
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}