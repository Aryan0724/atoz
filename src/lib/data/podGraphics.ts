// podGraphics.ts — Curated POD elements based on Vexels, Printful, Canva research
// Top-performing t-shirt graphic elements for print-on-demand

export interface PodGraphic {
  id: string;
  name: string;
  category: string;
  svg: string; // full SVG string, suitable for Fabric.js loadSVGFromString
}

export const podGraphicCategories = [
  'Popular',
  'Streetwear & Y2K',
  'Nature',
  'Shapes',
  'Vintage',
  'Decorative',
  'Animals',
  'Stickers',
  'Abstract',
  'Indian Heritage'
];

export const podGraphics: PodGraphic[] = [

  // ── POPULAR ──────────────────────────────────────────────────────────────

  {
    id: 'sunburst-vintage',
    name: 'Sunburst',
    category: 'Popular',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <g fill="#000000" transform="translate(100,100)">
        ${Array.from({ length: 18 }, (_, i) => {
          const a1 = (i * 20 - 5) * Math.PI / 180;
          const a2 = (i * 20 + 5) * Math.PI / 180;
          const r1 = 32, r2 = 92;
          return `<polygon points="${(Math.cos(a1)*r1).toFixed(1)},${(Math.sin(a1)*r1).toFixed(1)} ${(Math.cos(a2)*r1).toFixed(1)},${(Math.sin(a2)*r1).toFixed(1)} ${(Math.cos((a1+a2)/2)*r2).toFixed(1)},${(Math.sin((a1+a2)/2)*r2).toFixed(1)}"/>`;
        }).join('')}
        <circle r="30" fill="#000000"/>
        <circle r="20" fill="#ffffff"/>
        <circle r="6" fill="#000000"/>
      </g>
    </svg>`
  },

  {
    id: 'wings-spread',
    name: 'Wings',
    category: 'Popular',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 140">
      <g fill="#000000">
        <!-- Left wing -->
        <path d="M140 80 C110 60 60 20 20 30 C50 40 80 55 100 75 Z"/>
        <path d="M140 80 C118 52 68 8 30 18 C60 32 88 50 108 72 Z"/>
        <path d="M140 80 C125 45 78 0 42 8 C70 25 96 46 116 70 Z"/>
        <path d="M140 80 C130 60 96 24 62 18 C84 34 104 54 122 72 Z"/>
        <path d="M140 80 C138 65 118 42 88 32 C104 44 116 60 128 75 Z"/>
        <!-- Right wing (mirror) -->
        <path d="M140 80 C170 60 220 20 260 30 C230 40 200 55 180 75 Z"/>
        <path d="M140 80 C162 52 212 8 250 18 C220 32 192 50 172 72 Z"/>
        <path d="M140 80 C155 45 202 0 238 8 C210 25 184 46 164 70 Z"/>
        <path d="M140 80 C150 60 184 24 218 18 C196 34 176 54 158 72 Z"/>
        <path d="M140 80 C142 65 162 42 192 32 C176 44 164 60 152 75 Z"/>
        <!-- Center body -->
        <ellipse cx="140" cy="82" rx="8" ry="14"/>
      </g>
    </svg>`
  },

  {
    id: 'skull-classic',
    name: 'Skull',
    category: 'Popular',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 140 180">
      <g fill="#000000">
        <!-- Skull cranium -->
        <ellipse cx="70" cy="75" rx="58" ry="60"/>
        <!-- Jaw -->
        <rect x="30" y="118" width="80" height="35" rx="8"/>
        <!-- Teeth -->
        <rect x="38" y="135" width="12" height="18" rx="3" fill="white"/>
        <rect x="54" y="135" width="12" height="20" rx="3" fill="white"/>
        <rect x="70" y="135" width="12" height="20" rx="3" fill="white"/>
        <rect x="86" y="135" width="12" height="18" rx="3" fill="white"/>
        <!-- Left eye socket -->
        <ellipse cx="48" cy="80" rx="20" ry="22" fill="white"/>
        <ellipse cx="48" cy="82" rx="13" ry="15" fill="#000000"/>
        <!-- Right eye socket -->
        <ellipse cx="92" cy="80" rx="20" ry="22" fill="white"/>
        <ellipse cx="92" cy="82" rx="13" ry="15" fill="#000000"/>
        <!-- Nose cavity -->
        <path d="M64 103 Q70 96 76 103 L73 112 Q70 115 67 112 Z" fill="white"/>
        <!-- Chin indentation -->
        <path d="M55 153 Q70 160 85 153" fill="none" stroke="white" stroke-width="2"/>
      </g>
    </svg>`
  },

  {
    id: 'flame-bold',
    name: 'Flame',
    category: 'Popular',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 200">
      <g fill="#000000">
        <path d="M60 10 C60 10 90 50 85 80 C82 95 72 100 72 100 C72 100 95 70 75 40 C90 65 92 100 80 118 C75 126 68 130 60 130 C52 130 45 126 40 118 C28 100 30 65 45 40 C25 70 48 100 48 100 C48 100 38 95 35 80 C30 50 60 10 60 10Z"/>
        <path d="M60 85 C60 85 72 100 68 118 C66 126 63 130 60 130 C57 130 54 126 52 118 C48 100 60 85 60 85Z" fill="white" opacity="0.3"/>
      </g>
    </svg>`
  },

  {
    id: 'butterfly-illustrative',
    name: 'Butterfly',
    category: 'Popular',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160">
      <g fill="#000000">
        <!-- Upper left wing -->
        <path d="M100 80 C85 55 48 20 15 35 C0 42 10 72 35 72 C55 72 78 70 100 80Z"/>
        <!-- Upper right wing -->
        <path d="M100 80 C115 55 152 20 185 35 C200 42 190 72 165 72 C145 72 122 70 100 80Z"/>
        <!-- Lower left wing -->
        <path d="M100 82 C85 100 50 125 28 112 C12 102 22 80 45 82 C65 84 86 82 100 82Z"/>
        <!-- Lower right wing -->
        <path d="M100 82 C115 100 150 125 172 112 C188 102 178 80 155 82 C135 84 114 82 100 82Z"/>
        <!-- Wing details (lighter marks) -->
        <path d="M100 80 C88 65 60 40 35 48 C50 52 70 60 90 75Z" fill="white" opacity="0.25"/>
        <path d="M100 80 C112 65 140 40 165 48 C150 52 130 60 110 75Z" fill="white" opacity="0.25"/>
        <!-- Body -->
        <ellipse cx="100" cy="81" rx="4" ry="28"/>
        <!-- Head -->
        <circle cx="100" cy="52" r="6"/>
        <!-- Antennae -->
        <path d="M97 48 Q88 36 84 28" stroke="#000000" stroke-width="1.5" fill="none"/>
        <path d="M103 48 Q112 36 116 28" stroke="#000000" stroke-width="1.5" fill="none"/>
        <circle cx="84" cy="27" r="3"/>
        <circle cx="116" cy="27" r="3"/>
      </g>
    </svg>`
  },

  {
    id: 'mandala-simple',
    name: 'Mandala',
    category: 'Popular',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <g stroke="#000000" fill="none" stroke-width="1.5" transform="translate(100,100)">
        <circle r="10" fill="#000000"/>
        <circle r="18"/>
        <circle r="28"/>
        ${Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45) * Math.PI / 180;
          const x1 = Math.cos(a) * 20, y1 = Math.sin(a) * 20;
          const x2 = Math.cos(a) * 35, y2 = Math.sin(a) * 35;
          return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke-width="2"/>
                  <circle cx="${(Math.cos(a)*42).toFixed(1)}" cy="${(Math.sin(a)*42).toFixed(1)}" r="7" fill="#000000"/>
                  <circle cx="${(Math.cos(a)*42).toFixed(1)}" cy="${(Math.sin(a)*42).toFixed(1)}" r="4" fill="white"/>`;
        }).join('')}
        <circle r="52"/>
        ${Array.from({ length: 16 }, (_, i) => {
          const a = (i * 22.5) * Math.PI / 180;
          const x = Math.cos(a) * 62, y = Math.sin(a) * 62;
          return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4" fill="#000000"/>`;
        }).join('')}
        <circle r="70"/>
        ${Array.from({ length: 8 }, (_, i) => {
          const a = (i * 45 + 22.5) * Math.PI / 180;
          const x1 = Math.cos(a) * 72, y1 = Math.sin(a) * 72;
          const x2 = Math.cos(a) * 88, y2 = Math.sin(a) * 88;
          return `<ellipse cx="${((x1+x2)/2).toFixed(1)}" cy="${((y1+y2)/2).toFixed(1)}" rx="6" ry="10" transform="rotate(${i*45+22.5} ${((x1+x2)/2).toFixed(1)} ${((y1+y2)/2).toFixed(1)})" fill="#000000"/>`;
        }).join('')}
        <circle r="92"/>
      </g>
    </svg>`
  },

  // ── DECORATIVE ────────────────────────────────────────────────────────────

  {
    id: 'laurel-wreath-classic',
    name: 'Laurel Wreath',
    category: 'Decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 220 200">
      <g fill="#000000">
        <!-- Left sprigs -->
        <ellipse cx="65" cy="148" rx="14" ry="22" transform="rotate(-30 65 148)"/>
        <ellipse cx="50" cy="125" rx="13" ry="20" transform="rotate(-45 50 125)"/>
        <ellipse cx="40" cy="100" rx="12" ry="19" transform="rotate(-60 40 100)"/>
        <ellipse cx="36" cy="74"  rx="11" ry="18" transform="rotate(-75 36 74)"/>
        <ellipse cx="42" cy="50"  rx="10" ry="17" transform="rotate(-90 42 50)"/>
        <ellipse cx="55" cy="30"  rx="9"  ry="15" transform="rotate(-105 55 30)"/>
        <ellipse cx="74" cy="17"  rx="8"  ry="13" transform="rotate(-120 74 17)"/>
        <!-- Right sprigs (mirrored) -->
        <ellipse cx="155" cy="148" rx="14" ry="22" transform="rotate(30 155 148)"/>
        <ellipse cx="170" cy="125" rx="13" ry="20" transform="rotate(45 170 125)"/>
        <ellipse cx="180" cy="100" rx="12" ry="19" transform="rotate(60 180 100)"/>
        <ellipse cx="184" cy="74"  rx="11" ry="18" transform="rotate(75 184 74)"/>
        <ellipse cx="178" cy="50"  rx="10" ry="17" transform="rotate(90 178 50)"/>
        <ellipse cx="165" cy="30"  rx="9"  ry="15" transform="rotate(105 165 30)"/>
        <ellipse cx="146" cy="17"  rx="8"  ry="13" transform="rotate(120 146 17)"/>
        <!-- Stems -->
        <path d="M110 175 C90 170 70 155 60 145" stroke="#000" stroke-width="3" fill="none"/>
        <path d="M110 175 C130 170 150 155 160 145" stroke="#000" stroke-width="3" fill="none"/>
        <!-- Bottom knot -->
        <path d="M95 180 Q110 190 125 180 L122 170 Q110 176 98 170Z"/>
      </g>
    </svg>`
  },

  {
    id: 'ornament-divider',
    name: 'Ornament Divider',
    category: 'Decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 50">
      <g fill="#000000" stroke="none">
        <!-- Left line segment -->
        <rect x="0" y="23" width="90" height="2"/>
        <rect x="0" y="21" width="60" height="6" rx="2"/>
        <!-- Left arrow/chevron -->
        <polygon points="95,10 108,25 95,40 100,25"/>
        <!-- Center star/diamond -->
        <polygon points="150,5 158,25 150,45 142,25"/>
        <polygon points="130,25 150,15 170,25 150,35"/>
        <!-- Right arrow/chevron -->
        <polygon points="205,10 192,25 205,40 200,25"/>
        <!-- Right line segment -->
        <rect x="210" y="23" width="90" height="2"/>
        <rect x="240" y="21" width="60" height="6" rx="2"/>
        <!-- Dots -->
        <circle cx="80" cy="25" r="4"/>
        <circle cx="220" cy="25" r="4"/>
      </g>
    </svg>`
  },

  {
    id: 'double-star-divider',
    name: 'Star Divider',
    category: 'Decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 36">
      <g fill="#000000">
        <rect x="0" y="16" width="95" height="2"/>
        <rect x="185" y="16" width="95" height="2"/>
        <rect x="0" y="14" width="60" height="6" rx="2"/>
        <rect x="220" y="14" width="60" height="6" rx="2"/>
        <polygon points="105,0 109,12 122,12 112,19 116,31 105,24 94,31 98,19 88,12 101,12"/>
        <polygon points="140,4 143,12 152,12 145,17 148,25 140,20 132,25 135,17 128,12 137,12"/>
        <polygon points="175,0 179,12 192,12 182,19 186,31 175,24 164,31 168,19 158,12 171,12"/>
      </g>
    </svg>`
  },

  {
    id: 'scroll-ribbon',
    name: 'Scroll Banner',
    category: 'Decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 80">
      <g fill="#000000">
        <!-- Main ribbon body -->
        <path d="M30 15 L250 15 L250 65 L30 65 Z"/>
        <!-- Left curl -->
        <path d="M0 25 L35 15 L35 65 L0 55 Z" opacity="0.75"/>
        <path d="M0 25 L32 32 L0 40Z" fill="white" opacity="0.4"/>
        <!-- Right curl -->
        <path d="M280 25 L245 15 L245 65 L280 55 Z" opacity="0.75"/>
        <path d="M280 25 L248 32 L280 40Z" fill="white" opacity="0.4"/>
        <!-- Left tail -->
        <path d="M0 55 L35 65 L25 80 L0 68 Z" opacity="0.65"/>
        <!-- Right tail -->
        <path d="M280 55 L245 65 L255 80 L280 68 Z" opacity="0.65"/>
        <!-- Highlight line -->
        <line x1="30" y1="24" x2="250" y2="24" stroke="white" stroke-width="1.5" opacity="0.3"/>
      </g>
    </svg>`
  },

  {
    id: 'vintage-badge-circle',
    name: 'Circle Badge',
    category: 'Decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <g fill="none" stroke="#000000">
        <!-- Outer ring -->
        <circle cx="100" cy="100" r="94" stroke-width="4" fill="#000000"/>
        <circle cx="100" cy="100" r="86" stroke-width="1.5" stroke="white"/>
        <!-- Inner ring -->
        <circle cx="100" cy="100" r="70" stroke-width="3" stroke="white" fill="none"/>
        <!-- Small dots on ring -->
        ${Array.from({ length: 24 }, (_, i) => {
          const a = (i * 15) * Math.PI / 180;
          return `<circle cx="${(100 + Math.cos(a) * 80).toFixed(1)}" cy="${(100 + Math.sin(a) * 80).toFixed(1)}" r="2.5" fill="white"/>`;
        }).join('')}
        <!-- Star top -->
        <polygon points="100,16 103,24 112,24 105,29 108,37 100,32 92,37 95,29 88,24 97,24" fill="white"/>
        <!-- Star bottom -->
        <polygon points="100,184 103,176 112,176 105,171 108,163 100,168 92,163 95,171 88,176 97,176" fill="white"/>
      </g>
    </svg>`
  },

  {
    id: 'shield-heraldic',
    name: 'Heraldic Shield',
    category: 'Decorative',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 190">
      <g fill="#000000">
        <path d="M80 10 L150 38 L150 100 C150 148 80 185 80 185 C80 185 10 148 10 100 L10 38 Z"/>
        <path d="M80 22 L138 46 L138 100 C138 140 80 173 80 173 C80 173 22 140 22 100 L22 46 Z" fill="white"/>
        <!-- Division lines -->
        <line x1="80" y1="22" x2="80" y2="173" stroke="#000" stroke-width="3"/>
        <line x1="22" y1="100" x2="138" y2="100" stroke="#000" stroke-width="3"/>
        <!-- Top left quarter fill -->
        <path d="M22 46 L80 46 L80 100 L22 100 Z" fill="#000000"/>
        <!-- Bottom right quarter fill -->
        <path d="M80 100 L138 100 L138 140 C138 160 110 173 80 173 Z" fill="#000000"/>
        <!-- Small star center -->
        <polygon points="80,88 83,96 92,96 85,101 88,109 80,104 72,109 75,101 68,96 77,96" fill="white"/>
      </g>
    </svg>`
  },

  // ── NATURE ────────────────────────────────────────────────────────────────

  {
    id: 'mountains-scene',
    name: 'Mountains',
    category: 'Nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 160">
      <g fill="#000000">
        <!-- Background mountains -->
        <polygon points="150,25 210,130 90,130" opacity="0.5"/>
        <polygon points="240,55 290,130 190,130" opacity="0.45"/>
        <polygon points="60,55 110,130 10,130" opacity="0.45"/>
        <!-- Foreground mountains -->
        <polygon points="100,15 175,130 25,130"/>
        <polygon points="210,35 275,130 145,130"/>
        <!-- Snow caps -->
        <polygon points="100,15 116,50 84,50" fill="white"/>
        <polygon points="210,35 222,62 198,62" fill="white"/>
        <!-- Sun -->
        <circle cx="255" cy="35" r="20" fill="#000000"/>
        <circle cx="255" cy="35" r="14" fill="white"/>
        <!-- Ground -->
        <rect x="0" y="130" width="300" height="30"/>
      </g>
    </svg>`
  },

  {
    id: 'wave-ocean',
    name: 'Ocean Wave',
    category: 'Nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 130">
      <g fill="#000000">
        <path d="M0 60 C25 35 50 85 75 60 C100 35 125 85 150 60 C175 35 200 85 225 60 C250 35 275 50 300 45 L300 130 L0 130 Z"/>
        <path d="M0 80 C25 58 50 102 75 80 C100 58 125 102 150 80 C175 58 200 102 225 80 C250 58 275 72 300 68 L300 130 L0 130 Z" opacity="0.6"/>
        <!-- Foam/spray dots -->
        <circle cx="25" cy="52" r="4"/>
        <circle cx="75" cy="52" r="4"/>
        <circle cx="125" cy="52" r="4"/>
        <circle cx="175" cy="52" r="4"/>
        <circle cx="225" cy="52" r="4"/>
        <circle cx="50" cy="38" r="3"/>
        <circle cx="100" cy="38" r="3"/>
        <circle cx="150" cy="38" r="3"/>
        <circle cx="200" cy="38" r="3"/>
      </g>
    </svg>`
  },

  {
    id: 'rose-detailed',
    name: 'Rose',
    category: 'Nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 180">
      <g fill="#000000">
        <!-- Stem -->
        <rect x="62" y="110" width="6" height="65" rx="3"/>
        <!-- Leaves -->
        <path d="M65 140 C50 130 35 120 30 105 C45 108 58 118 65 135Z"/>
        <path d="M65 125 C80 115 95 105 100 90 C85 93 72 103 65 120Z"/>
        <!-- Thorns -->
        <polygon points="55,132 48,125 52,138"/>
        <polygon points="75,118 82,111 78,124"/>
        <!-- Outer petals -->
        <ellipse cx="65" cy="72" rx="22" ry="32" transform="rotate(-30 65 72)"/>
        <ellipse cx="65" cy="72" rx="22" ry="32" transform="rotate(30 65 72)"/>
        <ellipse cx="65" cy="75" rx="20" ry="28" transform="rotate(90 65 75)"/>
        <ellipse cx="65" cy="75" rx="20" ry="28" transform="rotate(-90 65 75)"/>
        <!-- Middle petals -->
        <ellipse cx="65" cy="68" rx="16" ry="24" transform="rotate(0 65 68)" fill="#222"/>
        <ellipse cx="65" cy="68" rx="16" ry="24" transform="rotate(60 65 68)" fill="#222"/>
        <ellipse cx="65" cy="68" rx="16" ry="24" transform="rotate(-60 65 68)" fill="#222"/>
        <!-- Inner -->
        <circle cx="65" cy="68" r="14" fill="#111"/>
        <circle cx="65" cy="68" r="8" fill="#000"/>
        <circle cx="65" cy="68" r="4" fill="#333"/>
      </g>
    </svg>`
  },

  {
    id: 'tree-pine',
    name: 'Pine Tree',
    category: 'Nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 200">
      <g fill="#000000">
        <polygon points="65,10 110,75 20,75"/>
        <polygon points="65,45 115,118 15,118"/>
        <polygon points="65,85 120,165 10,165"/>
        <rect x="56" y="162" width="18" height="30" rx="4"/>
      </g>
    </svg>`
  },

  {
    id: 'moon-celestial',
    name: 'Crescent Moon',
    category: 'Nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <g fill="#000000">
        <path d="M100 20 C60 20 28 52 28 92 C28 132 60 164 100 164 C80 152 68 124 68 92 C68 60 80 32 100 20Z"/>
        <!-- Stars around -->
        <polygon points="128,35 130,41 136,41 131,45 133,51 128,47 123,51 125,45 120,41 126,41"/>
        <polygon points="140,80 141,84 145,84 142,86 143,90 140,88 137,90 138,86 135,84 139,84"/>
        <polygon points="125,120 126,124 130,124 127,126 128,130 125,128 122,130 123,126 120,124 124,124"/>
        <circle cx="110" cy="60" r="3"/>
        <circle cx="145" cy="55" r="2"/>
        <circle cx="148" cy="100" r="2.5"/>
        <circle cx="108" cy="140" r="2"/>
      </g>
    </svg>`
  },

  // ── ANIMALS ───────────────────────────────────────────────────────────────

  {
    id: 'wolf-head',
    name: 'Wolf Head',
    category: 'Animals',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180">
      <g fill="#000000">
        <!-- Ear left -->
        <polygon points="35,25 20,0 62,38"/>
        <polygon points="38,28 26,8 58,36" fill="white"/>
        <!-- Ear right -->
        <polygon points="125,25 140,0 98,38"/>
        <polygon points="122,28 134,8 102,36" fill="white"/>
        <!-- Head shape -->
        <ellipse cx="80" cy="90" rx="65" ry="72"/>
        <!-- Muzzle -->
        <ellipse cx="80" cy="125" rx="35" ry="28" fill="#222"/>
        <!-- Nose -->
        <ellipse cx="80" cy="110" rx="14" ry="10"/>
        <!-- Nose highlight -->
        <ellipse cx="77" cy="108" rx="4" ry="3" fill="white" opacity="0.6"/>
        <!-- Eyes -->
        <ellipse cx="54" cy="82" rx="14" ry="12" fill="white"/>
        <ellipse cx="106" cy="82" rx="14" ry="12" fill="white"/>
        <ellipse cx="55" cy="83" rx="9" ry="9" fill="#000"/>
        <ellipse cx="107" cy="83" rx="9" ry="9" fill="#000"/>
        <circle cx="57" cy="80" r="3" fill="white"/>
        <circle cx="109" cy="80" r="3" fill="white"/>
        <!-- Mouth line -->
        <path d="M63 130 Q80 140 97 130" stroke="white" stroke-width="2" fill="none"/>
        <!-- Fur markings -->
        <path d="M46 65 C42 55 44 45 50 40" stroke="white" stroke-width="2" fill="none"/>
        <path d="M114 65 C118 55 116 45 110 40" stroke="white" stroke-width="2" fill="none"/>
      </g>
    </svg>`
  },

  {
    id: 'eagle-head',
    name: 'Eagle Head',
    category: 'Animals',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 180">
      <g fill="#000000">
        <!-- Head shape -->
        <ellipse cx="80" cy="80" rx="60" ry="65"/>
        <!-- White head marking -->
        <ellipse cx="80" cy="70" rx="46" ry="50" fill="white"/>
        <ellipse cx="80" cy="80" rx="60" ry="28" fill="#000"/>
        <!-- Eye -->
        <circle cx="95" cy="68" r="16" fill="white"/>
        <circle cx="96" cy="69" r="10" fill="#000"/>
        <circle cx="98" cy="66" r="3.5" fill="white"/>
        <!-- Beak -->
        <path d="M118 88 L145 100 L118 108 Q108 98 118 88Z"/>
        <path d="M118 88 Q128 98 118 108" stroke="white" stroke-width="1.5" fill="none"/>
        <!-- Neck feathers -->
        <path d="M30 120 C35 130 50 145 80 150 C110 145 125 130 130 120"/>
        <ellipse cx="80" cy="155" rx="55" ry="25"/>
        <!-- Feather detail lines -->
        <path d="M55 135 C55 148 80 155 80 155" stroke="white" stroke-width="1.5" fill="none"/>
        <path d="M105 135 C105 148 80 155 80 155" stroke="white" stroke-width="1.5" fill="none"/>
      </g>
    </svg>`
  },

  {
    id: 'bear-paw',
    name: 'Bear Paw',
    category: 'Animals',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 170 190">
      <g fill="#000000">
        <!-- Palm pad -->
        <ellipse cx="85" cy="130" rx="58" ry="52"/>
        <!-- Toe pads -->
        <ellipse cx="30" cy="80" rx="22" ry="26"/>
        <ellipse cx="65" cy="65" rx="22" ry="26"/>
        <ellipse cx="105" cy="65" rx="22" ry="26"/>
        <ellipse cx="140" cy="80" rx="22" ry="26"/>
        <!-- Claws -->
        <path d="M22 58 Q18 40 26 30 Q32 42 28 58Z"/>
        <path d="M57 43 Q56 24 65 15 Q70 28 65 44Z"/>
        <path d="M97 43 Q100 24 108 16 Q112 29 107 44Z"/>
        <path d="M132 58 Q136 40 142 32 Q146 44 140 58Z"/>
        <!-- Inner pad markings -->
        <ellipse cx="85" cy="132" rx="35" ry="30" fill="#222"/>
      </g>
    </svg>`
  },

  // ── VINTAGE ───────────────────────────────────────────────────────────────

  {
    id: 'anchor-nautical',
    name: 'Anchor',
    category: 'Vintage',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 130 200">
      <g fill="#000000" stroke="none">
        <!-- Top ring -->
        <circle cx="65" cy="30" r="20" fill="none" stroke="#000" stroke-width="8"/>
        <!-- Vertical shaft -->
        <rect x="59" y="48" width="12" height="140" rx="5"/>
        <!-- Crossbar -->
        <rect x="15" y="65" width="100" height="12" rx="5"/>
        <!-- Left flukes -->
        <path d="M65 188 C45 195 20 185 15 165 L25 162 C28 175 45 182 65 176Z"/>
        <!-- Right flukes -->
        <path d="M65 188 C85 195 110 185 115 165 L105 162 C102 175 85 182 65 176Z"/>
        <!-- Rope curl left -->
        <path d="M15 65 Q5 50 15 38 Q25 27 35 38" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/>
        <!-- Rope curl right -->
        <path d="M115 65 Q125 50 115 38 Q105 27 95 38" fill="none" stroke="#000" stroke-width="6" stroke-linecap="round"/>
      </g>
    </svg>`
  },

  {
    id: 'compass-vintage',
    name: 'Compass',
    category: 'Vintage',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <g fill="#000000" transform="translate(100,100)">
        <!-- Outer ring -->
        <circle r="95" fill="#000" stroke="none"/>
        <circle r="88" fill="white"/>
        <circle r="78" fill="#000"/>
        <circle r="70" fill="white"/>
        <!-- Tick marks -->
        ${Array.from({ length: 32 }, (_, i) => {
          const a = (i * 11.25) * Math.PI / 180;
          const r1 = 72, r2 = i % 4 === 0 ? 62 : i % 2 === 0 ? 66 : 68;
          return `<line x1="${(Math.cos(a)*r1).toFixed(1)}" y1="${(Math.sin(a)*r1).toFixed(1)}" x2="${(Math.cos(a)*r2).toFixed(1)}" y2="${(Math.sin(a)*r2).toFixed(1)}" stroke="#000" stroke-width="${i % 4 === 0 ? 2.5 : 1.5}"/>`;
        }).join('')}
        <!-- Cardinal directions -->
        <polygon points="0,-55 6,-25 0,-35 -6,-25" fill="#000"/>
        <polygon points="0,55 6,25 0,35 -6,25" fill="#444"/>
        <polygon points="-55,0 -25,6 -35,0 -25,-6" fill="#444"/>
        <polygon points="55,0 25,-6 35,0 25,6" fill="#000"/>
        <!-- Center -->
        <circle r="10" fill="#000"/>
        <circle r="5" fill="white"/>
      </g>
    </svg>`
  },

  {
    id: 'key-ornate',
    name: 'Ornate Key',
    category: 'Vintage',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 200">
      <g fill="#000000">
        <!-- Key ring top -->
        <circle cx="50" cy="45" r="38" fill="none" stroke="#000" stroke-width="10"/>
        <circle cx="50" cy="45" r="22" fill="none" stroke="#000" stroke-width="6"/>
        <circle cx="50" cy="45" r="8"/>
        <!-- Shaft -->
        <rect x="44" y="82" width="12" height="100" rx="5"/>
        <!-- Teeth -->
        <rect x="56" y="140" width="20" height="10" rx="3"/>
        <rect x="56" y="160" width="15" height="10" rx="3"/>
        <rect x="56" y="180" width="18" height="8" rx="3"/>
      </g>
    </svg>`
  },

  {
    id: 'lightning-vintage',
    name: 'Lightning Bolt',
    category: 'Vintage',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 200">
      <g fill="#000000">
        <path d="M85 5 L30 98 L58 98 L25 195 L105 85 L74 85 Z"/>
        <!-- Duplicate slightly offset for 3D effect -->
        <path d="M80 5 L25 98 L53 98 L20 195" fill="none" stroke="white" stroke-width="3" opacity="0.2"/>
      </g>
    </svg>`
  },

  // ── SHAPES ────────────────────────────────────────────────────────────────

  {
    id: 'diamond-gem',
    name: 'Diamond',
    category: 'Shapes',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <g fill="#000000">
        <!-- Top facets -->
        <polygon points="100,20 60,75 100,90 140,75"/>
        <!-- Top left crown facet -->
        <polygon points="100,20 60,75 30,55" fill="#222"/>
        <!-- Top right crown facet -->
        <polygon points="100,20 140,75 170,55" fill="#444"/>
        <!-- Girdle/sides -->
        <polygon points="30,55 60,75 100,90 60,185" fill="#333"/>
        <polygon points="170,55 140,75 100,90 140,185" fill="#111"/>
        <!-- Pavilion center -->
        <polygon points="100,90 60,185 100,170 140,185" fill="#222"/>
        <!-- Table -->
        <polygon points="100,20 140,75 100,90 60,75" fill="#555"/>
        <!-- Highlight -->
        <polygon points="95,22 65,72 95,85" fill="white" opacity="0.2"/>
      </g>
    </svg>`
  },

  {
    id: 'crown-royal',
    name: 'Crown',
    category: 'Shapes',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 160">
      <g fill="#000000">
        <!-- Crown body -->
        <path d="M10 140 L10 75 L52 110 L100 25 L148 110 L190 75 L190 140 Z"/>
        <!-- Base band -->
        <rect x="10" y="128" width="180" height="22" rx="4"/>
        <!-- Gemstones on band -->
        <circle cx="50" cy="139" r="8" fill="white"/>
        <circle cx="100" cy="139" r="10" fill="white"/>
        <circle cx="150" cy="139" r="8" fill="white"/>
        <circle cx="50" cy="139" r="5" fill="#000"/>
        <circle cx="100" cy="139" r="6" fill="#000"/>
        <circle cx="150" cy="139" r="5" fill="#000"/>
        <!-- Top gems -->
        <circle cx="100" cy="28" r="9" fill="white"/>
        <circle cx="100" cy="28" r="5" fill="#000"/>
        <circle cx="52" cy="96" r="7" fill="white"/>
        <circle cx="52" cy="96" r="4" fill="#000"/>
        <circle cx="148" cy="96" r="7" fill="white"/>
        <circle cx="148" cy="96" r="4" fill="#000"/>
      </g>
    </svg>`
  },

  {
    id: 'arrow-bold',
    name: 'Bold Arrow',
    category: 'Shapes',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
      <g fill="#000000">
        <polygon points="200,50 130,5 130,30 0,30 0,70 130,70 130,95"/>
      </g>
    </svg>`
  },

  {
    id: 'infinity-bold',
    name: 'Infinity',
    category: 'Shapes',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 120">
      <g fill="none" stroke="#000000" stroke-width="14" stroke-linecap="round">
        <path d="M140 60 C120 25 80 10 55 10 C25 10 5 30 5 60 C5 90 25 110 55 110 C80 110 120 95 140 60 C160 25 200 10 225 10 C255 10 275 30 275 60 C275 90 255 110 225 110 C200 110 160 95 140 60Z"/>
      </g>
    </svg>`
  },

  // ── STREETWEAR & Y2K ──────────────────────────────────────────────────────

  {
    id: 'y2k-sparkle-star',
    name: 'Y2K Sparkle',
    category: 'Streetwear & Y2K',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <path d="M50 0 C50 40 60 50 100 50 C60 50 50 60 50 100 C50 60 40 50 0 50 C40 50 50 40 50 0Z" fill="#000000"/>
    </svg>`
  },

  {
    id: 'wireframe-globe',
    name: 'Wireframe Globe',
    category: 'Streetwear & Y2K',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <g fill="none" stroke="#000000" stroke-width="2">
        <circle cx="100" cy="100" r="90"/>
        <ellipse cx="100" cy="100" rx="45" ry="90"/>
        <ellipse cx="100" cy="100" rx="15" ry="90"/>
        <ellipse cx="100" cy="100" rx="75" ry="90"/>
        <line x1="10" y1="100" x2="190" y2="100"/>
        <ellipse cx="100" cy="100" rx="90" ry="45"/>
        <ellipse cx="100" cy="100" rx="90" ry="15"/>
        <ellipse cx="100" cy="100" rx="90" ry="75"/>
      </g>
    </svg>`
  },

  {
    id: 'barcode-scan',
    name: 'Barcode Scan',
    category: 'Streetwear & Y2K',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
      <g fill="#000000">
        <rect x="10" y="10" width="4" height="70"/>
        <rect x="20" y="10" width="8" height="70"/>
        <rect x="35" y="10" width="4" height="70"/>
        <rect x="42" y="10" width="12" height="70"/>
        <rect x="60" y="10" width="2" height="70"/>
        <rect x="65" y="10" width="6" height="70"/>
        <rect x="75" y="10" width="8" height="70"/>
        <rect x="88" y="10" width="10" height="70"/>
        <rect x="105" y="10" width="4" height="70"/>
        <rect x="115" y="10" width="14" height="70"/>
        <rect x="135" y="10" width="6" height="70"/>
        <rect x="145" y="10" width="2" height="70"/>
        <rect x="150" y="10" width="10" height="70"/>
        <rect x="165" y="10" width="8" height="70"/>
        <rect x="180" y="10" width="4" height="70"/>
        <text x="12" y="95" font-family="'Courier New', Courier, monospace" font-size="14" font-weight="bold">8</text>
        <text x="40" y="95" font-family="'Courier New', Courier, monospace" font-size="14" font-weight="bold">42890</text>
        <text x="105" y="95" font-family="'Courier New', Courier, monospace" font-size="14" font-weight="bold">61294</text>
        <text x="180" y="95" font-family="'Courier New', Courier, monospace" font-size="14" font-weight="bold">2</text>
      </g>
    </svg>`
  },

  {
    id: 'paint-drip-edge',
    name: 'Paint Drips',
    category: 'Streetwear & Y2K',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 100">
      <path d="M0 0 L200 0 L200 20 C190 20 185 45 180 60 C175 75 165 75 160 60 C155 40 150 20 140 20 C130 20 120 70 115 90 C110 110 95 110 90 90 C85 70 80 30 70 30 C65 30 60 45 55 55 C50 65 40 65 35 55 C30 35 25 15 15 15 C10 15 5 25 0 35 Z" fill="#000000"/>
    </svg>`
  },

  {
    id: 'checkerboard-column',
    name: 'Checkerboard',
    category: 'Streetwear & Y2K',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 200">
      <g fill="#000000">
        <rect x="0" y="0" width="30" height="30"/>
        <rect x="30" y="30" width="30" height="30"/>
        <rect x="0" y="60" width="30" height="30"/>
        <rect x="30" y="90" width="30" height="30"/>
        <rect x="0" y="120" width="30" height="30"/>
        <rect x="30" y="150" width="30" height="30"/>
        <rect x="0" y="180" width="30" height="20"/>
      </g>
      <g fill="none" stroke="#000000" stroke-width="2">
        <rect x="0" y="0" width="60" height="200"/>
      </g>
    </svg>`
  },

  {
    id: 'tribal-cyber',
    name: 'Cybersigilism',
    category: 'Streetwear & Y2K',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <path d="M100 10 C120 50 180 80 190 120 C195 140 170 150 150 130 C130 110 110 80 100 80 C90 80 70 110 50 130 C30 150 5 140 10 120 C20 80 80 50 100 10 Z" fill="#000000"/>
      <path d="M100 40 C85 60 50 85 55 110 C58 120 65 120 75 105 C85 90 95 80 100 80 C105 80 115 90 125 105 C135 120 142 120 145 110 C150 85 115 60 100 40 Z" fill="white"/>
      <path d="M100 190 C110 160 140 140 135 125 C130 110 110 130 100 140 C90 130 70 110 65 125 C60 140 90 160 100 190 Z" fill="#000000"/>
    </svg>`
  },

  {
    id: 'paint-brush-stroke',
    name: 'Brush Stroke',
    category: 'Streetwear & Y2K',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 60">
      <path d="M10 30 C30 10 80 40 120 20 C160 0 220 50 260 20 C280 5 290 25 285 35 C280 45 250 25 210 45 C170 65 120 15 80 40 C50 60 0 45 10 30 Z" fill="#000000" opacity="0.9"/>
      <path d="M20 35 C40 25 70 45 110 30 C150 15 200 45 240 30 C260 20 275 35 265 40 C250 50 200 30 160 45 C120 60 70 30 50 45 C30 55 5 45 20 35 Z" fill="#000000" opacity="0.5"/>
    </svg>`
  },

  {
    id: 'monstera-leaf-2',
    name: 'Monstera',
    category: 'Nature',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <g fill="#000000">
        <path d="M100 190 C95 150 90 110 100 70 C110 30 150 10 150 10 C150 10 170 40 180 80 C185 100 170 120 150 110 C140 105 130 95 120 80 C130 100 135 120 125 130 C115 140 105 130 95 110 C100 130 100 160 90 180 C80 200 100 190 100 190 Z"/>
        <path d="M100 70 C80 30 40 20 40 20 C40 20 20 50 10 90 C5 110 25 130 45 120 C55 115 65 105 75 90 C65 110 60 130 70 140 C80 150 90 140 100 120 C95 140 95 160 100 180" fill="#000000"/>
        <ellipse cx="120" cy="50" rx="10" ry="15" transform="rotate(30 120 50)" fill="white"/>
        <ellipse cx="70" cy="65" rx="8" ry="12" transform="rotate(-40 70 65)" fill="white"/>
      </g>
    </svg>`
  }

];
