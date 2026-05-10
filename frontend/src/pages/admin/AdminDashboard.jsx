import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Bell, 
  ShoppingBag, 
  DollarSign, 
  TrendingUp, 
  Users,
  BarChart3,
  ArrowUp,
  LogOut
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { fetchProducts, fetchOrderStats, fetchCustomerStats, logoutUser } from '../../api/api';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const { data: orderStats, isLoading: orderStatsLoading } = useQuery({
    queryKey: ['orderStats'],
    queryFn: fetchOrderStats
  });

  const { data: customerStats, isLoading: customerStatsLoading } = useQuery({
    queryKey: ['customerStats'],
    queryFn: fetchCustomerStats
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      navigate('/auth/login');
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  const totalProducts = Array.isArray(productsData) ? productsData.length : productsData?.data?.length || 0;
  const totalOrders = orderStats?.data?.totalOrders || 0;
  const pendingOrders = orderStats?.data?.pendingOrders || 0;
  const totalRevenue = orderStats?.data?.totalRevenue || 0;
  const totalCustomers = customerStats?.data?.totalCustomers || 0;
  const activeCustomers = customerStats?.data?.activeCustomers || 0;
  return (
    <div className="min-h-screen bg-[#fdfaf7] flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-semibold text-gray-900">Glowify</h2>
          <p className="text-xs text-gray-500">Management</p>
        </div>

        <nav className="flex-1 px-3">
          <div className="space-y-1">
            <Link to="/admin/inventory" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl">
              <Package className="w-5 h-5" />
              <span>Inventory</span>
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
              <span>Orders</span>
            </Link>
            <Link to="/admin/customers" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl">
              <Users className="w-5 h-5" />
              <span>Customers</span>
            </Link>
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-700 rounded-2xl font-medium">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
          </div>
        </nav>

        <div className="p-6 border-t">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-rose-100 rounded-full flex items-center justify-center">
              👩‍💼
            </div>
            <div>
              <p className="font-medium">Admin</p>
              <button 
                onClick={handleLogout}
                disabled={logoutMutation.isLoading}
                className="text-xs text-gray-500 hover:text-red-600 disabled:text-gray-400 flex items-center gap-1 transition-colors"
              >
                <LogOut className="w-3 h-3" /> {logoutMutation.isLoading ? 'Signing out...' : 'Sign Out'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-10">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900">Analytics Overview</h1>
              <p className="text-gray-600 mt-1">Your shop's performance at a glance.</p>
            </div>
            <button className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition-colors">
              <span>↓</span> Export Report
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="bg-emerald-100 p-3 rounded-2xl">
                  <Package className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                  +2% <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <p className="text-4xl font-semibold mt-6">{productsLoading ? '...' : totalProducts}</p>
              <p className="text-gray-600">Total Products</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="bg-red-100 p-3 rounded-2xl">
                  <Bell className="w-6 h-6 text-red-600" />
                </div>
                <span className="text-red-600 text-sm font-medium">Action Needed</span>
              </div>
              <p className="text-4xl font-semibold mt-6">{orderStatsLoading ? '...' : pendingOrders}</p>
              <p className="text-gray-600">Low Stock Alerts</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="bg-amber-100 p-3 rounded-2xl">
                  <ShoppingBag className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-gray-500 text-sm font-medium">Today</span>
              </div>
              <p className="text-4xl font-semibold mt-6">{orderStatsLoading ? '...' : totalOrders}</p>
              <p className="text-gray-600">Total Orders</p>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div className="bg-emerald-100 p-3 rounded-2xl">
                  <DollarSign className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-emerald-600 text-sm font-medium flex items-center gap-1">
                  +18% <TrendingUp className="w-4 h-4" />
                </span>
              </div>
              <p className="text-4xl font-semibold mt-6">${totalRevenue.toLocaleString()}</p>
              <p className="text-gray-600">Total Revenue</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Weekly Sales Chart */}
            <div className="lg:col-span-3 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Weekly Sales</h2>
                <button className="text-gray-400 hover:text-gray-600">•••</button>
              </div>

              {/* Simple CSS Bar Chart */}
              <div className="h-64 flex items-end gap-3 mt-4">
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-2">
                    <div 
                      className={`w-full bg-linear-to-t from-rose-300 to-emerald-300 rounded-t-xl transition-all ${i === 3 ? 'h-[85%]' : i === 5 ? 'h-[70%]' : 'h-[55%]'}`}
                    />
                    <span className="text-xs text-gray-500">{day}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Average Daily Sales</p>
                  <p className="text-3xl font-semibold">$2,127</p>
                </div>
                <div className="h-2 w-40 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-linear-to-r from-rose-400 to-emerald-400"></div>
                </div>
              </div>
            </div>

            {/* Recent Orders */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">Recent Orders</h2>
                <button className="text-rose-600 text-sm font-medium">View All →</button>
              </div>

              <div className="space-y-5">
                {[
                  { id: "GLO-92831", customer: "Elena Vance", status: "SHIPPED", amount: "128.00", avatar: "👩" },
                  { id: "GLO-92830", customer: "Marcus Chen", status: "PENDING", amount: "245.50", avatar: "👨" },
                  { id: "GLO-92829", customer: "Isabella Ross", status: "SHIPPED", amount: "89.00", avatar: "👩" },
                  { id: "GLO-92828", customer: "David Miller", status: "SHIPPED", amount: "312.20", avatar: "👨" },
                ].map((order, i) => (
                  <div key={i} className="flex items-center justify-between py-2 group">
                    <div className="flex items-center gap-4">
                      <div className="text-2xl">{order.avatar}</div>
                      <div>
                        <p className="font-medium text-sm">{order.id}</p>
                        <p className="text-sm text-gray-600">{order.customer}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${
                        order.status === 'SHIPPED' 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status}
                      </span>
                      <p className="font-semibold mt-1">${order.amount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Restorative Insights */}
            <div className="bg-black text-white rounded-3xl p-8">
              <h3 className="text-xl font-semibold mb-4">Restorative Insights</h3>
              <p className="leading-relaxed">
                Product page engagement is up by 24% this week.<br />
                Consider featuring 'Morning Ritual' set on the home page.
              </p>
              <button className="mt-6 underline underline-offset-4 hover:text-rose-400 transition-colors">
                Analyze Trends →
              </button>
            </div>

            {/* Glowify Pro */}
            <div className="bg-[#f8e7e7] rounded-3xl p-8 relative overflow-hidden">
              <h3 className="text-2xl font-semibold text-gray-900">Glowify Pro</h3>
              <p className="mt-3 text-gray-700 leading-relaxed">
                Automated inventory syncing is now active across all storage locations. 
                Your shelves are balanced.
              </p>
              <div className="mt-8 text-6xl opacity-20">✦</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}