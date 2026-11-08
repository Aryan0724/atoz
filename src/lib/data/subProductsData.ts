import customConfig from './subProductsCustom.json';

export interface SubProductDesign {
  id: string;
  name: string;
  slug: string;
  parentProductSlug: string;
  category: string;
  profession: string;
  styleTag: string;
  description: string;
  frontImage: string;
  backImage?: string;
  templateIndex: number;
  startingPrice: number;
  unitLabel: string;
  moq: number;
  isPopular?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  orientation: 'horizontal' | 'vertical' | 'square' | 'circle';
  dimensions: string;
  paperStock?: string;
  features: string[];
}

export interface ParentProductInfo {
  id: string;
  name: string;
  slug: string;
  category: string;
  badge: string;
  tagline: string;
  description: string;
  startingPrice: number;
  unitLabel: string;
  moq: number;
  turnaroundDays: string;
  heroImage: string;
  totalDesigns: number;
  professions: string[];
  styles: string[];
}

export const PARENT_PRODUCTS: ParentProductInfo[] = [
  {
    id: 'business-cards',
    name: 'Visiting Cards / Business Cards',
    slug: 'business-card-custom',
    category: 'Stationery',
    badge: '30+ Designs',
    tagline: 'Premium Visiting Cards for Indian Professionals & Enterprises',
    description: 'Bespoke visiting cards printed on luxury 350+ GSM cardstock with Velvet Matte, Spot UV, and Gold Foil finishes. Tailored templates for Advocates, CAs, Doctors, Corporates & Retail.',
    startingPrice: 4.40,
    unitLabel: 'per card (from ₹440/100)',
    moq: 100,
    turnaroundDays: '3–5 Days',
    heroImage: '/images/products/business-card-front.png',
    totalDesigns: 30,
    professions: ['All', 'Chartered Accountant', 'Advocate & Legal', 'Doctor & Clinic', 'Corporate & Finance', 'Tech & Creative', 'Retail & Shop', 'Luxury & Gold'],
    styles: ['All', 'Minimal Modern', 'Executive Classic', 'Gold Foil', 'Geometric', 'Creative Dark', 'Dual Tone']
  },
  {
    id: 'letterheads',
    name: 'Corporate Letterheads',
    slug: 'letter-head-custom',
    category: 'Stationery',
    badge: '30+ Designs',
    tagline: 'Official Corporate Letterheads on 100/120 GSM Executive Paper',
    description: 'High-definition laser and inkjet compatible letterheads designed specifically for corporate houses, law firms, chartered accountants, and healthcare practices.',
    startingPrice: 3.50,
    unitLabel: 'per sheet (from ₹350/100)',
    moq: 100,
    turnaroundDays: '2–4 Days',
    heroImage: '/images/products/letterhead.png',
    totalDesigns: 30,
    professions: ['All', 'Chartered Accountant', 'Advocate & Legal', 'Doctor & Healthcare', 'Corporate Enterprise', 'Creative Agency', 'Real Estate'],
    styles: ['All', 'Minimal Header', 'Emblem Classic', 'Modern Gradient', 'Sidebar Accent', 'Geometric Edge']
  },
  {
    id: 'id-cards',
    name: 'Staff & Student ID Cards',
    slug: 'id-card-custom',
    category: 'Stationery',
    badge: '29+ Designs',
    tagline: 'CR80 Heavy-Duty PVC Identity Cards with High-Security Overlay',
    description: 'Scratch-resistant thermal infused PVC ID cards for corporate enterprises, schools, universities, hospitals, and VIP event passes with barcode & QR support.',
    startingPrice: 45,
    unitLabel: 'per card (from ₹45/unit)',
    moq: 10,
    turnaroundDays: '2–3 Days',
    heroImage: '/images/products/id-card-front.png',
    totalDesigns: 29,
    professions: ['All', 'Corporate Staff', 'School & College', 'Hospital & Medical', 'Event & VIP Pass', 'Security & Access', 'Tech Company'],
    styles: ['All', 'Vertical Standard', 'Horizontal Badge', 'Dark Executive', 'Clean Medical', 'Modern Gradient']
  },
  {
    id: 'wedding-cards',
    name: 'Wedding & Event Invitations',
    slug: 'wedding-card-custom',
    category: 'Stationery',
    badge: '30+ Designs',
    tagline: 'Bespoke Royal & Contemporary Indian Wedding Invitations',
    description: 'Stunning invitations crafted with traditional Indian elegance, gold foil mandalas, botanical floral accents, and royal crimson motifs on heavy metallic shimmer stock.',
    startingPrice: 28,
    unitLabel: 'per invite (from ₹1,400/50)',
    moq: 50,
    turnaroundDays: '5–7 Days',
    heroImage: '/images/products/wedding-card.png',
    totalDesigns: 30,
    professions: ['All', 'Royal Traditional', 'Floral Botanical', 'Modern Minimal', 'Monogram Luxury', 'Destination'],
    styles: ['All', 'Gold Mandala', 'Emerald Royal', 'Crimson Classic', 'Pastel Blossom', 'Kraft Rustic']
  },
  {
    id: 'stickers',
    name: 'Custom Stickers & Product Labels',
    slug: 'pvc-sticker-1000',
    category: 'Stationery',
    badge: 'Custom Shapes',
    tagline: 'Waterproof Vinyl & Paper Stickers in Any Shape & Size',
    description: 'Precision die-cut stickers and packaging labels for jar branding, courier packaging, food containers, bottles, and brand giveaways. Matte, Gloss, and Transparent.',
    startingPrice: 0.85,
    unitLabel: 'per label (from ₹850/1000)',
    moq: 500,
    turnaroundDays: '3–5 Days',
    heroImage: '/images/products/box.png',
    totalDesigns: 12,
    professions: ['All', 'Product Packaging', 'Cosmetics & Jars', 'Food & Bakery', 'Branding & Swag', 'Security Seals'],
    styles: ['All', 'Circle / Round', 'Square & Rectangle', 'Custom Die-Cut', 'Oval Bottle', 'Gold Foil']
  },
  {
    id: 'bill-books',
    name: 'Bill Books & Invoices',
    slug: 'bill-book',
    category: 'Stationery',
    badge: 'GST Ready',
    tagline: 'Custom Printed Carbonless (NCR) Bill Books & Estimate Memos',
    description: '2-Ply and 3-Ply duplicate carbonless invoice books with serial numbering, perforation, and sturdy binding. Ideal for retail stores, wholesalers, and service centers.',
    startingPrice: 160,
    unitLabel: 'per book (50 sets each)',
    moq: 5,
    turnaroundDays: '4–6 Days',
    heroImage: '/images/products/bill-book.jpg',
    totalDesigns: 8,
    professions: ['All', 'GST Tax Invoice', 'Retail Cash Memo', 'Estimate Memo', 'Delivery Challan', 'Order Receipt'],
    styles: ['All', 'Standard A5', 'Compact A6', 'Full Sheet A4', '2-Ply Duplicate', '3-Ply Triplicate']
  },
  {
    id: 'apparel',
    name: 'Custom T-Shirts & Hoodies',
    slug: 'custom-premium-tshirt',
    category: 'Apparel',
    badge: 'Premium Cotton',
    tagline: '100% Combed Cotton Apparel for Teams, Startups & Merchandise',
    description: 'Bio-washed 220–240 GSM luxury cotton t-shirts and 400 GSM heavyweight fleece hoodies with vivid screen printing, DTF, and high-density embroidery.',
    startingPrice: 380,
    unitLabel: 'per unit (Min. 10)',
    moq: 10,
    turnaroundDays: '5–7 Days',
    heroImage: '/images/products/tshirt.png',
    totalDesigns: 8,
    professions: ['All', 'Corporate Uniforms', 'Startup Merch', 'College & Fest', 'Sports & Fitness', 'Event Crew'],
    styles: ['All', 'Crewneck Classic', 'Polo Collar', 'Oversized Streetwear', 'Heavyweight Hoodie']
  },
  {
    id: 'drinkware',
    name: 'Custom Mugs & Sippers',
    slug: 'premium-coffee-mug',
    category: 'Drinkware',
    badge: 'Dishwasher Safe',
    tagline: 'Ceramic Mugs, Magic Mugs & Stainless Steel Temperature Bottles',
    description: 'High-gloss AAA grade sublimation ceramic mugs and double-wall insulated stainless steel bottles customized with your brand logo or photo.',
    startingPrice: 140,
    unitLabel: 'per mug (Min. 20)',
    moq: 20,
    turnaroundDays: '3–5 Days',
    heroImage: '/images/products/mug.png',
    totalDesigns: 8,
    professions: ['All', 'Corporate Gifts', 'Client Giveaways', 'Employee Welcome', 'Personalized Photo'],
    styles: ['All', 'Classic White Ceramic', 'Dual-Tone Inside Color', 'Magic Heat Reveal', 'Stainless Steel Flask']
  }
];

