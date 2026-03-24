import { Product } from '../supabase/types';

// ── Helper to encode SVG into a data URI ────────────────────────────────
const svgUri = (svg: string) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;

// ── T-SHIRT ─────────────────────────────────────────────────────────────
export const TSHIRT_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 625" width="500" height="625">' +
  '<path d="M 180 50 Q 250 75 320 50" fill="#f0f0f0" stroke="#000" stroke-width="1"/>' +
  '<path d="M 180 50 Q 250 100 320 50 L 410 80 L 480 180 L 380 230 L 380 580 L 120 580 L 120 230 L 20 180 L 90 80 Z" fill="#fff" stroke="#000" stroke-width="1" stroke-linejoin="round"/>' +
  '<path d="M 175 48 Q 250 108 325 48" fill="none" stroke="#e0e0e0" stroke-width="6"/>' +
  '<path d="M 175 48 Q 250 108 325 48" fill="none" stroke="#000" stroke-width="1"/>' +
  '<path d="M 90 80 Q 120 150 120 230" fill="none" stroke="#000" stroke-width="1"/>' +
  '<path d="M 410 80 Q 380 150 380 230" fill="none" stroke="#000" stroke-width="1"/>' +
  '<path d="M 33 173 L 105 130" fill="none" stroke="#ccc" stroke-width="1" stroke-dasharray="2,2"/>' +
  '<path d="M 467 173 L 395 130" fill="none" stroke="#ccc" stroke-width="1" stroke-dasharray="2,2"/>' +
  '<path d="M 120 565 L 380 565" fill="none" stroke="#ccc" stroke-width="1" stroke-dasharray="2,2"/>' +
  '<path d="M 120 570 L 380 570" fill="none" stroke="#ccc" stroke-width="1" stroke-dasharray="2,2"/>' +
  '</svg>'
);

export const TSHIRT_BACK_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 625" width="500" height="625">' +
  // Outline (Same as front)
  '<path d="M 180 50 Q 250 70 320 50 L 410 80 L 480 180 L 380 230 L 380 580 L 120 580 L 120 230 L 20 180 L 90 80 Z" fill="#fff" stroke="#000" stroke-width="1.2" stroke-linejoin="round"/>' +
  // Higher neckline for back
  '<path d="M 180 50 Q 250 70 320 50" fill="none" stroke="#000" stroke-width="1"/>' +
  // Shoulder seams
  '<path d="M 90 80 Q 120 150 120 230" fill="none" stroke="#000" stroke-width="1"/>' +
  '<path d="M 410 80 Q 380 150 380 230" fill="none" stroke="#000" stroke-width="1"/>' +
  // "BACK" indicator (subtle)
  '<text x="250" y="320" text-anchor="middle" font-size="24" fill="#eee" font-family="sans-serif" font-weight="bold" opacity="0.3">BACK SIDE</text>' +
  '</svg>'
);

// ── MUG ─────────────────────────────────────────────────────────────────
export const MUG_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">' +
  '<rect x="80" y="100" width="280" height="320" rx="18" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // rim
  '<ellipse cx="220" cy="100" rx="140" ry="22" fill="#f5f5f5" stroke="#000" stroke-width="1.5"/>' +
  // bottom
  '<ellipse cx="220" cy="420" rx="140" ry="18" fill="#f5f5f5" stroke="#000" stroke-width="1.5"/>' +
  // handle
  '<path d="M 360 180 C 420 180 440 260 440 300 C 440 340 420 380 360 380" fill="none" stroke="#000" stroke-width="1.5"/>' +
  // print area dashed
  '<rect x="110" y="160" width="220" height="200" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="220" y="268" text-anchor="middle" font-size="11" fill="#bbb" font-family="sans-serif">PRINT AREA</text>' +
  '</svg>'
);

