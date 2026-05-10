
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Tag,
  CreditCard,
  Wallet,
  Gift
} from 'lucide-react';
import { createOrder, getCart, updateCartItem, removeFromCart, clearCart } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function Cart() {
  const [promoCode, setPromoCode] = useState('');
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState('credit');
  
  const [shippingAddress, setShippingAddress] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: ''
  });
 
  const [orderMessage, setOrderMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: cartData, isLoading: cartLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: getCart,
    enabled: !!user
  });

  const cartItems = cartData?.data?.items?.map((item) => {
    const productId = item.product?._id || item.product
    return {
      ...item,
      productId,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    }
  }) || [];

  const updateItemMutation = useMutation({
    mutationFn: ({ productId, quantity }) => updateCartItem(productId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: (productId) => removeFromCart(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    }
  });

  const clearCartMutation = useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries(['cart']);
    }
  });

  // Order mutation
  const orderMutation = useMutation({
    mutationFn: (orderData) => createOrder(orderData),
    onSuccess: (response) => {
      clearCartMutation.mutate();
      setOrderMessage('✓ Order placed successfully!');
      setShippingAddress({ address: '', city: '', postalCode: '', country: '' });
      setPromoCode('');
      setIsPromoApplied(false);
      
      setTimeout(() => {
        navigate('/ordersuccess', {
          state: {
            orderNumber: response.data.orderNumber,
            totalAmount: response.data.totalAmount,
            items: response.data.items,
            customerName: response.data.customerName,
            shippingAddress: response.data.shippingAddress
          }
        });
      }, 1500);
    },
    onError: (error) => {
      setOrderMessage(
        error?.response?.data?.message || 
        'Failed to place order. Please try again.'
      );
      setIsLoading(false);
    }
  });

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateItemMutation.mutate({ productId, quantity: newQuantity });
  };

  const removeItem = (productId) => {
    removeItemMutation.mutate(productId);
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const shipping = 0;
  const total = subtotal - discountAmount + shipping;
  const isEmpty = cartItems.length === 0;

  // Apply Promo Code with Alert
  const applyPromoCode = () => {
    const validCodes = {
      'GLOW15': 0.15,
      'RITUAL20': 0.20,
      'WELCOME10': 0.10,
      'SELFCARE': 0.25
    };

    const codeUpper = promoCode.trim().toUpperCase();

    if (validCodes[codeUpper]) {
      const discount = subtotal * validCodes[codeUpper];
      setDiscountAmount(discount);
      setIsPromoApplied(true);
      setOrderMessage(`✅ Promo code ${codeUpper} applied successfully!`);
    } else {
      alert("❌ Invalid promo code. Try: GLOW15, RITUAL20, WELCOME10, or SELFCARE");
      setOrderMessage('');
    }
  };

  const removePromo = () => {
    setPromoCode('');
    setIsPromoApplied(false);
    setDiscountAmount(0);
    setOrderMessage('');
  };

  const handleCheckout = () => {
    if (isEmpty) {
      setOrderMessage('Your cart is empty');
      return;
    }

    if (!user?.email) {
      setOrderMessage('Please log in to complete checkout.');
      return;
    }

    if (!shippingAddress.address || !shippingAddress.city || 
        !shippingAddress.postalCode || !shippingAddress.country) {
      setOrderMessage('Please fill in all shipping details.');
      return;
    }

    setIsLoading(true);
    setOrderMessage('Processing your order...');

    // Format the order data for the backend
    const orderData = {
      customerName: user.username || user.name || 'Customer',
      customerEmail: user.email,
      items: cartItems.map((item) => ({ 
        product: item.productId, 
        quantity: item.quantity 
      })),
      totalAmount: total,
      shippingAddress: {
        street: shippingAddress.address,
        city: shippingAddress.city,
        zipCode: shippingAddress.postalCode,
        country: shippingAddress.country
      },
      paymentMethod: selectedPayment === 'credit' ? 'Credit Card' :
                    selectedPayment === 'paypal' ? 'PayPal' : 'Cash on Delivery'
    };

    orderMutation.mutate(orderData);
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] py-6 md:py-10 px-4 md:px-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-8">
          <button 
            onClick={() => navigate('/shop')} 
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors self-start"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Continue Shopping</span>
          </button>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900">Your Cart</h1>
            <span className="text-sm text-gray-500">({cartItems.length} items)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Cart Items Section */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-gray-100">
              {isEmpty ? (
                <div className="text-center py-16 md:py-20">
                  <p className="text-2xl text-gray-400">Your cart is empty</p>
                  <button 
                    onClick={() => navigate('/shop')} 
                    className="mt-6 bg-gray-900 text-white px-8 py-3.5 rounded-2xl hover:bg-black transition-colors"
                  >
                    Browse Products
                  </button>
                </div>
              ) : (
                <div className="space-y-6 md:space-y-8">
                  {cartItems.map((item) => (
                    <div key={item.productId} className="flex flex-col sm:flex-row gap-4 sm:gap-6 border-b border-gray-100 pb-6 last:border-none last:pb-0">
                      <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gray-50 rounded-2xl overflow-hidden shrink-0 mx-auto sm:mx-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>

                      <div className="flex-1 text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:justify-between gap-2">
                          <div>
                            <h3 className="font-semibold text-lg md:text-xl text-gray-900">{item.name}</h3>
                            {item.variant && <p className="text-gray-500 text-sm">{item.variant}</p>}
                          </div>
                          <button 
                            onClick={() => removeItem(item.productId)} 
                            className="text-gray-400 hover:text-red-500 transition-colors self-center sm:self-auto"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center border border-gray-200 rounded-2xl mx-auto sm:mx-0">
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity - 1)} 
                              className="p-2.5 sm:p-3 hover:bg-gray-100 rounded-l-2xl transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-6 font-medium min-w-10">{item.quantity}</span>
                            <button 
                              onClick={() => updateQuantity(item.productId, item.quantity + 1)} 
                              className="p-2.5 sm:p-3 hover:bg-gray-100 rounded-r-2xl transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="text-right">
                            <p className="font-semibold text-lg md:text-xl">${(item.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.price} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 sticky top-4">
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

                {discountAmount > 0 && (
                  <div className="flex justify-between text-lg text-emerald-600">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
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
                    placeholder="GLOW15, RITUAL20..."
                    className="flex-1 px-5 py-3.5 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                    disabled={isPromoApplied}
                  />
                  {!isPromoApplied ? (
                    <button 
                      onClick={applyPromoCode} 
                      className="px-6 bg-gray-900 text-white rounded-2xl hover:bg-black transition-colors whitespace-nowrap"
                    >
                      Apply
                    </button>
                  ) : (
                    <button 
                      onClick={removePromo} 
                      className="px-6 text-red-600 hover:bg-red-50 border border-red-200 rounded-2xl whitespace-nowrap"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>

              {/* Payment Method */}
              <div className="mt-8">
                <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'credit', label: 'Card', icon: CreditCard },
                    { value: 'paypal', label: 'PayPal', icon: Wallet },
                    { value: 'cod', label: 'COD', icon: Gift }
                  ].map(({ value, label, icon: Icon }) => (
                    <button
                      key={value}
                      onClick={() => setSelectedPayment(value)}
                      className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                        selectedPayment === value 
                          ? 'border-rose-600 bg-rose-50' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Shipping Details */}
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-medium">Shipping Details</h3>
                <input 
                  type="text" 
                  placeholder="Street address" 
                  value={shippingAddress.address} 
                  onChange={(e) => setShippingAddress({...shippingAddress, address: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input 
                    type="text" 
                    placeholder="City" 
                    value={shippingAddress.city} 
                    onChange={(e) => setShippingAddress({...shippingAddress, city: e.target.value})} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  />
                  <input 
                    type="text" 
                    placeholder="Postal Code" 
                    value={shippingAddress.postalCode} 
                    onChange={(e) => setShippingAddress({...shippingAddress, postalCode: e.target.value})} 
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  />
                </div>
                <input 
                  type="text" 
                  placeholder="Country" 
                  value={shippingAddress.country} 
                  onChange={(e) => setShippingAddress({...shippingAddress, country: e.target.value})} 
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                />
              </div>

              <button
                onClick={handleCheckout}
                disabled={isEmpty || orderMutation.isLoading}
                className="w-full mt-10 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white py-4 rounded-3xl text-lg font-medium disabled:opacity-50 transition-all"
              >
                {orderMutation.isLoading ? 'Processing...' : `Pay $${total.toFixed(2)}`}
              </button>

              {orderMessage && (
                <p className="text-center text-sm mt-4 text-gray-600">{orderMessage}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}