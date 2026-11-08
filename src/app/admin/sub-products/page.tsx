"use client";

import React, { useState, useEffect, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  Edit2, 
  Trash2, 
  Copy, 
  Eye, 
  Save, 
  RotateCcw, 
  Layers, 
  Image as ImageIcon, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight, 
  Briefcase, 
  Store, 
  Building2, 
  FileSpreadsheet, 
  X, 
  Loader2, 
  Upload, 
  Tag, 
  ChevronRight,
  TrendingUp,
  Flame,
  Check
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase/client';
import { uploadFile } from '@/lib/supabase/storage';
import { 
  SubProductDesign, 
  ParentProductInfo, 
  PrintAsiaCategoryItem 
} from '@/lib/data/subProductsData';

const GROUPS: Array<'All' | PrintAsiaCategoryItem['group']> = [
  'All',
  'Professionals',
  'Retails & Services',
  'Business & Real Estate',
  'Stationery & Merch'
];

const PROFESSIONS = [
  'All',
  'Chartered Accountant',
  'Advocate & Legal',
  'Doctor & Clinic',
  'Corporate & Finance',
  'Tech & Creative',
  'Retail & Shop',
  'Luxury & Gold',
  'Hospitality',
  'Education',
  'Event & Wedding'
];

const STYLES = [
  'All',
  'Minimal Modern',
  'Executive Classic',
  'Gold Foil',
  'Creative Dark',
  'Geometric',
  'Dual Tone',
  'Editorial Clean'
];

export default function SubProductsAdminPage() {
  const [activeTab, setActiveTab] = useState<'designs' | 'categories' | 'parents'>('designs');
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [resetting, setResetting] = useState<boolean>(false);

  // Data states
  const [subProducts, setSubProducts] = useState<SubProductDesign[]>([]);
  const [categories, setCategories] = useState<PrintAsiaCategoryItem[]>([]);
  const [parentProducts, setParentProducts] = useState<ParentProductInfo[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  // Filters for Designs
  const [designSearch, setDesignSearch] = useState<string>('');
  const [selectedParentFilter, setSelectedParentFilter] = useState<string>('All');
  const [selectedProfessionFilter, setSelectedProfessionFilter] = useState<string>('All');
  const [selectedStyleFilter, setSelectedStyleFilter] = useState<string>('All');

  // Filters for Categories
  const [categorySearch, setCategorySearch] = useState<string>('');
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>('All');

  // Modal states for Designs
  const [isDesignModalOpen, setIsDesignModalOpen] = useState<boolean>(false);
  const [editingDesign, setEditingDesign] = useState<SubProductDesign | null>(null);
  const [designForm, setDesignForm] = useState<Partial<SubProductDesign>>({});
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);

  // Modal states for Categories
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState<boolean>(false);
  const [editingCategory, setEditingCategory] = useState<PrintAsiaCategoryItem | null>(null);
  const [categoryForm, setCategoryForm] = useState<Partial<PrintAsiaCategoryItem>>({});

  // Modal states for Parent Product Lines
  const [isParentModalOpen, setIsParentModalOpen] = useState<boolean>(false);
  const [editingParent, setEditingParent] = useState<ParentProductInfo | null>(null);
  const [parentForm, setParentForm] = useState<Partial<ParentProductInfo>>({});

  // Fetch initial data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sub-products');
      const json = await res.json();
      if (json.success && json.data) {
        setSubProducts(json.data.subProducts || []);
        setCategories(json.data.categories || []);
        setParentProducts(json.data.parentProducts || []);
        setLastUpdated(json.data.updatedAt || null);
      } else {
        toast.error('Failed to load sub-products data');
      }
    } catch (err: any) {
      console.error(err);
      toast.error('Network error loading sub-products data');
    } finally {
      setLoading(false);
    }
  };

  // Save changes to API & Supabase
  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const payload = {
        categories,
        parentProducts,
        subProducts,
        updatedAt: new Date().toISOString()
      };

      // 1. Save to local server / file
      const res = await fetch('/api/admin/sub-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.error || 'Failed to save configuration');
      }

      // 2. Also attempt to sync with Supabase site_settings if accessible
      try {
        await supabase.from('site_settings').upsert({
          id: 'sub_products_config',
          config: payload
        });
      } catch (sbErr) {
        console.warn('Supabase site_settings sync notice:', sbErr);
      }

      setLastUpdated(payload.updatedAt);
      toast.success('Published successfully! All changes are live on the storefront.', {
        duration: 4000
      });
    } catch (err: any) {
      console.error(err);
      toast.error('Error saving: ' + (err.message || 'Unknown error'));
    } finally {
      setSaving(false);
    }
  };

  // Reset to factory defaults
  const handleResetDefaults = async () => {
    if (!window.confirm('Are you sure you want to revert all designs and categories to the factory defaults? Any custom modifications will be reset.')) {
      return;
    }

    setResetting(true);
    try {
      const res = await fetch('/api/admin/sub-products', { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        toast.success('Reset to default data successfully!');
        await fetchData();
      } else {
        toast.error('Failed to reset: ' + json.error);
      }
    } catch (err: any) {
      toast.error('Error resetting: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  // ---------------- DESIGN HANDLERS ---------------- //
  const handleOpenAddDesign = () => {
    setEditingDesign(null);
    const defaultParent = parentProducts[0]?.slug || 'business-card-custom';
    setDesignForm({
      id: `design-${Date.now()}`,
      name: '',
      slug: '',
      parentProductSlug: defaultParent,
      category: 'Stationery',
      profession: 'Advocate & Legal',
      styleTag: 'Minimal Modern',
      description: '',
      frontImage: '/images/products/business-card-front.png',
      backImage: '/images/products/business-card-back.png',
      templateIndex: subProducts.length + 1,
      startingPrice: 4.40,
      unitLabel: 'per card (from ₹440/100)',
      moq: 100,
      orientation: 'horizontal',
      dimensions: '3.5" x 2" (89 x 51 mm)',
      paperStock: '350 GSM Velvet Matte',
      features: ['Double-sided crisp print', 'Rich Gold / Foil accents', 'Premium luxury cardstock'],
      isPopular: false,
      isTrending: false,
      isNew: true
    });
    setIsDesignModalOpen(true);
  };

  const handleOpenEditDesign = (design: SubProductDesign) => {
    setEditingDesign(design);
    setDesignForm({ ...design });
    setIsDesignModalOpen(true);
  };

  const handleDuplicateDesign = (design: SubProductDesign) => {
    const clone: SubProductDesign = {
      ...design,
      id: `design-${Date.now()}`,
      slug: `${design.slug}-copy-${Math.floor(Math.random() * 1000)}`,
      name: `${design.name} (Copy)`,
      templateIndex: subProducts.length + 1,
      isNew: true
    };
    setSubProducts([clone, ...subProducts]);
    toast.success(`Duplicated "${design.name}". Click "Save & Publish" to commit.`);
  };

  const handleDeleteDesign = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this design template?')) return;
    setSubProducts(subProducts.filter(d => d.id !== id));
    toast.info('Design removed from list. Click "Save & Publish" to commit.');
  };

  const handleSaveDesignForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!designForm.name || !designForm.frontImage) {
      toast.error('Please enter design name and front image URL');
      return;
    }

    const slug = designForm.slug || designForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finalDesign: SubProductDesign = {
      id: designForm.id || `design-${Date.now()}`,
      name: designForm.name,
      slug,
      parentProductSlug: designForm.parentProductSlug || 'business-card-custom',
      category: designForm.category || 'Stationery',
      profession: designForm.profession || 'All',
      styleTag: designForm.styleTag || 'Minimal Modern',
      description: designForm.description || '',
      frontImage: designForm.frontImage,
      backImage: designForm.backImage,
      templateIndex: Number(designForm.templateIndex) || 1,
      startingPrice: Number(designForm.startingPrice) || 4.40,
      unitLabel: designForm.unitLabel || 'per card',
      moq: Number(designForm.moq) || 100,
      orientation: (designForm.orientation as any) || 'horizontal',
      dimensions: designForm.dimensions || '3.5" x 2"',
      paperStock: designForm.paperStock,
      features: Array.isArray(designForm.features) ? designForm.features : [String(designForm.features)],
      isPopular: Boolean(designForm.isPopular),
      isTrending: Boolean(designForm.isTrending),
      isNew: Boolean(designForm.isNew)
    };

    if (editingDesign) {
      setSubProducts(subProducts.map(d => d.id === editingDesign.id ? finalDesign : d));
      toast.success('Design updated. Click "Save & Publish" to commit.');
    } else {
      setSubProducts([finalDesign, ...subProducts]);
      toast.success('New design added. Click "Save & Publish" to commit.');
    }

    setIsDesignModalOpen(false);
  };

  // Image file upload handler
  const handleUploadImageFile = async (e: React.ChangeEvent<HTMLInputElement>, field: 'frontImage' | 'backImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadFile('products', `designs/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`, file);
      if (url) {
        setDesignForm(prev => ({ ...prev, [field]: url }));
        toast.success(`Image uploaded successfully!`);
      }
    } catch (err: any) {
      console.warn('Supabase upload notice, using local file reader for preview:', err);
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setDesignForm(prev => ({ ...prev, [field]: reader.result as string }));
          toast.success('Image loaded for design preview');
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  // ---------------- CATEGORY HANDLERS ---------------- //
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCategoryForm({
      id: `category-${Date.now()}`,
      title: '',
      count: 20,
      image: '/images/categories/visiting-cards.jpg',
      parentProductSlug: 'business-card-custom',
      professionFilter: 'Chartered Accountant',
      tagline: 'Custom Corporate Stationery',
      group: 'Professionals',
      startingPrice: 140
    });
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: PrintAsiaCategoryItem) => {
    setEditingCategory(category);
    setCategoryForm({ ...category });
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (!window.confirm('Are you sure you want to remove this category showcase tile?')) return;
    setCategories(categories.filter(c => c.id !== id));
    toast.info('Category removed. Click "Save & Publish" to commit.');
  };

  const handleSaveCategoryForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryForm.title) {
      toast.error('Category title is required');
      return;
    }

    const finalCategory: PrintAsiaCategoryItem = {
      id: categoryForm.id || `cat-${Date.now()}`,
      title: categoryForm.title,
      count: Number(categoryForm.count) || 20,
      image: categoryForm.image || '/images/categories/visiting-cards.jpg',
      parentProductSlug: categoryForm.parentProductSlug || 'business-card-custom',
      professionFilter: categoryForm.professionFilter,
      tagline: categoryForm.tagline || '',
      group: (categoryForm.group as any) || 'Professionals',
      startingPrice: Number(categoryForm.startingPrice) || 140
    };

    if (editingCategory) {
      setCategories(categories.map(c => c.id === editingCategory.id ? finalCategory : c));
      toast.success('Category updated. Click "Save & Publish" to commit.');
    } else {
      setCategories([...categories, finalCategory]);
      toast.success('Category added. Click "Save & Publish" to commit.');
    }

    setIsCategoryModalOpen(false);
  };

  // ---------------- PARENT PRODUCT HANDLERS ---------------- //
  const handleOpenEditParent = (parent: ParentProductInfo) => {
    setEditingParent(parent);
    setParentForm({ ...parent });
    setIsParentModalOpen(true);
  };

  const handleSaveParentForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!parentForm.name) {
      toast.error('Product name is required');
      return;
    }

    const updated = parentProducts.map(p => {
      if (p.id === editingParent?.id) {
        return {
          ...p,
          ...parentForm,
          startingPrice: Number(parentForm.startingPrice) || p.startingPrice,
          moq: Number(parentForm.moq) || p.moq
        } as ParentProductInfo;
      }
      return p;
    });

    setParentProducts(updated);
    toast.success('Parent product line updated. Click "Save & Publish" to commit.');
    setIsParentModalOpen(false);
  };

  // Filtered lists
  const filteredDesigns = useMemo(() => {
    return subProducts.filter(d => {
      const matchesSearch = !designSearch.trim() || 
        d.name.toLowerCase().includes(designSearch.toLowerCase()) ||
        d.profession.toLowerCase().includes(designSearch.toLowerCase()) ||
        d.styleTag.toLowerCase().includes(designSearch.toLowerCase()) ||
        d.parentProductSlug.toLowerCase().includes(designSearch.toLowerCase());

      const matchesParent = selectedParentFilter === 'All' || d.parentProductSlug === selectedParentFilter;
      const matchesProfession = selectedProfessionFilter === 'All' || d.profession.toLowerCase().includes(selectedProfessionFilter.toLowerCase());
      const matchesStyle = selectedStyleFilter === 'All' || d.styleTag.toLowerCase() === selectedStyleFilter.toLowerCase();

      return matchesSearch && matchesParent && matchesProfession && matchesStyle;
    });
  }, [subProducts, designSearch, selectedParentFilter, selectedProfessionFilter, selectedStyleFilter]);

  const filteredCategories = useMemo(() => {
    return categories.filter(c => {
      const matchesSearch = !categorySearch.trim() ||
        c.title.toLowerCase().includes(categorySearch.toLowerCase()) ||
        c.tagline.toLowerCase().includes(categorySearch.toLowerCase());

      const matchesGroup = selectedGroupFilter === 'All' || c.group === selectedGroupFilter;
      return matchesSearch && matchesGroup;
    });
  }, [categories, categorySearch, selectedGroupFilter]);

  return (
    <AdminLayout>
      <div className="p-8 md:p-12 max-w-7xl mx-auto w-full">
        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8 pb-8 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">
              <Link href="/admin" className="hover:text-brand-dark transition-colors">Admin</Link>
              <span>/</span>
              <span className="text-brand-dark">Sub-Products &amp; Designs</span>
              {lastUpdated && (
                <>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">Last Saved: {new Date(lastUpdated).toLocaleTimeString()}</span>
                </>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-brand-dark tracking-tight flex items-center gap-3">
              Sub-Products &amp; Design Manager
              <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                Interactive Showcase
              </span>
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              Add, edit, duplicate, and configure 120+ customizable profession designs, product lines, and 27 storefront showcase categories. Changes publish instantly to the storefront catalog.
            </p>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/products"
              target="_blank"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
            >
              <Eye className="w-4 h-4 text-gray-400" />
              View Storefront
              <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
            </Link>

            <button
              onClick={handleResetDefaults}
              disabled={resetting || saving}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
              title="Revert all changes back to factory default data"
            >
              {resetting ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <RotateCcw className="w-4 h-4" />}
              Reset
            </button>

            <button
              onClick={handleSaveAll}
              disabled={saving}
              className="inline-flex items-center gap-2.5 px-6 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-black tracking-wider uppercase hover:bg-black active:scale-95 transition-all shadow-md"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-brand-gold" />}
              {saving ? 'Publishing...' : 'Save & Publish'}
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-dark">{subProducts.length}</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sub-Product Designs</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-dark">{categories.length}</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Showcase Categories</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-dark">{parentProducts.length}</p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Parent Lines</p>
            </div>
          </div>

          <div className="p-5 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-brand-dark">
                {subProducts.filter(s => s.isPopular || s.isTrending).length}
              </p>
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Featured / Trending</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('designs')}
            className={cn(
              "px-6 py-3 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2",
              activeTab === 'designs'
                ? "border-brand-dark text-brand-dark font-black"
                : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            <Layers className="w-4 h-4" />
            Sub-Product Designs ({subProducts.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={cn(
              "px-6 py-3 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2",
              activeTab === 'categories'
                ? "border-brand-dark text-brand-dark font-black"
                : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            <Store className="w-4 h-4" />
            Showcase Categories ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('parents')}
            className={cn(
              "px-6 py-3 font-bold text-sm tracking-tight border-b-2 transition-all flex items-center gap-2",
              activeTab === 'parents'
                ? "border-brand-dark text-brand-dark font-black"
                : "border-transparent text-gray-400 hover:text-gray-600"
            )}
          >
            <Package className="w-4 h-4" />
            Parent Product Lines ({parentProducts.length})
          </button>
        </div>

        {/* ---------------- TAB 1: DESIGNS ---------------- */}
        {activeTab === 'designs' && (
          <div>
            {/* Filter Toolbar */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search designs by title, profession, or style..."
                  value={designSearch}
                  onChange={(e) => setDesignSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-dark/20 focus:outline-none text-xs font-medium transition-all"
                />
              </div>

              {/* Parent Product Filter */}
              <select
                value={selectedParentFilter}
                onChange={(e) => setSelectedParentFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-brand-dark/20 cursor-pointer"
              >
                <option value="All">All Parent Products</option>
                {parentProducts.map(p => (
                  <option key={p.slug} value={p.slug}>{p.name}</option>
                ))}
              </select>

              {/* Profession Filter */}
              <select
                value={selectedProfessionFilter}
                onChange={(e) => setSelectedProfessionFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-brand-dark/20 cursor-pointer"
              >
                <option value="All">All Professions</option>
                {PROFESSIONS.filter(p => p !== 'All').map(prof => (
                  <option key={prof} value={prof}>{prof}</option>
                ))}
              </select>

              {/* Style Tag Filter */}
              <select
                value={selectedStyleFilter}
                onChange={(e) => setSelectedStyleFilter(e.target.value)}
                className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-brand-dark/20 cursor-pointer"
              >
                <option value="All">All Styles</option>
                {STYLES.filter(s => s !== 'All').map(st => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>

              <button
                onClick={handleOpenAddDesign}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-dark text-white rounded-2xl text-xs font-bold hover:bg-black transition-all shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add New Design
              </button>
            </div>

            {/* Designs Count Bar */}
            <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase tracking-wider mb-4 px-2">
              <span>Showing {filteredDesigns.length} of {subProducts.length} Designs</span>
              {(designSearch || selectedParentFilter !== 'All' || selectedProfessionFilter !== 'All' || selectedStyleFilter !== 'All') && (
                <button
                  onClick={() => {
                    setDesignSearch('');
                    setSelectedParentFilter('All');
                    setSelectedProfessionFilter('All');
                    setSelectedStyleFilter('All');
                  }}
                  className="text-red-500 hover:underline cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {/* Designs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredDesigns.map((design) => (
                <div 
                  key={design.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-brand-gold/40 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group"
                >
                  {/* Card Thumbnail */}
                  <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                    <Image
                      src={design.frontImage || '/images/products/business-card-front.png'}
                      alt={design.name}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Status Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      {design.isPopular && (
                        <span className="px-2 py-0.5 bg-amber-500 text-white text-[9px] font-black rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <Flame className="w-2.5 h-2.5" /> Popular
                        </span>
                      )}
                      {design.isTrending && (
                        <span className="px-2 py-0.5 bg-blue-600 text-white text-[9px] font-black rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                          <TrendingUp className="w-2.5 h-2.5" /> Trending
                        </span>
                      )}
                      {design.isNew && (
                        <span className="px-2 py-0.5 bg-emerald-600 text-white text-[9px] font-black rounded-md uppercase tracking-wider shadow-sm">
                          New
                        </span>
                      )}
                    </div>

                    {/* Price Tag Badge */}
                    <div className="absolute bottom-2 right-2 px-2 py-1 bg-brand-dark/90 text-white text-[10px] font-bold rounded-lg backdrop-blur-sm">
                      ₹{design.startingPrice} <span className="text-[8px] text-gray-300">/ MOQ {design.moq}</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-full">
                          {design.profession}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium truncate">
                          {design.styleTag}
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-brand-dark line-clamp-1 group-hover:text-amber-700 transition-colors">
                        {design.name}
                      </h3>
                      <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                        {design.description || `${design.orientation} • ${design.dimensions}`}
                      </p>
                    </div>

                    {/* Card Actions */}
                    <div className="pt-4 mt-3 border-t border-gray-100 flex items-center justify-between gap-1">
                      <Link
                        href={`/customize/${design.parentProductSlug}?template=${design.templateIndex || 1}`}
                        target="_blank"
                        className="p-1.5 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors"
                        title="Preview Live in Customizer"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDuplicateDesign(design)}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Duplicate Design"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEditDesign(design)}
                          className="p-1.5 text-gray-400 hover:text-brand-dark hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Design Details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteDesign(design.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Design"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDesigns.length === 0 && (
              <div className="p-12 text-center bg-white rounded-3xl border border-gray-100 mt-4">
                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-gray-700 mb-1">No designs match your filter</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                  Try searching with different keywords or clear the category and profession filters.
                </p>
                <button
                  onClick={handleOpenAddDesign}
                  className="px-5 py-2.5 bg-brand-dark text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" /> Create a New Design
                </button>
              </div>
            )}
          </div>
        )}

        {/* ---------------- TAB 2: SHOWCASE CATEGORIES (27 Tiles) ---------------- */}
        {activeTab === 'categories' && (
          <div>
            {/* Toolbar */}
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search showcase category tiles..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-gray-50 border border-transparent focus:bg-white focus:border-brand-dark/20 focus:outline-none text-xs font-medium transition-all"
                />
              </div>

              <select
                value={selectedGroupFilter}
                onChange={(e) => setSelectedGroupFilter(e.target.value as any)}
                className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-2xl text-xs font-bold text-gray-700 focus:outline-none focus:bg-white focus:border-brand-dark/20 cursor-pointer"
              >
                {GROUPS.map(g => (
                  <option key={g} value={g}>{g === 'All' ? 'All Category Groups' : g}</option>
                ))}
              </select>

              <button
                onClick={handleOpenAddCategory}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-brand-dark text-white rounded-2xl text-xs font-bold hover:bg-black transition-all shadow-sm whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                Add Category Showcase
              </button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-brand-gold/40 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="px-2 py-0.5 bg-amber-50 text-amber-800 text-[10px] font-bold rounded-full">
                        {category.group}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-black rounded-md">
                        {category.count} Designs
                      </span>
                    </div>

                    <div className="relative w-full aspect-video bg-gray-50 rounded-xl overflow-hidden mb-3">
                      <Image
                        src={category.image || '/images/categories/visiting-cards.jpg'}
                        alt={category.title}
                        fill
                        className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <h3 className="font-bold text-sm text-brand-dark group-hover:text-amber-700 transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {category.tagline}
                    </p>

                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-medium">Starting from:</span>
                      <span className="font-black text-brand-dark">₹{category.startingPrice}</span>
                    </div>
                  </div>

                  <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-gray-400 truncate max-w-[120px]">
                      Line: {category.parentProductSlug}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditCategory(category)}
                        className="p-1.5 text-gray-400 hover:text-brand-dark hover:bg-white rounded-lg transition-colors"
                        title="Edit Category Showcase"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: PARENT PRODUCTS ---------------- */}
        {activeTab === 'parents' && (
          <div className="space-y-4">
            <p className="text-xs text-gray-500 font-medium mb-4">
              These are the primary product lines that power the top pill filters in the Sub-Product Designs browser.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {parentProducts.map((parent) => (
                <div 
                  key={parent.id}
                  className="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-bold rounded-full">
                        {parent.category}
                      </span>
                      <span className="text-xs font-black text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full">
                        {parent.badge}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-brand-dark mb-1">{parent.name}</h3>
                    <p className="text-xs text-amber-700 font-bold mb-2">{parent.tagline}</p>
                    <p className="text-xs text-gray-400 leading-relaxed mb-4">{parent.description}</p>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-gray-50 rounded-xl text-center text-xs">
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Starts At</span>
                        <span className="font-bold text-brand-dark">₹{parent.startingPrice}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">MOQ</span>
                        <span className="font-bold text-brand-dark">{parent.moq} Units</span>
                      </div>
                      <div>
                        <span className="block text-[10px] text-gray-400 uppercase font-bold">Turnaround</span>
                        <span className="font-bold text-brand-dark">{parent.turnaroundDays}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400 font-medium">Slug: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{parent.slug}</code></span>
                    <button
                      onClick={() => handleOpenEditParent(parent)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-brand-dark hover:text-white rounded-lg text-xs font-bold text-gray-700 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" /> Edit Settings
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---------------- MODAL: ADD / EDIT DESIGN ---------------- */}
        {isDesignModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="text-xl font-black text-brand-dark">
                    {editingDesign ? 'Edit Sub-Product Design' : 'Add New Design Template'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Configure design template metadata, artwork images, and pricing.
                  </p>
                </div>
                <button
                  onClick={() => setIsDesignModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveDesignForm} className="space-y-4">
                {/* Name & Slug */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Design Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Advocate Emblem & Gold Crest Card"
                      value={designForm.name || ''}
                      onChange={(e) => setDesignForm({ ...designForm, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Slug / Identifier</label>
                    <input
                      type="text"
                      placeholder="auto-generated from title"
                      value={designForm.slug || ''}
                      onChange={(e) => setDesignForm({ ...designForm, slug: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-brand-dark"
                    />
                  </div>
                </div>

                {/* Parent Product & Profession */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Parent Product Line *</label>
                    <select
                      value={designForm.parentProductSlug || 'business-card-custom'}
                      onChange={(e) => setDesignForm({ ...designForm, parentProductSlug: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-brand-dark"
                    >
                      {parentProducts.map(p => (
                        <option key={p.slug} value={p.slug}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Profession / Industry *</label>
                    <select
                      value={designForm.profession || 'Advocate & Legal'}
                      onChange={(e) => setDesignForm({ ...designForm, profession: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-brand-dark"
                    >
                      {PROFESSIONS.filter(p => p !== 'All').map(prof => (
                        <option key={prof} value={prof}>{prof}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Style Tag & Orientation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Style Tag</label>
                    <select
                      value={designForm.styleTag || 'Minimal Modern'}
                      onChange={(e) => setDesignForm({ ...designForm, styleTag: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-brand-dark"
                    >
                      {STYLES.filter(s => s !== 'All').map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Orientation &amp; Dimensions</label>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={designForm.orientation || 'horizontal'}
                        onChange={(e) => setDesignForm({ ...designForm, orientation: e.target.value as any })}
                        className="px-2 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                      >
                        <option value="horizontal">Horizontal</option>
                        <option value="vertical">Vertical</option>
                        <option value="square">Square</option>
                        <option value="circle">Circle</option>
                      </select>
                      <input
                        type="text"
                        placeholder="3.5 x 2 in"
                        value={designForm.dimensions || ''}
                        onChange={(e) => setDesignForm({ ...designForm, dimensions: e.target.value })}
                        className="px-2 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description / Tagline</label>
                  <textarea
                    rows={2}
                    placeholder="Short summary of this design's aesthetic, paper stock, and layout..."
                    value={designForm.description || ''}
                    onChange={(e) => setDesignForm({ ...designForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-brand-dark"
                  />
                </div>

                {/* Front Image & Back Image */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Front Artwork Image *</label>
                    <input
                      type="text"
                      placeholder="e.g. /images/products/business-card-front.png"
                      value={designForm.frontImage || ''}
                      onChange={(e) => setDesignForm({ ...designForm, frontImage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium mb-2"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingImage ? 'Uploading...' : 'Upload Front File'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadImageFile(e, 'frontImage')}
                      />
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Back Artwork Image (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. /images/products/business-card-back.png"
                      value={designForm.backImage || ''}
                      onChange={(e) => setDesignForm({ ...designForm, backImage: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium mb-2"
                    />
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      {uploadingImage ? 'Uploading...' : 'Upload Back File'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleUploadImageFile(e, 'backImage')}
                      />
                    </label>
                  </div>
                </div>

                {/* Price, MOQ, Template Index */}
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Starting Price (₹)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={designForm.startingPrice ?? 4.40}
                      onChange={(e) => setDesignForm({ ...designForm, startingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">MOQ (Units)</label>
                    <input
                      type="number"
                      value={designForm.moq ?? 100}
                      onChange={(e) => setDesignForm({ ...designForm, moq: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Template Index</label>
                    <input
                      type="number"
                      value={designForm.templateIndex ?? 1}
                      onChange={(e) => setDesignForm({ ...designForm, templateIndex: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Badges Toggle */}
                <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-gray-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(designForm.isPopular)}
                      onChange={(e) => setDesignForm({ ...designForm, isPopular: e.target.checked })}
                      className="rounded text-brand-dark focus:ring-0"
                    />
                    Mark as Popular
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(designForm.isTrending)}
                      onChange={(e) => setDesignForm({ ...designForm, isTrending: e.target.checked })}
                      className="rounded text-brand-dark focus:ring-0"
                    />
                    Mark as Trending
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(designForm.isNew)}
                      onChange={(e) => setDesignForm({ ...designForm, isNew: e.target.checked })}
                      className="rounded text-brand-dark focus:ring-0"
                    />
                    Mark as New
                  </label>
                </div>

                {/* Submit & Cancel */}
                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsDesignModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-dark text-white text-xs font-black tracking-wider uppercase hover:bg-black transition-all shadow-md"
                  >
                    {editingDesign ? 'Update Design' : 'Add Design'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- MODAL: ADD / EDIT CATEGORY ---------------- */}
        {isCategoryModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="text-xl font-black text-brand-dark">
                    {editingCategory ? 'Edit Showcase Category' : 'Add Showcase Category'}
                  </h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Controls the 27 product category tiles in the storefront showcase grid.
                  </p>
                </div>
                <button
                  onClick={() => setIsCategoryModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCategoryForm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Finance & CA"
                    value={categoryForm.title || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-brand-dark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Category Group *</label>
                    <select
                      value={categoryForm.group || 'Professionals'}
                      onChange={(e) => setCategoryForm({ ...categoryForm, group: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    >
                      {GROUPS.filter(g => g !== 'All').map(g => (
                        <option key={g} value={g}>{g}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Count Label</label>
                    <input
                      type="number"
                      placeholder="e.g. 81"
                      value={categoryForm.count ?? 20}
                      onChange={(e) => setCategoryForm({ ...categoryForm, count: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Starting Price (₹)</label>
                    <input
                      type="number"
                      value={categoryForm.startingPrice ?? 140}
                      onChange={(e) => setCategoryForm({ ...categoryForm, startingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Parent Product Slug</label>
                    <input
                      type="text"
                      placeholder="business-card-custom"
                      value={categoryForm.parentProductSlug || 'business-card-custom'}
                      onChange={(e) => setCategoryForm({ ...categoryForm, parentProductSlug: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    placeholder="/images/categories/finance.png"
                    value={categoryForm.image || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tagline / Description</label>
                  <textarea
                    rows={2}
                    value={categoryForm.tagline || ''}
                    onChange={(e) => setCategoryForm({ ...categoryForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsCategoryModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-dark text-white text-xs font-black tracking-wider uppercase hover:bg-black transition-all shadow-md"
                  >
                    {editingCategory ? 'Update Category' : 'Add Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ---------------- MODAL: EDIT PARENT PRODUCT LINE ---------------- */}
        {isParentModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl my-8">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-6">
                <div>
                  <h2 className="text-xl font-black text-brand-dark">Edit Parent Product Line</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Configure turnaround time, MOQ, base pricing, and taglines.
                  </p>
                </div>
                <button
                  onClick={() => setIsParentModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveParentForm} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Product Line Name</label>
                  <input
                    type="text"
                    required
                    value={parentForm.name || ''}
                    onChange={(e) => setParentForm({ ...parentForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Tagline</label>
                  <input
                    type="text"
                    value={parentForm.tagline || ''}
                    onChange={(e) => setParentForm({ ...parentForm, tagline: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Starts At (₹)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={parentForm.startingPrice ?? 4.40}
                      onChange={(e) => setParentForm({ ...parentForm, startingPrice: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">MOQ</label>
                    <input
                      type="number"
                      value={parentForm.moq ?? 100}
                      onChange={(e) => setParentForm({ ...parentForm, moq: parseInt(e.target.value, 10) || 1 })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Turnaround</label>
                    <input
                      type="text"
                      placeholder="3-5 Days"
                      value={parentForm.turnaroundDays || ''}
                      onChange={(e) => setParentForm({ ...parentForm, turnaroundDays: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={parentForm.description || ''}
                    onChange={(e) => setParentForm({ ...parentForm, description: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-medium"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsParentModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-brand-dark text-white text-xs font-black tracking-wider uppercase hover:bg-black transition-all shadow-md"
                  >
                    Save Line Settings
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