// ── NOTEBOOK / DIARY ────────────────────────────────────────────────────
export const NOTEBOOK_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 625" width="500" height="625">' +
  // cover
  '<rect x="80" y="40" width="340" height="545" rx="8" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // spine
  '<line x1="110" y1="40" x2="110" y2="585" stroke="#000" stroke-width="1.5"/>' +
  // binding rings
  '<circle cx="110" cy="100" r="8" fill="none" stroke="#999" stroke-width="1.2"/>' +
  '<circle cx="110" cy="180" r="8" fill="none" stroke="#999" stroke-width="1.2"/>' +
  '<circle cx="110" cy="260" r="8" fill="none" stroke="#999" stroke-width="1.2"/>' +
  '<circle cx="110" cy="340" r="8" fill="none" stroke="#999" stroke-width="1.2"/>' +
  '<circle cx="110" cy="420" r="8" fill="none" stroke="#999" stroke-width="1.2"/>' +
  '<circle cx="110" cy="500" r="8" fill="none" stroke="#999" stroke-width="1.2"/>' +
  // cover design area
  '<rect x="140" y="80" width="250" height="465" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="265" y="318" text-anchor="middle" font-size="11" fill="#bbb" font-family="sans-serif">COVER DESIGN AREA</text>' +
  '</svg>'
);

// ── POUCH / BAG ─────────────────────────────────────────────────────────
export const POUCH_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">' +
  // body
  '<path d="M 60 130 L 60 420 Q 60 440 80 440 L 420 440 Q 440 440 440 420 L 440 130 Q 440 110 420 110 L 80 110 Q 60 110 60 130 Z" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // zipper
  '<line x1="60" y1="140" x2="440" y2="140" stroke="#000" stroke-width="1.5"/>' +
  '<rect x="230" y="132" width="40" height="16" rx="4" fill="#eee" stroke="#000" stroke-width="1"/>' +
  // print area
  '<rect x="100" y="175" width="300" height="230" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="250" y="295" text-anchor="middle" font-size="11" fill="#bbb" font-family="sans-serif">PRINT AREA</text>' +
  '</svg>'
);

// ── CALENDAR ────────────────────────────────────────────────────────────
export const CALENDAR_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 625" width="500" height="625">' +
  // page
  '<rect x="60" y="60" width="380" height="505" rx="6" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // top bar
  '<rect x="60" y="60" width="380" height="60" rx="6" fill="#f5f5f5" stroke="#000" stroke-width="1.5"/>' +
  // binding holes
  '<circle cx="150" cy="60" r="8" fill="#fff" stroke="#000" stroke-width="1"/>' +
  '<circle cx="250" cy="60" r="8" fill="#fff" stroke="#000" stroke-width="1"/>' +
  '<circle cx="350" cy="60" r="8" fill="#fff" stroke="#000" stroke-width="1"/>' +
  // month label
  '<text x="250" y="97" text-anchor="middle" font-size="16" fill="#555" font-family="sans-serif" font-weight="bold">MONTH</text>' +
  // grid lines
  '<line x1="60" y1="160" x2="440" y2="160" stroke="#ddd" stroke-width="1"/>' +
  '<line x1="60" y1="230" x2="440" y2="230" stroke="#ddd" stroke-width="1"/>' +
  '<line x1="60" y1="300" x2="440" y2="300" stroke="#ddd" stroke-width="1"/>' +
  '<line x1="60" y1="370" x2="440" y2="370" stroke="#ddd" stroke-width="1"/>' +
  '<line x1="60" y1="440" x2="440" y2="440" stroke="#ddd" stroke-width="1"/>' +
  // vertical grid
  '<line x1="114" y1="120" x2="114" y2="565" stroke="#ddd" stroke-width="1"/>' +
  '<line x1="168" y1="120" x2="168" y2="565" stroke="#ddd" stroke-width="1"/>' +
  '<line x1="222" y1="120" x2="222" y2="565" stroke="#ddd" stroke-width="1"/>' +
  '<line x1="276" y1="120" x2="276" y2="565" stroke="#ddd" stroke-width="1"/>' +
  '<line x1="330" y1="120" x2="330" y2="565" stroke="#ddd" stroke-width="1"/>' +
  '<line x1="384" y1="120" x2="384" y2="565" stroke="#ddd" stroke-width="1"/>' +
  // print area
  '<rect x="80" y="130" width="340" height="420" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '</svg>'
);

