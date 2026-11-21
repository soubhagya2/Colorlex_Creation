import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, X, Star } from 'lucide-react';
import { apiFetch } from '../../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentCategory: '',
    isFeatured: false,
    displayOrder: 0
  });

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await apiFetch('/categories');
      if (res.success) setCategories(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80',
      parentCategory: '',
      isFeatured: true,
      displayOrder: categories.length + 1
    });
    setShowModal(true);
  };

  const openEditModal = (cat) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      description: cat.description || '',
      image: cat.image || '',
      parentCategory: cat.parentCategory?._id || cat.parentCategory || '',
      isFeatured: cat.isFeatured || false,
      displayOrder: cat.displayOrder ?? 0
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete category?')) return;
    try {
      await apiFetch(`/categories/${id}`, { method: 'DELETE' });
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await apiFetch(`/categories/${editingCategory._id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/categories', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      fetchCategories();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Category Hierarchy</h1>
          <p className="text-slate-400 text-sm mt-0.5">Organize print departments and store taxonomy</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-400">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400">No categories found.</div>
        ) : (
          categories.map((c) => (
            <div key={c._id} className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-purple-500/40 transition-all">
              <div>
                <div className="h-36 relative overflow-hidden bg-slate-900">
                  <img
                    src={c.image || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80'}
                    alt={c.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  {c.isFeatured && (
                    <span className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1">
                      <Star className="w-3 h-3 fill-current" /> Featured
                    </span>
                  )}
                  <span className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700/80 text-[10px] font-bold px-2 py-0.5 rounded shadow">
                    Order: #{c.displayOrder ?? 0}
                  </span>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold text-white tracking-tight">{c.name}</h3>
                  <span className="text-xs font-mono text-purple-400 block mt-0.5">/{c.slug}</span>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">{c.description || 'No description.'}</p>
                </div>
              </div>

              <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-medium text-slate-500">ID: {c._id.substring(18)}</span>
                  <span className="text-[10px] font-semibold text-purple-400 bg-purple-950/60 border border-purple-800/60 px-1.5 py-0.5 rounded">
                    Order: {c.displayOrder ?? 0}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(c)}
                    className="p-1.5 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Category Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="Auto-generated if left blank"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Display Order</label>
                <input
                  type="number"
                  min="0"
                  value={formData.displayOrder}
                  onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                  placeholder="0, 1, 2... (Lower values appear first)"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Determines category sequence on homepage and catalog (lowest number first).
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Banner Image URL</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <label className="flex items-center space-x-2 text-xs text-slate-300 font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                />
                <span>Feature on Homepage</span>
              </label>

              <div className="border-t border-slate-800 pt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30"
                >
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
