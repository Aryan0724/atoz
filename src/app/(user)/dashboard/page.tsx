"use client";

import React, { useEffect, useState } from 'react';
import SectionHeading from '@/components/common/SectionHeading';
import { 
  Package, 
  Clock, 
  Star, 
  Settings, 
  ChevronRight, 
  IndianRupee, 
  Loader2, 
  Zap, 
  Truck, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  LayoutGrid,
  LogOut,
  User,
  MapPin,
  Save,
  Plus as PlusIcon,
  RotateCcw
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { getUserOrders } from '@/lib/supabase/orderActions';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import ReviewModal from '@/components/products/ReviewModal';
import AddressModal from '@/components/profile/AddressModal';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [reviewOrder, setReviewOrder] = useState<any>(null);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [stats, setStats] = useState({
    active: 0,
    delivered: 0,
    saved: 0, // Placeholder for saved designs
    points: 1250
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    toast.success('Signed out successfully');
  };

  useEffect(() => {
    const fetchUserDataAndOrders = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push('/login');
          return;
        }
        setUserData(user);

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          if (profileData.wishlist && profileData.wishlist.length > 0) {
             const { data: wpx } = await supabase.from('products').select('*').in('id', profileData.wishlist);
             if (wpx) setWishlistProducts(wpx);
          }
        }

        const userOrders = await getUserOrders(user.id);
        
        if (userOrders) {
          setOrders(userOrders);
          setStats(prev => ({
            ...prev,
            active: userOrders.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled').length,
            delivered: userOrders.filter((o: any) => o.status === 'delivered').length
          }));
        }
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndOrders();
  }, [router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile || !userData) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          company_name: profile.company_name,
          gst_number: profile.gst_number
        })
        .eq('id', userData.id);
        
      if (error) throw error;
      toast.success('Profile updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = async (newAddress: any) => {
    if (!profile || !userData) return;
    
    const currentAddresses = profile.addresses || [];
    const updatedAddresses = [...currentAddresses, newAddress];
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ addresses: updatedAddresses })
        .eq('id', userData.id);
        
      if (error) throw error;
      
      setProfile({ ...profile, addresses: updatedAddresses });
      toast.success('Address bound to profile!');
    } catch (err: any) {
      toast.error(err.message || 'Failed to save address');
      throw err;
    }
  };

  const topStats = [
    { label: "Active Deployments", value: stats.active.toString().padStart(2, '0'), icon: <Zap />, sub: "Order in Transit", color: "pink" },
    { label: "Completed Prints", value: stats.delivered.toString().padStart(2, '0'), icon: <CheckCircle2 />, sub: "Delivered to You", color: "cyan" },
    { label: "Brand Integrity", value: stats.points.toString(), icon: <ShieldCheck />, sub: "AtoZ Tier 1", color: "dark" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-white overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 to-brand-cyan/5 -z-10" />
        <div className="relative">
          <div className="h-20 w-20 border-4 border-brand-pink/10 border-t-brand-pink rounded-full animate-spin"></div>
          <Zap className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-brand-pink animate-pulse" />
        </div>
        <p className="text-xs font-black text-gray-400 uppercase tracking-[0.3em] italic animate-pulse">Initializing Portal...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-40 overflow-x-hidden pt-32">
      {/* Cinematic Background Mesh */}
      <div className="absolute top-0 right-0 w-[60%] h-[60%] bg-pink-100/30 rounded-full blur-[140px] -z-10 animate-pulse" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-cyan-100/20 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-20 lg:mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-brand-pink/5 border border-brand-pink/10 text-brand-pink text-[10px] font-black uppercase tracking-[0.2em] mb-8">
               <TrendingUp className="w-3.5 h-3.5" />
               Your Print Intelligence Dashboard
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-brand-dark tracking-tighter mb-6 leading-none italic">
               Welcome, <span className="text-brand-pink text-shadow-sm">{profile?.full_name?.split(' ')[0] || userData?.user_metadata?.full_name?.split(' ')[0] || 'Visionary'}</span>.
            </h1>
            <p className="text-lg text-gray-400 font-bold max-w-xl leading-relaxed uppercase tracking-widest text-xs italic">
               Monitor your brand assets, track project status, and scale your merchandise influence from a single command post.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center gap-4"
          >
             <button 
               onClick={handleLogout}
               className="flex items-center gap-3 px-10 py-5 bg-red-50 text-red-500 rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-500 hover:text-white transform hover:-translate-y-1 transition-all shadow-xl shadow-red-100 group"
             >
                <LogOut className="h-4 w-4" />
                Sign Out
             </button>
             <Link href="/products" className="flex items-center gap-3 px-10 py-5 bg-brand-dark text-white rounded-[24px] font-black text-[10px] uppercase tracking-[0.2em] hover:bg-brand-pink transform hover:-translate-y-1 transition-all shadow-xl shadow-brand-dark/10 group">
                New Design +
             </Link>
          </motion.div>
        </div>

        {/* Intelligence Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {topStats.map((stat, idx) => (
            <motion.div 
               key={idx}
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6, delay: idx * 0.1 + 0.3 }}
               className="group relative h-64 p-10 bg-white border border-gray-100 rounded-[48px] overflow-hidden shadow-xl shadow-gray-100 hover:shadow-2xl hover:border-brand-pink/20 transition-all cursor-default"
            >
               <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 group-hover:bg-brand-pink/10 transition-colors" />
               
               <div className="relative z-10 flex flex-col h-full">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center mb-10 transition-all transform group-hover:rotate-12",
                    stat.color === 'pink' ? "bg-brand-pink/10 text-brand-pink" : 
                    stat.color === 'cyan' ? "bg-brand-cyan/10 text-brand-cyan" : "bg-brand-dark/10 text-brand-dark"
                  )}>
                    {React.cloneElement(stat.icon as React.ReactElement, { className: "h-6 w-6" })}
                  </div>
                  <div className="mt-auto">
                    <div className="text-6xl font-black tracking-tighter text-brand-dark mb-1 group-hover:scale-105 transition-transform origin-left">{stat.value}</div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 opacity-60 italic">{stat.label}</div>
                  </div>
               </div>
            </motion.div>
          ))}
        </div>

        {/* Main Panel with Tabs */}
        <div className="grid lg:grid-cols-3 gap-16">
           <div className="lg:col-span-2 space-y-12">
              <div className="flex flex-col md:flex-row items-center justify-between border-b border-gray-100 pb-8 gap-6">
                 <div className="flex items-center gap-8">
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className={cn(
                        "text-lg font-black uppercase tracking-tighter italic transition-all relative pb-2",
                        activeTab === 'orders' ? "text-brand-dark" : "text-gray-300 hover:text-gray-400"
                      )}
                    >
                      Orders <span className="ml-2 px-2 py-0.5 bg-gray-100 rounded-full text-[10px]">{orders.length}</span>
                      {activeTab === 'orders' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-pink rounded-full" />}
                    </button>
                    <button 
                      onClick={() => setActiveTab('profile')}
                      className={cn(
                        "text-lg font-black uppercase tracking-tighter italic transition-all relative pb-2",
                        activeTab === 'profile' ? "text-brand-dark" : "text-gray-300 hover:text-gray-400"
                      )}
                    >
                      Profile
                      {activeTab === 'profile' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-pink rounded-full" />}
                    </button>
                    <button 
                      onClick={() => setActiveTab('addresses')}
                      className={cn(
                        "text-lg font-black uppercase tracking-tighter italic transition-all relative pb-2",
                        activeTab === 'addresses' ? "text-brand-dark" : "text-gray-300 hover:text-gray-400"
                      )}
                    >
                      Addresses
                      {activeTab === 'addresses' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-pink rounded-full" />}
                    </button>
                    <button 
                      onClick={() => setActiveTab('wishlist')}
                      className={cn(
                        "text-lg font-black uppercase tracking-tighter italic transition-all relative pb-2",
                        activeTab === 'wishlist' ? "text-brand-dark" : "text-gray-300 hover:text-gray-400"
                      )}
                    >
                      Wishlist <span className="ml-2 px-2 py-0.5 bg-brand-pink/10 text-brand-pink rounded-full text-[10px]">{wishlistProducts.length}</span>
                      {activeTab === 'wishlist' && <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-brand-pink rounded-full" />}
                    </button>
                 </div>
                 
                 {activeTab === 'orders' && (
                   <select className="bg-transparent text-[10px] font-black uppercase tracking-widest text-gray-400 outline-none focus:text-brand-dark cursor-pointer">
                      <option>Sort: Most Recent</option>
                      <option>Sort: High Value</option>
                   </select>
                 )}
              </div>

              <AnimatePresence mode="wait">
                {activeTab === 'orders' && (
                  <motion.div 
                    key="orders"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    {orders.length > 0 ? (
                      orders.map((order, idx) => (
                        <motion.div 
                           key={order.id} 
                           initial={{ opacity: 0, x: -20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ duration: 0.5, delay: idx * 0.05 }}
                           className="group bg-white p-8 rounded-[40px] border border-gray-100 hover:border-brand-pink/30 hover:shadow-2xl hover:shadow-gray-200/50 transition-all flex flex-col md:flex-row items-center gap-8 relative overflow-hidden"
                        >
                           <div className="absolute bottom-0 left-0 h-1.5 bg-brand-pink/5 w-0 group-hover:w-full transition-all duration-700" />
                           
                           <div className="h-32 w-32 bg-gray-50/50 rounded-[32px] flex-shrink-0 relative overflow-hidden p-6 border border-gray-100 group-hover:scale-105 transition-transform duration-500">
                              <Image 
                                src={order.design_preview_url || (order.products?.images?.[0] || 'https://images.unsplash.com/photo-1549463591-147823d18a2e?q=80&w=300&auto=format&fit=crop')} 
                                alt={order.products?.name || 'Product'} 
                                fill
                                className="object-contain p-4 group-hover:scale-125 transition-transform duration-700"
                              />
                           </div>

                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                 <span className={cn(
                                   "text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1 rounded-full",
                                   order.status === 'delivered' ? "bg-brand-cyan/10 text-brand-cyan" : 
                                   order.status === 'cancelled' ? "bg-red-50 text-red-500" : "bg-brand-pink/10 text-brand-pink animate-pulse"
                                 )}>
                                   {order.status}
                                 </span>
                                 <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Deploy ID: #{order.id.slice(0, 8)}</span>
                              </div>
                              <h4 className="text-2xl font-black text-brand-dark mb-2 tracking-tight group-hover:text-brand-pink transition-colors truncate">{order.products?.name}</h4>
                              <div className="flex flex-wrap items-center gap-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                 <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-brand-cyan" /> {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                                 <span className="flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-brand-pink" /> {order.quality_level} Tier</span>
                                 <span className="flex items-center gap-2 text-brand-dark underline decoration-brand-cyan/30 underline-offset-4">{order.quantity} Units</span>
                              </div>

                              {/* Order Tracking Timeline Stepper */}
                              {order.status !== 'cancelled' && (
                                <div className="mt-8 mb-4 flex items-center w-full md:max-w-md">
                                  {['pending', 'processing', 'shipped', 'delivered'].map((step, i, arr) => {
                                    const currentIdx = arr.indexOf(order.status || 'pending');
                                    const isCompleted = i <= currentIdx;
                                    const isStepCurrent = i === currentIdx;
                                    return (
                                      <React.Fragment key={step}>
                                        <div className="flex flex-col items-center gap-2 relative z-10">
                                          <div className={cn(
                                            "w-7 h-7 rounded-full flex items-center justify-center transition-all bg-white shadow-sm ring-4 ring-white z-10",
                                            isCompleted ? "bg-brand-pink/10 text-brand-pink" : "bg-gray-50 text-gray-300"
                                          )}>
                                            {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-gray-200" />}
                                          </div>
                                          <span className={cn(
                                            "absolute top-10 text-[8px] font-black uppercase tracking-[0.2em] whitespace-nowrap",
                                            isStepCurrent ? "text-brand-pink" : "text-gray-300"
                                          )}>
                                            {step}
                                          </span>
                                        </div>
                                        {i < arr.length - 1 && (
                                          <div className={cn(
                                            "flex-1 h-[2px] -mx-1 z-0 transition-all",
                                            i < currentIdx ? "bg-brand-pink" : "bg-gray-100"
                                          )} />
                                        )}
                                      </React.Fragment>
                                    )
                                  })}
                                </div>
                              )}
                           </div>

                           <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
                              <div className="flex flex-col items-center md:items-end">
                                 <div className="text-3xl font-black text-brand-dark tracking-tighter italic flex items-center gap-1 group-hover:scale-110 transition-transform origin-right">
                                   <span className="text-brand-pink text-sm mb-1 italic">₹</span>
                                   {(order.total_price || 0).toLocaleString()}
                                 </div>
                              </div>
                              <div className="flex gap-2">
                                <Link 
                                  href={`/customize/${order.products?.slug}`}
                                  className="px-6 py-4 bg-gray-50 rounded-2xl text-brand-dark group-hover:bg-brand-dark group-hover:text-white group-hover:shadow-lg transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                >
                                  <RotateCcw className="h-4 w-4" />
                                  Reorder
                                </Link>
                                {order.status === 'delivered' ? (
                                  <button 
                                    onClick={() => setReviewOrder(order)}
                                    className="px-6 py-4 bg-brand-cyan/10 text-brand-cyan rounded-2xl group-hover:bg-brand-cyan group-hover:text-white group-hover:shadow-lg transition-all font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                                  >
                                     <Star className="h-4 w-4" />
                                     Review
                                  </button>
                                ) : (
                                  <button className="p-4 bg-gray-50 rounded-2xl text-gray-400 group-hover:bg-brand-pink group-hover:text-white group-hover:shadow-lg transition-all">
                                     <ExternalLink className="h-5 w-5" />
                                  </button>
                                )}
                              </div>
                           </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="bg-gray-50/50 rounded-[48px] p-24 text-center border-2 border-dashed border-gray-100 flex flex-col items-center gap-8">
                         <div className="h-24 w-24 bg-white rounded-[32px] flex items-center justify-center shadow-lg transform -rotate-6">
                            <Package className="h-10 w-10 text-brand-dark opacity-20" />
                         </div>
                         <div>
                            <h3 className="text-3xl font-black text-brand-dark mb-2 tracking-tighter uppercase italic">No Active Deployments</h3>
                            <p className="text-gray-400 font-bold max-w-xs mx-auto uppercase text-xs tracking-widest leading-relaxed">
                              Your brand is currently quiet. Visit the catalog to initiate a new design deployment.
                            </p>
                         </div>
                         <Link href="/products" className="px-10 py-5 bg-brand-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-pink shadow-xl shadow-brand-dark/10 transition-all">
                           Initiate First Order
                         </Link>
                      </div>
                    )}
                  </motion.div>
                )}

                {activeTab === 'profile' && (
                  <motion.div 
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white p-12 rounded-[48px] border border-gray-100 shadow-xl"
                  >
                    <div className="flex items-center gap-6 mb-12">
                      <div className="w-20 h-20 rounded-3xl bg-brand-pink/10 flex items-center justify-center">
                        <User className="w-10 h-10 text-brand-pink" />
                      </div>
                      <div>
                        <h3 className="text-3xl font-black text-brand-dark italic uppercase tracking-tight">Identity Profile</h3>
                        <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Update your brand and contact coordinates</p>
                      </div>
                    </div>

                    <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={async (e) => {
                      e.preventDefault();
                      setIsSaving(true);
                      const { error } = await supabase
                        .from('profiles')
                        .update({
                          full_name: profile.full_name,
                          phone: profile.phone,
                          company_name: profile.company_name,
                          gst_number: profile.gst_number
                        })
                        .eq('id', userData.id);
                      
                      setIsSaving(false);
                      if (error) toast.error(error.message);
                      else toast.success('Profile updated successfully');
                    }}>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Legal Name</label>
                        <input 
                          value={profile?.full_name || ''} 
                          onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                          className="w-full px-8 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Contact Phone</label>
                        <input 
                          value={profile?.phone || ''} 
                          onChange={(e) => setProfile({...profile, phone: e.target.value})}
                          className="w-full px-8 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Business Identity (Company)</label>
                        <input 
                          value={profile?.company_name || ''} 
                          onChange={(e) => setProfile({...profile, company_name: e.target.value})}
                          className="w-full px-8 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark shadow-inner"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">GST Registration Number</label>
                        <input 
                          value={profile?.gst_number || ''} 
                          onChange={(e) => setProfile({...profile, gst_number: e.target.value})}
                          className="w-full px-8 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-pink/20 outline-none transition-all font-bold text-brand-dark shadow-inner"
                        />
                      </div>
                      <div className="md:col-span-2 pt-6">
                        <button 
                          disabled={isSaving}
                          className="w-full py-5 bg-brand-dark text-white font-black rounded-2xl text-base uppercase tracking-[0.2em] hover:bg-brand-pink shadow-xl shadow-brand-dark/10 transition-all flex items-center justify-center gap-4 italic disabled:opacity-50"
                        >
                          {isSaving ? <Loader2 className="animate-spin" /> : <Save className="w-5 h-5" />}
                          Update Records
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'addresses' && (
                  <motion.div 
                    key="addresses"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-6">
                        <div className="w-16 h-16 rounded-3xl bg-brand-cyan/10 flex items-center justify-center">
                          <MapPin className="w-8 h-8 text-brand-cyan" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-black text-brand-dark italic uppercase tracking-tight">Deployment Locations</h3>
                          <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Manage your global shipping endpoints</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsAddressModalOpen(true)}
                        className="px-6 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-brand-cyan hover:text-brand-cyan transition-all flex items-center gap-2"
                      >
                        <PlusIcon className="w-4 h-4" />
                        Add New
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {(profile?.addresses || []).length > 0 ? profile.addresses.map((addr: any, idx: number) => (
                         <div key={idx} className="p-8 bg-white rounded-[40px] border border-gray-100 shadow-lg hover:border-brand-cyan/30 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                               <div className="w-8 h-8 bg-gray-50 rounded-xl flex items-center justify-center text-gray-300 group-hover:bg-brand-cyan group-hover:text-white transition-all cursor-pointer">
                                  <Settings className="w-4 h-4" />
                               </div>
                            </div>
                            <div className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-4">Location Tier 1</div>
                            <div className="font-black text-xl text-brand-dark mb-2">{addr.fullName || 'Office Primary'}</div>
                            <p className="text-gray-400 text-sm font-bold leading-relaxed mb-6">
                               {addr.address}<br/>
                               {addr.city}, {addr.state} {addr.pincode}
                            </p>
                            <div className="flex items-center gap-2 text-[9px] font-black text-gray-300 uppercase tracking-widest">
                               <Truck className="w-4 h-4" />
                               Priority Service Enabled
                            </div>
                         </div>
                       )) : (
                        <div className="md:col-span-2 bg-gray-50/50 rounded-[48px] p-24 text-center border-2 border-dashed border-gray-100 flex flex-col items-center gap-8">
                           <div className="h-20 w-20 bg-white rounded-[32px] flex items-center justify-center shadow-lg">
                              <MapPin className="h-8 w-8 text-gray-200" />
                           </div>
                           <h3 className="text-2xl font-black text-brand-dark uppercase italic">No Addresses Registered</h3>
                           <button 
                             onClick={() => setIsAddressModalOpen(true)}
                             className="px-10 py-5 bg-brand-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-cyan transition-all"
                           >
                             Deploy New Endpoint
                           </button>
                        </div>
                       )}
                    </div>
                  </motion.div>
                )}

                {activeTab === 'wishlist' && (
                  <motion.div 
                    key="wishlist"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  >
                    {wishlistProducts.length > 0 ? (
                      wishlistProducts.map((prod) => (
                        <div key={prod.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden group hover:border-brand-pink/30 hover:shadow-xl transition-all">
                           <div className="aspect-square bg-gray-50 relative p-4">
                             <Image 
                                src={prod.images?.[0] || ''} 
                                alt={prod.name} 
                                fill 
                                className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                             />
                           </div>
                           <div className="p-5">
                             <div className="text-[9px] font-black text-brand-pink uppercase tracking-widest mb-1">{prod.category}</div>
                             <h4 className="font-black text-brand-dark truncate mb-3">{prod.name}</h4>
                             <div className="flex items-center justify-between">
                               <div className="font-black text-lg text-brand-dark">₹{prod.base_price}</div>
                               <Link href={`/customize/${prod.slug}`} className="px-4 py-2 bg-brand-dark text-white text-[10px] uppercase font-black tracking-widest rounded-xl hover:bg-brand-pink transition-colors">
                                 Customize
                               </Link>
                             </div>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full bg-gray-50/50 rounded-[48px] p-24 text-center border-2 border-dashed border-gray-100 flex flex-col items-center gap-8">
                         <div className="h-20 w-20 bg-white rounded-[32px] flex items-center justify-center shadow-lg">
                           <Star className="h-8 w-8 text-gray-200 fill-gray-100" />
                         </div>
                         <h3 className="text-2xl font-black text-brand-dark uppercase italic">Your Wishlist is Empty</h3>
                         <Link href="/products" className="px-10 py-5 bg-brand-dark text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-brand-pink transition-all">
                           Explore Catalog
                         </Link>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
           </div>

           {/* Sidebar Component Panels */}
           <div className="space-y-10">
              <div className="bg-brand-dark rounded-[48px] p-10 text-white relative overflow-hidden group">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-brand-pink/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
                 <h3 className="text-xl font-black mb-8 flex items-center justify-between tracking-tight uppercase italic">
                    Saved <span className="text-brand-pink">Mockups</span>
                    <LayoutGrid className="h-5 w-5 text-brand-pink/50" />
                 </h3>
                 <div className="space-y-6">
                    <div className="p-5 bg-white/5 border border-white/10 rounded-3xl group/item hover:bg-white/10 transition-all cursor-pointer">
                       <div className="text-[10px] font-black text-brand-pink uppercase tracking-widest mb-1">Apparel / Draft</div>
                       <div className="font-black text-lg tracking-tight mb-4 flex items-center justify-between group-hover/item:translate-x-1 transition-transform">
                          Neon Future Tee
                          <ChevronRight className="h-4 w-4 opacity-50" />
                       </div>
                       <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-widest italic">
                          <Clock className="w-3.5 h-3.5" /> 
                          Edited 2h ago
                       </div>
                    </div>
                    <div className="p-5 bg-white/5 border border-white/10 rounded-3xl group/item hover:bg-white/10 transition-all cursor-pointer">
                       <div className="text-[10px] font-black text-brand-cyan uppercase tracking-widest mb-1">Drinkware / Draft</div>
                       <div className="font-black text-lg tracking-tight mb-4 flex items-center justify-between group-hover/item:translate-x-1 transition-transform">
                          Cyber Mug v2
                          <ChevronRight className="h-4 w-4 opacity-50" />
                       </div>
                       <div className="flex items-center gap-2 text-[9px] font-bold text-white/40 uppercase tracking-widest italic">
                          <Clock className="w-3.5 h-3.5" /> 
                          Edited Jan 15
                       </div>
                    </div>
                 </div>
                 <button className="w-full mt-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-brand-dark transition-all">
                    View Master Collection
                 </button>
              </div>

              <div className="p-10 bg-gray-50 rounded-[48px] border border-gray-100">
                 <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-brand-cyan shadow-sm border border-gray-100">
                       <Star className="h-6 w-6" />
                    </div>
                    <div>
                       <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">AtoZ Rewards</div>
                       <div className="text-xl font-black text-brand-dark tracking-tighter">1,250 <span className="text-sm">Points</span></div>
                    </div>
                 </div>
                 <div className="space-y-4 mb-8">
                    <div className="h-2 w-full bg-white rounded-full overflow-hidden border border-gray-100">
                       <div className="h-full bg-brand-cyan w-[60%] rounded-full" />
                    </div>
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest text-center">750 Points until next tier unlock</p>
                 </div>
                 <button className="w-full py-4 bg-brand-cyan/10 text-brand-cyan rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-cyan hover:text-white transition-all">
                    Explore Perks
                 </button>
              </div>
           </div>
        </div>
      </div>
      <ReviewModal 
        isOpen={!!reviewOrder} 
        onClose={() => setReviewOrder(null)} 
        product={reviewOrder?.products || { id: '', name: '' }} 
        userId={userData?.id || ''} 
      />
      <AddressModal 
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        onSave={handleAddAddress}
      />
    </div>
  );
}