// ── CARD (Wedding / Invitation) ─────────────────────────────────────────
export const CARD_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 625" width="500" height="625">' +
  // card
  '<rect x="50" y="60" width="400" height="505" rx="4" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // fold line
  '<line x1="50" y1="312" x2="450" y2="312" stroke="#ccc" stroke-width="1" stroke-dasharray="4,4"/>' +
  // decorative border (inner)
  '<rect x="70" y="80" width="360" height="465" rx="2" fill="none" stroke="#ddd" stroke-width="1"/>' +
  '<rect x="80" y="90" width="340" height="445" rx="2" fill="none" stroke="#eee" stroke-width="1"/>' +
  // print area
  '<rect x="100" y="110" width="300" height="400" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="250" y="318" text-anchor="middle" font-size="11" fill="#bbb" font-family="sans-serif">DESIGN AREA</text>' +
  '</svg>'
);

// ── BUSINESS CARD ───────────────────────────────────────────────────────
export const BUSINESS_CARD_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 310" width="500" height="310">' +
  // card outline
  '<rect x="30" y="20" width="440" height="270" rx="10" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // corner marks
  '<line x1="50" y1="40" x2="65" y2="40" stroke="#ccc" stroke-width="1"/>' +
  '<line x1="50" y1="40" x2="50" y2="55" stroke="#ccc" stroke-width="1"/>' +
  '<line x1="450" y1="40" x2="435" y2="40" stroke="#ccc" stroke-width="1"/>' +
  '<line x1="450" y1="40" x2="450" y2="55" stroke="#ccc" stroke-width="1"/>' +
  '<line x1="50" y1="270" x2="65" y2="270" stroke="#ccc" stroke-width="1"/>' +
  '<line x1="50" y1="270" x2="50" y2="255" stroke="#ccc" stroke-width="1"/>' +
  '<line x1="450" y1="270" x2="435" y2="270" stroke="#ccc" stroke-width="1"/>' +
  '<line x1="450" y1="270" x2="450" y2="255" stroke="#ccc" stroke-width="1"/>' +
  // print area
  '<rect x="60" y="50" width="380" height="210" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="250" y="160" text-anchor="middle" font-size="11" fill="#bbb" font-family="sans-serif">PRINT AREA (3.5 x 2 in)</text>' +
  '</svg>'
);

// ── BOX / KIT ───────────────────────────────────────────────────────────
export const BOX_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">' +
  // front face
  '<path d="M 80 200 L 80 430 L 380 430 L 380 200 Z" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // top face (3D)
  '<path d="M 80 200 L 160 130 L 460 130 L 380 200 Z" fill="#f5f5f5" stroke="#000" stroke-width="1.5"/>' +
  // right face (3D)
  '<path d="M 380 200 L 460 130 L 460 360 L 380 430 Z" fill="#ebebeb" stroke="#000" stroke-width="1.5"/>' +
  // flap line
  '<line x1="80" y1="200" x2="380" y2="200" stroke="#ccc" stroke-width="1" stroke-dasharray="4,4"/>' +
  // print area on front
  '<rect x="110" y="230" width="240" height="170" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="230" y="322" text-anchor="middle" font-size="11" fill="#bbb" font-family="sans-serif">LOGO / DESIGN AREA</text>' +
  '</svg>'
);

// ── HEADPHONE ───────────────────────────────────────────────────────────
export const HEADPHONE_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">' +
  // headband
  '<path d="M 130 250 Q 130 80 250 80 Q 370 80 370 250" fill="none" stroke="#000" stroke-width="4"/>' +
  // headband padding
  '<path d="M 200 100 Q 250 85 300 100" fill="none" stroke="#000" stroke-width="8" stroke-linecap="round"/>' +
  // left ear cup
  '<rect x="95" y="230" width="70" height="110" rx="20" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  '<rect x="108" y="248" width="44" height="74" rx="12" fill="#f5f5f5" stroke="#000" stroke-width="1"/>' +
  // left pad
  '<rect x="80" y="245" width="20" height="80" rx="10" fill="#eee" stroke="#000" stroke-width="1.2"/>' +
  // right ear cup
  '<rect x="335" y="230" width="70" height="110" rx="20" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  '<rect x="348" y="248" width="44" height="74" rx="12" fill="#f5f5f5" stroke="#000" stroke-width="1"/>' +
  // right pad
  '<rect x="400" y="245" width="20" height="80" rx="10" fill="#eee" stroke="#000" stroke-width="1.2"/>' +
  // print area on right cup
  '<rect x="345" y="250" width="50" height="50" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="4,3"/>' +
  '<text x="370" y="280" text-anchor="middle" font-size="8" fill="#bbb" font-family="sans-serif">LOGO</text>' +
  '</svg>'
);

