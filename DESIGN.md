# Design System: High-End Editorial for AI Agent Skills

## 1. Overview & Creative North Star
**Creative North Star: "The Digital Atelier"**
This design system moves away from the sterile, plastic feel of modern SaaS and toward the warmth of a high-end physical workspace. It treats AI agent management not as a technical chore, but as a curated craft. By utilizing a "Soft Minimalism" approach, we prioritize breathing room, tactile surfaces, and a sophisticated tonal palette that invites focus and calm.

The system breaks the "template" look through **intentional asymmetry** and **tonal layering**. Rather than using rigid borders to define space, we use shifts in light and depth to guide the eye, creating an interface that feels organic and premium.

---

## 2. Colors
Our palette is a sophisticated suite of warm neutrals, designed to reduce cognitive load and evoke a sense of "cozy productivity."

### The "No-Line" Rule
**Borders are prohibited for sectioning.** To define boundaries between content areas, use background color shifts only. For example, a sidebar should reside on `surface`, while the main content area sits on `surface_container_low`. This creates a seamless, high-end editorial feel that avoids the "grid-trapped" look of standard dashboards.

### Surface Hierarchy & Nesting
Depth is achieved through the physical stacking of tones:
- **Level 0 (Base):** `background` (#fbf9f4)
- **Level 1 (Sections):** `surface_container_low` (#f5f4ed)
- **Level 2 (Cards/Modules):** `surface_container_lowest` (#ffffff)
- **Level 3 (Floating/Active):** `surface_bright` (#fbf9f4)

### Glass & Gradient Rule
For main CTAs and "Hero" cards, use a subtle linear gradient from `primary` (#615e57) to `primary_dim` (#55524c). For floating modal overlays, use a semi-transparent `surface` color with a **24px backdrop-blur** to create a "frosted glass" effect, allowing the warm neutrals of the workspace to bleed through.

---

## 3. Typography
We utilize a pairing of **Manrope** for expressive editorial weight and **Inter** for functional precision.

*   **Display & Headlines (Manrope):** These are the "voice" of the platform. Use `display-lg` (3.5rem) with tight letter spacing for welcome states. Use `headline-md` (1.75rem) for page titles to establish an authoritative yet approachable tone.
*   **Body (Manrope):** `body-lg` (1rem) is the workhorse. The generous x-height of Manrope ensures that even dense agent logs feel readable and premium.
*   **Labels (Inter):** For technical metadata, agent statuses, and micro-copy, switch to `label-md` (Inter, 0.75rem). The shift to a more utilitarian font signals to the user that they are looking at "data" rather than "narrative."

---

## 4. Elevation & Depth
In "The Digital Atelier," depth is felt, not seen. We avoid heavy dropshadows in favor of **Tonal Layering**.

*   **The Layering Principle:** To lift a card, do not reach for a shadow first. Place a `surface_container_lowest` (#ffffff) element on top of a `surface_container_low` (#f5f4ed) background. The 3% shift in luminance is enough to signify depth to the human eye while maintaining a clean aesthetic.
*   **Ambient Shadows:** When an element must "float" (e.g., a dropdown or a dragged skill icon), use a shadow tinted with `on_surface` (#31332c).
    *   *Spec:* `0px 12px 32px rgba(49, 51, 44, 0.06)`
*   **The Ghost Border:** If a container requires more definition for accessibility (e.g., an input field), use the `outline_variant` (#b1b3a9) at **15% opacity**. Never use 100% opaque borders.

---

## 5. Components

### Buttons
*   **Primary:** Background: `primary` (#615e57); Text: `on_primary` (#fdf7ee). Shape: `md` (0.75rem).
*   **Secondary:** Background: `secondary_container` (#ece1d2); Text: `on_secondary_container` (#585145).
*   **Tertiary:** Text only using `primary` with no container, used for low-emphasis actions like "Cancel" or "View Docs."

### Cards & Skill Modules
*   **Layout:** Cards must use `xl` (1.5rem) rounded corners.
*   **Constraint:** Forbid the use of divider lines. Separate content using vertical whitespace (24px or 32px) or by nesting a `surface_container` inside the card.
*   **Interactive State:** On hover, a card should shift from `surface_container_lowest` to `surface_bright` with a 4% ambient shadow.

### Inputs & Search
*   **Search Bar:** Use `surface_container_high` (#e8e9e0) with `full` (9999px) rounding. The search icon should be `outline` (#797c73).
*   **Active State:** When focused, the background remains, but a 1px "Ghost Border" appears at 20% opacity.

### Navigation (Sidebar)
*   **Active Link:** Use a soft pill shape with `primary_container` (#e8e2d9) and `on_primary_container` (#55514b) text.
*   **Inactive Link:** `on_surface_variant` (#5e6058) with no background.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use asymmetrical layouts. Let the sidebar be wider or have content blocks of varying widths to create an "editorial" feel.
*   **Do** utilize the `lg` (1rem) and `xl` (1.5rem) corner radii for large containers to emphasize the "cozy" brand personality.
*   **Do** use `surface_dim` (#d9dbcf) for very subtle "well" areas where content like code snippets or logs are housed.

### Don't
*   **Don't** use pure black (#000000) for text. Always use `on_surface` (#31332c) to maintain the warm, premium tone.
*   **Don't** use standard 1px borders to separate list items. Use 12px of `gap` and a slight background color change on hover.
*   **Don't** use high-vibrancy colors for success or error states. Use the muted `error` (#9e422c) and `on_error_container` (#742410) to keep the "calm" promise of the system.