

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Package, 
  Clock, 
  User, 
  CreditCard, 
  MapPin, 
  LogOut,
  Droplet,
  CheckCircle2,
  XCircle,
  Truck
} from 'lucide-react';
import { getCurrentUser, logoutUser, fetchOrders } from '../../api/api';
import { useAuth } from '../../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['currentUser'],
    queryFn: getCurrentUser,
    retry: false,
  });

  const { data: ordersResponse, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: fetchOrders,
  });

  const myOrders = ordersResponse?.data || [];

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      logout();
      navigate('/auth/login');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-semibold text-gray-900">
            Welcome back, <span className="text-rose-600">{user.username || user.email || 'there'}</span>
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Your personalized dashboard for restorative self-care and your unique skin journey.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Role: <span className="font-medium text-gray-700">{user.role?.toUpperCase()}</span>
          </p>
          {user.role === 'admin' && (
            <button
              onClick={() => navigate('/admin/dashboard')}
              className="mt-4 inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-black transition-colors"
            >
              Go to Admin Panel
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            {/* Skin Profile */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="uppercase text-xs tracking-widest text-gray-500 font-medium">MY SKIN PROFILE</p>
                  <h2 className="text-3xl font-semibold text-gray-900 mt-1">Combination Skin</h2>
                </div>
                <div className="bg-rose-100 text-rose-700 text-sm px-4 py-1.5 rounded-full font-medium">
                  Analysis: Oct 24, 2024
                </div>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">
                Your profile indicates an oily T-zone with dryer cheeks. We recommend balancing formulas that hydrate without adding weight.
              </p>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">CURRENT CONCERN</p>
                  <p className="font-semibold text-lg">Mild Hydration</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">SENSITIVITY LEVEL</p>
                  <p className="font-semibold text-lg">Low</p>
                </div>
                <div className="bg-white rounded-2xl p-5 border border-gray-100">
                  <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">RITUAL PACE</p>
                  <p className="font-semibold text-lg">Slow / Mindful</p>
                </div>
              </div>

              {/* Product Recommendations */}
              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Velvet Milk Cleanser */}
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 group hover:shadow-xl transition-all">
                  <div className="h-52 bg-[#f8f1eb] flex items-center justify-center relative">
                    <img 
                      src="https://picsum.photos/id/1015/300/300" 
                      alt="Velvet Milk Cleanser" 
                      className="w-40 h-40 object-contain drop-shadow-xl group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6">
                    <div className="uppercase text-xs text-amber-600 font-medium tracking-wider mb-1">BEST FOR YOU</div>
                    <h3 className="font-semibold text-xl text-gray-900">Velvet Milk Cleanser</h3>
                    <button className="mt-6 w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-2xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      Shop Now →
                    </button>
                  </div>
                </div>

                {/* Dew Drop Serum */}
                <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 group hover:shadow-xl transition-all">
                  <div className="h-52 bg-emerald-50 flex items-center justify-center relative">
                    <img 
                      src="https://picsum.photos/id/106/300/300" 
                      alt="Dew Drop Serum" 
                      className="w-40 h-40 object-contain drop-shadow-xl group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-6">
                    <div className="uppercase text-xs text-emerald-600 font-medium tracking-wider mb-1">DAILY RITUAL</div>
                    <h3 className="font-semibold text-xl text-gray-900">Dew Drop Serum</h3>
                    <button className="mt-6 w-full bg-gray-900 hover:bg-black text-white py-3.5 rounded-2xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                      Shop Now →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 space-y-6">
            {/* Order History */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-xl">Order History</h3>
                
              </div>

              <div className="space-y-4">
                {isOrdersLoading ? (
                  <p className="text-gray-500 text-sm">Loading order history...</p>
                ) : myOrders.length === 0 ? (
                  <p className="text-gray-500 text-sm">No orders placed yet.</p>
                ) : (
                  myOrders.slice(0, 5).map((order) => {
                    let statusConfig = { icon: Package, bg: 'bg-gray-100', text: 'text-gray-600', label: order.status };
                    
                    if (order.status === 'DELIVERED') {
                      statusConfig = { icon: CheckCircle2, bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'DELIVERED' };
                    } else if (order.status === 'SHIPPED') {
                      statusConfig = { icon: Truck, bg: 'bg-blue-100', text: 'text-blue-700', label: 'SHIPPED' };
                    } else if (order.status === 'PENDING') {
                      statusConfig = { icon: Clock, bg: 'bg-amber-100', text: 'text-amber-700', label: 'PROCESSING' };
                    } else if (order.status === 'CANCELLED') {
                      statusConfig = { icon: XCircle, bg: 'bg-rose-100', text: 'text-rose-700', label: 'CANCELLED' };
                    }

                    const StatusIcon = statusConfig.icon;

                    return (
                      <div key={order._id} className="flex gap-4 bg-white p-4 rounded-2xl border border-gray-50">
                        <div className={`w-12 h-12 ${statusConfig.bg} rounded-2xl flex items-center justify-center shrink-0`}>
                          <StatusIcon className={`w-6 h-6 ${statusConfig.text}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">{order.orderNumber}</p>
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
                              {statusConfig.label}
                            </span>
                          </div>
                          <div className="flex items-center justify-between mt-0.5">
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                            </p>
                            <p className="text-sm font-medium text-gray-700">${order.totalAmount?.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-gray-100 shadow-sm">
              <h3 className="font-semibold text-xl mb-6">Account Settings</h3>
              
              <div className="space-y-1">
                <button className="w-full flex items-center gap-4 hover:bg-gray-50 px-5 py-4 rounded-2xl text-left transition-colors group">
                  <User className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                  <span className="flex-1 font-medium">Personal Information</span>
                  <span className="text-gray-300 group-hover:text-gray-400">→</span>
                </button>

                <button className="w-full flex items-center gap-4 hover:bg-gray-50 px-5 py-4 rounded-2xl text-left transition-colors group">
                  <CreditCard className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                  <span className="flex-1 font-medium">Payment Methods</span>
                  <span className="text-gray-300 group-hover:text-gray-400">→</span>
                </button>

                <button className="w-full flex items-center gap-4 hover:bg-gray-50 px-5 py-4 rounded-2xl text-left transition-colors group">
                  <MapPin className="w-5 h-5 text-gray-400 group-hover:text-rose-500 transition-colors" />
                  <span className="flex-1 font-medium">Shipping Addresses</span>
                  <span className="text-gray-300 group-hover:text-gray-400">→</span>
                </button>

                <div className="h-px bg-gray-100 my-4" />

                <button
                  onClick={handleLogout}
                  disabled={logoutMutation.isLoading}
                  className="w-full flex items-center gap-4 hover:bg-red-50 px-5 py-4 rounded-2xl text-left text-red-600 hover:text-red-700 transition-colors group"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="flex-1 font-medium">{logoutMutation.isLoading ? 'Logging Out...' : 'Log Out'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}