
import React from 'react';
import { 
  CheckCircle, 
  Home,
  ShoppingBag,
  CreditCard
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from navigation state (passed from Cart)
  const orderData = location.state || {};
  
  const {
    orderNumber,
    totalAmount = 0,
    items = [],
    customerName = "Valued Customer",
    shippingAddress = {}
  } = orderData;

  // Fallback values
  const finalOrderNumber = orderNumber || "#GLO-" + Math.floor(100000 + Math.random() * 900000);
  const finalTotal = totalAmount || 0;

  return (
    <div className="min-h-screen bg-[#fdfaf7] flex items-center justify-center font-sans p-6">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-32 h-32 bg-emerald-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-24 h-24 text-emerald-600" />
            </div>
            <div className="absolute -top-3 -right-3 bg-white rounded-full p-2 shadow-lg">
              <span className="text-4xl">🌸</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl font-semibold text-gray-900 mb-2">Thank You, {customerName}!</h1>
        <p className="text-2xl text-emerald-600 font-medium mb-6">Your Order Has Been Placed Successfully</p>
        
        <p className="text-gray-600 text-lg mb-10">
          We've sent a confirmation email with all the details.
        </p>

        {/* Order Summary Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-10 text-left">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold text-xl">Order Confirmation</h3>
            <span className="font-mono text-emerald-600">{finalOrderNumber}</span>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Date</span>
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Payment</span>
              <span className="flex items-center gap-1.5">
                <CreditCard className="w-4 h-4" /> Credit Card
              </span>
            </div>

            {shippingAddress?.address && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Shipping Address</span>
                <span className="text-right text-sm">
                  {shippingAddress.address}<br />
                  {shippingAddress.city}, {shippingAddress.country}
                </span>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-100 my-6" />

          {/* Items List */}
          {items.length > 0 && (
            <>
              <p className="text-sm text-gray-500 mb-3">Your Items</p>
              <div className="space-y-3 mb-6">
                {items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.variant && <span className="text-gray-500"> • {item.variant}</span>}
                    </div>
                    <div className="font-medium">
                      ${ (item.price * item.quantity).toFixed(2) } 
                      <span className="text-gray-400 text-xs ml-1">×{item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Total */}
          <div className="flex justify-between items-center pt-6 border-t text-lg font-semibold">
            <span>Total Paid</span>
            <span>${parseFloat(finalTotal).toFixed(2)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => navigate('/shop')}
            className="w-full bg-gray-900 text-white py-4 rounded-3xl text-lg font-medium hover:bg-black transition-all flex items-center justify-center gap-3"
          >
            Continue Shopping
            <ShoppingBag className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate('/')}
            className="w-full border border-gray-300 py-4 rounded-3xl text-lg font-medium hover:bg-gray-50 transition-all flex items-center justify-center gap-3"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-12">
          Need assistance? Reach us at <span className="text-rose-600">support@glowify.com</span>
        </p>
      </div>
    </div>
  );
}