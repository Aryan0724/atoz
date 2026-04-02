"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Loader2 } from 'lucide-react';

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: any) => Promise<void>;
}

const AddressModal = ({ isOpen, onClose, onSave }: AddressModalProps) => {
  const [formData, setFormData] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSave(formData);
      setFormData({ fullName: '', address: '', city: '', state: '', pincode: '' });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-brand-dark/40 backdrop-blur-md z-[1001]"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-lg bg-white rounded-[40px] shadow-2xl z-[1002] p-8 md:p-12 border border-gray-100"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-brand-cyan" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-brand-dark tracking-tight italic uppercase">Deploy Endpoint</h2>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Add new shipping location</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Receiver Name</label>
                <input
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData(p => ({ ...p, fullName: e.target.value }))}
                  className="w-full px-6 py-4 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-cyan/20 outline-none transition-all font-bold text-gray-600 block"
                />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Street Address</label>
                <input
                  required
                  value={formData.address}
                  onChange={(e) => setFormData(p => ({ ...p, address: e.target.value }))}
                  className="w-full px-6 py-4 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-cyan/20 outline-none transition-all font-bold text-gray-600 block"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">City</label>
                  <input
                    required
                    value={formData.city}
                    onChange={(e) => setFormData(p => ({ ...p, city: e.target.value }))}
                    className="w-full px-6 py-4 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-cyan/20 outline-none transition-all font-bold text-gray-600 block"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">State</label>
                  <input
                    required
                    value={formData.state}
                    onChange={(e) => setFormData(p => ({ ...p, state: e.target.value }))}
                    className="w-full px-6 py-4 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-cyan/20 outline-none transition-all font-bold text-gray-600 block"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">PIN Code</label>
                <input
                  required
                  value={formData.pincode}
                  onChange={(e) => setFormData(p => ({ ...p, pincode: e.target.value }))}
                  className="w-full px-6 py-4 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-cyan/20 outline-none transition-all font-bold text-gray-600 block"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full text-center mt-4 py-5 bg-brand-dark text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-brand-cyan shadow-xl shadow-brand-dark/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
                Save Destination
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddressModal;