// ── TOTE BAG ────────────────────────────────────────────────────────────
export const TOTE_BAG_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 600" width="500" height="600">' +
  // handles
  '<path d="M 150 130 Q 150 50 200 50 L 200 130" fill="none" stroke="#000" stroke-width="3"/>' +
  '<path d="M 300 130 Q 300 50 350 50 L 350 130" fill="none" stroke="#000" stroke-width="3"/>' +
  // bag body
  '<path d="M 70 130 L 70 540 Q 70 560 90 560 L 410 560 Q 430 560 430 540 L 430 130 Z" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // top fold
  '<line x1="70" y1="160" x2="430" y2="160" stroke="#ddd" stroke-width="1"/>' +
  // print area
  '<rect x="110" y="200" width="280" height="300" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="250" y="355" text-anchor="middle" font-size="11" fill="#bbb" font-family="sans-serif">PRINT AREA</text>' +
  '</svg>'
);

// ── ID CARD ─────────────────────────────────────────────────────────────
export const ID_CARD_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 560" width="400" height="560">' +
  // lanyard hole
  '<ellipse cx="200" cy="30" rx="20" ry="12" fill="none" stroke="#000" stroke-width="1.5"/>' +
  // card body
  '<rect x="40" y="50" width="320" height="480" rx="12" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // top banner
  '<rect x="40" y="50" width="320" height="70" rx="12" fill="#f5f5f5" stroke="#000" stroke-width="1.5"/>' +
  '<rect x="40" y="100" width="320" height="20" fill="#f5f5f5"/>' +
  // photo placeholder
  '<rect x="140" y="150" width="120" height="140" rx="8" fill="#f0f0f0" stroke="#ccc" stroke-width="1"/>' +
  '<text x="200" y="225" text-anchor="middle" font-size="10" fill="#bbb" font-family="sans-serif">PHOTO</text>' +
  // name line
  '<rect x="100" y="320" width="200" height="14" rx="4" fill="#eee"/>' +
  // title line
  '<rect x="130" y="350" width="140" height="10" rx="4" fill="#eee"/>' +
  // barcode area
  '<rect x="110" y="420" width="180" height="50" rx="4" fill="#f5f5f5" stroke="#ddd" stroke-width="1"/>' +
  // design area
  '<rect x="60" y="60" width="280" height="50" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="200" y="90" text-anchor="middle" font-size="9" fill="#bbb" font-family="sans-serif">COMPANY LOGO AREA</text>' +
  '</svg>'
);

// ── LETTERHEAD ──────────────────────────────────────────────────────────
export const LETTERHEAD_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 650" width="500" height="650">' +
  // paper
  '<rect x="50" y="20" width="400" height="610" rx="2" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // header area
  '<rect x="70" y="40" width="360" height="70" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="250" y="82" text-anchor="middle" font-size="11" fill="#bbb" font-family="sans-serif">COMPANY HEADER / LOGO</text>' +
  // text lines
  '<rect x="70" y="140" width="360" height="8" rx="2" fill="#f0f0f0"/>' +
  '<rect x="70" y="160" width="340" height="8" rx="2" fill="#f0f0f0"/>' +
  '<rect x="70" y="180" width="300" height="8" rx="2" fill="#f0f0f0"/>' +
  '<rect x="70" y="200" width="360" height="8" rx="2" fill="#f0f0f0"/>' +
  '<rect x="70" y="220" width="280" height="8" rx="2" fill="#f0f0f0"/>' +
  '<rect x="70" y="240" width="350" height="8" rx="2" fill="#f0f0f0"/>' +
  '<rect x="70" y="260" width="320" height="8" rx="2" fill="#f0f0f0"/>' +
  '<rect x="70" y="280" width="360" height="8" rx="2" fill="#f0f0f0"/>' +
  '<rect x="70" y="300" width="200" height="8" rx="2" fill="#f0f0f0"/>' +
  // footer
  '<rect x="70" y="580" width="360" height="30" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="250" y="600" text-anchor="middle" font-size="9" fill="#bbb" font-family="sans-serif">FOOTER / CONTACT INFO</text>' +
  '</svg>'
);

