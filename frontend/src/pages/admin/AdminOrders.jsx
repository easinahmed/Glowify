
import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Search, 
  Eye, 
  Download,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOrders, fetchOrderStats, updateOrderStatus } from '../../api/api';

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState('All Orders');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders
  });

  const { data: orderStats, isLoading: statsLoading } = useQuery({
    queryKey: ['orderStats'],
    queryFn: fetchOrderStats
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ orderId, status }) => updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries(['orders']);
      queryClient.invalidateQueries(['orderStats']);
    }
  });

  const orders = ordersData?.data || [];

  // Filter orders based on active tab and search
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'All Orders') return matchesSearch;
    if (activeTab === 'Pending') return matchesSearch && order.status === 'PENDING';
    if (activeTab === 'Shipped') return matchesSearch && order.status === 'SHIPPED';
    if (activeTab === 'Delivered') return matchesSearch && order.status === 'DELIVERED';
    
    return matchesSearch;
  });

  const getStatusStyle = (status) => {
    switch(status) {
      case 'PENDING': return 'bg-orange-100 text-orange-700';
      case 'SHIPPED': return 'bg-blue-100 text-blue-700';
      case 'DELIVERED': return 'bg-emerald-100 text-emerald-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf7] flex font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-semibold">Glowify</h2>
          <p className="text-xs text-gray-500">Management</p>
        </div>

        <nav className="flex-1 px-3">
          <div className="space-y-1">
            <Link to="/admin/inventory" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl">
              <Package className="w-5 h-5" />
              <span>Inventory</span>
            </Link>
            <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-700 rounded-2xl font-medium">
              <ShoppingBag className="w-5 h-5" />
              <span>Orders</span>
            </Link>
            <Link to="/admin/customers" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl">
              <Users className="w-5 h-5" />
              <span>Customers</span>
            </Link>
            <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl">
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </Link>
          </div>
        </nav>

        
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="text-sm text-gray-500 mb-1">ADMIN / ORDER TRACKING</div>
              <h1 className="text-4xl font-semibold text-gray-900">Customer Orders</h1>
              <p className="text-gray-600 mt-1">Review and manage recent purchase rituals from your community.</p>
            </div>
            <button className="flex items-center gap-2 border border-gray-300 hover:bg-white px-5 py-3 rounded-2xl text-sm font-medium transition-colors">
              <Download className="w-4 h-4" />
              Export CSV
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">TOTAL ORDERS</p>
              <p className="text-4xl font-semibold mt-3">{statsLoading ? '...' : (orderStats?.data?.totalOrders || 0)}</p>
              <p className="text-emerald-600 text-sm mt-1">+12% vs last month</p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">PENDING SHIPMENT</p>
              <p className="text-4xl font-semibold mt-3">{statsLoading ? '...' : (orderStats?.data?.pendingOrders || 0)}</p>
              <p className="text-orange-600 text-sm mt-1">Requires attention</p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">COMPLETED RITUALS</p>
              <p className="text-4xl font-semibold mt-3">{statsLoading ? '...' : (orderStats?.data?.deliveredOrders || 0)}</p>
              <p className="text-gray-500 text-sm mt-1">92.6% fulfillment rate</p>
            </div>

            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">TOTAL REVENUE</p>
              <p className="text-4xl font-semibold mt-3">${statsLoading ? '...' : ((orderStats?.data?.totalRevenue || 0).toLocaleString())}</p>
              <p className="text-gray-500 text-sm mt-1">Gross curated sales</p>
            </div>
          </div>

          {/* Orders Table Section */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Tabs & Search */}
            <div className="flex items-center justify-between border-b p-6">
              <div className="flex gap-2">
                {['All Orders', 'Pending', 'Shipped', 'Delivered'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-5 py-2 rounded-2xl text-sm font-medium transition-colors ${
                      activeTab === tab 
                        ? 'bg-rose-100 text-rose-700' 
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="relative w-80">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customer or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-6 py-5 font-medium">ORDER ID</th>
                    <th className="px-6 py-5 font-medium">CUSTOMER NAME</th>
                    <th className="px-6 py-5 font-medium">DATE</th>
                    <th className="px-6 py-5 font-medium">TOTAL</th>
                    <th className="px-6 py-5 font-medium">STATUS</th>
                    <th className="px-6 py-5 font-medium text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {ordersLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        Loading orders...
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5 font-medium">{order.orderNumber}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <img 
                              src={`https://i.pravatar.cc/40?u=${order.customerName.toLowerCase().replace(/\s+/g, '')}`} 
                              alt=""
                              className="w-8 h-8 rounded-full" 
                            />
                            <span>{order.customerName}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-600">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5 font-semibold">${order.totalAmount.toFixed(2)}</td>
                        <td className="px-6 py-5">
                          <select
                            value={order.status}
                            onChange={(e) => updateStatusMutation.mutate({ 
                              orderId: order._id, 
                              status: e.target.value 
                            })}
                            className={`inline-block px-4 py-1 text-xs font-medium rounded-full border-0 ${
                              order.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                              order.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700' :
                              order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-gray-100 text-gray-700'
                            }`}
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <button className="text-gray-400 hover:text-gray-700 transition-colors">
                            <Eye className="w-5 h-5 mx-auto" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-5 flex items-center justify-between border-t">
              <p className="text-sm text-gray-500">
                Showing 1-{Math.min(filteredOrders.length, 10)} of {filteredOrders.length} results
              </p>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-xl">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl font-medium">1</button>
                <button className="px-4 py-2 hover:bg-gray-100 rounded-xl">2</button>
                <button className="px-4 py-2 hover:bg-gray-100 rounded-xl">3</button>
                <button className="p-2 hover:bg-gray-100 rounded-xl">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-xs text-gray-400 flex justify-between">
            <p>© 2024 GLOWIFY. A RITUAL OF SELF-CARE.</p>
            <div className="flex gap-6">
              <p>SYSTEM STATUS</p>
              <p>HELP CENTER</p>
              <p>PRIVACY POLICY</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}