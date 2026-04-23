"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { 
  Ticket, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle2,
  X,
  Loader2,
  Zap,
  Calendar,
  Tag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Coupon {
  id: string;
  code: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount: number;
  max_discount_amount: number | null;
  expiry_date: string | null;
  is_active: boolean;
  created_at: string;
  applicable_product_ids: string[] | null;
}

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(0);
  const [minOrder, setMinOrder] = useState(0);
  const [expiry, setExpiry] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [applicableProducts, setApplicableProducts] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<{id: string, name: string}[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCouponsAndProducts();
  }, []);

  const fetchCouponsAndProducts = async () => {
    setLoading(true);
    try {
      const [couponsRes, productsRes] = await Promise.all([
        supabase.from('coupons').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('id, name').order('name')
      ]);

      if (couponsRes.error) throw couponsRes.error;
      setCoupons(couponsRes.data || []);
      if (productsRes.data) setAllProducts(productsRes.data);
    } catch (err: any) {
      toast.error("Failed to load data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const payload = {
        code: code.toUpperCase().trim(),
        description,
        discount_type: discountType,
        discount_value: Number(discountValue),
        min_order_amount: Number(minOrder),
        expiry_date: expiry ? new Date(expiry).toISOString() : null,
        is_active: isActive,
        applicable_product_ids: applicableProducts.length > 0 ? applicableProducts : null
      };

      if (editingCoupon) {
        const { error } = await supabase
          .from('coupons')
          .update(payload)
          .eq('id', editingCoupon.id);
        if (error) throw error;
        toast.success("Coupon code updated!");
      } else {
        const { error } = await supabase
          .from('coupons')
          .insert(payload);
        if (error) throw error;
        toast.success("Coupon successfully deployed!");
      }
      
      setIsModalOpen(false);
      resetForm();
      fetchCouponsAndProducts();
    } catch (err: any) {
      toast.error("Deployment failed: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setCode('');
    setDescription('');
    setDiscountType('percentage');
    setDiscountValue(0);
    setMinOrder(0);
    setExpiry('');
    setIsActive(true);
    setApplicableProducts([]);
    setEditingCoupon(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to terminate this coupon code?")) return;
    try {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) throw error;
      toast.success("Coupon removed from system");
      fetchCouponsAndProducts();
    } catch (err: any) {
      toast.error("Failed to delete coupon");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto animate-in fade-in duration-500 pb-32">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-black text-brand-dark tracking-tighter italic mb-2">Discount <span className="text-brand-pink">Terminal</span></h1>
            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Manage promo codes and seasonal incentives.</p>
          </div>
          
          <button 
            onClick={() => { resetForm(); setIsModalOpen(true); }}
            className="px-8 py-4 bg-brand-dark text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-brand-dark/10 hover:bg-brand-pink transition-all flex items-center gap-3 italic"
          >
            <Plus className="h-4 w-4" /> Deploy New Coupon
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-brand-pink"><Loader2 className="h-10 w-10 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coupons.map((coupon) => (
              <div key={coupon.id} className="group bg-white rounded-[40px] p-8 border border-gray-100 hover:shadow-2xl transition-all relative overflow-hidden flex flex-col h-full">
                {!coupon.is_active && <div className="absolute top-0 right-0 px-4 py-2 bg-gray-100 text-[9px] font-black uppercase tracking-widest text-gray-400 rounded-bl-2xl">INACTIVE</div>}
                
                <div className="flex items-start justify-between mb-8">
                   <div className="w-16 h-16 rounded-[24px] bg-brand-pink/10 flex items-center justify-center text-brand-pink group-hover:bg-brand-pink group-hover:text-white transition-all">
                      <Ticket className="h-7 w-7" />
                   </div>
                   <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingCoupon(coupon);
                          setCode(coupon.code);
                          setDescription(coupon.description);
                          setDiscountType(coupon.discount_type);
                          setDiscountValue(coupon.discount_value);
                          setMinOrder(coupon.min_order_amount);
                          setExpiry(coupon.expiry_date ? new Date(coupon.expiry_date).toISOString().split('T')[0] : '');
                          setIsActive(coupon.is_active);
                          setApplicableProducts(coupon.applicable_product_ids || []);
                          setIsModalOpen(true);
                        }}
                        className="p-3 bg-gray-50 hover:bg-brand-dark hover:text-white rounded-xl transition-all"
                      ><Edit3 className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(coupon.id)} className="p-3 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 className="h-4 w-4" /></button>
                   </div>
                </div>

                <div className="mb-auto">
                   <h3 className="text-3xl font-black text-brand-dark tracking-tighter mb-2 font-mono group-hover:text-brand-pink transition-colors uppercase">{coupon.code}</h3>
                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">{coupon.description}</p>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-50 space-y-4">
                   <div className="flex items-center justify-between">
                      <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Incentive</div>
                      <div className="text-xl font-black text-brand-dark italic">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}%` : `₹${coupon.discount_value}`}
                      </div>
                   </div>
                   <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <div className="flex items-center gap-2"><Zap className="h-3 w-3 text-brand-cyan" /> Min Order</div>
                      <div className="text-brand-dark">₹{coupon.min_order_amount}</div>
                   </div>
                   {coupon.expiry_date && (
                     <div className="flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <div className="flex items-center gap-2"><Calendar className="h-3 w-3 text-brand-pink" /> Expiry</div>
                        <div className="text-brand-dark">{new Date(coupon.expiry_date).toLocaleDateString()}</div>
                     </div>
                   )}
                </div>
              </div>
            ))}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-brand-dark/40 backdrop-blur-sm animate-in fade-in duration-300">
             <div className="bg-white w-full max-w-xl rounded-[48px] shadow-2xl overflow-hidden relative border border-white/20 animate-in zoom-in-95 duration-300">
                <header className="p-8 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                   <h2 className="text-2xl font-black text-brand-dark tracking-tighter italic">
                     {editingCoupon ? "Modify" : "Initialize"} <span className="text-brand-pink">Coupon</span>
                   </h2>
                   <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                      <X className="h-5 w-5 text-gray-400" />
                   </button>
                </header>

                <form onSubmit={handleSave} className="p-8 space-y-6">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Promo Code</label>
                        <input
                          required
                          type="text"
                          className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm focus:bg-white focus:border-brand-pink outline-none transition-all font-black text-brand-dark uppercase placeholder:normal-case"
                          placeholder="e.g. SUMMER50"
                          value={code}
                          onChange={(e) => setCode(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Incentive Type</label>
                        <div className="flex gap-2">
                           <button 
                             type="button" 
                             onClick={() => setDiscountType('percentage')}
                             className={cn("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", discountType === 'percentage' ? "bg-brand-dark text-white" : "bg-gray-50 text-gray-400")}
                           >Percentage (%)</button>
                           <button 
                             type="button" 
                             onClick={() => setDiscountType('fixed')}
                             className={cn("flex-1 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all", discountType === 'fixed' ? "bg-brand-pink text-white" : "bg-gray-50 text-gray-400")}
                           >Fixed (₹)</button>
                        </div>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Value ({discountType === 'percentage' ? '%' : '₹'})</label>
                        <input
                          required
                          type="number"
                          className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm focus:bg-white focus:border-brand-pink outline-none transition-all font-bold text-brand-dark"
                          value={discountValue}
                          onChange={(e) => setDiscountValue(Number(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Min. Order Amount (₹)</label>
                        <input
                          type="number"
                          className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm focus:bg-white focus:border-brand-pink outline-none transition-all font-bold text-brand-dark"
                          value={minOrder}
                          onChange={(e) => setMinOrder(Number(e.target.value))}
                        />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Description / Purpose</label>
                      <input
                        type="text"
                        className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm focus:bg-white focus:border-brand-pink outline-none transition-all font-bold text-brand-dark"
                        placeholder="e.g. 10% off for new visionary users"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Applicable Products (Leave empty for all)</label>
                      <div className="flex flex-col gap-2">
                         <select
                           onChange={(e) => {
                             const val = e.target.value;
                             if (val && !applicableProducts.includes(val)) {
                               setApplicableProducts([...applicableProducts, val]);
                               e.target.value = "";
                             }
                           }}
                           className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm focus:bg-white focus:border-brand-pink outline-none transition-all font-bold text-brand-dark cursor-pointer appearance-none"
                         >
                            <option value="">Link to specific product...</option>
                            {allProducts.filter(p => !applicableProducts.includes(p.id)).map(p => (
                              <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                         </select>
                         {applicableProducts.length > 0 && (
                           <div className="flex flex-wrap gap-2 mt-2">
                             {applicableProducts.map(id => {
                               const product = allProducts.find(p => p.id === id);
                               return (
                                 <span key={id} className="px-3 py-1.5 bg-brand-dark text-white text-[10px] font-black rounded-xl flex items-center gap-2">
                                   {product?.name || id}
                                   <button type="button" onClick={() => setApplicableProducts(applicableProducts.filter(pid => pid !== id))} className="text-white/50 hover:text-white transition-colors"><X className="h-3 w-3" /></button>
                                 </span>
                               )
                             })}
                           </div>
                         )}
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Expiration Date</label>
                        <input
                          type="date"
                          className="w-full bg-gray-50 border border-transparent rounded-2xl py-4 px-5 text-sm focus:bg-white focus:border-brand-pink outline-none transition-all font-bold text-brand-dark"
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">System Status</label>
                        <button 
                          type="button" 
                          onClick={() => setIsActive(!isActive)}
                          className={cn("w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2", isActive ? "bg-brand-cyan/10 text-brand-cyan" : "bg-red-50 text-red-500")}
                        >
                           {isActive ? <><CheckCircle2 className="h-4 w-4" /> Active</> : <><X className="h-4 w-4" /> Suspended</>}
                        </button>
                      </div>
                   </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="w-full py-5 bg-brand-dark text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.3em] shadow-xl shadow-brand-dark/10 hover:bg-brand-pink transition-all flex items-center justify-center gap-3 disabled:opacity-50 italic"
                    >
                      {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> syncing</> : <><Tag className="h-4 w-4" /> Deploy to Production</>}
                    </button>
                </form>
              </div>
           </div>
         )}
      </div>
  );
}
