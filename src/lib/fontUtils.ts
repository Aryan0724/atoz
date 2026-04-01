/**
 * Utility to load Google Fonts dynamically and ensure they are ready for canvas rendering.
 */

const loadedFonts = new Set<string>();

export const loadGoogleFont = async (fontFamily: string): Promise<boolean> => {
  if (loadedFonts.has(fontFamily)) return true;

  return new Promise((resolve) => {
    // If we're not in the browser
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    try {
      // Create font link
      const fontName = fontFamily.split(',')[0].replace(/['"]/g, '').trim();
      const googleFontUrl = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;700;900&display=swap`;

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = googleFontUrl;

      link.onload = () => {
        // Use document.fonts API to wait for actual loading if supported
        if ('fonts' in document) {
          (document as any).fonts.load(`1em "${fontName}"`)
            .then(() => {
              loadedFonts.add(fontFamily);
              resolve(true);
            })
            .catch(() => {
              // Even if it fails, we resolve true to avoid blocking the UI forever
              loadedFonts.add(fontFamily);
              resolve(true);
            });
        } else {
          loadedFonts.add(fontFamily);
          resolve(true);
        }
      };

      link.onerror = () => {
        console.error(`Failed to load font: ${fontName}`);
        resolve(false);
      };

      document.head.appendChild(link);
    } catch (err) {
      console.error('Error in loadGoogleFont:', err);
      resolve(false);
    }
  });
};

/**
 * Pre-curated font list for the designer
 */
export const designerFonts = [
  // Sans-Serif (Clean, Modern)
  { name: 'Inter', family: "'Inter', sans-serif", category: 'Sans-Serif' },
  { name: 'Montserrat', family: "'Montserrat', sans-serif", category: 'Sans-Serif' },
  { name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", category: 'Sans-Serif' },
  { name: 'Oswald', family: "'Oswald', sans-serif", category: 'Sans-Serif' },
  
  // Serif (Elegant, Classic)
  { name: 'Playfair Display', family: "'Playfair Display', serif", category: 'Serif' },
  { name: 'Merriweather', family: "'Merriweather', serif", category: 'Serif' },
  { name: 'Lora', family: "'Lora', serif", category: 'Serif' },
  
  // Script / Handwritten (Artistic, Fun)
  { name: 'Pacifico', family: "'Pacifico', cursive", category: 'Handwritten' },
  { name: 'Dancing Script', family: "'Dancing Script', cursive", category: 'Handwritten' },
  { name: 'Caveat', family: "'Caveat', cursive", category: 'Handwritten' },
  { name: 'Satisfy', family: "'Satisfy', cursive", category: 'Handwritten' },
  
  // Display (Bold, Impactful)
  { name: 'Righteous', family: "'Righteous', cursive", category: 'Display' },
  { name: 'Lobster', family: "'Lobster', cursive", category: 'Display' },
  { name: 'Abhaya Libre', family: "'Abhaya Libre', serif", category: 'Display' },
  { name: 'Luckiest Guy', family: "'Luckiest Guy', cursive", category: 'Display' },
];
