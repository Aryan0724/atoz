import { 
  Shirt, 
  Coffee, 
  BookOpen, 
  Box, 
  Smile, 
  Zap, 
  ShieldCheck, 
  Award, 
  Globe, 
  Package,
  Layers,
  PenTool,
  Printer,
  ShoppingBag,
  CreditCard,
  User,
  Layout,
  Smartphone,
  Gift
} from 'lucide-react';

// ── STOREFRONT CATEGORY MAPPING ──────────────────────────────────────────
// Maps category/feature names to premium Lucide-React icons for UI rendering.

export const CATEGORY_ICONS: Record<string, any> = {
  'apparel': Shirt,
  'clothing': Shirt,
  'drinkware': Coffee,
  'mug': Coffee,
  'stationery': BookOpen,
  'notebook': BookOpen,
  'lifestyle': Smile,
  'corporate': Box,
  'gifting': Gift,
  'packaging': Package,
  'electronics': Smartphone,
  'enterprise': ShieldCheck,
  'dropshipping': Globe,
  'bulk': Layers,
  'customized': PenTool,
  'printing': Printer,
  'cards': CreditCard,
  'business': User,
  'layout': Layout,
};

export const getCategoryIcon = (id: string) => {
  const normalizedId = id.toLowerCase();
  return CATEGORY_ICONS[normalizedId] || Package;
};

// ── DESIGN STUDIO ICON SYSTEM (FIX FOR RUNTIME ERROR) ──────────────────
// These exports are used by SidebarPanel.tsx for the in-canvas icon library.

export const iconCategories = [
  {
    name: 'Shapes',
    icons: ['circle', 'square', 'triangle', 'star', 'heart', 'diamond', 'hexagon', 'octagon']
  },
  {
    name: 'Business',
    icons: ['briefcase', 'chart', 'target', 'check-badge', 'shield-lock', 'user-badge', 'globe-network', 'layers-clean']
  },
  {
    name: 'Symbols',
    icons: ['sparkle', 'zap-bold', 'anchor', 'infinite', 'crown-simple', 'sun', 'moon', 'flame']
  },
  {
    name: 'Social',
    icons: ['facebook-outline', 'instagram-outline', 'twitter-outline', 'linkedin-outline', 'whatsapp-outline', 'mail-outline']
  }
];