// ── PEN ─────────────────────────────────────────────────────────────────
export const PEN_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 200" width="500" height="200">' +
  // barrel
  '<rect x="80" y="75" width="320" height="50" rx="8" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // grip section
  '<rect x="60" y="80" width="40" height="40" rx="4" fill="#f0f0f0" stroke="#000" stroke-width="1"/>' +
  // tip
  '<polygon points="60,85 20,100 60,115" fill="#333" stroke="#000" stroke-width="1"/>' +
  // clip
  '<path d="M 380 75 L 410 55 L 412 75" fill="none" stroke="#000" stroke-width="1.5"/>' +
  // cap
  '<rect x="380" y="75" width="60" height="50" rx="6" fill="#f5f5f5" stroke="#000" stroke-width="1.5"/>' +
  // print area
  '<rect x="140" y="82" width="200" height="36" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="5,3"/>' +
  '<text x="240" y="105" text-anchor="middle" font-size="9" fill="#bbb" font-family="sans-serif">PRINT AREA</text>' +
  '</svg>'
);

// ── BOTTLE ──────────────────────────────────────────────────────────────
export const BOTTLE_SVG = svgUri(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 600" width="300" height="600">' +
  // cap
  '<rect x="115" y="20" width="70" height="40" rx="6" fill="#f0f0f0" stroke="#000" stroke-width="1.5"/>' +
  // neck
  '<path d="M 125 60 Q 125 80 115 100 L 115 120 Q 80 140 80 180 L 80 540 Q 80 570 110 570 L 190 570 Q 220 570 220 540 L 220 180 Q 220 140 185 120 L 185 100 Q 175 80 175 60 Z" fill="#fff" stroke="#000" stroke-width="1.5"/>' +
  // grip lines
  '<line x1="80" y1="200" x2="220" y2="200" stroke="#eee" stroke-width="1"/>' +
  '<line x1="80" y1="500" x2="220" y2="500" stroke="#eee" stroke-width="1"/>' +
  // print area
  '<rect x="95" y="220" width="110" height="260" rx="4" fill="none" stroke="#aaa" stroke-width="1" stroke-dasharray="6,4"/>' +
  '<text x="150" y="355" text-anchor="middle" font-size="10" fill="#bbb" font-family="sans-serif">PRINT AREA</text>' +
  '</svg>'
);