// Helper to format 2-digit number
const pad2 = (n: number) => (n < 10 ? `0${n}` : `${n}`);

// Generate Business Card Sub-Products (bc 01 to 30)
const bcProfessions = [
  { p: 'Chartered Accountant', s: 'Executive Classic', desc: 'Precision CA business card with balance sheet grid motif and formal typography.' },
  { p: 'Advocate & Legal', s: 'Gold Foil', desc: 'Distinguished advocate card featuring legal crest, emblem accents, and high-authority layout.' },
  { p: 'Doctor & Clinic', s: 'Minimal Modern', desc: 'Clean clinical visiting card with medical cross, specialty credentials, and clinic consultation timings.' },
  { p: 'Corporate & Finance', s: 'Dual Tone', desc: 'Sophisticated navy and ice blue corporate card for banking, wealth, and enterprise leaders.' },
  { p: 'Tech & Creative', s: 'Creative Dark', desc: 'High-contrast dark mode card with QR code link for software engineers, founders, and UI designers.' },
  { p: 'Luxury & Gold', s: 'Gold Foil', desc: 'Ultra-luxurious matte black card with simulated gold foil lettering for premium brand owners.' },
  { p: 'Retail & Shop', s: 'Modern Gradient', desc: 'Vibrant retail shop card with store address, WhatsApp ordering, and catalog QR code.' },
  { p: 'Doctor & Clinic', s: 'Minimal Modern', desc: 'Pediatric and dental care visiting card with calming pastel accents and contact info.' },
  { p: 'Chartered Accountant', s: 'Executive Classic', desc: 'Tax consultant & auditor visiting card with GST / PAN details and corporate layout.' },
  { p: 'Advocate & Legal', s: 'Gold Foil', desc: 'High court advocate visiting card with embossed emblem and bilingual Hindi/English design.' },
  { p: 'Tech & Creative', s: 'Geometric', desc: 'Futuristic geometric agency card with diagonal color block and bold modern typeface.' },
  { p: 'Corporate & Finance', s: 'Minimal Modern', desc: 'Sleek financial advisor visiting card with minimalist typography and contact icons.' },
  { p: 'Retail & Shop', s: 'Modern Gradient', desc: 'Jewellery and lifestyle boutique card with elegant gold-line framing and Instagram handle.' },
  { p: 'Tech & Creative', s: 'Creative Dark', desc: 'Photography and film studio card with dark textured background and portfolio link.' },
  { p: 'Corporate & Finance', s: 'Executive Classic', desc: 'Real estate developer and property advisor card with clean architectural borders.' },
  { p: 'Luxury & Gold', s: 'Gold Foil', desc: 'Presidential executive card with brushed metal texture and minimalist center emblem.' },
  { p: 'Advocate & Legal', s: 'Executive Classic', desc: 'Notary public and legal associate visiting card with clean traditional borders.' },
  { p: 'Doctor & Clinic', s: 'Minimal Modern', desc: 'Specialist physician visiting card with appointment booking QR code and clinic hours.' },
  { p: 'Retail & Shop', s: 'Dual Tone', desc: 'Electronics & mobile accessories repair store card with service highlights.' },
  { p: 'Chartered Accountant', s: 'Minimal Modern', desc: 'Company secretary & compliance advisor card with modern sans-serif hierarchy.' },
  { p: 'Corporate & Finance', s: 'Geometric', desc: 'Venture capital & private equity investor card with understated luxury aesthetic.' },
  { p: 'Tech & Creative', s: 'Creative Dark', desc: 'Digital marketing & brand strategy consultant card with vibrant neon highlights.' },
  { p: 'Retail & Shop', s: 'Modern Gradient', desc: 'Bakery, sweets & gourmet food business card with custom QR menu and contact info.' },
  { p: 'Doctor & Clinic', s: 'Clean Medical', desc: 'Ayurvedic & wellness clinic card with soothing earthy sage and gold accents.' },
  { p: 'Advocate & Legal', s: 'Gold Foil', desc: 'Senior advocate Supreme Court style card with bold seal and serif typography.' },
  { p: 'Luxury & Gold', s: 'Gold Foil', desc: 'Black velvet luxury card with gold corner flourishes and double-sided finish.' },
  { p: 'Corporate & Finance', s: 'Dual Tone', desc: 'Logistics, transport & supply chain director card with route icon accents.' },
  { p: 'Tech & Creative', s: 'Minimal Modern', desc: 'AI startup founder card with minimalist monochrome aesthetic and micro-dots.' },
  { p: 'Retail & Shop', s: 'Executive Classic', desc: 'Textile & saree showroom business card with traditional motif and dual store branches.' },
  { p: 'Chartered Accountant', s: 'Executive Classic', desc: 'Elite corporate tax advisory card with dual-sided bilingual address details.' }
];

