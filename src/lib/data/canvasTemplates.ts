export const canvasTemplates = [
  {
    id: 'vintage-motor',
    name: 'Vintage Motor Co.',
    category: 'Vintage',
    preview: '🏍️',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 180, width: 400,
          fill: '#C62828', text: 'IRON & OIL', fontSize: 72, fontWeight: 'black',
          fontFamily: 'Bebas Neue', textAlign: 'center', charSpacing: 250, id: 'vtg-1',
          shadow: { color: 'rgba(0,0,0,0.3)', offsetX: 2, offsetY: 2, blur: 0 }
        },
        {
          type: 'rect', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 230, width: 300, height: 4, fill: '#1A1A1A', id: 'vtg-line'
        },
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 280, width: 400,
          fill: '#1A1A1A', text: 'MOTOR CO.', fontSize: 110, fontWeight: 'black',
          fontFamily: 'Oswald', textAlign: 'center', charSpacing: 100, id: 'vtg-2'
        },
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 350, width: 300,
          fill: '#555555', text: 'CUSTOM BUILDERS • EST 1974', fontSize: 18, fontWeight: 'bold',
          fontFamily: 'Inter', textAlign: 'center', charSpacing: 400, id: 'vtg-3'
        }
      ]
    }
  },
  {
    id: 'cyberpunk-neon',
    name: 'Cyberpunk Tokyo',
    category: 'Streetwear',
    preview: '🌆',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 200, width: 400,
          fill: '#00FFFF', text: 'NEO', fontSize: 120, fontWeight: 'black',
          fontFamily: 'Righteous', textAlign: 'center', id: 'cyb-1',
          shadow: { color: '#00FFFF', offsetX: 0, offsetY: 0, blur: 20 }
        },
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 300, width: 400,
          fill: '#FF00FF', text: 'TOKYO', fontSize: 130, fontWeight: 'black',
          fontFamily: 'Bebas Neue', textAlign: 'center', charSpacing: 300, id: 'cyb-2',
          shadow: { color: '#FF00FF', offsetX: 0, offsetY: 0, blur: 20 },
          stroke: '#FFFFFF', strokeWidth: 1
        },
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 390, width: 300,
          fill: '#FFFFFF', text: 'シ ス テ ム エ ラ ー', fontSize: 24, fontWeight: 'bold',
          fontFamily: 'Inter', textAlign: 'center', charSpacing: 500, id: 'cyb-3'
        }
      ]
    }
  },
  {
    id: 'varsity-athletics',
    name: 'Varsity Athletics',
    category: 'Sports',
    preview: '🏈',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 160, width: 400,
          fill: '#0D47A1', text: 'BROOKLYN', fontSize: 60, fontWeight: 'black',
          fontFamily: 'Montserrat', textAlign: 'center', charSpacing: 300,
          _curve: 50, id: 'var-1'
        },
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 280, width: 400,
          fill: '#FFFFFF', text: '99', fontSize: 180, fontWeight: 'black',
          fontFamily: 'Bebas Neue', textAlign: 'center', id: 'var-2',
          stroke: '#0D47A1', strokeWidth: 8,
          shadow: { color: 'rgba(0,0,0,0.2)', offsetX: 4, offsetY: 4, blur: 0 }
        },
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 410, width: 400,
          fill: '#0D47A1', text: 'STATE CHAMPIONS', fontSize: 24, fontWeight: 'bold',
          fontFamily: 'Inter', textAlign: 'center', charSpacing: 500, id: 'var-3'
        }
      ]
    }
  },
  {
    id: 'modern-typography',
    name: 'Modern Minimal',
    category: 'Minimal',
    preview: 'Az',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 220, width: 400,
          fill: '#1A1A1A', text: 'CREATE.', fontSize: 85, fontWeight: 'black',
          fontFamily: 'Oswald', textAlign: 'center', charSpacing: -50, id: 'min-1'
        },
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 290, width: 400,
          fill: '#1A1A1A', text: 'INSPIRE.', fontSize: 85, fontWeight: 'black',
          fontFamily: 'Oswald', textAlign: 'center', charSpacing: -50, id: 'min-2'
        },
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 360, width: 400,
          fill: '#E91E63', text: 'EVOLVE.', fontSize: 85, fontWeight: 'black',
          fontFamily: 'Oswald', textAlign: 'center', charSpacing: -50, id: 'min-3'
        }
      ]
    }
  },
  {
    id: 'botanical-art',
    name: 'Botanical Garden',
    category: 'Art',
    preview: '🌿',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 250, width: 400,
          fill: '#2E7D32', text: 'Wild & Free', fontSize: 80, fontWeight: 'bold',
          fontFamily: 'Dancing Script', textAlign: 'center', id: 'bot-1'
        },
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 330, width: 400,
          fill: '#558B2F', text: 'LET NATURE BE YOUR GUIDE', fontSize: 20, fontWeight: 'bold',
          fontFamily: 'Montserrat', textAlign: 'center', charSpacing: 400, id: 'bot-2'
        }
      ]
    }
  },
  {
    id: 'retro-wave',
    name: 'Retrowave 80s',
    category: 'Vintage',
    preview: '🌇',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 220, width: 400,
          fill: '#FF9800', text: 'OUTRUN', fontSize: 90, fontWeight: 'black',
          fontFamily: 'Righteous', textAlign: 'center', id: 'retro-1',
          shadow: { color: '#FF9800', offsetX: 0, offsetY: 0, blur: 15 }
        },
        {
          type: 'i-text', version: '5.3.0', originX: 'center', originY: 'center',
          left: 250, top: 310, width: 400,
          fill: '#E040FB', text: '1984', fontSize: 130, fontWeight: 'bold',
          fontFamily: 'Pacifico', textAlign: 'center', id: 'retro-2',
          stroke: '#FFFFFF', strokeWidth: 2,
          shadow: { color: '#E040FB', offsetX: 0, offsetY: 0, blur: 10 }
        }
      ]
    }
  },
  {
    id: 'bottle-signature',
    name: 'Signature Label',
    category: 'Minimal',
    preview: '🍾',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect', left: 250, top: 250, originX: 'center', originY: 'center',
          width: 320, height: 400, fill: 'transparent', stroke: '#1A1A1A', strokeWidth: 2, id: 'frame-1'
        },
        {
          type: 'i-text', left: 250, top: 180, originX: 'center', originY: 'center',
          text: 'PREMIUM', fontSize: 18, fontWeight: 'black', fontFamily: 'Montserrat',
          charSpacing: 500, fill: '#1A1A1A', id: 'txt-1'
        },
        {
          type: 'i-text', left: 250, top: 250, originX: 'center', originY: 'center',
          text: 'PURE', fontSize: 72, fontWeight: 'black', fontFamily: 'Oswald',
          fill: '#1A1A1A', id: 'txt-2'
        },
        {
          type: 'i-text', left: 250, top: 320, originX: 'center', originY: 'center',
          text: 'Source. Nature. Life.', fontSize: 14, fontWeight: 'italic', fontFamily: 'Lora',
          fill: '#555555', id: 'txt-3'
        }
      ]
    }
  },
  {
    id: 'corporate-identity',
    name: 'Brand Standard',
    category: 'Corporate',
    preview: '💼',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect', left: 100, top: 50, width: 300, height: 10, fill: '#5B5B42', id: 'bar-1'
        },
        {
          type: 'i-text', left: 250, top: 200, originX: 'center', originY: 'center',
          text: 'COMPANY', fontSize: 32, fontWeight: 'black', fontFamily: 'Inter',
          fill: '#1A1A1A', charSpacing: 200, id: 'corp-1'
        },
        {
          type: 'i-text', left: 250, top: 240, originX: 'center', originY: 'center',
          text: 'I D E N T I T Y', fontSize: 12, fontWeight: 'bold', fontFamily: 'Inter',
          fill: '#999999', charSpacing: 600, id: 'corp-2'
        }
      ]
    }
  },
  {
    id: 'eco-bottle',
    name: 'Eco Warrior',
    category: 'Drinkware',
    preview: '💧',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'i-text', left: 250, top: 220, originX: 'center', originY: 'center',
          text: 'PURE', fontSize: 80, fontWeight: 'black', fontFamily: 'Bebas Neue',
          fill: '#2E7D32', id: 'eco-1'
        },
        {
          type: 'i-text', left: 250, top: 280, originX: 'center', originY: 'center',
          text: 'STAY HYDRATED', fontSize: 18, fontWeight: 'bold', fontFamily: 'Inter',
          fill: '#1B5E20', charSpacing: 300, id: 'eco-2'
        }
      ]
    }
  },
  {
    id: 'minimal-notebook',
    name: 'Ideas & Notes',
    category: 'Stationery',
    preview: '📓',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'rect', left: 250, top: 120, width: 40, height: 40, rx: 8, ry: 8, originX: 'center', originY: 'center',
          fill: '#5B5B42', id: 'nb-rect'
        },
        {
          type: 'i-text', left: 250, top: 250, originX: 'center', originY: 'center',
          text: 'JOURNAL', fontSize: 48, fontWeight: 'black', fontFamily: 'Oswald',
          fill: '#1A1A1A', charSpacing: 400, id: 'nb-1'
        },
        {
          type: 'i-text', left: 250, top: 310, originX: 'center', originY: 'center',
          text: 'EST 2024', fontSize: 14, fontWeight: 'bold', fontFamily: 'Inter',
          fill: '#999999', charSpacing: 200, id: 'nb-2'
        }
      ]
    }
  },
  {
    id: 'lifestyle-pouch',
    name: 'Daily Essentials',
    category: 'Lifestyle',
    preview: '👝',
    json: {
      version: '5.3.0',
      objects: [
        {
          type: 'i-text', left: 250, top: 250, originX: 'center', originY: 'center',
          text: 'ESSENTIALS', fontSize: 42, fontWeight: 'black', fontFamily: 'Bebas Neue',
          fill: '#1A1A1A', stroke: '#1A1A1A', strokeWidth: 1, id: 'ls-1'
        }
      ]
    }
  }
];

export const templateCategories = ['All', 'Apparel', 'Drinkware', 'Stationery', 'Lifestyle', 'Corporate', 'Vintage', 'Minimal', 'Art'];
