"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { Plus, Trash2, Edit2, MapPin, Search } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';

export default function DeliveryAreasPage() {
  const [areas, setAreas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    pincode: '',
    city: '',
    state: '',
    estimated_days: 5,
    is_active: true
  });

  useEffect(() => {
    fetchAreas();
  }, []);

  const fetchAreas = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('serviceable_areas')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast.error('Failed to load serviceable areas');
    } else {
      setAreas(data || []);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) {
        const { error } = await supabase
          .from('serviceable_areas')
          .update(formData)
          .eq('id', editId);
        if (error) throw error;
        toast.success('Area updated');
      } else {
        const { error } = await supabase
          .from('serviceable_areas')
          .insert([formData]);
        if (error) throw error;
        toast.success('Area added successfully');
      }
      setIsModalOpen(false);
      fetchAreas();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save area');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this delivery area?')) return;
    try {
      const { error } = await supabase.from('serviceable_areas').delete().eq('id', id);
      if (error) throw error;
      toast.success('Area deleted');
      fetchAreas();
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete');
    }
  };

  const openNewModal = () => {
    setEditId(null);
    setFormData({ pincode: '', city: '', state: '', estimated_days: 5, is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (area: any) => {
    setEditId(area.id);
    setFormData({
      pincode: area.pincode,
      city: area.city || '',
      state: area.state || '',
      estimated_days: area.estimated_days || 5,
      is_active: area.is_active
    });
    setIsModalOpen(true);
  };

  const filteredAreas = areas.filter(a => 
    a.pincode.includes(search) || 
    (a.city && a.city.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <SectionHeading title="Delivery Areas" subtitle="Manage serviceable pincodes and times" />
        <button 
          onClick={openNewModal}
          className="flex items-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-xl font-bold hover:bg-brand-pink transition-colors"
        >
          <Plus className="h-5 w-5" /> Add New Area
        </button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Search by pincode or city..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-brand-pink transition-colors"
        />
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-400">Loading...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Pincode</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">City/State</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Est. Days</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAreas.length > 0 ? filteredAreas.map(area => (
                <tr key={area.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-brand-dark flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-brand-pink" />
                    {area.pincode}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {area.city ? `${area.city}, ${area.state}` : 'Unspecified'}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {area.estimated_days} Days
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${area.is_active ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                      {area.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-3">
                    <button onClick={() => openEditModal(area)} className="p-2 text-gray-400 hover:text-brand-pink hover:bg-brand-pink/10 rounded-lg transition-colors">
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button onClick={() => handleDelete(area.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No serviceable areas found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <h3 className="text-2xl font-black mb-6">{editId ? 'Edit Area' : 'New Area'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Pincode *</label>
                <input required type="text" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-pink outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">City</label>
                  <input type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-pink outline-none" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">State</label>
                  <input type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-pink outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Estimated Delivery (Days) *</label>
                <input required type="number" min="1" value={formData.estimated_days} onChange={e => setFormData({...formData, estimated_days: parseInt(e.target.value)})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-brand-pink outline-none" />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <input type="checkbox" id="isActive" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} className="w-4 h-4 text-brand-pink" />
                <label htmlFor="isActive" className="font-bold text-gray-600">Active / Serviceable</label>
              </div>
              
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3 text-gray-500 font-bold hover:bg-gray-50 rounded-xl">Cancel</button>
                <button type="submit" className="flex-1 py-3 bg-brand-dark text-white font-bold rounded-xl hover:bg-brand-pink transition-colors">Save Area</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