export const iconLibrary: Record<string, string> = {
  // SHAPES
  'circle': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z',
  'square': 'M3 3h18v18H3z',
  'triangle': 'M12 2L1 21h22L12 2z',
  'star': 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
  'heart': 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z',
  'diamond': 'M12 2L2 12l10 10 10-10L12 2z',
  'hexagon': 'M12 2.5L20.66 7.5V17.5L12 22.5L3.34 17.5V7.5L12 2.5Z',
  'octagon': 'M12 2L19.07 4.93L22 12L19.07 19.07L12 22L4.93 19.07L2 12L4.93 4.93L12 2Z',

  // BUSINESS
  'briefcase': 'M20 7h-4V5c0-.55-.45-1-1-1H9c-.55 0-1 .45-1 1v2H4c-.55 0-1 .45-1 1v11c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V8c0-.55-.45-1-1-1zM9 5h6v2H9V5zm11 14H4V9h16v10z',
  'chart': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z',
  'target': 'M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-12.5c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
  'check-badge': 'M12 2L15.09 3.09L18.18 4.18V7.27C18.18 10.91 15.45 14.27 12 15.09V12H9V15.09C5.55 14.27 2.82 10.91 2.82 7.27V4.18L5.91 3.09L9 2H12Z',
  'shield-lock': 'M12 2L4 5V11C4 16.19 7.41 20.92 12 22C16.59 20.92 20 16.19 20 11V5L12 2ZM12 15C10.62 15 9.5 13.88 9.5 12.5C9.5 11.12 10.62 10 12 10C13.38 10 14.5 11.12 14.5 12.5C14.5 13.88 13.38 15 12 15Z',
  'user-badge': 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  'globe-network': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
  'layers-clean': 'M12 16.41l-9-5.14V7.59l9 5.14 9-5.14V11.27l-9 5.14zm0-8.82L3 2.45v3.68l9 5.14 9-5.14V2.45l-9 5.14z',

  // SYMBOLS
  'sparkle': 'M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z',
  'zap-bold': 'M7 2v11h3v9l7-12h-4l4-8z',
  'anchor': 'M12 2a3 3 0 0 1 3 3 3 3 0 0 1-3 3 3 3 0 0 1-3-3 3 3 0 0 1 3-3zm0 18c-4.418 0-8-3.582-8-8h3l-4-4-4 4h3c0 5.523 4.477 10 10 10s10-4.477 10-10h3l-4-4-4 4h3c0 4.418-3.582 8-8 8z',
  'infinite': 'M7.5 4a5.5 5.5 0 1 0 0 11c2.8 0 5-2.2 6.5-4.5 1.5 2.3 3.7 4.5 6.5 4.5a5.5 5.5 0 1 0 0-11c-2.8 0-5 2.2-6.5 4.5C12.5 6.2 10.3 4 7.5 4z',
  'crown-simple': 'M5 16h14l1-10-4 4-4-6-4 6-4-4z',
  'sun': 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h3v-2H2v2zm17 0h3v-2h-3v2zM11 2v3h2V2h-2zm0 17v3h2v-3h-2zM5.05 17.54l2.12-2.12-1.41-1.41-2.12 2.12 1.41 1.41zm12.43-12.43l2.12-2.12-1.41-1.41-2.12 2.12 1.41 1.41zm-12.43-12.43L2.93 4.83 4.34 6.24l2.12-2.12-1.41-1.41zM17.48 14.83l2.12 2.12 1.41-1.41-2.12-2.12-1.41 1.41z',
  'moon': 'M12 2c-5.523 0-10 4.477-10 10s4.477 10 10 10a9.96 9.96 0 0 0 5.856-1.896 1 1 0 0 0-.175-1.745c-1.503-.509-2.903-1.378-4.103-2.578-2.614-2.614-4.053-6.09-4.053-9.783 0-1.716.313-3.376.903-4.903a1 1 0 0 0-1.077-1.341A9.957 9.957 0 0 0 12 2z',
  'flame': 'M12 2c0 0-5 5-5 8s2.24 5 5 5 5-2.24 5-5-5-8-5-8z',

  // SOCIAL
  'facebook-outline': 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3V2z',
  'instagram-outline': 'M16.5 2h-9A5.5 5.5 0 0 0 2 7.5v9A5.5 5.5 0 0 0 7.5 22h9a5.5 5.5 0 0 0 5.5-5.5v-9A5.5 5.5 0 0 0 16.5 2zm3.5 14.5a3.5 3.5 0 0 1-3.5 3.5h-9A3.5 3.5 0 0 1 4 16.5v-9A3.5 3.5 0 0 1 7.5 4h9A3.5 3.5 0 0 1 20 7.5v9z M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8a3 3 0 1 1 0-6 3 3 0 0 1 0 6z M17.5 6a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z',
  'twitter-outline': 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C5 15.5 3.8 13.5 3.2 11c1 .1 2.1.1 3-.1-4-1.2-5.4-4-5-6.4 1 .6 2.1 1.1 3.2 1.1C.2 3.2 1.5.8 4 1.5c3.5 4.5 9 6.5 14.5 7-.4-2.5.5-5 2.5-6.5 2.5-1.5 6 0 7 3.5 1.2-.2 2.4-.7 3.5-1.4-.4 1.2-1.3 2.3-2.5 3 1-.1 2-.4 3-.7-.7 1.1-1.6 2-2.5 2.6z',
  'linkedin-outline': 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z',
  'whatsapp-outline': 'M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 2C6.48 2 2 6.48 2 12c0 2.17.7 4.19 1.89 5.84L2.01 22l4.31-1.13A9.97 9.97 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z',
  'mail-outline': 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2-2-2zm0 4l8 5 8-5V6l-8 5-8-5v2z'
};