export const SUB_PRODUCTS_DATA: SubProductDesign[] = [
  // ─── VISITING CARDS (30 Designs) ───────────────────────────
  ...bcProfessions.map((item, idx): SubProductDesign => {
    const num = pad2(idx + 1);
    const frontImg = `/templates/bc/${num}/front_ref.png`;
    const backImg = `/templates/bc/${num}/back_ref.png`;
    
    return {
      id: `bc-design-${num}`,
      name: `${item.p}: ${item.s} ${num}`,
      slug: `visiting-card-${item.p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${num}`,
      parentProductSlug: 'business-card-custom',
      category: 'Stationery',
      profession: item.p,
      styleTag: item.s,
      description: item.desc,
      frontImage: frontImg,
      backImage: backImg,
      templateIndex: idx,
      startingPrice: 4.40,
      unitLabel: 'per card (from ₹440/100)',
      moq: 100,
      isPopular: idx === 0 || idx === 1 || idx === 4 || idx === 9,
      isTrending: idx === 2 || idx === 5 || idx === 11,
      isNew: idx >= 25,
      orientation: 'horizontal',
      dimensions: '3.5" x 2.0" (Standard)',
      paperStock: '350 GSM Premium Art Card with Matte / Gloss Lamination',
      features: ['Both Sides Full Color Printing', 'Velvet Matte or Gloss Lamination', 'Rounded or Sharp Square Corners', 'Print-Ready in 24-48 Hours']
    };
  }),

  // ─── LETTERHEADS (30 Designs) ──────────────────────────────
  ...Array.from({ length: 30 }, (_, idx): SubProductDesign => {
    const num = pad2(idx + 1);
    const profs = ['Chartered Accountant', 'Advocate & Legal', 'Doctor & Healthcare', 'Corporate Enterprise', 'Creative Agency', 'Real Estate'];
    const styles = ['Minimal Header', 'Emblem Classic', 'Modern Gradient', 'Sidebar Accent', 'Geometric Edge'];
    const p = profs[idx % profs.length];
    const s = styles[idx % styles.length];

    return {
      id: `lh-design-${num}`,
      name: `${p} Letterhead Format ${num}`,
      slug: `letterhead-${p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${num}`,
      parentProductSlug: 'letter-head-custom',
      category: 'Stationery',
      profession: p,
      styleTag: s,
      description: `Professional letterhead layout for ${p} with official registration numbers, header logo, and footer legal info.`,
      frontImage: `/templates/lh/${num}/front.jpg`,
      templateIndex: idx,
      startingPrice: 3.50,
      unitLabel: 'per sheet (from ₹350/100)',
      moq: 100,
      isPopular: idx === 0 || idx === 3 || idx === 8,
      isTrending: idx === 1 || idx === 6,
      orientation: 'vertical',
      dimensions: 'A4 (210 x 297 mm)',
      paperStock: '100 GSM Superfine Alabaster Executive Bond Paper',
      features: ['Laser & Inkjet Printer Friendly', 'Crisp 1200 DPI Micro-Text Printing', 'Official Watermark & Header Alignment', 'Fountain Pen Non-Bleed Paper']
    };
  }),

  // ─── ID CARDS (29 Designs) ─────────────────────────────────
  ...Array.from({ length: 29 }, (_, idx): SubProductDesign => {
    const num = pad2(idx + 1);
    const profs = ['Corporate Staff', 'School & College', 'Hospital & Medical', 'Event & VIP Pass', 'Security & Access', 'Tech Company'];
    const styles = ['Vertical Standard', 'Horizontal Badge', 'Dark Executive', 'Clean Medical', 'Modern Gradient'];
    const p = profs[idx % profs.length];
    const s = styles[idx % styles.length];
    const isVert = idx % 2 === 0;

    return {
      id: `id-design-${num}`,
      name: `${p} ID Badge ${num}`,
      slug: `id-card-${p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${num}`,
      parentProductSlug: 'id-card-custom',
      category: 'Stationery',
      profession: p,
      styleTag: s,
      description: `High-durability thermal PVC identity card for ${p} with employee photo slot, barcode/QR code, and emergency contact details.`,
      frontImage: `/templates/id/${num}/front_ref.png`,
      backImage: `/templates/id/${num}/back_ref.png`,
      templateIndex: idx,
      startingPrice: 45,
      unitLabel: 'per card (from ₹45/unit)',
      moq: 10,
      isPopular: idx === 0 || idx === 2 || idx === 7,
      isTrending: idx === 4 || idx === 10,
      orientation: isVert ? 'vertical' : 'horizontal',
      dimensions: 'CR80 (85.6 x 54.0 mm) 30 Mil',
      paperStock: '100% Solid Thermoplastic PVC with UV Guard',
      features: ['Credit Card Thickness (0.76mm)', 'Waterproof & Fade Resistant', 'Pre-Punched Slot for Lanyard', 'High-Res Photo & QR Reproduction']
    };
  }),

  // ─── WEDDING CARDS (30 Designs) ────────────────────────────
  ...Array.from({ length: 30 }, (_, idx): SubProductDesign => {
    const num = pad2(idx + 1);
    const profs = ['Royal Traditional', 'Floral Botanical', 'Modern Minimal', 'Monogram Luxury', 'Destination'];
    const styles = ['Gold Mandala', 'Emerald Royal', 'Crimson Classic', 'Pastel Blossom', 'Kraft Rustic'];
    const p = profs[idx % profs.length];
    const s = styles[idx % styles.length];

    return {
      id: `wc-design-${num}`,
      name: `${p} Invitation Suite ${num}`,
      slug: `wedding-card-${p.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${num}`,
      parentProductSlug: 'wedding-card-custom',
      category: 'Stationery',
      profession: p,
      styleTag: s,
      description: `Exquisite Indian wedding ceremony invitation with ${s.toLowerCase()} elements, Sanskrit shloka headers, and personalized family details.`,
      frontImage: `/templates/wc/${num}/front.jpg`,
      templateIndex: idx,
      startingPrice: 28,
      unitLabel: 'per invite (from ₹1,400/50)',
      moq: 50,
      isPopular: idx === 0 || idx === 2 || idx === 6,
      isTrending: idx === 1 || idx === 5,
      orientation: 'vertical',
      dimensions: '7.5" x 5.5" (Standard Envelope Fit)',
      paperStock: '300 GSM Shimmer Metallic Pearl Cardstock',
      features: ['Matching Designer Envelopes Included', 'Rich Gold Foil Stamping Available', 'Bilingual English/Hindi Content', 'Free Digital PDF Invitation Card']
    };
  }),

  // ─── STICKERS & LABELS (6 Designs) ─────────────────────────
  {
    id: 'sticker-square-vinyl',
    name: 'Square Vinyl Box & Packaging Sticker',
    slug: 'square-vinyl-packaging-sticker',
    parentProductSlug: 'pvc-sticker-1000',
    category: 'Stationery',
    profession: 'Product Packaging',
    styleTag: 'Square & Rectangle',
    description: 'Crisp square stickers with scratchproof gloss coating. Perfect for shipping boxes, product cartons, and takeaway bags.',
    frontImage: '/images/products/box.png',
    templateIndex: 0,
    startingPrice: 0.85,
    unitLabel: 'per sticker (from ₹850/1000)',
    moq: 1000,
    isPopular: true,
    orientation: 'square',
    dimensions: '2" x 2" / 3" x 3"',
    paperStock: 'Self-Adhesive 120 GSM PVC Vinyl with Silicon Release Liner',
    features: ['Waterproof & Tear-Resistant', 'Permanent High-Tack Adhesive', 'Easy Peel Backing', 'Full Color CMYK UV Print']
  },
  {
    id: 'sticker-circle-label',
    name: 'Round Circle Jar & Cosmetic Label',
    slug: 'round-circle-jar-cosmetic-label',
    parentProductSlug: 'pvc-sticker-1000',
    category: 'Stationery',
    profession: 'Cosmetics & Jars',
    styleTag: 'Circle / Round',
    description: 'Circular branding labels designed for candle jars, cosmetic bottles, honey jars, and seal envelopes.',
    frontImage: '/images/products/bottle.png',
    templateIndex: 1,
    startingPrice: 0.90,
    unitLabel: 'per sticker (from ₹900/1000)',
    moq: 1000,
    isTrending: true,
    orientation: 'circle',
    dimensions: '2" / 2.5" / 3" Diameter',
    paperStock: 'Waterproof Gloss White Vinyl',
    features: ['Precision Kiss-Cut on Sheets', 'Resistant to Oil & Moisture', 'Vibrant Gloss or Soft Matte Finish', 'Available in Transparent Clear Option']
  },
  {
    id: 'sticker-die-cut-custom',
    name: 'Custom Shape Die-Cut Vinyl Sticker',
    slug: 'custom-shape-die-cut-vinyl-sticker',
    parentProductSlug: 'pvc-sticker-1000',
    category: 'Stationery',
    profession: 'Branding & Swag',
    styleTag: 'Custom Die-Cut',
    description: 'Cut precisely to the exact silhouette of your artwork, logo, or mascot with an easy-peel white border.',
    frontImage: '/images/products/box.png',
    templateIndex: 2,
    startingPrice: 1.20,
    unitLabel: 'per sticker (from ₹1,200/1000)',
    moq: 500,
    isNew: true,
    orientation: 'square',
    dimensions: 'Custom Fit (Up to 4" x 4")',
    paperStock: 'Heavy-Duty 150 Micron Outdoor Vinyl',
    features: ['Cut to Any Custom Silhouette', 'UV Sun-Proof Non-Fading Ink', 'Laptop, Phone & Helmet Safe', 'Leaves No Sticky Residue When Removed']
  },

  // ─── BILL BOOKS (4 Designs) ────────────────────────────────
  {
    id: 'bill-book-gst-triplicate',
    name: 'GST 3-Ply Carbonless Tax Invoice Book',
    slug: 'gst-3-ply-carbonless-tax-invoice-book',
    parentProductSlug: 'bill-book',
    category: 'Stationery',
    profession: 'GST Tax Invoice',
    styleTag: '3-Ply Triplicate',
    description: 'Official GST tax invoice book with Original for Buyer, Duplicate for Transporter, and Triplicate for Supplier.',
    frontImage: '/images/products/bill-book.jpg',
    templateIndex: 0,
    startingPrice: 220,
    unitLabel: 'per book (50 sets x 3 ply)',
    moq: 5,
    isPopular: true,
    orientation: 'vertical',
    dimensions: 'A4 / A5 (Standard)',
    paperStock: 'Premium NCR Paper (White / Pink / Yellow)',
    features: ['Instant Carbonless Impression', 'Pre-Printed Consecutive Serial Numbers', 'Perforated for Clean Tear-Off', 'Hardboard Backing for Writing Comfort']
  },
  {
    id: 'bill-book-cash-memo-duplicate',
    name: 'Retail Store 2-Ply Cash Memo Book',
    slug: 'retail-store-2-ply-cash-memo-book',
    parentProductSlug: 'bill-book',
    category: 'Stationery',
    profession: 'Retail Cash Memo',
    styleTag: '2-Ply Duplicate',
    description: 'Compact 2-ply cash receipt book with customized store header, GST number, terms of sale, and customer signature block.',
    frontImage: '/images/products/bill-book.jpg',
    templateIndex: 1,
    startingPrice: 160,
    unitLabel: 'per book (50 sets x 2 ply)',
    moq: 5,
    orientation: 'vertical',
    dimensions: 'A5 (148 x 210 mm)',
    paperStock: 'NCR Carbonless (White & Pink)',
    features: ['High-Contrast Crisp Copy', 'Custom Shop Logo & Terms', 'Stitch-Bound with Kraft Cover', 'Available in 50 & 100 Set Formats']
  },

  // ─── APPAREL & T-SHIRTS (4 Designs) ────────────────────────
  {
    id: 'apparel-classic-crewneck',
    name: 'Executive Combed Cotton Crewneck T-Shirt',
    slug: 'executive-combed-cotton-crewneck-tshirt',
    parentProductSlug: 'custom-premium-tshirt',
    category: 'Apparel',
    profession: 'Corporate Uniforms',
    styleTag: 'Crewneck Classic',
    description: '220 GSM 100% bio-washed cotton t-shirt with lycra ribbed collar and double-stitched hem.',
    frontImage: '/images/products/tshirt.png',
    templateIndex: 0,
    startingPrice: 380,
    unitLabel: 'per t-shirt (Min. 10)',
    moq: 10,
    isPopular: true,
    orientation: 'vertical',
    dimensions: 'Sizes S to 3XL',
    paperStock: '100% Super-Combed Bio-Washed Cotton',
    features: ['Zero Color Bleed Guaranteed', 'Breathable All-Day Comfort', 'HD DTF or Screen Print on Chest & Back', 'Available in 12+ Color Shades']
  },
  {
    id: 'apparel-heavyweight-hoodie',
    name: 'Luxury 400 GSM Fleece Pullover Hoodie',
    slug: 'luxury-400-gsm-fleece-pullover-hoodie',
    parentProductSlug: 'premium-heavyweight-hoodie',
    category: 'Apparel',
    profession: 'Startup Merch',
    styleTag: 'Heavyweight Hoodie',
    description: 'Ultra-plush brushed fleece hoodie with double-layer hood, kangaroo pocket, and heavy matching drawstrings.',
    frontImage: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=1000&auto=format',
    templateIndex: 0,
    startingPrice: 1250,
    unitLabel: 'per hoodie (Min. 10)',
    moq: 10,
    isTrending: true,
    orientation: 'vertical',
    dimensions: 'Sizes S to XXL',
    paperStock: '400 GSM Heavyweight Fleece',
    features: ['Warm Brushed Cotton Interior', 'High-Density Puff Print or Embroidery', 'Double-Lined Hood with Eyelets', 'Pre-Shrunk Luxury Finish']
  },

  // ─── DRINKWARE (3 Designs) ─────────────────────────────────
  {
    id: 'mug-classic-white',
    name: '11oz AAA Gloss Ceramic Coffee Mug',
    slug: '11oz-aaa-gloss-ceramic-coffee-mug',
    parentProductSlug: 'premium-coffee-mug',
    category: 'Drinkware',
    profession: 'Corporate Gifts',
    styleTag: 'Classic White Ceramic',
    description: 'Vibrant edge-to-edge sublimation printing on premium AAA grade dishwasher-safe ceramic.',
    frontImage: '/images/products/mug.png',
    templateIndex: 0,
    startingPrice: 140,
    unitLabel: 'per mug (Min. 20)',
    moq: 20,
    isPopular: true,
    orientation: 'square',
    dimensions: '11oz (325 ml)',
    paperStock: 'High-Fired Glazed Ceramic',
    features: ['Microwave & Dishwasher Safe', 'Vibrant Edge-to-Edge Color', 'Individual White Gift Box Included', 'Scratch-Proof Sublimation Glaze']
  },
  {
    id: 'bottle-temp-sipper',
    name: 'LED Smart Temperature Stainless Steel Flask',
    slug: 'led-smart-temperature-stainless-steel-flask',
    parentProductSlug: 'bottle-custom',
    category: 'Drinkware',
    profession: 'Client Giveaways',
    styleTag: 'Stainless Steel Flask',
    description: 'Double-walled vacuum insulated 500ml flask with smart digital LED touch temperature display and laser engraved brand logo.',
    frontImage: '/images/products/bottle.png',
    templateIndex: 0,
    startingPrice: 380,
    unitLabel: 'per bottle (Min. 20)',
    moq: 20,
    isTrending: true,
    orientation: 'vertical',
    dimensions: '500 ml Capacity',
    paperStock: 'Food-Grade 304 Stainless Steel',
    features: ['Keeps Hot & Cold for 12+ Hours', 'Smart Touch LED Display on Cap', 'Permanent Laser Engraving', 'Leak-Proof Silicone Seal']
  }
];

