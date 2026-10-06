# KSENZA Luxury Real Estate Website - Design Guidelines

## Design Approach

**Reference-Based Luxury Real Estate Design**

Primary inspirations: Amali Properties, awwwards.com luxury real estate sites, and high-end property platforms like Sotheby's Realty. The design emphasizes sophistication, exclusivity, and trust through elegant layouts, generous whitespace, and refined visual hierarchy.

**Core Design Principles:**
- **Luxurious Minimalism**: Clean layouts with intentional negative space
- **Visual Storytelling**: Large, cinematic imagery showcasing Dubai's premium properties
- **Effortless Navigation**: Intuitive, friction-free user journeys
- **Trust & Credibility**: Professional, polished presentation throughout

---

## Typography System

**Font Families:**
- **Tiempose Headline**: All headings (H1-H6), hero titles, property names, section headers
- **Sora**: Body text, UI elements, navigation, form labels, property descriptions

**Type Scale:**
- Hero Headlines: 4xl to 6xl (text-4xl md:text-6xl)
- Section Headings: 3xl to 4xl (text-3xl md:text-4xl)
- Property Titles: 2xl to 3xl
- Body Text: base to lg (text-base md:text-lg)
- UI Elements: sm to base
- Captions/Labels: xs to sm

**Type Styling:**
- Headings: font-normal to font-light (elegant, not heavy)
- Body: font-normal, generous line-height (1.7-1.8)
- Letter spacing: Slightly increased for headlines (tracking-wide)

---

## Color Implementation

**Primary Palette:**
- **Warm Beige** (rgb(188,158,125)): Accent elements, hover states, subtle backgrounds, decorative lines
- **Deep Burgundy** (rgb(127,20,46)): Primary CTAs, active states, key highlights, navigation accents
- **Dark Charcoal** (rgb(51,51,51)): Primary text, headings, borders

**Supporting Neutrals:**
- Off-white/Cream (rgb(250,248,245)): Page backgrounds, card backgrounds
- Light Gray (rgb(240,238,235)): Dividers, subtle borders
- Pure White: Overlays, modal backgrounds

**Usage Guidelines:**
- Backgrounds: Cream/off-white dominates with strategic dark charcoal sections
- Text: Dark charcoal primary, warm beige for secondary/accent text
- CTAs: Deep burgundy backgrounds with white text, warm beige hover states
- Accents: Warm beige decorative elements, section dividers, underlines

---

## Layout System

**Spacing Primitives:**
Use Tailwind units: 2, 4, 6, 8, 12, 16, 20, 24, 32

- Component padding: p-6 to p-8
- Section padding vertical: py-16 to py-32 (responsive)
- Card spacing: gap-6 to gap-8
- Element margins: mb-4, mb-6, mb-8

**Container Strategy:**
- Full-width sections with inner max-w-7xl container
- Property cards/content: max-w-6xl
- Long-form text: max-w-4xl
- Form sections: max-w-2xl

**Grid Systems:**
- Property listings: 1 column mobile, 2 columns tablet, 3 columns desktop
- Feature sections: 1/2/4 column responsive grids
- Blog posts: 1/2/3 column masonry-style layout

---

## Page-Specific Designs

### Home Page

**Hero Section (Full viewport height):**
- Cinematic full-bleed image/video background showcasing Dubai skyline or luxury property
- Centered content overlay with translucent dark gradient
- Large Tiempose headline: "Discover Luxury Living in Dubai"
- Subheading in Sora describing KSENZA's unique value
- Primary CTA button with blurred background: "Explore Properties"
- Secondary link: "Schedule Consultation"
- Scroll indicator at bottom

**Featured Properties Section:**
- 3-column grid of property cards (responsive)
- Each card: Large property image, location badge, property name, price, key specs (beds/baths/sqft), "View Details" link
- Subtle warm beige border on hover with smooth transition
- Section header with "Featured Listings" and "View All Properties" link

**Services Overview:**
- 4-column icon grid (2 columns mobile)
- Icons in warm beige with service names
- Services: Buying, Selling, Renting, Property Management
- Brief description under each

**Why KSENZA Section:**
- Split layout: Large luxury property image left, content right (stacked mobile)
- 4-5 key differentiators with burgundy accent marks
- Elegant typography hierarchy

**Client Types Section:**
- Horizontal cards showcasing: Investors, Expatriates, First-Time Buyers, High-Net-Worth Clients
- Each with icon, title, brief description

**CTA Section:**
- Full-width warm beige background
- Centered content: Compelling headline + CTA button
- "Ready to find your dream property?"

### About Us Page

