
import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  BarChart3, 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../api/api'

export default function Inventory() {
  const queryClient = useQueryClient()

  const { data: products = [], isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  })

  const addProductMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsModalOpen(false)
      setEditingProduct(null)
      setFormData({
        name: "",
        category: "",
        stock: 0,
        price: 0,
        image: "",
        description: ""
      })
    },
    onError: (error) => {
      alert('Failed to add product: ' + error.message)
    }
  })

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      setIsModalOpen(false)
      setEditingProduct(null)
      setFormData({
        name: "",
        category: "",
        stock: 0,
        price: 0,
        image: "",
        description: ""
      })
    },
    onError: (error) => {
      alert('Failed to update product: ' + error.message)
    }
  })

  const deleteProductMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error) => {
      alert('Failed to delete product: ' + error.message)
    }
  })

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    stock: 0,
    price: 0,
    image: "",
    description: ""
  });

  // Filter products
  const filteredInventory = products
    .filter(item => 
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       item._id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterStatus === "All" || 
       (item.stock === 0 ? "Out of Stock" : item.stock < 20 ? "Low Stock" : "In Stock") === filterStatus)
    );

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (stock < 20) return { label: "Low Stock", color: "bg-orange-100 text-orange-700" };
    return { label: "In Stock", color: "bg-emerald-100 text-emerald-700" };
  };

  // Open modal for Add
  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: "CLEANSER",
      stock: 10,
      price: 45,
      image: "",
      description: ""
    });
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      stock: product.stock,
      price: product.price,
      image: product.image,
      description: product.description
    });
    setIsModalOpen(true);
  };

  // Save product
  const handleSave = () => {
    if (!formData.name || !formData.price) return alert("Name and price are required");

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, data: formData });
    } else {
      addProductMutation.mutate(formData);
    }
  };

  // Delete product
  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProductMutation.mutate(productId);
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
            <Link to="/admin/inventory" className="flex items-center gap-3 px-4 py-3 bg-rose-50 text-rose-700 rounded-2xl font-medium">
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
              <h1 className="text-4xl font-semibold text-gray-900">Inventory</h1>
              <p className="text-gray-600 mt-1">Manage your product stock and rituals.</p>
            </div>
            <button 
              onClick={openAddModal}
              className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add New Product
            </button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">TOTAL PRODUCTS</p>
              <p className="text-4xl font-semibold mt-3">{products.length}</p>
            </div>
            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">LOW STOCK</p>
              <p className="text-4xl font-semibold mt-3 text-orange-600">
                {products.filter(p => p.stock > 0 && p.stock < 20).length}
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">OUT OF STOCK</p>
              <p className="text-4xl font-semibold mt-3 text-red-600">
                {products.filter(p => p.stock === 0).length}
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6">
              <p className="text-sm text-gray-500">TOTAL VALUE</p>
              <p className="text-4xl font-semibold mt-3">
                ${products.reduce((sum, p) => sum + p.price * p.stock, 0)}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Products</h2>
              <div className="flex items-center gap-4">
                <div className="relative w-80">
                  <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  />
                </div>

                <select 
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-5 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none"
                >
                  <option value="All">All Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-8 text-center">
                  <div className="text-gray-500">Loading products...</div>
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <div className="text-red-500">Error loading products: {error.message}</div>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b text-left text-sm text-gray-500">
                      <th className="px-6 py-5 font-medium">PRODUCT</th>
                      <th className="px-6 py-5 font-medium">SKU</th>
                      <th className="px-6 py-5 font-medium">CATEGORY</th>
                      <th className="px-6 py-5 font-medium">STOCK</th>
                      <th className="px-6 py-5 font-medium">PRICE</th>
                      <th className="px-6 py-5 font-medium">STATUS</th>
                      <th className="px-6 py-5 font-medium text-center">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInventory.map((item) => {
                      const status = getStockStatus(item.stock);
                      return (
                        <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-2xl object-cover" />
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 font-mono text-gray-600">{item._id}</td>
                          <td className="px-6 py-5 text-gray-600">{item.category}</td>
                          <td className="px-6 py-5 font-semibold">{item.stock} units</td>
                          <td className="px-6 py-5 font-semibold">${item.price}</td>
                          <td className="px-6 py-5">
                            <span className={`inline-block px-4 py-1 text-xs font-medium rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <div className="flex items-center justify-center gap-4">
                              <button 
                                onClick={() => openEditModal(item)}
                                className="text-gray-400 hover:text-blue-600 transition-colors"
                                disabled={deleteProductMutation.isPending}
                              >
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => handleDelete(item._id)}
                                className="text-gray-400 hover:text-red-600 transition-colors"
                                disabled={deleteProductMutation.isPending}
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
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
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  rows="3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  >
                    <option>CLEANSER</option>
                    <option>SERUM</option>
                    <option>MOISTURIZER</option>
                    <option>RITUAL</option>
                    <option>TONER</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:border-rose-300"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3.5 border border-gray-300 rounded-2xl font-medium hover:bg-gray-50"
                disabled={addProductMutation.isPending || updateProductMutation.isPending}
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={addProductMutation.isPending || updateProductMutation.isPending}
                className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl font-medium hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {addProductMutation.isPending || updateProductMutation.isPending 
                  ? "Saving..." 
                  : editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}