export interface PrintAsiaCategoryItem {
  id: string;
  title: string;
  count: number;
  image: string;
  parentProductSlug: string;
  professionFilter?: string;
  tagline: string;
  group: 'Professionals' | 'Retails & Services' | 'Business & Real Estate' | 'Stationery & Merch';
  startingPrice: number;
}

export const PRINTASIA_CATEGORIES: PrintAsiaCategoryItem[] = [
  // ─── PROFESSIONALS ─────────────────────────────────────────
  {
    id: 'finance',
    title: 'Finance',
    count: 81,
    image: '/images/categories/finance.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Corporate & Finance',
    tagline: 'Accountants, Banking, Wealth Managers & Advisors',
    group: 'Professionals',
    startingPrice: 299
  },
  {
    id: 'advocate',
    title: 'Advocate',
    count: 58,
    image: '/images/categories/advocate.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Advocate & Legal',
    tagline: 'Lawyers, Notaries, Legal Advocates & High Court Attys',
    group: 'Professionals',
    startingPrice: 299
  },
  {
    id: 'ca',
    title: 'CA',
    count: 81,
    image: '/images/categories/ca.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Chartered Accountant',
    tagline: 'Chartered Accountants, Tax Auditors & Financial Planners',
    group: 'Professionals',
    startingPrice: 299
  },
  {
    id: 'lic-agent',
    title: 'LIC Agent',
    count: 107,
    image: '/images/categories/lic-agent.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Corporate & Finance',
    tagline: 'Life Insurance Corporation, Health & Motor Advisors',
    group: 'Professionals',
    startingPrice: 299
  },
  {
    id: 'doctor',
    title: 'Doctor',
    count: 23,
    image: '/images/categories/doctor.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Doctor & Clinic',
    tagline: 'Physicians, Surgeons, Pediatricians & Specialists',
    group: 'Professionals',
    startingPrice: 299
  },
  {
    id: 'dentist',
    title: 'Dentist',
    count: 29,
    image: '/images/categories/dentist.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Doctor & Clinic',
    tagline: 'Dental Surgeons, Orthodontists & Smile Clinics',
    group: 'Professionals',
    startingPrice: 299
  },
  {
    id: 'cs',
    title: 'CS',
    count: 53,
    image: '/images/categories/cs.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Chartered Accountant',
    tagline: 'Corporate Governance, Compliance & Legal CS',
    group: 'Professionals',
    startingPrice: 299
  },

  // ─── RETAILS & SERVICES ────────────────────────────────────
  {
    id: 'boutique',
    title: 'Boutique',
    count: 29,
    image: '/images/categories/boutique.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Retail & Shop',
    tagline: 'Fashion Boutiques, Couture & Designer Outlets',
    group: 'Retails & Services',
    startingPrice: 299
  },
  {
    id: 'astrologer',
    title: 'Astrologer',
    count: 28,
    image: '/images/categories/astrologer.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Luxury & Gold',
    tagline: 'Jyotish, Tarot Readers, Vastu & Numerology',
    group: 'Retails & Services',
    startingPrice: 299
  },
  {
    id: 'medical-store',
    title: 'Medical Store',
    count: 9,
    image: '/images/categories/medical-store.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Doctor & Clinic',
    tagline: 'Pharmacies, Chemists & Medical Distributors',
    group: 'Retails & Services',
    startingPrice: 299
  },
  {
    id: 'jewellery',
    title: 'Jewellery',
    count: 45,
    image: '/images/categories/jewellery.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Luxury & Gold',
    tagline: 'Gold, Diamond & Silver Jewelry Showrooms',
    group: 'Retails & Services',
    startingPrice: 299
  },
  {
    id: 'catering',
    title: 'Catering',
    count: 28,
    image: '/images/categories/catering.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Retail & Shop',
    tagline: 'Wedding Catering, Food Trucks & Event Banquets',
    group: 'Retails & Services',
    startingPrice: 299
  },
  {
    id: 'beauty-parlour',
    title: 'Beauty Parlour',
    count: 20,
    image: '/images/categories/beauty-parlour.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Retail & Shop',
    tagline: 'Salons, Spa, Bridal Makeover & Hair Stylists',
    group: 'Retails & Services',
    startingPrice: 299
  },
  {
    id: 'mobile-store',
    title: 'Mobile Store',
    count: 39,
    image: '/images/categories/mobile-store.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Tech & Creative',
    tagline: 'Smartphone Sales, Gadgets & Repair Centers',
    group: 'Retails & Services',
    startingPrice: 299
  },

  // ─── BUSINESS & REAL ESTATE ────────────────────────────────
  {
    id: 'construction',
    title: 'Construction',
    count: 20,
    image: '/images/categories/construction.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Corporate & Finance',
    tagline: 'Civil Contractors, Builders, Architects & Engineers',
    group: 'Business & Real Estate',
    startingPrice: 299
  },
  {
    id: 'property-dealer',
    title: 'Property Dealer',
    count: 38,
    image: '/images/categories/property-dealer.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Corporate & Finance',
    tagline: 'Real Estate Brokers, Plot & Flat Consultants',
    group: 'Business & Real Estate',
    startingPrice: 299
  },
  {
    id: 'travel-agent',
    title: 'Travel Agent',
    count: 48,
    image: '/images/categories/travel-agent.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Corporate & Finance',
    tagline: 'Tour Operators, Ticket Booking & Holidays',
    group: 'Business & Real Estate',
    startingPrice: 299
  },
  {
    id: 'indian-god',
    title: 'Indian God',
    count: 24,
    image: '/images/categories/indian-god.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Luxury & Gold',
    tagline: 'Ganesh, Shiva, Krishna & Spiritual Emblems',
    group: 'Business & Real Estate',
    startingPrice: 299
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    count: 21,
    image: '/images/categories/real-estate.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Corporate & Finance',
    tagline: 'Commercial Properties, Township & Infrastructure',
    group: 'Business & Real Estate',
    startingPrice: 299
  },
  {
    id: 'creative',
    title: 'Creative',
    count: 20,
    image: '/images/categories/creative.png',
    parentProductSlug: 'business-card-custom',
    professionFilter: 'Tech & Creative',
    tagline: 'Graphic Designers, Photographers & Studios',
    group: 'Business & Real Estate',
    startingPrice: 299
  },

  // ─── STATIONERY & MERCHANDISE ──────────────────────────────
  {
    id: 'letterheads',
    title: 'Letterheads',
    count: 30,
    image: '/images/products/letterhead.png',
    parentProductSlug: 'letter-head-custom',
    tagline: 'Official Executive Letterheads for Companies & Advocates',
    group: 'Stationery & Merch',
    startingPrice: 350
  },
  {
    id: 'id-cards',
    title: 'PVC ID Cards',
    count: 29,
    image: '/images/products/id-card-front.png',
    parentProductSlug: 'id-card-custom',
    tagline: 'Heavy-Duty CR80 ID Badges for Staff & Students',
    group: 'Stationery & Merch',
    startingPrice: 45
  },
  {
    id: 'wedding-cards',
    title: 'Wedding Cards',
    count: 30,
    image: '/images/products/wedding-card.png',
    parentProductSlug: 'wedding-card-custom',
    tagline: 'Royal Traditional & Contemporary Wedding Invitations',
    group: 'Stationery & Merch',
    startingPrice: 1400
  },
  {
    id: 'stickers',
    title: 'Stickers & Labels',
    count: 12,
    image: '/images/products/box.png',
    parentProductSlug: 'pvc-sticker-1000',
    tagline: 'Die-Cut Waterproof Vinyl Stickers & Packaging Labels',
    group: 'Stationery & Merch',
    startingPrice: 850
  },
  {
    id: 'bill-books',
    title: 'Bill Books',
    count: 8,
    image: '/images/products/bill-book.jpg',
    parentProductSlug: 'bill-book',
    tagline: 'Carbonless Duplicate Invoices & Cash Memos',
    group: 'Stationery & Merch',
    startingPrice: 160
  },
  {
    id: 'apparel',
    title: 'Custom T-Shirts',
    count: 8,
    image: '/images/products/tshirt.png',
    parentProductSlug: 'custom-premium-tshirt',
    tagline: '100% Cotton Branded T-Shirts & Team Apparel',
    group: 'Stationery & Merch',
    startingPrice: 380
  },
  {
    id: 'mugs',
    title: 'Custom Mugs',
    count: 8,
    image: '/images/products/mug.png',
    parentProductSlug: 'premium-coffee-mug',
    tagline: 'Ceramic Photo Mugs & Temperature Water Bottles',
    group: 'Stationery & Merch',
    startingPrice: 140
  }
];

