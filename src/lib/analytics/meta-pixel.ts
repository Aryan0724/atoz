"use client";

// --- Meta Pixel (Facebook Pixel) Utility ---
// Standard events: PageView, ViewContent, Search, AddToCart, InitiateCheckout, Purchase

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '';

/**
 * Trigger a standard or custom Meta Pixel event
 * @param eventName Name of the event (e.g., 'Purchase')
 * @param options Additional data for the event
 */
export const trackMetaEvent = (eventName: string, options: any = {}) => {
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, options);
    console.log(`[MetaPixel] Tracked: ${eventName}`, options);
  }
};

/**
 * Standard Event Helpers
 */

export const trackPageView = () => trackMetaEvent('PageView');

export const trackViewContent = (product: any) => {
  trackMetaEvent('ViewContent', {
    content_name: product.name,
    content_ids: [product.id],
    content_type: 'product',
    value: product.base_price,
    currency: 'INR',
  });
};

export const trackAddToCart = (item: any) => {
  trackMetaEvent('AddToCart', {
    content_name: item.product.name,
    content_ids: [item.product.id],
    content_type: 'product',
    value: item.unitPrice || item.product.base_price,
    currency: 'INR',
  });
};

export const trackInitiateCheckout = (total: number, itemCount: number) => {
  trackMetaEvent('InitiateCheckout', {
    value: total,
    currency: 'INR',
    num_items: itemCount,
  });
};

export const trackPurchase = (orderId: string, total: number, items: any[]) => {
  trackMetaEvent('Purchase', {
    content_ids: items.map(item => item.product_id || item.id),
    content_type: 'product',
    value: total,
    currency: 'INR',
    order_id: orderId,
  });
};