// ── PRODUCTS ────────────────────────────────────────────────────────────

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Custom Premium T-Shirt',
    slug: 'custom-premium-tshirt',
    description: 'High-quality 100% bio-washed cotton t-shirts for brand promotion and corporate events.',
    category: 'Apparel',
    quality_levels: ['Basic', 'Standard', 'Premium'],
    customization_fields: ['Logo', 'Front Text', 'Back Text'],
    moq: 50,
    base_price: 299,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Luxury Box'],
    images: [TSHIRT_SVG, TSHIRT_BACK_SVG, TSHIRT_SVG],
    supported_views: ['front', 'back', 'sleeve_l', 'sleeve_r', 'neck'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p2',
    name: 'Branded Ceramic Mug',
    slug: 'branded-ceramic-mug',
    description: 'Perfect for office desks and corporate gifting. Microwave and dishwasher safe.',
    category: 'Drinkware',
    quality_levels: ['Standard', 'Premium'],
    customization_fields: ['Logo', 'Wraparound Design'],
    moq: 100,
    base_price: 149,
    delivery_days: '5-7 Working Days',
    packaging_options: ['Safe-ship Box', 'Gift Wrap'],
    images: [MUG_SVG, MUG_SVG, MUG_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p3',
    name: 'Corporate Notebook',
    slug: 'corporate-notebook',
    description: 'Hardbound premium notebooks with customized covers and individual name engraving.',
    category: 'Stationery',
    quality_levels: ['Standard', 'Premium', 'Luxury'],
    customization_fields: ['Cover Logo', 'Name Engraving'],
    moq: 50,
    base_price: 199,
    delivery_days: '7-9 Working Days',
    packaging_options: ['Standard', 'Executive Sleeve'],
    images: [NOTEBOOK_SVG, NOTEBOOK_SVG, NOTEBOOK_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p4',
    name: 'Tech Accessories Pouch',
    slug: 'tech-accessories-pouch',
    description: 'Keep your charging cables and gear organized with this high-quality branded pouch.',
    category: 'Lifestyle',
    quality_levels: ['Standard', 'Premium'],
    customization_fields: ['Embroidered Logo', 'Printed Name'],
    moq: 50,
    base_price: 349,
    delivery_days: '10-12 Working Days',
    packaging_options: ['Standard', 'Branded Box'],
    images: [POUCH_SVG, POUCH_SVG, POUCH_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p5',
    name: 'Custom Calendar',
    slug: 'custom-calendar',
    description: 'Fully customized, professional-quality desk or wall calendars for branding.',
    category: 'Stationery',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 199,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [CALENDAR_SVG, CALENDAR_SVG, CALENDAR_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p6',
    name: 'Wedding Card',
    slug: 'wedding-card',
    description: 'Exquisite custom-designed wedding cards with high-end print finishes.',
    category: 'Stationery',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 85,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [CARD_SVG, CARD_SVG, CARD_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p7',
    name: 'Premium Business Card',
    slug: 'business-card',
    description: 'Leave a lasting impression with premium, fully customized business cards.',
    category: 'Stationery',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 5,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [BUSINESS_CARD_SVG, BUSINESS_CARD_SVG, BUSINESS_CARD_SVG],
    supported_views: ['front', 'back'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p8',
    name: 'Employee Joining Kit',
    slug: 'employee-joining-kit',
    description: 'Complete onboarding kit for new employees, branded to your company.',
    category: 'Corporate Gifting',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 1499,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [BOX_SVG, BOX_SVG, BOX_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p9',
    name: 'Diary with Logo',
    slug: 'diary-with-logo',
    description: 'Professional-grade diaries with your company logo and custom branding.',
    category: 'Stationery',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 249,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [NOTEBOOK_SVG, NOTEBOOK_SVG, NOTEBOOK_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p10',
    name: 'Branded Headphone',
    slug: 'branded-headphone',
    description: 'Fully customized headphones suitable for branding and promotional use.',
    category: 'Electronics',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 999,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [HEADPHONE_SVG, HEADPHONE_SVG, HEADPHONE_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p11',
    name: 'Custom Printed Bag',
    slug: 'custom-bag',
    description: 'Durable and professional-quality bags with custom print and branding.',
    category: 'Lifestyle',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 499,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [TOTE_BAG_SVG, TOTE_BAG_SVG, TOTE_BAG_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p12',
    name: 'Personalized ID Card',
    slug: 'id-card',
    description: 'High-quality PVC ID cards with custom designs and variable data printing.',
    category: 'Corporate',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 45,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [ID_CARD_SVG, ID_CARD_SVG, ID_CARD_SVG],
    supported_views: ['front', 'back'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p13',
    name: 'Branded Letter Head',
    slug: 'letter-head',
    description: 'Official letterheads with premium paper and high-quality company branding.',
    category: 'Stationery',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 8,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [LETTERHEAD_SVG, LETTERHEAD_SVG, LETTERHEAD_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p14',
    name: 'Custom Printed Pen',
    slug: 'custom-pen',
    description: 'Sleek pens with custom logo printing for promotional gifting.',
    category: 'Stationery',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 15,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [PEN_SVG, PEN_SVG, PEN_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  },
  {
    id: 'p15',
    name: 'Premium Branded Bottle',
    slug: 'premium-bottle',
    description: 'Customized bottles for corporate gifting and brand promotion.',
    category: 'Drinkware',
    quality_levels: ['Basic', 'Standard', 'Premium', 'Luxury'],
    customization_fields: ['Logo', 'Name', 'Text', 'Color'],
    moq: 50,
    base_price: 599,
    delivery_days: '7-10 Working Days',
    packaging_options: ['Standard', 'Premium Packaging'],
    images: [BOTTLE_SVG, BOTTLE_SVG, BOTTLE_SVG],
    supported_views: ['front'],
    is_active: true,
    created_at: new Date().toISOString()
  }
];
