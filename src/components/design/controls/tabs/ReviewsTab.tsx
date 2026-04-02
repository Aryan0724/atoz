"use client";

import React, { useEffect, useState } from 'react';
import { Star, Loader2, User } from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

interface ReviewsTabProps {
  productId: string;
}

const ReviewsTab = ({ productId }: ReviewsTabProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
         const { data, error } = await supabase
           .from('product_reviews')
           .select('*, profiles(full_name)')
           .eq('product_id', productId)
           .order('created_at', { ascending: false });
           
         if (!error && data) {
           setReviews(data);
         }
      } catch (err) {
         console.error('Failed to fetch reviews', err);
      } finally {
         setLoading(false);
      }
    };
    
    fetchReviews();
  }, [productId]);

  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="p-5 space-y-6">
      <div className="bg-[#f7f7f2] rounded-3xl p-6 flex flex-col items-center justify-center text-center">
         <div className="text-5xl font-black text-brand-dark tracking-tighter mb-2">{avgRating}</div>
         <div className="flex gap-1 mb-2">
           {[1,2,3,4,5].map(s => (
             <Star key={s} className={`w-4 h-4 ${s <= Number(avgRating) ? 'fill-brand-cyan text-brand-cyan' : 'fill-gray-200 text-gray-200'}`} />
           ))}
         </div>
         <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{reviews.length} Reviews</div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center p-8"><Loader2 className="w-6 h-6 animate-spin text-gray-300" /></div>
        ) : reviews.length === 0 ? (
          <div className="text-center p-8 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
             <Star className="w-8 h-8 text-gray-200 mx-auto mb-3" />
             <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">No reviews yet.</p>
          </div>
        ) : (
          reviews.map(review => (
            <div key={review.id} className="p-4 bg-white border border-gray-100 shadow-sm rounded-2xl">
               <div className="flex items-center justify-between mb-3">
                 <div className="flex items-center gap-2">
                   <div className="w-6 h-6 rounded-full bg-brand-pink/10 flex items-center justify-center">
                     <User className="w-3 h-3 text-brand-pink" />
                   </div>
                   <span className="text-[10px] font-black text-brand-dark">{review.profiles?.full_name || 'Verified Buyer'}</span>
                 </div>
                 <div className="flex gap-0.5">
                   {[1,2,3,4,5].map(s => (
                     <Star key={s} className={`w-3 h-3 ${s <= review.rating ? 'fill-brand-cyan text-brand-cyan' : 'fill-gray-100 text-gray-100'}`} />
                   ))}
                 </div>
               </div>
               <p className="text-xs text-gray-500 font-medium leading-relaxed">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsTab;
