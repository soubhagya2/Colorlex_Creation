import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit3, Trash2, X } from 'lucide-react';
import { apiFetch } from '../../services/api';

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    sku: '',
    category: '',
    description: '',
    basePrice: 100,
    isFeatured: false,
    isBestSeller: false,
    images: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'],
    variants: {
      sizes: [{ name: 'Standard 3.5" x 2.0"', priceModifier: 0 }],
      materials: [{ name: '14pt Gloss Cover', priceModifier: 0 }],
      finishes: [{ name: 'Standard Matte Finish', priceModifier: 0 }]
    },
    bulkPricing: [
      { minQty: 100, pricePerUnit: 5.0, discountPercentage: 0 },
      { minQty: 500, pricePerUnit: 3.5, discountPercentage: 30 }
    ],
    turnaroundOptions: [
      { name: 'Standard (2-3 Days)', extraFee: 0, estimatedDays: '2-3 Days' },
      { name: 'Express (24 Hours)', extraFee: 300, estimatedDays: '24 Hours' }
    ]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        apiFetch('/products'),
        apiFetch('/categories')
      ]);
      if (prodRes.success) setProducts(prodRes.data);
      if (catRes.success) setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      sku: '',
      category: categories[0]?._id || '',
      description: '',
      basePrice: 500,
      isFeatured: false,
      isBestSeller: false,
      images: ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'],
      variants: {
        sizes: [{ name: 'Standard', priceModifier: 0 }],
        materials: [{ name: 'Standard Paper', priceModifier: 0 }],
        finishes: [{ name: 'Standard Matte', priceModifier: 0 }]
      },
      bulkPricing: [{ minQty: 100, pricePerUnit: 5, discountPercentage: 0 }],
      turnaroundOptions: [{ name: 'Standard (3 Days)', extraFee: 0, estimatedDays: '3 Days' }]
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      category: product.category?._id || product.category || '',
      description: product.description,
      basePrice: product.basePrice,
      isFeatured: product.isFeatured || false,
      isBestSeller: product.isBestSeller || false,
      images: product.images?.length > 0 ? product.images : ['https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'],
      variants: product.variants || { sizes: [], materials: [], finishes: [] },
      bulkPricing: product.bulkPricing || [],
      turnaroundOptions: product.turnaroundOptions || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await apiFetch(`/products/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await apiFetch(`/products/${editingProduct._id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
      } else {
        await apiFetch('/products', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      alert(err.message);
    }
  };

  const addVariantOption = (type) => {
    setFormData(prev => ({
      ...prev,
      variants: {
        ...prev.variants,
        [type]: [...(prev.variants[type] || []), { name: 'New Option', priceModifier: 0 }]
      }
    }));
  };

  const updateVariantOption = (type, idx, key, val) => {
    setFormData(prev => {
      const list = [...prev.variants[type]];
      list[idx][key] = key === 'priceModifier' ? Number(val) : val;
      return { ...prev, variants: { ...prev.variants, [type]: list } };
    });
  };

  const removeVariantOption = (type, idx) => {
    setFormData(prev => {
      const list = prev.variants[type].filter((_, i) => i !== idx);
      return { ...prev, variants: { ...prev.variants, [type]: list } };
    });
  };

  const addBulkTier = () => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: [...prev.bulkPricing, { minQty: 250, pricePerUnit: 4, discountPercentage: 10 }]
    }));
  };

  const updateBulkTier = (idx, key, val) => {
    setFormData(prev => {
      const list = [...prev.bulkPricing];
      list[idx][key] = Number(val);
      return { ...prev, bulkPricing: list };
    });
  };

  const removeBulkTier = (idx) => {
    setFormData(prev => ({
      ...prev,
      bulkPricing: prev.bulkPricing.filter((_, i) => i !== idx)
    }));
  };

  const filteredProducts = products.filter(p =>
    (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.sku || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Products & Pricing Catalog</h1>
          <p className="text-slate-400 text-sm mt-0.5">Manage print products, custom variants, and volume discount tiers</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-4 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 flex items-center space-x-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold">{filteredProducts.length} Items Total</span>
      </div>

      <div className="bg-slate-950/70 border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/80 border-b border-slate-800 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <th className="p-4">Product Info</th>
              <th className="p-4">Category</th>
              <th className="p-4">Base Price</th>
              <th className="p-4">Variants Count</th>
              <th className="p-4">Badges</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-sm">
            {loading ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">Loading products...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center text-slate-400">No print products found matching criteria.</td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p._id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={p.images?.[0] || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=150&q=80'}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white block">{p.name}</span>
                        <span className="text-xs font-mono text-purple-400">{p.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-300 font-medium">
                    {p.category?.name || 'Uncategorized'}
                  </td>
                  <td className="p-4 font-extrabold text-white">
                    ₹{p.basePrice}
                  </td>
                  <td className="p-4 text-xs text-slate-400">
                    <div>{p.variants?.sizes?.length || 0} Sizes</div>
                    <div>{p.variants?.materials?.length || 0} Materials</div>
                    <div>{p.variants?.finishes?.length || 0} Finishes</div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {p.isBestSeller && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Best Seller
                        </span>
                      )}
                      {p.isFeatured && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                          Featured
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white">
                {editingProduct ? 'Edit Product & Variant Specs' : 'Create New Print Product'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Product Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Auto-generated if blank"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Base Starting Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.basePrice}
                    onChange={(e) => setFormData({ ...formData, basePrice: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Description</label>
                <textarea
                  rows="3"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Product Image URL</label>
                <input
                  type="text"
                  value={formData.images[0] || ''}
                  onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white"
                />
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-xs text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center space-x-2 text-xs text-slate-300 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded bg-slate-950 border-slate-800 text-purple-600 focus:ring-0"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-400">1. Size Variants</h4>
                  <button type="button" onClick={() => addVariantOption('sizes')} className="text-xs text-purple-400 hover:underline">+ Add Size</button>
                </div>
                <div className="space-y-2">
                  {formData.variants?.sizes?.map((size, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={size.name}
                        onChange={(e) => updateVariantOption('sizes', idx, 'name', e.target.value)}
                        placeholder="Size Name (e.g., 3.5 x 2)"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="number"
                        value={size.priceModifier}
                        onChange={(e) => updateVariantOption('sizes', idx, 'priceModifier', e.target.value)}
                        placeholder="+/- Price (₹)"
                        className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <button type="button" onClick={() => removeVariantOption('sizes', idx)} className="text-rose-400 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-400">2. Paper / Material Type Variants</h4>
                  <button type="button" onClick={() => addVariantOption('materials')} className="text-xs text-purple-400 hover:underline">+ Add Material</button>
                </div>
                <div className="space-y-2">
                  {formData.variants?.materials?.map((mat, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={mat.name}
                        onChange={(e) => updateVariantOption('materials', idx, 'name', e.target.value)}
                        placeholder="Material (e.g. 16pt Matte Cover)"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="number"
                        value={mat.priceModifier}
                        onChange={(e) => updateVariantOption('materials', idx, 'priceModifier', e.target.value)}
                        placeholder="+/- Price (₹)"
                        className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <button type="button" onClick={() => removeVariantOption('materials', idx)} className="text-rose-400 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-purple-400">3. Finish Variants</h4>
                  <button type="button" onClick={() => addVariantOption('finishes')} className="text-xs text-purple-400 hover:underline">+ Add Finish</button>
                </div>
                <div className="space-y-2">
                  {formData.variants?.finishes?.map((fin, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={fin.name}
                        onChange={(e) => updateVariantOption('finishes', idx, 'name', e.target.value)}
                        placeholder="Finish (e.g., Gold Foil)"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="number"
                        value={fin.priceModifier}
                        onChange={(e) => updateVariantOption('finishes', idx, 'priceModifier', e.target.value)}
                        placeholder="+/- Price (₹)"
                        className="w-28 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <button type="button" onClick={() => removeVariantOption('finishes', idx)} className="text-rose-400 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">4. Bulk Quantity Tier Pricing</h4>
                  <button type="button" onClick={addBulkTier} className="text-xs text-emerald-400 hover:underline">+ Add Bulk Tier</button>
                </div>
                <div className="space-y-2">
                  {formData.bulkPricing?.map((tier, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <input
                        type="number"
                        value={tier.minQty}
                        onChange={(e) => updateBulkTier(idx, 'minQty', e.target.value)}
                        placeholder="Min Qty (e.g. 500)"
                        className="w-36 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <input
                        type="number"
                        step="0.01"
                        value={tier.pricePerUnit}
                        onChange={(e) => updateBulkTier(idx, 'pricePerUnit', e.target.value)}
                        placeholder="Price/Unit (₹)"
                        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white"
                      />
                      <button type="button" onClick={() => removeBulkTier(idx)} className="text-rose-400 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-slate-800 pt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white shadow-lg shadow-purple-600/30"
                >
                  Save Product Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
