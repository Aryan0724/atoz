"use client";

// --- Google Analytics (GA4) Utility ---
// Standard ecommerce events: page_view, view_item, add_to_cart, begin_checkout, purchase

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || '';

/**
 * Send a custom event to Google Analytics
 * @param action The event name (e.g., 'purchase')
 * @param params Additional event parameters (e.g., currency, items, value)
 */
export const trackGAEvent = (action: string, params: any = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, params);
    console.log(`[GoogleAnalytics] Event Tracked: ${action}`, params);
  }
};

/**
 * GA4 Standard Event Helpers
 */

/**
 * Track a page view (useful for SPAs, although GA4 enhanced measurement tracks history state automatically)
 * @param url Destination path
 */
export const trackGAPageView = (url: string) => {
  if (!GA_MEASUREMENT_ID) return;
  trackGAEvent('page_view', {
    page_path: url,
  });
};

/**
 * Track viewing an item details page
 * @param product Product object
 */
export const trackGAViewItem = (product: any) => {
  trackGAEvent('view_item', {
    currency: 'INR',
    value: product.base_price,
    items: [
      {
        item_id: product.id,
        item_name: product.name,
        item_category: product.category || 'Custom Merch',
        price: product.base_price,
        quantity: 1
      }
    ]
  });
};

/**
 * Track adding an item to the cart
 * @param item Cart item object containing product details
 */
export const trackGAAddToCart = (item: any) => {
  const price = item.unitPrice || item.product.base_price;
  trackGAEvent('add_to_cart', {
    currency: 'INR',
    value: price * (item.quantity || 1),
    items: [
      {
        item_id: item.product.id,
        item_name: item.product.name,
        item_category: item.product.category || 'Custom Merch',
        price: price,
        quantity: item.quantity || 1
      }
    ]
  });
};

/**
 * Track user initiating the checkout process
 * @param total Total checkout cart value
 * @param items Array of cart items
 */
export const trackGABeginCheckout = (total: number, items: any[]) => {
  trackGAEvent('begin_checkout', {
    currency: 'INR',
    value: total,
    items: items.map(item => {
      const price = item.unitPrice || item.product?.base_price || 0;
      return {
        item_id: item.product?.id || item.product_id,
        item_name: item.product?.name || 'Custom Product',
        item_category: item.product?.category || 'Custom Merch',
        price: price,
        quantity: item.quantity || 1
      };
    })
  });
};

/**
 * Track successful checkout payment and order creation
 * @param orderId Supabase order UUID or human ID
 * @param total Total transaction value
 * @param items Array of order items
 */
export const trackGAPurchase = (orderId: string, total: number, items: any[]) => {
  trackGAEvent('purchase', {
    transaction_id: orderId,
    value: total,
    currency: 'INR',
    tax: 0,
    shipping: 0,
    items: items.map(item => {
      const price = item.price || item.unitPrice || 0;
      return {
        item_id: item.product_id || item.id,
        item_name: item.product?.name || item.name || 'Custom Product',
        item_category: item.product?.category || 'Custom Merch',
        price: price,
        quantity: item.quantity || 1
      };
    })
  });
};
