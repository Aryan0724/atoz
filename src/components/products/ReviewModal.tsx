"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase/client';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: { id: string; name: string };
  userId: string;
}

const ReviewModal = ({ isOpen, onClose, product, userId }: ReviewModalProps) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('product_reviews')
        .insert({
          product_id: product.id,
          user_id: userId,
          rating,
          comment
        });

      if (error) {
        if (error.code === '42P01') {
           // Table doesn't exist warning - the user needs to run the SQL migration
           toast.error(
             "Database migration required. Please run the SQL file in the Supabase Dashboard.",
             { duration: 8000 }
           );
           onClose();
           return;
        }
        throw error;
      }
      
      toast.success('Thank you for your review!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to submit review');
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
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-[40px] shadow-2xl z-[1002] p-8 md:p-12 border border-gray-100"
          >
            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-400"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-black text-brand-dark tracking-tight mb-2 italic uppercase">Rate Product</h2>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{product.name}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center">
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star 
                      className={`w-10 h-10 transition-colors ${
                        star <= (hoverRating || rating) 
                          ? 'fill-brand-cyan text-brand-cyan' 
                          : 'fill-gray-100 text-gray-200'
                      }`} 
                    />
                  </button>
                ))}
              </div>

              <div className="w-full space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Your Experience</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you love about this item..."
                  className="w-full px-6 py-5 rounded-[24px] bg-gray-50/50 border border-transparent focus:bg-white focus:border-brand-cyan/20 outline-none transition-all font-bold text-gray-600 block resize-none h-32"
                />
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-brand-dark text-white font-black rounded-2xl text-[11px] uppercase tracking-[0.2em] hover:bg-brand-cyan shadow-xl shadow-brand-dark/10 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Star className="w-5 h-5" />}
                Submit Review
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReviewModal;
