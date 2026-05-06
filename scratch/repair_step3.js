const fs = require('fs');
const path = 'src/app/admin/products/edit/[slug]/page.tsx';
let content = fs.readFileSync(path, 'utf8');

// I will find the end of Step 2 and the beginning of what's left of Step 3
const step2End = '              )}';
const step3Leftover = 'return (';

const step2EndIdx = content.indexOf(step2End, content.indexOf('STEP 2: COMMERCE'));
const step3LeftoverIdx = content.indexOf(step3Leftover, step2EndIdx);

if (step2EndIdx !== -1 && step3LeftoverIdx !== -1) {
    const part1 = content.substring(0, step2EndIdx + step2End.length);
    const part2 = content.substring(step3LeftoverIdx);
    
    const step3 = `

              {/* STEP 3: DESIGN STUDIO (COLOUR VARIANTS OR TEMPLATES) */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <section className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-xl shadow-gray-100/50">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-xl font-black text-brand-dark flex items-center gap-3 italic uppercase tracking-tighter">
                          <div className="h-6 w-1 bg-brand-pink rounded-full"></div>
                          {formData.design_mode === 'template_form' || formData.design_mode === 'intake_form' 
                            ? 'Template Mockups & Fields' 
                            : 'Color Product Variations (Wireframes)'}
                       </h2>
                       {!(formData.design_mode === 'template_form' || formData.design_mode === 'intake_form') && (
                         <button type="button" onClick={() => setFormData((prev: any) => ({ ...prev, color_variants: [...prev.color_variants, { name: 'New Color', hex: '#000000', wireframe_images: ['', '', '', ''] }] }))} className="px-4 py-2 bg-[#6C5CE7]/10 text-[#6C5CE7] hover:bg-[#6C5CE7] hover:text-white transition-all text-[9px] font-black uppercase tracking-widest rounded-full border shadow-sm">+ Add Variant</button>
                       )}
                    </div>

                    {(formData.design_mode === 'template_form' || formData.design_mode === 'intake_form') ? (
                       // TEMPLATE FORM BUILDER
                       <div className="space-y-8">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                           {[0, 1, 2, 3].map((idx) => {
                              const url = formData.template_images?.[idx];
                              const defaultName = idx === 0 ? 'Front Side' : idx === 1 ? 'Back Side' : \`Side \${idx + 1}\`;
                              const tName = formData.design_config?.templates?.[idx]?.name || defaultName;
                              
                              `;
    
    fs.writeFileSync(path, part1 + step3 + part2);
    console.log('Restored Step 3');
} else {
    console.log('Could not find Step 2 end or Step 3 leftover');
}
