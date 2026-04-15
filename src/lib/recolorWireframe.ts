/**
 * Wireframe PNG Recolorizer — Flood Fill Edition
 *
 * For white-background wireframe PNGs (white body, dark outlines, white bg):
 *
 * ALGORITHM:
 * 1. BFS flood fill from all 4 edges → marks the OUTER white background
 * 2. Any remaining bright pixel NOT reached from edges = enclosed shirt body
 * 3. Recolor only the shirt body pixels with the selected color
 * 4. Dark outline pixels are untouched
 *
 * This correctly handles: white bg + white body + dark outlines
 * without coloring the background rectangle.
 */

export async function recolorWireframePng(
  imageUrl: string,
  hexColor: string
): Promise<string> {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const cvs = document.createElement('canvas');
      cvs.width = img.naturalWidth || 500;
      cvs.height = img.naturalHeight || 500;
      const ctx = cvs.getContext('2d')!;
      ctx.drawImage(img, 0, 0);

      const W = cvs.width;
      const H = cvs.height;
      const imageData = ctx.getImageData(0, 0, W, H);
      const data = imageData.data; // [R,G,B,A, R,G,B,A, ...]
      const total = W * H;

      // ── STEP 1: BFS flood fill from all edge pixels ──────────────────────────
      // Mark all "background" pixels reachable from the image boundary.
      // A pixel is traversable if it is bright (light-colored or transparent).
      // Dark outline pixels act as natural walls that stop the flood.

      const BRIGHT_THRESHOLD = 160; // pixels brighter than this can be background
      const visited = new Uint8Array(total); // 1 = confirmed background

      // Efficient BFS using a pre-allocated queue
      const queue = new Int32Array(total);
      let qHead = 0, qTail = 0;

      const isLight = (idx: number): boolean => {
        const a = data[idx * 4 + 3];
        if (a < 30) return true; // transparent → treat as background
        const brightness = (data[idx * 4] + data[idx * 4 + 1] + data[idx * 4 + 2]) / 3;
        return brightness > BRIGHT_THRESHOLD;
      };

      const enqueue = (x: number, y: number) => {
        if (x < 0 || x >= W || y < 0 || y >= H) return;
        const idx = y * W + x;
        if (visited[idx] || !isLight(idx)) return;
        visited[idx] = 1;
        queue[qTail++] = idx;
      };

      // Seed from all 4 edges
      for (let x = 0; x < W; x++) {
        enqueue(x, 0);
        enqueue(x, H - 1);
      }
      for (let y = 1; y < H - 1; y++) {
        enqueue(0, y);
        enqueue(W - 1, y);
      }

      // BFS expansion
      while (qHead < qTail) {
        const idx = queue[qHead++];
        const x = idx % W;
        const y = (idx - x) / W;
        enqueue(x + 1, y);
        enqueue(x - 1, y);
        enqueue(x, y + 1);
        enqueue(x, y - 1);
      }

      // ── STEP 2: Recolor enclosed bright pixels (the shirt body) ──────────────
      // visited[idx] === 0 && pixel is bright → enclosed interior = shirt body
      // visited[idx] === 1 → outer background → leave white
      // dark pixels → outlines → leave untouched

      for (let i = 0; i < total; i++) {
        const pa = data[i * 4 + 3];
        if (pa < 30) continue;          // transparent → skip
        if (visited[i]) continue;        // outer background → skip

        const brightness = (data[i * 4] + data[i * 4 + 1] + data[i * 4 + 2]) / 3;
        if (brightness > BRIGHT_THRESHOLD) {
          // Enclosed bright pixel → shirt body → recolor
          data[i * 4]     = r;
          data[i * 4 + 1] = g;
          data[i * 4 + 2] = b;
          // Alpha unchanged
        }
        // Dark pixels (brightness <= threshold) → outlines → untouched
      }

      ctx.putImageData(imageData, 0, 0);
      resolve(cvs.toDataURL('image/png'));
    };

    img.onerror = () => reject(new Error(`Failed to load wireframe: ${imageUrl}`));
    img.src = imageUrl;
  });
}