// Active dynamic data (prefers custom overrides if saved via Admin)
export const ACTIVE_PARENT_PRODUCTS: ParentProductInfo[] = 
  (customConfig?.parentProducts && customConfig.parentProducts.length > 0 
    ? customConfig.parentProducts 
    : PARENT_PRODUCTS) as ParentProductInfo[];

export const ACTIVE_SUB_PRODUCTS: SubProductDesign[] = 
  (customConfig?.subProducts && customConfig.subProducts.length > 0 
    ? customConfig.subProducts 
    : SUB_PRODUCTS_DATA) as SubProductDesign[];

export const ACTIVE_CATEGORIES: PrintAsiaCategoryItem[] = 
  (customConfig?.categories && customConfig.categories.length > 0 
    ? customConfig.categories 
    : PRINTASIA_CATEGORIES) as PrintAsiaCategoryItem[];

// Helper functions for easy querying
export function getParentProducts(): ParentProductInfo[] {
  return ACTIVE_PARENT_PRODUCTS;
}

export function getParentProductBySlug(slug: string): ParentProductInfo | undefined {
  return ACTIVE_PARENT_PRODUCTS.find(p => p.slug === slug || (slug.includes('business-card') && p.slug === 'business-card-custom') || (slug.includes('letter-head') && p.slug === 'letter-head-custom') || (slug.includes('id-card') && p.slug === 'id-card-custom') || (slug.includes('wedding-card') && p.slug === 'wedding-card-custom'));
}

