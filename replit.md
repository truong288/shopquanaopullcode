# Overview

This is a modern e-commerce fashion store application built with React, TypeScript, and Node.js. The application features a full-stack architecture with user authentication, product management, shopping cart functionality, and order processing. It's designed as a Vietnamese fashion store ("FashionStore") with multi-role support (customers and admins), complete product catalog management, and a responsive user interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React 18** with TypeScript for type safety and modern development
- **Vite** as the build tool and development server for fast hot module replacement
- **Wouter** for client-side routing instead of React Router
- **TanStack Query (React Query)** for server state management, caching, and API calls
- **shadcn/ui** components built on Radix UI primitives for consistent, accessible UI
- **Tailwind CSS** for utility-first styling with custom design tokens and theming
- Component-based architecture with reusable UI components in `/components/ui/`
- Custom hooks for authentication (`useAuth`) and mobile detection (`useIsMobile`)

## Backend Architecture
- **Express.js** server with TypeScript for API endpoints and middleware
- **RESTful API** design with route handlers in `/server/routes.ts`
- **Storage layer abstraction** via `/server/storage.ts` interface for database operations
- **Session-based authentication** using express-session with PostgreSQL session store
- **Replit OAuth integration** for user authentication and authorization
- Request logging middleware for API monitoring and debugging
- Error handling middleware for consistent error responses

## Database Design
- **PostgreSQL** as the primary database with Neon serverless hosting
- **Drizzle ORM** for type-safe database operations and schema management
- **Schema-first approach** with shared types between frontend and backend
- Database tables include:
  - Users (authentication, roles, profile data)
  - Categories (product organization)
  - Products (inventory, pricing, variants)
  - Cart items (user shopping carts)
  - Orders and order items (purchase history)
  - Sessions (authentication state)

## State Management
- **TanStack Query** for server state caching and synchronization
- **React hooks** for local component state management
- **Context API** for theme and global UI state
- Optimistic updates for cart operations and product interactions

## Authentication & Authorization
- **Replit OAuth** integration for user authentication
- **Role-based access control** with customer and admin roles
- **Session management** with PostgreSQL session storage
- **Protected routes** with authentication middleware
- **Automatic token refresh** and unauthorized request handling

# External Dependencies

## Database & ORM
- **@neondatabase/serverless** - Neon PostgreSQL serverless driver
- **drizzle-orm** - TypeScript ORM for type-safe database operations
- **connect-pg-simple** - PostgreSQL session store for Express sessions

## Authentication
- **openid-client** - OpenID Connect client for Replit OAuth
- **passport** - Authentication middleware for Node.js
- **express-session** - Session middleware for Express

## UI & Styling
- **@radix-ui/react-*** - Accessible UI primitives for dialogs, dropdowns, forms
- **tailwindcss** - Utility-first CSS framework
- **class-variance-authority** - Utility for conditional CSS classes
- **lucide-react** - Icon library for consistent iconography

## State Management
- **@tanstack/react-query** - Server state management and caching
- **react-hook-form** - Form state management and validation
- **@hookform/resolvers** - Form validation resolvers

## Development Tools
- **@replit/vite-plugin-runtime-error-modal** - Development error overlay
- **@replit/vite-plugin-cartographer** - Replit-specific development tooling
- **tsx** - TypeScript execution for Node.js development

## Validation & Utilities
- **zod** - Schema validation for forms and API data
- **drizzle-zod** - Zod integration for Drizzle schemas
- **date-fns** - Date manipulation and formatting
- **memoizee** - Function memoization for performance optimization