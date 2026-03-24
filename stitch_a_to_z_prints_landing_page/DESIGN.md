# Design System Specification

## 1. Overview & Creative North Star: "The Digital Atelier"
This design system moves away from the generic "SaaS-blue" corporate template and adopts the persona of **The Digital Atelier**. It treats the screen as a high-end editorial canvas where precision meets craftsmanship. Inspired by the tactile nature of premium print and corporate gifting, the interface prioritizes intentional asymmetry, vast "breathing room," and a sophisticated layering of digital "substrates." 

We break the rigid grid by allowing high-quality imagery to overlap containers and using typography scales that demand attention. This is not just a tool; it is a showcase of print-grade precision.

---

## 2. Color Philosophy
The palette is a dialogue between deep, authoritative foundations and vibrant, ink-inspired accents.

- **Primary & Secondary:** Use `primary` (#b7004d - Magenta) and `secondary` (#0062a1 - Cyan) sparingly as "ink hits." They represent the core CMYK origins of the brand.
- **The "No-Line" Rule:** We do not use 1px solid borders to define sections. Boundaries must be defined solely through background color shifts. For example, a `surface-container-low` section should sit against a `surface` background to create a clean, modern break.
- **Surface Hierarchy & Nesting:** Treat the UI as physical layers of paper. 
    - Use `surface_container_lowest` for the primary work surface.
    - Nest elements using `surface_container` and `surface_container_high` to create organic depth without relying on heavy shadows.
- **The "Glass & Gradient" Rule:** To provide visual "soul," main CTAs and Hero backgrounds should utilize subtle gradients (e.g., `primary` transitioning to `primary_container`). Floating navigation or utility panels should use Glassmorphism: semi-transparent surface colors with a `backdrop-filter: blur(20px)` to keep the layout feeling integrated.

---

## 3. Typography
The system uses a pairing of **Manrope** for impact and **Inter** for utility.

- **Display & Headlines (Manrope):** Chosen for its geometric precision and modern efficiency. Use `display-lg` (3.5rem) for hero statements to evoke the feel of a high-end magazine masthead.
- **Body & Titles (Inter):** Inter provides a neutral, highly legible contrast to the character of Manrope. 
- **The Editorial Scale:** We use high contrast between font sizes. A large `headline-lg` paired with a significantly smaller, tracked-out `label-md` creates an authoritative hierarchy that feels curated rather than automated.

---

## 4. Elevation & Depth
Depth is achieved through **Tonal Layering** rather than traditional structural lines or heavy shadows.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` background. This creates a soft, natural lift mimicking the way heavy cardstock sits on a table.
- **Ambient Shadows:** Shadows must be felt, not seen. Use extra-diffused blur values (20px-40px) at 4%-8% opacity. Use a tint of `on_surface` (#101b30) for the shadow color to ensure it feels like a natural lighting effect.
- **The "Ghost Border" Fallback:** If a border is required for accessibility, use the `outline_variant` (#e4bdc2) at **10% opacity**. 100% opaque borders are strictly prohibited.
- **Tactile Glass:** Floating elements (like tooltips or sticky headers) should use semi-transparent surface colors to allow the vibrant brand colors to bleed through subtly, softening the composition.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill from `primary` to `primary_container`. 8px corner radius (`rounded-lg`). Text is `on_primary` (White).
- **Secondary:** Surface-based with a "Ghost Border." High-end professional feel.
- **Tertiary:** No background. Bold `primary` text. Used for low-priority actions within dense layouts.

### Cards & Lists
- **The "No-Divider" Rule:** Forbid 1px horizontal lines. Use the Spacing Scale (`spacing-6` or `spacing-8`) to create separation. 
- **Visual Nesting:** Use a `surface_container_highest` background for a sidebar and `surface_container_lowest` for the cards within it.

### Input Fields
- **Style:** Sharp 4px corners (`rounded-DEFAULT`). 
- **States:** The focus state should not be a thick border, but a subtle glow using `secondary` at 20% opacity and a shift in the background to `surface_bright`.

### Print-Specific Components
- **Texture Previews:** Components that house paper-stock imagery should use `surface_dim` as a backdrop to make white paper textures "pop."
- **Spec Chips:** Use `secondary_container` for technical specs (e.g., "GSM", "Finish"). These should be compact and use `label-sm` typography.

---

## 6. Do's and Don'ts

### Do
- **Do** use generous whitespace (Scale 16, 20, 24) to frame high-quality imagery.
- **Do** lean into asymmetry. Place text on the left with a large, high-quality image overlapping the right edge of the container.
- **Do** use `surface_tint` at very low opacities to give neutral sections a hint of the brand’s magenta soul.

### Don't
- **Don't** use pure black (#000000). Use `on_surface` (#101b30) for all "black" text and icons to maintain the premium navy foundation.
- **Don't** use standard "drop shadows" on cards. Stick to Tonal Layering.
- **Don't** use 1px dividers. If you feel the need for a line, use a background color change instead.
- **Don't** crowd the interface. If a screen feels "busy," increase the spacing scale and simplify the surface tiers.

---

## 7. Token Reference Summary

| Category | Token | Value | Application |
| :--- | :--- | :--- | :--- |
| **Corner** | `rounded-lg` | 0.5rem (8px) | Main CTA Buttons & Large Cards |
| **Corner** | `rounded-DEFAULT` | 0.25rem (4px) | Input Fields & Form Elements |
| **Spacing** | `spacing-12` | 4rem | Standard Section Padding |
| **Color** | `primary` | #b7004d | Action-oriented elements |
| **Color** | `surface` | #f9f9ff | Main application background |
| **Shadow** | `ambient` | 0 20px 40px | 4% Opacity of `#101b30` |