export function getSubProductsForParent(parentSlug: string): SubProductDesign[] {
  return ACTIVE_SUB_PRODUCTS.filter(s => {
    if (s.parentProductSlug === parentSlug) return true;
    if (parentSlug.includes('business-card') && s.parentProductSlug === 'business-card-custom') return true;
    if (parentSlug.includes('letter-head') && s.parentProductSlug === 'letter-head-custom') return true;
    if (parentSlug.includes('id-card') && s.parentProductSlug === 'id-card-custom') return true;
    if (parentSlug.includes('wedding-card') && s.parentProductSlug === 'wedding-card-custom') return true;
    return false;
  });
}

export function getSubProductById(id: string): SubProductDesign | undefined {
  return ACTIVE_SUB_PRODUCTS.find(s => s.id === id || s.slug === id);
}

export function searchSubProducts(
  query: string,
  parentSlug?: string,
  profession?: string,
  styleTag?: string
): SubProductDesign[] {
  let list = parentSlug ? getSubProductsForParent(parentSlug) : ACTIVE_SUB_PRODUCTS;
  
  if (profession && profession !== 'All') {
    list = list.filter(item => item.profession.toLowerCase().includes(profession.toLowerCase()));
  }
  
  if (styleTag && styleTag !== 'All') {
    list = list.filter(item => item.styleTag.toLowerCase() === styleTag.toLowerCase());
  }
  
  if (query.trim()) {
    const q = query.toLowerCase().trim();
    list = list.filter(item => 
      item.name.toLowerCase().includes(q) ||
      item.profession.toLowerCase().includes(q) ||
      item.styleTag.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q)
    );
  }
  
  return list;
}

export function getPrintAsiaCategories(): PrintAsiaCategoryItem[] {
  return ACTIVE_CATEGORIES;
}

export function getPrintAsiaCategoryById(id: string): PrintAsiaCategoryItem | undefined {
  return ACTIVE_CATEGORIES.find(c => c.id === id);
}
