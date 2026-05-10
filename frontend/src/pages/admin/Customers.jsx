'use client';

import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Search, 
  Eye, 
  UserPlus,
  TrendingUp,
  Edit2,
  Trash2,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCustomers, fetchCustomerStats, createCustomer, updateCustomer, deleteCustomer } from '../../api/api';

export default function Customers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const queryClient = useQueryClient();

  const { data: customersData, isLoading: customersLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: fetchCustomers
  });

  const { data: customerStats, isLoading: statsLoading } = useQuery({
    queryKey: ['customerStats'],
    queryFn: fetchCustomerStats
  });

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customerStats']);
      setIsModalOpen(false);
    }
  });

  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }) => updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customerStats']);
      setIsModalOpen(false);
    }
  });

  const deleteCustomerMutation = useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries(['customers']);
      queryClient.invalidateQueries(['customerStats']);
    }
  });

  const customers = customersData?.data || [];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    avatar: "https://i.pravatar.cc/40?u=default",
    joinDate: new Date().toISOString().split('T')[0],
    totalSpent: 0,
    orders: 0,
    status: "Active"
  });

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open Add Modal
  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      avatar: `https://i.pravatar.cc/40?u=${Date.now()}`,
      joinDate: new Date().toISOString().split('T')[0],
      totalSpent: 0,
      orders: 0,
      status: "Active"
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setIsModalOpen(true);
  };

  // Save (Create or Update)
  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert("Name and Email are required!");
      return;
    }

    if (editingCustomer) {
      // Update
      updateCustomerMutation.mutate({ id: editingCustomer._id, data: formData });
    } else {
      // Create
      createCustomerMutation.mutate(formData);
    }
  };

  // Delete Customer
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      deleteCustomerMutation.mutate(id);
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
            <Link to="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-2xl">
              <ShoppingBag className="w-5 h-5" />
              <span>Orders</span>
            </Link>
            <Link to="/admin/customers" className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-700 rounded-2xl font-medium">
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
          <div className="flex justify-between items-start mb-8">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900">Customers</h1>
              <p className="text-gray-600 mt-1">Manage your community and track customer rituals.</p>
            </div>
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition-colors"
            >
              <UserPlus className="w-5 h-5" />
              Add Customer
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">TOTAL CUSTOMERS</p>
              <p className="text-4xl font-semibold mt-3">{statsLoading ? '...' : (customerStats?.data?.totalCustomers || 0)}</p>
              <p className="text-emerald-600 text-sm mt-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" /> +18% this month
              </p>
            </div>
            {/* Other KPI cards remain the same */}
            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">NEW THIS MONTH</p>
              <p className="text-4xl font-semibold mt-3">{statsLoading ? '...' : (customerStats?.data?.newThisMonth || 0)}</p>
              <p className="text-gray-500 text-sm mt-1">+42 since last week</p>
            </div>
            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">ACTIVE CUSTOMERS</p>
              <p className="text-4xl font-semibold mt-3">{statsLoading ? '...' : (customerStats?.data?.activeCustomers || 0)}</p>
              <p className="text-emerald-600 text-sm mt-1">84% retention rate</p>
            </div>
            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">AVG. LIFETIME VALUE</p>
              <p className="text-4xl font-semibold mt-3">${statsLoading ? '...' : ((customerStats?.data?.avgLifetimeValue || 0).toFixed(0))}</p>
              <p className="text-gray-500 text-sm mt-1">+12% from last quarter</p>
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Customers</h2>
              <div className="relative w-96">
                <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-6 py-5 font-medium">CUSTOMER</th>
                    <th className="px-6 py-5 font-medium">EMAIL</th>
                    <th className="px-6 py-5 font-medium">JOINED</th>
                    <th className="px-6 py-5 font-medium">TOTAL SPENT</th>
                    <th className="px-6 py-5 font-medium">ORDERS</th>
                    <th className="px-6 py-5 font-medium">STATUS</th>
                    <th className="px-6 py-5 font-medium text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {customersLoading ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        Loading customers...
                      </td>
                    </tr>
                  ) : filteredCustomers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                        No customers found
                      </td>
                    </tr>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <tr key={customer._id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <img 
                              src={customer.avatar || `https://i.pravatar.cc/40?u=${customer.name.toLowerCase().replace(/\s+/g, '')}`}
                              alt={customer.name}
                              className="w-9 h-9 rounded-full" 
                            />
                            <span className="font-medium">{customer.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-gray-600">{customer.email}</td>
                        <td className="px-6 py-5 text-gray-600">
                          {new Date(customer.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-5 font-semibold">${customer.totalSpent}</td>
                        <td className="px-6 py-5 font-medium">{customer.orders}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-block px-4 py-1 text-xs font-medium rounded-full ${
                            customer.status === 'Active' 
                              ? 'bg-emerald-100 text-emerald-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            {customer.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <div className="flex items-center justify-center gap-4">
                            <button 
                              onClick={() => openEditModal(customer)}
                              className="text-gray-400 hover:text-blue-600 transition-colors"
                            >
                              <Edit2 className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(customer._id)}
                              className="text-gray-400 hover:text-red-600 transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-semibold">
                {editingCustomer ? "Edit Customer" : "Add New Customer"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  placeholder="Enter customer name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  placeholder="customer@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Join Date</label>
                  <input
                    type="date"
                    value={formData.joinDate}
                    onChange={(e) => setFormData({...formData, joinDate: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Total Spent ($)</label>
                  <input
                    type="number"
                    value={formData.totalSpent}
                    onChange={(e) => setFormData({...formData, totalSpent: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Total Orders</label>
                  <input
                    type="number"
                    value={formData.orders}
                    onChange={(e) => setFormData({...formData, orders: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl font-medium hover:bg-rose-700"
              >
                {editingCustomer ? "Update Customer" : "Add Customer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}