**Hero Section:**
- Large Dubai cityscape image with overlay
- Centered headline: "Your Trusted Partner in Dubai Real Estate"
- Breadcrumb navigation

**Company Story:**
- Alternating image-text sections
- Timeline-style layout showing company evolution
- Professional team photo section

**Mission & Vision:**
- Side-by-side cards with burgundy accents
- Icons representing core values

**Team Section:**
- Grid of team member cards with professional headshots
- Names, titles, brief bios

### Properties Page

**Search & Filter Bar:**
- Sticky top bar with expandable filters
- Filters: Property Type dropdown, Location multiselect, Price range slider, Size range inputs, Bedrooms/Bathrooms selectors
- "Search" button in burgundy
- Active filter tags with dismiss buttons

**Property Grid:**
- 3-column responsive grid
- Each card: Large image, property type badge, location, price (prominent), specs row, heart icon (save), "View Details" CTA
- Lazy loading with skeleton screens
- Sort dropdown: Price, Newest, Size

**Individual Property Page:**
- Full-width image gallery with thumbnails
- Sticky inquiry sidebar: Price, key specs, "Schedule Viewing" and "Request Info" buttons
- Tabbed content: Overview, Features & Amenities, Location Map, Floor Plans
- Related properties carousel at bottom

### Blog Page

**Masonry Grid Layout:**
- Featured article hero at top (large image, overlay text)
- 3-column masonry grid below
- Article cards: Image, category tag, title, excerpt, author/date, "Read More"
- Categories filter sidebar

### Contact Page

**Split Layout:**
- Left: Elegant contact form with warm beige accents
  - Fields: Name, Email, Phone, Property Interest dropdown, Message textarea
  - Burgundy submit button
  - Form validation with subtle animations
- Right: Contact information card + Google Maps embed
  - Office address, phone, email with icons
  - Office hours
  - Social media links

---

## Component Library

**Navigation:**
- Top navigation bar with transparent background over hero, solid on scroll
- KSENZA logo left, menu items center/right
- Desktop: Horizontal menu with dropdown for Properties
- Mobile: Hamburger menu with slide-in drawer
- Search icon, language switcher, contact CTA button

**Property Cards:**
- Image with hover zoom effect
- Location badge overlay (top-left)
- Heart icon bookmark (top-right)
- Bottom section: Price, title, specs row with icons
- Subtle shadow, increased shadow on hover

**Buttons:**
- Primary: Deep burgundy background, white text, rounded corners, subtle shadow
- Secondary: Warm beige border, charcoal text, transparent background
- Blurred buttons on images: Semi-transparent white background with backdrop-blur
- All buttons: Smooth hover transitions (no complex interactions)

**Form Inputs:**
- Clean, minimal styling with warm beige focus borders
- Floating labels or placeholder text
- Proper spacing and alignment
- Error states in burgundy

**Footer:**
- Dark charcoal background with warm beige/white text
- 4-column layout: About, Quick Links, Properties, Contact
- Newsletter signup form
- Bottom bar: Copyright, legal links, social icons

**Modals/Overlays:**
- Property inquiry forms
- Image lightboxes for galleries
- Confirmation messages

---

## Images

**Required Images:**

1. **Home Hero**: Dubai skyline at golden hour or luxury waterfront property (full-width, min 1920x1080)
2. **Featured Properties**: 6-9 high-quality property photos showcasing interiors and exteriors
3. **About Us Hero**: Professional Dubai cityscape or KSENZA office exterior
4. **Company Story**: 2-3 images showing Dubai development, team at work
5. **Team Members**: Professional headshots of 6-8 team members
6. **Property Listings**: Multiple images per property (15-20 unique properties for demo)
7. **Blog**: Featured images for 6-8 articles (real estate related)
8. **Contact**: Office exterior or elegant interior shot

**Image Treatment:**
- Professional, high-resolution photography
- Consistent color grading with warm tones
- Strategic overlays for text readability
- Optimized for web performance

---

## Animations & Interactions

**Minimal, Purposeful Motion:**
- Smooth page transitions (200-300ms)
- Property card hover: Subtle scale (1.02) and shadow increase
- Filter dropdown: Slide down animation
- Image galleries: Smooth crossfade
- Scroll-triggered fade-ins for section content (subtle)
- **No parallax effects, no excessive scroll animations**

---

## Responsive Breakpoints

- Mobile: < 768px (single column, stacked layouts)
- Tablet: 768px - 1024px (2 columns, adjusted spacing)
- Desktop: > 1024px (full multi-column layouts)
- Large Desktop: > 1440px (maximum container width constraints)