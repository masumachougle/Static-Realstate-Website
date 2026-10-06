# KSENZA Luxury Real Estate Website

## Overview

KSENZA is a luxury real estate platform specializing in high-end properties in Dubai. The application targets investors, expatriates, first-time home buyers, and high-net-worth individuals seeking premium residential and commercial properties. The platform features property listings with advanced search and filtering, property comparison (up to 3 properties), favorites system, expandable photo galleries, currency conversion, availability status indicators, blog for market insights, WhatsApp contact widget, newsletter popup, and contact forms.

The application is built as a full-stack web application with a React frontend and Express backend, using PostgreSQL database for data persistence via Drizzle ORM. An admin panel allows content managers to create, edit, and delete properties and blog posts, as well as view customer inquiries.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Routing:**
- React 18 with TypeScript for type safety
- Wouter for client-side routing (lightweight alternative to React Router)
- Vite as the build tool and development server

**UI Component System:**
- shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling with custom design tokens
- Component library follows "New York" style variant
- Custom luxury design system with warm beige (RGB 188,158,125), deep burgundy (RGB 127,20,46), and dark charcoal (RGB 51,51,51) color palette

**State Management:**
- TanStack Query (React Query) for server state management and data fetching
- AuthContext: React Context for admin authentication state and login/logout functions
- ThemeContext: React Context for light/dark theme state (admin panel)
- ComparisonContext: React Context for managing property comparison state (up to 3 properties)
- FavoritesContext: React Context for managing favorited properties (persisted in localStorage with key "ksenza-favorites")
- Local component state with React hooks
- localStorage for client-side persistence:
  - "theme": Light/dark theme preference for admin panel
  - "ksenza-favorites": Array of favorited property IDs
  - "newsletter-subscribed": Newsletter subscription status
  - "newsletter-dismissed": Newsletter popup dismissal status
- No global state management library (Redux, Zustand, etc.)

**Typography System:**
- Tiempose Headline for headings and hero titles (loaded via Google Fonts fallback using Playfair Display)
- Sora for body text and UI elements

**Key Pages:**

*Public Pages:*
- Home: Hero section, featured properties, services overview
- Properties: Searchable/filterable property listings with comparison feature and favorites toggle
- Property Detail: Individual property information with expandable lightbox gallery, virtual tours, currency converter, mortgage calculator, favorites toggle
- Property Comparison: Side-by-side comparison of up to 3 properties
- Favorites: User's favorited properties (persisted in localStorage)
- About: Company information and team members
- Blog: Articles about real estate market insights
- Blog Detail: Individual blog post view
- Contact: Contact form for inquiries
- Privacy Policy: Privacy and data protection information
- Terms of Service: Terms and conditions

*Admin Pages (Protected):*
- Admin Login: Username/password authentication (route: /admin/login)
- Admin Properties: Manage property listings - create, edit, delete (route: /admin/properties)
- Admin Blog: Manage blog posts - create, edit, delete (route: /admin/blog)
- Admin Inquiries: View customer contact submissions (route: /admin/inquiries)
- Admin Users: Full user management - create, edit, delete users, reset passwords, manage roles (route: /admin/users)
- Admin Settings: Account settings with password change functionality (route: /admin/settings)
- Theme Toggle: Light/dark mode switcher in admin panel header (persisted in localStorage)

### Backend Architecture

**Server Framework:**
- Express.js running on Node.js
- TypeScript for type safety across the stack
- ESM (ES Modules) for modern JavaScript module system

**API Design:**
- RESTful API endpoints under `/api` prefix
- JSON request/response format
- Route handlers defined in `server/routes.ts`

*Public Endpoints:*
- GET /api/properties - List properties with optional filters (location, type, price, bedrooms)
- GET /api/properties/:id - Get single property by ID
- GET /api/blog - List all blog posts
- GET /api/blog/:id - Get single blog post by ID
- POST /api/contact - Submit contact form inquiry

*Permission-Protected Endpoints:*

Property Management (requires canManageProperties or isAdmin):
- POST /api/properties - Create new property
- PUT /api/properties/:id - Update property
- DELETE /api/properties/:id - Delete property

Blog Management (requires canManageBlogs or isAdmin):
- POST /api/blog - Create new blog post
- PUT /api/blog/:id - Update blog post
- DELETE /api/blog/:id - Delete blog post

Lead Viewing (requires canViewLeads or isAdmin):
- GET /api/contacts - List all customer inquiries

User Management (requires isAdmin only - Super Admin):
- GET /api/users - List all users
- POST /api/users - Create new user
- PUT /api/users/:id - Update user details
- DELETE /api/users/:id - Delete user
- POST /api/users/:id/reset-password - Reset user password

*User Endpoints (require authentication):*
- GET /api/users/me - Get current user info
- POST /api/users/change-password - Change own password

*Authentication Endpoints:*
- POST /api/auth/login - Admin login
- POST /api/auth/logout - Admin logout
- GET /api/auth/check - Check authentication status

**Data Storage:**
- PostgreSQL database via Replit's built-in database service
- Database schema defined using Drizzle ORM
- Schema includes tables for: users, properties, blog_posts, and contacts
- Zod schemas for runtime validation of incoming data
- DatabaseStorage class implements IStorage interface with Drizzle queries

