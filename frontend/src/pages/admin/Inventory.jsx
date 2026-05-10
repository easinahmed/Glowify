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
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProducts, addProduct, updateProduct, deleteProduct } from '../../api/api';

const CATEGORIES = ["CLEANSER", "SERUM", "MOISTURIZER", "TONER", "RITUAL"];

export default function Inventory() {
  const queryClient = useQueryClient();

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "CLEANSER",
    stock: 10,
    price: 45,
    image: "",
    description: "",
    additionalImages: "",     // Comma separated
    keyActives: "",           // Name | Description
    ritualSteps: ""           // Title | Description
  });

  // Mutations
  const addMutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      alert("✅ Product added successfully!");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
    },
    onError: (err) => alert('❌ ' + (err.response?.data?.message || err.message))
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateProduct(id, data),
    onSuccess: () => {
      alert("✅ Product updated!");
      queryClient.invalidateQueries({ queryKey: ['products'] });
      resetForm();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      alert("✅ Product deleted!");
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (err) => alert('❌ ' + (err.response?.data?.message || err.message))
  });

  const resetForm = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      name: "", category: "CLEANSER", stock: 10, price: 45,
      image: "", description: "", additionalImages: "",
      keyActives: "", ritualSteps: ""
    });
  };

  // Filter products based on search and status
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "All" ||
      (filterStatus === "In Stock" && product.stock > 20) ||
      (filterStatus === "Low Stock" && product.stock > 0 && product.stock <= 20) ||
      (filterStatus === "Out of Stock" && product.stock === 0);
    return matchesSearch && matchesStatus;
  });

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (stock <= 20) return { label: "Low Stock", color: "bg-orange-100 text-orange-700" };
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  };

  // Handle delete
  const handleDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteMutation.mutate(productId);
    }
  };

  const openAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      category: product.category || "CLEANSER",
      stock: product.stock || 0,
      price: product.price || 0,
      image: product.image || "",
      description: product.description || "",
      additionalImages: product.additionalImages ? product.additionalImages.join(", ") : "",
      keyActives: product.keyActives ? product.keyActives.map(a => `${a.name} | ${a.desc}`).join("\n") : "",
      ritualSteps: product.ritualSteps ? product.ritualSteps.map(r => `${r.title} | ${r.desc}`).join("\n") : ""
    });
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return alert("Product Name is required!");

    const payload = {
      name: formData.name,
      category: formData.category,
      stock: Number(formData.stock),
      price: Number(formData.price),
      image: formData.image,
      description: formData.description,

      additionalImages: formData.additionalImages
        ? formData.additionalImages.split(",").map(url => url.trim()).filter(Boolean)
        : [],

      keyActives: formData.keyActives
        ? formData.keyActives.split("\n").map(line => {
          const [name, desc] = line.split("|").map(s => s.trim());
          return name && desc ? { icon: "✦", name, desc } : null;
        }).filter(Boolean)
        : [],

      ritualSteps: formData.ritualSteps
        ? formData.ritualSteps.split("\n").map((line, i) => {
          const [title, desc] = line.split("|").map(s => s.trim());
          return title && desc ? { num: `0${i + 1}`, title, desc } : null;
        }).filter(Boolean)
        : []
    };

    if (editingProduct) {
      updateMutation.mutate({ id: editingProduct._id, data: payload });
    } else {
      addMutation.mutate(payload);
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
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-semibold text-gray-900">Inventory</h1>
              <p className="text-gray-600">Manage your products</p>
            </div>
            <button onClick={openAddModal} className="bg-gray-900 text-white px-6 py-3 rounded-2xl flex items-center gap-2 hover:bg-black">
              <Plus className="w-5 h-5" /> Add New Product
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
                ${products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0)}
              </p>
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b flex flex-col md:flex-row gap-4 justify-between">
              <h2 className="text-xl font-semibold">All Products</h2>
              <div className="flex gap-4">
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
              <table className="w-full">
                <thead>
                  <tr className="border-b text-left text-sm text-gray-500">
                    <th className="px-6 py-5 font-medium">PRODUCT</th>
                    <th className="px-6 py-5 font-medium">CATEGORY</th>
                    <th className="px-6 py-5 font-medium">STOCK</th>
                    <th className="px-6 py-5 font-medium">PRICE</th>
                    <th className="px-6 py-5 font-medium">STATUS</th>
                    <th className="px-6 py-5 font-medium text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        Loading products...
                      </td>
                    </tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                        No products found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((item) => {
                      const status = getStockStatus(item.stock);
                      return (
                        <tr key={item._id} className="border-b hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 rounded-2xl object-cover" />}
                              <span className="font-medium">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-gray-600">{item.category}</td>
                          <td className="px-6 py-5 font-semibold">{item.stock} units</td>
                          <td className="px-6 py-5 font-semibold">${item.price}</td>
                          <td className="px-6 py-5">
                            <span className={`inline-block px-4 py-1 text-xs font-medium rounded-full ${status.color}`}>
                              {status.label}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-center">
                            <div className="flex justify-center gap-4">
                              <button onClick={() => openEditModal(item)} className="text-blue-600 hover:text-blue-700">
                                <Edit2 className="w-5 h-5" />
                              </button>
                              <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-700">
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between sticky top-0 bg-white">
              <h2 className="text-2xl font-semibold">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={resetForm}><X className="w-6 h-6" /></button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                  <input type="number" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock</label>
                  <input type="number" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Main Image URL</label>
                  <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images (comma separated)</label>
                <textarea value={formData.additionalImages} onChange={(e) => setFormData({ ...formData, additionalImages: e.target.value })} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Actives (One per line: Name | Description)</label>
                <textarea value={formData.keyActives} onChange={(e) => setFormData({ ...formData, keyActives: e.target.value })} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" placeholder="Hyaluronic Acid | Deep hydration" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ritual Steps (One per line: Title | Description)</label>
                <textarea value={formData.ritualSteps} onChange={(e) => setFormData({ ...formData, ritualSteps: e.target.value })} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent" placeholder="Cleanse & Prep | Start with gentle cleanser" />
              </div>
            </div>

            <div className="p-6 border-t flex gap-3">
              <button onClick={resetForm} className="flex-1 py-3.5 border rounded-2xl">Cancel</button>
              <button onClick={handleSave} className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl">
                {editingProduct ? "Update Product" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}