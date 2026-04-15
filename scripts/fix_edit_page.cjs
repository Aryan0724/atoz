const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'app', 'admin', 'products', 'edit', '[slug]', 'page.tsx');
let content = fs.readFileSync(filePath, 'utf8');
const lines = content.split('\n');

// Find boundaries
let startLine = -1, endLine = -1;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('SVG Required') && startLine === -1) startLine = i;
  if (startLine !== -1 && lines[i].includes('AI Prompt Booster')) { endLine = i; break; }
}

console.log('start:', startLine, 'end:', endLine);
if (startLine === -1 || endLine === -1) {
  console.log('SVG section not found - checking if already replaced');
  if (content.includes('PNG Upload')) {
    console.log('Already has PNG Upload badge. All good.');
  } else {
    console.log('ERROR: Cannot locate section');
  }
  process.exit(0);
}

const replacement = [
  `                       <div className="px-4 py-2 bg-brand-pink/5 text-brand-pink text-[9px] font-black uppercase tracking-widest rounded-full border border-brand-pink/10 shadow-sm">PNG Upload</div>`,
  `                     </div>`,
  ``,
  `                     <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">`,
  `                       {[`,
  `                         { label: 'Front View', idx: 0 },`,
  `                         { label: 'Back View', idx: 1 },`,
  `                         { label: 'Left Side', idx: 2 },`,
  `                         { label: 'Right Side', idx: 3 },`,
  `                       ].map((view) => (`,
  `                         <div key={view.idx} className="space-y-3">`,
  `                           <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">{view.label}</label>`,
  `                           <div className="aspect-[3/4] rounded-3xl overflow-hidden border-2 border-dashed border-gray-100 bg-gray-50/50 hover:border-brand-pink/30 hover:bg-white transition-all cursor-pointer relative group flex items-center justify-center">`,
  `                             {formData.wireframe_images[view.idx] ? (`,
  `                               <>`,
  `                                 <img src={formData.wireframe_images[view.idx]} alt={view.label} className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform" />`,
  `                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 px-4">`,
  `                                   <button type="button" onClick={() => setEditingArea({ url: formData.wireframe_images[view.idx], sideIndex: view.idx, sideKey: viewKeys[view.idx] })} className="w-full py-2 bg-brand-pink text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-lg">Define Area</button>`,
  `                                   <button type="button" onClick={() => { const newW = [...formData.wireframe_images]; newW[view.idx] = ''; setFormData({...formData, wireframe_images: newW}); }} className="w-full py-2 bg-white/10 hover:bg-red-500 backdrop-blur-md rounded-xl text-[10px] font-black text-white uppercase">Remove</button>`,
  `                                 </div>`,
  `                               </>`,
  `                             ) : (`,
  `                               <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer">`,
  `                                 <input type="file" className="hidden" accept="image/png,image/jpeg,image/webp" onChange={(e) => handleImageUpload(e, 'wireframe', view.idx)} />`,
  `                                 <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">`,
  `                                   <ImageIcon className="h-5 w-5 text-gray-300 group-hover:text-brand-pink" />`,
  `                                 </div>`,
  `                                 <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest text-center px-4">Upload Wireframe</span>`,
  `                               </label>`,
  `                             )}`,
  `                           </div>`,
  `                         </div>`,
  `                       ))}`,
  `                     </div>`,
  ``,
];

const result = [
  ...lines.slice(0, startLine),
  ...replacement,
  `                     {/* AI Prompt Booster Box */}`,
  ...lines.slice(endLine + 1)
];

fs.writeFileSync(filePath, result.join('\n'), 'utf8');
console.log('DONE. Total lines:', result.length);