**Authentication & Authorization:**
- Passport.js with LocalStrategy for username/password authentication
- Session-based authentication using express-session with PostgreSQL session store
- Password hashing using scrypt with salt for security
- Admin-only middleware (isAdmin) protects admin API endpoints
- Session cookies with httpOnly and secure flags in production
- Admin credentials (seeded via server/seed.ts):
  - Username: admin
  - Password: admin123

**Storage Interface:**
- IStorage interface defines contract for data operations
- DatabaseStorage implements the interface with Drizzle ORM queries
- Includes seed data script (server/seed.ts) for initial data population
- Seeded data includes 6 properties, 6 blog posts, and 1 admin user

**Request/Response Handling:**
- Express middleware for JSON parsing with raw body capture
- Request logging middleware for API endpoints
- Error handling with appropriate HTTP status codes

### Design System

**Color Palette (Luxury Theme):**
- Primary: Warm Beige (RGB 188,158,125) for accents and hover states
- Secondary: Deep Burgundy (RGB 127,20,46) for CTAs and highlights
- Neutral: Dark Charcoal (RGB 51,51,51) for text
- Backgrounds: Off-white/cream tones for sophistication

**Interaction Patterns:**
- Hover elevation effects on cards and buttons (`.hover-elevate`, `.active-elevate-2`)
- Smooth transitions and animations
- Focus states for accessibility
- Mobile-responsive navigation with hamburger menu

**Component Patterns:**
- Reusable PropertyCard, BlogCard, TeamMember components
- PropertyCard includes:
  - Comparison checkbox for selecting properties
  - Heart icon for favorites toggle
  - Availability status badges (Sold/Available/Reserved)
- ComparisonBar: Floating bottom bar showing selected properties (max 3)
- ImageGalleryLightbox: Full-screen image viewer with navigation and thumbnails
- CurrencyConverter: Self-contained currency selector with live price conversion
- WhatsAppWidget: Floating bottom-right contact button
- NewsletterPopup: Timed dialog for email capture with localStorage tracking
- Mortgage calculator component with real-time calculations
- Consistent spacing and border radius (9px/6px/3px system)
- Shadow system for depth (shadow-xs, shadow-sm, shadow-md)

**Key Features:**

*Property Browsing & Management:*
- **Favorites System**: Heart icon toggle on cards and detail pages; persisted in localStorage; dedicated /favorites route
- **Property Comparison**: Select up to 3 properties for side-by-side comparison with detailed specifications
  - Checkboxes on property cards for easy selection
  - Floating comparison bar shows thumbnails and prices
  - Dedicated comparison page with detailed side-by-side view
  - Always-visible remove buttons for touch device accessibility
- **Advanced Filtering**: Location, property type, price range, and bedroom count filters
- **Availability Status**: Visual badges showing "Sold", "Available", or "Reserved" status

*Visual & Interactive Features:*
- **Photo Gallery Lightbox**: Expandable full-screen image viewer with navigation controls and thumbnails
- **Virtual Tours**: 360-degree panoramic property views using Pannellum library
- **Currency Converter**: Real-time multi-currency price display (AED, USD, EUR, GBP, CNY, RUB) with hardcoded exchange rates

*Engagement Tools:*
- **WhatsApp Widget**: Floating contact button (bottom-right) linking to WhatsApp with pre-filled message
- **Newsletter Popup**: Timed email capture dialog (appears after 10 seconds on first visit); uses localStorage to prevent re-display
- **Mortgage Calculator**: Real-time calculations with adjustable down payment and interest rates

### Build & Deployment

**Development:**
- Vite dev server with HMR (Hot Module Replacement)
- tsx for running TypeScript server code directly
- Concurrent client and server development

**Production Build:**
- Vite builds client bundle to `dist/public`
- esbuild bundles server code to `dist/index.js`
- Single Node.js process serves both API and static assets

**Asset Management:**
- Static images stored in `attached_assets/generated_images`
- Image mapping system (`lib/imageMap.ts`) for property/blog images
- Vite alias `@assets` for clean imports

## External Dependencies

### UI Component Libraries
- **Radix UI**: Headless component primitives (accordion, dialog, dropdown, popover, tabs, toast, etc.)
- **shadcn/ui**: Pre-styled components built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel/slider for image galleries

### Data & Forms
- **TanStack Query v5**: Server state management, caching, and data fetching
- **React Hook Form**: Form state management
- **Zod**: Schema validation for forms and API data
- **@hookform/resolvers**: Integration between React Hook Form and Zod
- **drizzle-zod**: Generate Zod schemas from Drizzle ORM definitions

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **clsx & tailwind-merge**: Conditional className utilities
- **PostCSS & Autoprefixer**: CSS processing

### Database (Schema Defined, Not Yet Connected)
- **Drizzle ORM**: TypeScript ORM for SQL databases
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- **drizzle-kit**: CLI tool for migrations and schema management
- Database URL expected via `DATABASE_URL` environment variable
- Migration files configured to output to `./migrations`

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety across frontend and backend
- **tsx**: TypeScript execution for server
- **esbuild**: Fast JavaScript bundler for production server build
- **@replit/vite-plugin-***: Replit-specific development plugins (error overlay, cartographer, dev banner)

### Session & Storage (Dependencies Present, Not Implemented)
- **connect-pg-simple**: PostgreSQL session store for Express (not currently in use)
- **express-session**: Session middleware (dependency present but not configured)

### Utilities
- **date-fns**: Date formatting and manipulation
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing library for React