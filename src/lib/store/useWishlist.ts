import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../supabase/client';

interface WishlistState {
  wishlistIds: string[];
  setWishlist: (ids: string[]) => void;
  toggleFavorite: (productId: string) => Promise<boolean>;
  syncWithProfile: (userId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlistIds: [],
      setWishlist: (ids) => set({ wishlistIds: ids }),
      isFavorite: (productId) => get().wishlistIds.includes(productId),
      toggleFavorite: async (productId: string) => {
        const { data: { session } } = await supabase.auth.getSession();
        const currentList = get().wishlistIds;
        const isFav = currentList.includes(productId);
        
        let newList: string[];
        if (isFav) {
          newList = currentList.filter(id => id !== productId);
        } else {
          newList = [...currentList, productId];
        }
        
        set({ wishlistIds: newList });

        if (session?.user) {
          try {
            await supabase
              .from('profiles')
              .update({ wishlist: newList })
              .eq('id', session.user.id);
          } catch (err) {
             console.error('Failed to sync wishlist to profile', err);
          }
        }
        
        return !isFav;
      },
      syncWithProfile: async (userId: string) => {
        try {
           const { data } = await supabase
             .from('profiles')
             .select('wishlist')
             .eq('id', userId)
             .single();
           
           if (data && data.wishlist) {
             set({ wishlistIds: data.wishlist });
           }
        } catch (err) {
           console.error('Error fetching profile wishlist', err);
        }
      }
    }),
    {
      name: 'atoz-wishlist-storage',
    }
  )
);
