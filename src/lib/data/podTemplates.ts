// podTemplates.ts
// SVG templates for different product angles (Front, Back, Left Sleeve)
// Each template includes the SVG base and the specific printZone coordinates for that angle.

export interface PrintZone {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface PodTemplate {
  id: 'front' | 'back' | 'sleeve';
  name: string;
  svg: string;
  printZone: PrintZone;
}

export const podTemplates: Record<'front' | 'back' | 'sleeve', PodTemplate> = {
  front: {
    id: 'front',
    name: 'Front View',
    // The beautiful flat-lay front we already established
    svg: `<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.08" />
        </filter>
        <clipPath id="shirt-clip-front">
          <path d="M260 120 C320 120 340 180 400 180 C460 180 480 120 540 120 C580 130 650 180 720 280 C740 310 700 360 670 330 C640 300 620 260 610 320 C580 500 580 700 580 700 C580 740 500 750 400 750 C300 750 220 740 220 700 C220 700 220 500 190 320 C180 260 160 300 130 330 C100 360 60 310 80 280 C150 180 220 130 260 120 Z" />
        </clipPath>
      </defs>
      
      <g filter="url(#shadow)">
        <path d="M260 120 C320 120 340 180 400 180 C460 180 480 120 540 120 C580 130 650 180 720 280 C740 310 700 360 670 330 C640 300 620 260 610 320 C580 500 580 700 580 700 C580 740 500 750 400 750 C300 750 220 740 220 700 C220 700 220 500 190 320 C180 260 160 300 130 330 C100 360 60 310 80 280 C150 180 220 130 260 120 Z" fill="currentColor" />
        
        <g stroke="#000" stroke-opacity="0.1" stroke-width="2" fill="none">
          <path d="M260 120 C320 120 340 180 400 180 C460 180 480 120 540 120" />
          <path d="M220 240 C280 280 340 240 400 260 C460 280 520 280 580 240" />
          <path d="M190 320 C220 450 210 600 220 700" />
          <path d="M610 320 C580 450 590 600 580 700" />
          <path d="M220 700 C300 740 500 740 580 700" />
          <path d="M190 320 C230 310 240 250 250 160" />
          <path d="M610 320 C570 310 560 250 550 160" />
          <path d="M260 120 C280 140 300 160 340 160 C380 160 400 140 400 120" />
          <path d="M540 120 C520 140 500 160 460 160 C420 160 400 140 400 120" />
        </g>
        
        <g fill="#000" fill-opacity="0.03" clip-path="url(#shirt-clip-front)">
          <path d="M190 320 Q250 400 220 700 L0 750 L0 120 Z" />
          <path d="M610 320 Q550 400 580 700 L800 750 L800 120 Z" />
          <path d="M260 120 Q400 250 540 120 L800 0 L0 0 Z" fill-opacity="0.05" />
        </g>
      </g>
      
      <!-- Inner tag / label -->
      <path d="M360 160 C380 180 420 180 440 160 L420 130 L380 130 Z" fill="#000" fill-opacity="0.08" />
      <text x="400" y="150" font-family="sans-serif" font-size="12" font-weight="bold" fill="#000" fill-opacity="0.3" text-anchor="middle">L</text>
    </svg>`,
    printZone: {
      x: 0.35,
      y: 0.28,
      width: 0.30,
      height: 0.45
    }
  },
  
  back: {
    id: 'back',
    name: 'Back View',
    // Back view has higher neckline, no internal tag visible, different crease lines
    svg: `<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-back" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.08" />
        </filter>
        <clipPath id="shirt-clip-back">
          <path d="M260 110 C320 100 340 120 400 120 C460 120 480 100 540 110 C580 120 650 170 720 270 C740 300 700 350 670 320 C640 290 620 250 610 310 C580 490 580 690 580 690 C580 730 500 740 400 740 C300 740 220 730 220 690 C220 690 220 490 190 310 C180 250 160 290 130 320 C100 350 60 300 80 270 C150 170 220 120 260 110 Z" />
        </clipPath>
      </defs>
      
      <g filter="url(#shadow-back)">
        <!-- Higher neckline for back view -->
        <path d="M260 110 C320 100 340 120 400 120 C460 120 480 100 540 110 C580 120 650 170 720 270 C740 300 700 350 670 320 C640 290 620 250 610 310 C580 490 580 690 580 690 C580 730 500 740 400 740 C300 740 220 730 220 690 C220 690 220 490 190 310 C180 250 160 290 130 320 C100 350 60 300 80 270 C150 170 220 120 260 110 Z" fill="currentColor" />
        
        <g stroke="#000" stroke-opacity="0.1" stroke-width="2" fill="none">
          <path d="M260 110 C320 100 340 120 400 120 C460 120 480 100 540 110" />
          <!-- Small crescent seam at back of neck -->
          <path d="M320 140 C360 150 440 150 480 140" stroke-opacity="0.15" />
          <path d="M220 240 C280 260 340 220 400 240 C460 260 520 260 580 240" />
          <path d="M190 310 C220 440 210 590 220 690" />
          <path d="M610 310 C580 440 590 590 580 690" />
          <path d="M220 690 C300 730 500 730 580 690" />
          <path d="M190 310 C230 300 240 240 250 150" />
          <path d="M610 310 C570 300 560 240 550 150" />
        </g>
        
        <g fill="#000" fill-opacity="0.03" clip-path="url(#shirt-clip-back)">
          <path d="M190 310 Q250 390 220 690 L0 740 L0 110 Z" />
          <path d="M610 310 Q550 390 580 690 L800 740 L800 110 Z" />
          <path d="M260 110 Q400 240 540 110 L800 0 L0 0 Z" fill-opacity="0.05" />
        </g>
      </g>
    </svg>`,
    printZone: {
      x: 0.35,
      y: 0.23, // higher up on the back
      width: 0.30,
      height: 0.45
    }
  },

  sleeve: {
    id: 'sleeve',
    name: 'Left Sleeve',
    // Rotated side/sleeve view focusing on the left shoulder and sleeve
    svg: `<svg viewBox="0 0 800 800" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-sleeve" x="-5%" y="-5%" width="110%" height="110%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" flood-opacity="0.08" />
        </filter>
        <clipPath id="shirt-clip-sleeve">
          <path d="M300 100 C400 80 480 150 500 200 C550 250 680 380 700 450 C720 500 650 550 600 500 C550 450 500 350 480 300 C480 400 480 650 460 700 C400 750 350 780 250 750 C230 700 200 650 200 450 C200 350 220 280 250 200 C250 150 280 120 300 100 Z" />
        </clipPath>
      </defs>
      
      <g filter="url(#shadow-sleeve)">
        <path d="M300 100 C400 80 480 150 500 200 C550 250 680 380 700 450 C720 500 650 550 600 500 C550 450 500 350 480 300 C480 400 480 650 460 700 C400 750 350 780 250 750 C230 700 200 650 200 450 C200 350 220 280 250 200 C250 150 280 120 300 100 Z" fill="currentColor" />
        
        <g stroke="#000" stroke-opacity="0.1" stroke-width="2" fill="none">
          <path d="M300 100 C360 120 420 180 500 200" />
          <path d="M500 200 C510 280 490 320 480 300" />
          <!-- Sleeve seam (critical) -->
          <path d="M400 130 C450 190 480 260 480 300" stroke-width="3" stroke-dasharray="4" />
          <path d="M460 700 C400 720 350 750 250 750" />
          <path d="M250 200 C270 300 280 450 250 750" />
          <path d="M480 300 C480 400 470 600 460 700" />
          <path d="M600 500 C610 520 650 520 700 450" />
        </g>
        
        <g fill="#000" fill-opacity="0.04" clip-path="url(#shirt-clip-sleeve)">
          <path d="M250 200 Q280 400 250 750 L0 750 L0 200 Z" />
          <path d="M480 300 Q600 400 700 450 L800 100 L400 100 Z" fill-opacity="0.06" />
        </g>
      </g>
    </svg>`,
    printZone: {
      x: 0.53, // Right side of the canvas where the sleeve is extended
      y: 0.28, // Top third
      width: 0.18, // Narrow width
      height: 0.15 // Short height (like a small logo)
    }
  }
};
