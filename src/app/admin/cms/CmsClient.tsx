"use client";

import React, { useState } from 'react';
import { 
  Save, 
  Loader2, 
  Plus, 
  Trash2,
  Building2,
  Gift,
  Users,
  Zap,
  Globe,
  Star,
  Shield,
  Palette,
  X,
  Image as ImageIcon,
  CreditCard,
  Target
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import { cn } from '@/lib/utils';

const ICONS: Record<string, React.ReactNode> = {
  Building2: <Building2 className="w-5 h-5" />,
  Gift: <Gift className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Zap: <Zap className="w-5 h-5" />,
  Globe: <Globe className="w-5 h-5" />,
  Star: <Star className="w-5 h-5" />,
  Shield: <Shield className="w-5 h-5" />,
  Palette: <Palette className="w-5 h-5" />,
  CreditCard: <CreditCard className="w-5 h-5" />,
  Target: <Target className="w-5 h-5" />
};

export default function ContentManagerClient({ 
  initialCmsConfig, 
  initialGlobalConfig 
}: { 
  initialCmsConfig: any;
  initialGlobalConfig: any;
}) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'categories' | 'about' | 'faq' | 'contact' | 'pricing' | 'settings'>('home');

  // --- HOME PAGE (Global) STATE --- //
  const [heroTitle, setHeroTitle] = useState(initialGlobalConfig?.hero?.title || '');
  const [heroSubtitle, setHeroSubtitle] = useState(initialGlobalConfig?.hero?.subtitle || '');
  const [heroImages, setHeroImages] = useState<string[]>(
    Array.isArray(initialGlobalConfig?.hero?.image) 
      ? initialGlobalConfig.hero.image 
      : (initialGlobalConfig?.hero?.image ? [initialGlobalConfig.hero.image] : [])
  );
  const [bannerText, setBannerText] = useState(initialGlobalConfig?.topBanner?.text || '');
  const [bannerActive, setBannerActive] = useState(initialGlobalConfig?.topBanner?.isActive !== false);
  const [features, setFeatures] = useState<any[]>(initialGlobalConfig?.features || []);

  // --- SERVICES PAGE (CMS) STATE --- //
  const [serviceHeroTitle, setServiceHeroTitle] = useState(initialCmsConfig?.services?.heroTitle || '');
  const [serviceHeroSubtitle, setServiceHeroSubtitle] = useState(initialCmsConfig?.services?.heroSubtitle || '');
  const [servicesList, setServicesList] = useState<any[]>(initialCmsConfig?.services?.servicesList || []);
  const [ctaHeading, setCtaHeading] = useState(initialCmsConfig?.services?.ctaHeading || '');
  const [ctaDesc, setCtaDesc] = useState(initialCmsConfig?.services?.ctaDesc || '');

  // --- SYSTEM INTEGRATIONS (Global) STATE --- //
  const [pexelsApiKey, setPexelsApiKey] = useState(initialGlobalConfig?.integrations?.pexelsApiKey || '');

    // --- ABOUT PAGE STATE --- //
    const [aboutHero, setAboutHero] = useState(initialCmsConfig?.about?.hero || {
      title: "The Architects of Legacy.",
      subtitle: "We don't just put ink on paper. We translate corporate identity into tangible assets."
    });
    const [aboutPhilosophy, setAboutPhilosophy] = useState(initialCmsConfig?.about?.philosophy || []);
    const [aboutTimeline, setAboutTimeline] = useState(initialCmsConfig?.about?.timeline || []);
    const [aboutProcess, setAboutProcess] = useState(initialCmsConfig?.about?.process || []);
    const [aboutTeam, setAboutTeam] = useState(initialCmsConfig?.about?.team || []);
    const [aboutQuote, setAboutQuote] = useState(initialCmsConfig?.about?.quote || {
      text: "We don't build for the transaction. We build for the legacy.",
      author: "Rajesh Verma",
      role: "Founder, ATOZPRINTS"
    });

    // --- FAQ PAGE STATE --- //
    const [faqHero, setFaqHero] = useState(initialCmsConfig?.faq?.hero || {
      title: "The Knowledge Base.",
      subtitle: "Support Center"
    });
    const [faqs, setFaqs] = useState(initialCmsConfig?.faq?.items || []);

    // --- CONTACT PAGE STATE --- //
    const [contactHero, setContactHero] = useState(initialCmsConfig?.contact?.hero || {
      title: "Let's Engineer Your Legacy.",
      subtitle: "Get in Touch"
    });
    const [contactInfo, setContactInfo] = useState(initialCmsConfig?.contact?.info || {
      email: "hello@atozprints.in",
      phone: "+91 98765 43210",
      address: "12, Okhla Industrial Estate, Phase III, New Delhi, India 110020"
    });
    const [contactSocials, setContactSocials] = useState(initialCmsConfig?.contact?.socials || {
      instagram: "#",
      linkedin: "#",
      twitter: "#"
    });

    const [pricingTiers, setPricingTiers] = useState<any[]>(initialGlobalConfig?.pricing?.tiers || [
      { min: 1, discount: 0 },
      { min: 20, discount: 5 },
      { min: 50, discount: 10 },
      { min: 100, discount: 20 }
    ]);

    const handleSave = async () => {
      setLoading(true);

      const cmsPayload = {
        ...initialCmsConfig,
        services: {
          heroTitle: serviceHeroTitle,
          heroSubtitle: serviceHeroSubtitle,
          servicesList,
          ctaHeading,
          ctaDesc
        },
        about: {
          hero: aboutHero,
          philosophy: aboutPhilosophy,
          timeline: aboutTimeline,
          process: aboutProcess,
          team: aboutTeam,
          quote: aboutQuote
        },
        faq: {
          hero: faqHero,
          items: faqs
        },
        contact: {
          hero: contactHero,
          info: contactInfo,
          socials: contactSocials
        }
      };

      const globalPayload = {
        ...initialGlobalConfig,
        hero: {
          title: heroTitle,
          subtitle: heroSubtitle,
          image: heroImages
        },
        topBanner: { text: bannerText, isActive: bannerActive },
        features,
        integrations: { pexelsApiKey },
        stats: initialGlobalConfig?.stats || [],
        testimonials: initialGlobalConfig?.testimonials || [],
        trustLogos: initialGlobalConfig?.trustLogos || [],
        pricing: {
          ...initialGlobalConfig?.pricing,
          tiers: pricingTiers
        }
      };

    try {
      // Execute multi-document update
      const { error: cmsErr } = await supabase.from('site_settings').upsert({ id: 'cms_pages', config: cmsPayload });
      if (cmsErr) throw cmsErr;

      const { error: globalErr } = await supabase.from('site_settings').upsert({ id: 'global', config: globalPayload });
      if (globalErr) throw globalErr;

      toast.success('Site Content Published Successfully!');
    } catch (err: any) {
      toast.error('Failed to sync content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const url = await uploadFile('public', `settings/${Date.now()}-${file.name}`, file);
      if (url) {
        setter(url);
        toast.success('Asset uploaded successfully!');
      }
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMultiFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setLoading(true);
    try {
      const uploadPromises = files.map(file => uploadFile('public', `settings/${Date.now()}-${file.name}`, file));
      const urls = await Promise.all(uploadPromises);
      const validUrls = urls.filter(Boolean) as string[];
      
      if (validUrls.length > 0) {
        setHeroImages(prev => [...prev, ...validUrls]);
        toast.success(`${validUrls.length} image(s) uploaded!`);
      }
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setLoading(false);
      // Reset input
      e.target.value = '';
    }
  };

  // --- LIST HELPERS --- //
  const addFeature = () => setFeatures([...features, { title: 'New Feature', desc: 'Detail', icon: 'Zap', color: 'pink' }]);
  const removeFeature = (idx: number) => setFeatures(features.filter((_, i) => i !== idx));
  const updateFeature = (idx: number, key: string, val: any) => { const n = [...features]; n[idx][key] = val; setFeatures(n); };

  const addServiceItem = () => setServicesList([...servicesList, { title: "New Service", desc: "Detail", icon: "Star", features: [] }]);
  const removeServiceItem = (idx: number) => setServicesList(servicesList.filter((_, i) => i !== idx));
  const updateServiceItem = (idx: number, key: string, val: any) => { const n = [...servicesList]; n[idx][key] = val; setServicesList(n); };

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[800px]">
      <div className="flex flex-wrap border-b border-gray-100 bg-gray-50/50 p-3 gap-2">
        {(['home', 'categories', 'about', 'faq', 'contact', 'pricing', 'settings'] as const).map((tab: string) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
              activeTab === tab ? "bg-brand-dark text-white shadow-xl" : "text-gray-400 hover:bg-gray-100 hover:text-brand-dark"
            )}
          >
            {tab === 'home' && 'Home'}
            {tab === 'categories' && 'Categories'}
            {tab === 'about' && 'About Us'}
            {tab === 'faq' && 'FAQ'}
            {tab === 'contact' && 'Contact'}
            {tab === 'pricing' && 'Pricing'}
            {tab === 'settings' && 'Global'}
          </button>
        ))}
      </div>

      <div className="p-8 md:p-12 flex-1 overflow-auto bg-white/50">
        
        {/* --- HOME PAGE TAB --- */}
        {activeTab === 'home' && (
          <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl mx-auto">
             <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight mb-6 flex items-center gap-3">
                  <Globe className="text-brand-cyan" /> Storefront Hero Section
                </h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Main Headline</label>
                    <input type="text" value={heroTitle} onChange={e => setHeroTitle(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white border border-transparent focus:border-brand-pink/20 outline-none font-black text-brand-dark shadow-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Subheading</label>
                    <textarea rows={2} value={heroSubtitle} onChange={e => setHeroSubtitle(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white border border-transparent focus:border-brand-pink/20 outline-none font-bold text-gray-600 shadow-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Hero Images (Slideshow)</label>
                    <div className="flex flex-col gap-4">
                       <div className="flex flex-wrap gap-4">
                         {heroImages.map((img: string, i: number) => (
                           <div key={i} className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm w-24 h-24">
                             <img src={img} alt="hero" className="w-full h-full object-cover" />
                             <button onClick={() => setHeroImages(heroImages.filter((_, idx) => idx !== i))} className="absolute top-1 right-1 bg-white hover:bg-red-500 hover:text-white text-red-500 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all shadow-md">
                               <X className="w-3 h-3" />
                             </button>
                           </div>
                         ))}
                         {heroImages.length === 0 && (
                           <div className="w-24 h-24 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400">
                              <ImageIcon className="w-5 h-5 mb-1" />
                              <span className="text-[8px] font-black uppercase">No Images</span>
                           </div>
                         )}
                       </div>
                       <input type="file" multiple accept="image/*" onChange={handleMultiFileUpload} className="text-sm font-bold text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-brand-pink/10 file:text-brand-pink hover:file:bg-brand-pink/20 cursor-pointer transition-colors" />
                    </div>
                  </div>
                </div>
             </section>

             <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
                 <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight flex items-center gap-3">
                    <Zap className="text-brand-pink" /> Core Features Graph
                  </h3>
                  <button onClick={addFeature} className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-pink transition-all">Add Feature</button>
                 </div>
                 <div className="space-y-4">
                    {features.map((feat: any, i: number) => (
                      <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white border border-gray-100 items-start group">
                         <div className="flex-1 space-y-3">
                            <input type="text" value={feat.title} onChange={e => updateFeature(i, 'title', e.target.value)} className="w-full text-sm font-black text-brand-dark uppercase tracking-widest focus:outline-none" placeholder="Feature Title" />
                            <input type="text" value={feat.desc} onChange={e => updateFeature(i, 'desc', e.target.value)} className="w-full text-xs font-bold text-gray-500 focus:outline-none" placeholder="Description" />
                         </div>
                         <select value={feat.icon} onChange={e => updateFeature(i, 'icon', e.target.value)} className="text-xs font-bold text-gray-500 focus:outline-none bg-gray-50 rounded-lg p-2">
                             {Object.keys(ICONS).map((icon: string) => <option key={icon} value={icon}>{icon}</option>)}
                         </select>
                         <button onClick={() => removeFeature(i)} className="p-2 text-red-400 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                 </div>
             </section>
          </div>
        )}

        {/* --- ABOUT PAGE TAB --- */}
        {activeTab === 'about' && (
          <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
            <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight mb-6">About Hero</h3>
              <div className="space-y-4">
                <input type="text" value={aboutHero.title} onChange={e => setAboutHero({...aboutHero, title: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border border-transparent focus:border-brand-pink/20 outline-none font-black text-brand-dark shadow-sm" placeholder="Hero Title" />
                <textarea rows={3} value={aboutHero.subtitle} onChange={e => setAboutHero({...aboutHero, subtitle: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border border-transparent focus:border-brand-pink/20 outline-none font-bold text-gray-600 shadow-sm" placeholder="Hero Subtitle" />
              </div>
            </section>

            <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight">Our Philosophy</h3>
                <button onClick={() => setAboutPhilosophy([...aboutPhilosophy, { title: 'New Value', desc: 'Detail' }])} className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Add Value</button>
              </div>
              <div className="space-y-4">
                {aboutPhilosophy.map((phil: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3">
                    <div className="flex justify-between">
                      <input type="text" value={phil.title} onChange={e => {
                        const n = [...aboutPhilosophy]; n[i].title = e.target.value; setAboutPhilosophy(n);
                      }} className="text-sm font-black text-brand-dark uppercase tracking-widest focus:outline-none w-full" placeholder="Title" />
                      <button onClick={() => setAboutPhilosophy(aboutPhilosophy.filter((_: any, idx: number) => idx !== i))} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea value={phil.desc} onChange={e => {
                      const n = [...aboutPhilosophy]; n[i].desc = e.target.value; setAboutPhilosophy(n);
                    }} className="w-full text-xs font-bold text-gray-500 focus:outline-none" placeholder="Description" />
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight">Evolution Timeline</h3>
                <button onClick={() => setAboutTimeline([...aboutTimeline, { year: '2024', title: 'Milestone', desc: 'Detail', img: '' }])} className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Add Milestone</button>
              </div>
              <div className="space-y-4">
                {aboutTimeline.map((item: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-4">
                    <div className="flex gap-4">
                      <input type="text" value={item.year} onChange={e => {
                        const n = [...aboutTimeline]; n[i].year = e.target.value; setAboutTimeline(n);
                      }} className="w-24 text-sm font-black text-brand-dark focus:outline-none" placeholder="Year" />
                      <input type="text" value={item.title} onChange={e => {
                        const n = [...aboutTimeline]; n[i].title = e.target.value; setAboutTimeline(n);
                      }} className="flex-1 text-sm font-black text-brand-dark focus:outline-none" placeholder="Title" />
                      <button onClick={() => setAboutTimeline(aboutTimeline.filter((_: any, idx: number) => idx !== i))} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea value={item.desc} onChange={e => {
                      const n = [...aboutTimeline]; n[i].desc = e.target.value; setAboutTimeline(n);
                    }} className="w-full text-xs font-bold text-gray-500 focus:outline-none" placeholder="Description" />
                    <div className="flex items-center gap-4">
                      {item.img && <img src={item.img} className="w-12 h-12 rounded object-cover" />}
                      <input type="file" onChange={e => handleFileUpload(e, (url) => {
                         const n = [...aboutTimeline]; n[i].img = url; setAboutTimeline(n);
                      })} className="text-[8px]" />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* --- FAQ PAGE TAB --- */}
        {activeTab === 'faq' && (
          <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
            <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight mb-6">FAQ Hero</h3>
              <div className="space-y-4">
                <input type="text" value={faqHero.title} onChange={e => setFaqHero({...faqHero, title: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent shadow-sm outline-none font-black text-brand-dark" placeholder="Hero Title" />
                <input type="text" value={faqHero.subtitle} onChange={e => setFaqHero({...faqHero, subtitle: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent shadow-sm outline-none font-bold text-gray-600" placeholder="Support Center" />
              </div>
            </section>

            <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight">Question & Answers</h3>
                <button onClick={() => setFaqs([...faqs, { category: 'general', q: 'New Question', a: 'Detail' }])} className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Add FAQ</button>
              </div>
              <div className="space-y-4">
                {faqs.map((faq: any, i: number) => (
                  <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 space-y-3">
                    <div className="flex gap-4">
                      <select value={faq.category} onChange={e => {
                        const n = [...faqs]; n[i].category = e.target.value; setFaqs(n);
                      }} className="text-[10px] font-black uppercase tracking-widest bg-gray-50 rounded-lg px-3 py-1 outline-none">
                        <option value="ordering">Ordering</option>
                        <option value="design">Design</option>
                        <option value="logistics">Logistics</option>
                        <option value="sustainability">Sustainability</option>
                        <option value="general">General</option>
                      </select>
                      <input type="text" value={faq.q} onChange={e => {
                        const n = [...faqs]; n[i].q = e.target.value; setFaqs(n);
                      }} className="flex-1 text-sm font-black text-brand-dark focus:outline-none" placeholder="Question" />
                      <button onClick={() => setFaqs(faqs.filter((_: any, idx: number) => idx !== i))} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    <textarea value={faq.a} onChange={e => {
                      const n = [...faqs]; n[i].a = e.target.value; setFaqs(n);
                    }} className="w-full text-xs font-bold text-gray-500 focus:outline-none" placeholder="Answer" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* --- CONTACT PAGE TAB --- */}
        {activeTab === 'contact' && (
          <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
            <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight mb-6">Contact Hero</h3>
              <div className="space-y-4">
                <input type="text" value={contactHero.title} onChange={e => setContactHero({...contactHero, title: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent shadow-sm outline-none font-black text-brand-dark" placeholder="Hero Title" />
                <input type="text" value={contactHero.subtitle} onChange={e => setContactHero({...contactHero, subtitle: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent shadow-sm outline-none font-bold text-gray-600" placeholder="Hero Subtitle" />
              </div>
            </section>

            <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight mb-6">Direct Info</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Email</label>
                  <input type="text" value={contactInfo.email} onChange={e => setContactInfo({...contactInfo, email: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent shadow-sm outline-none font-bold text-brand-dark" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Phone</label>
                  <input type="text" value={contactInfo.phone} onChange={e => setContactInfo({...contactInfo, phone: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent shadow-sm outline-none font-bold text-brand-dark" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Address</label>
                  <textarea rows={3} value={contactInfo.address} onChange={e => setContactInfo({...contactInfo, address: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent shadow-sm outline-none font-bold text-brand-dark" />
                </div>
              </div>
            </section>

            <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight mb-6">Social Media</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Instagram Link</label>
                  <input type="text" value={contactSocials.instagram} onChange={e => setContactSocials({...contactSocials, instagram: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent shadow-sm outline-none font-bold text-brand-dark" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">LinkedIn Link</label>
                  <input type="text" value={contactSocials.linkedin} onChange={e => setContactSocials({...contactSocials, linkedin: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent shadow-sm outline-none font-bold text-brand-dark" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Twitter Link</label>
                  <input type="text" value={contactSocials.twitter} onChange={e => setContactSocials({...contactSocials, twitter: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent shadow-sm outline-none font-bold text-brand-dark" />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* --- PRICING PAGE TAB --- */}
        {activeTab === 'pricing' && (
          <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl mx-auto pb-20">
             <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight">Bulk Discount Tiers</h3>
                  <button onClick={() => setPricingTiers([...pricingTiers, { min: 200, discount: 25 }])} className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-[10px] font-black uppercase tracking-widest">Add Tier</button>
                </div>
                <div className="space-y-4">
                  {pricingTiers.map((tier: any, i: number) => (
                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 flex items-center gap-6">
                      <div className="flex-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase mb-1 block">Min Quantity</label>
                        <input type="number" value={tier.min} onChange={e => {
                          const n = [...pricingTiers]; n[i].min = parseInt(e.target.value) || 0; setPricingTiers(n);
                        }} className="w-full text-sm font-black text-brand-dark focus:outline-none" />
                      </div>
                      <div className="flex-1">
                        <label className="text-[8px] font-black text-gray-400 uppercase mb-1 block">Discount %</label>
                        <input type="number" value={tier.discount} onChange={e => {
                          const n = [...pricingTiers]; n[i].discount = parseInt(e.target.value) || 0; setPricingTiers(n);
                        }} className="w-full text-sm font-black text-brand-dark focus:outline-none" />
                      </div>
                      <button onClick={() => setPricingTiers(pricingTiers.filter((_: any, idx: number) => idx !== i))} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  ))}
                  <p className="text-[9px] font-bold text-gray-400 italic mt-4">Note: These tiers apply globally unless overridden at the product level.</p>
                </div>
             </section>
          </div>
        )}

        {/* --- CATEGORIES PAGE TAB --- */}
        {activeTab === ('services' as any) || activeTab === ('categories' as any) ? (
          <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl mx-auto">
             <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight mb-6">Category Landing Hero</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Hero Title</label>
                    <input type="text" value={serviceHeroTitle} onChange={e => setServiceHeroTitle(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent focus:border-brand-pink/20 outline-none font-black text-brand-dark shadow-sm" />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">Hero Description</label>
                    <textarea rows={2} value={serviceHeroSubtitle} onChange={e => setServiceHeroSubtitle(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent focus:border-brand-pink/20 outline-none font-bold text-gray-600 shadow-sm" />
                  </div>
                </div>
             </section>

             <section className="bg-gray-50 p-8 rounded-[32px] border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-black italic text-brand-dark uppercase tracking-tight">Enterprise Solutions CTA</h3>
                </div>
                <div className="space-y-4">
                   <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">CTA Heading</label>
                     <input type="text" value={ctaHeading} onChange={e => setCtaHeading(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent focus:border-brand-pink/20 outline-none font-black text-brand-dark shadow-sm" />
                   </div>
                   <div>
                     <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-2">CTA Subtext</label>
                     <textarea rows={2} value={ctaDesc} onChange={e => setCtaDesc(e.target.value)} className="w-full px-6 py-4 rounded-2xl bg-white border-transparent focus:border-brand-pink/20 outline-none font-bold text-gray-600 shadow-sm" />
                   </div>
                </div>
             </section>
          </div>
        ) : null}

        {/* --- SYSTEM INTEGRATIONS TAB --- */}
        {activeTab === 'settings' && (
          <div className="space-y-12 animate-in fade-in duration-500 max-w-4xl mx-auto">
             <section className="bg-brand-dark p-10 rounded-[32px] text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5"><Target className="w-40 h-40" /></div>
                <h3 className="text-xl font-black italic uppercase tracking-tight mb-6">Backend API Links</h3>
                <div className="space-y-6 relative z-10">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-brand-pink block mb-2">Pexels Stock Image API Key</label>
                    <input 
                      type="password" 
                      value={pexelsApiKey}
                      onChange={e => setPexelsApiKey(e.target.value)}
                      className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-brand-cyan/40 outline-none font-bold text-white font-mono tracking-widest"
                      placeholder="563492ad6f91700001000001..."
                    />
                    <p className="text-xs text-white/40 mt-2 font-medium">Leave blank to use default system stock library.</p>
                  </div>
                </div>
             </section>
          </div>
        )}
      </div>

      {/* COMMIT BAR */}
      <div className="p-8 border-t border-gray-100 bg-white flex justify-between items-center sticky bottom-0 z-20">
         <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic leading-none mb-1">Unified Architect</span>
            <span className="text-[8px] font-bold text-brand-pink uppercase tracking-tighter">Commit applies changes instantly network-wide.</span>
         </div>
         <button 
           onClick={handleSave}
           disabled={loading}
           className="px-16 py-5 bg-brand-dark text-white rounded-[20px] font-black text-[11px] tracking-[0.3em] uppercase hover:shadow-2xl hover:bg-brand-cyan active:scale-95 flex items-center gap-4 transition-all"
         >
           {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-4 w-4" />}
           Compile & Publish Database
         </button>
      </div>
    </div>
  );
}
