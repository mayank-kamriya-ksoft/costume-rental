# Overview

This is a costume rental management system built as a full-stack web application. It provides a customer-facing interface for browsing and renting costumes and accessories, plus an admin dashboard for inventory and booking management. The application handles the complete rental workflow from product discovery to booking management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React SPA**: Built with React 18 using Vite as the build tool and development server
- **Routing**: Uses Wouter for client-side routing with routes for home, admin dashboard, and 404 pages
- **UI Framework**: Implements shadcn/ui component library with Radix UI primitives and Tailwind CSS for styling
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form validation

## Backend Architecture
- **Express Server**: Node.js/Express API server with TypeScript
- **Route Structure**: RESTful API design with routes for costumes, accessories, categories, and bookings
- **Middleware**: Custom logging middleware for API requests and error handling middleware
- **Development Setup**: Hot reloading with Vite integration in development mode

## Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless connection pooling
- **ORM**: Drizzle ORM for type-safe database queries and schema management
- **Schema Design**: Normalized database with tables for users, categories, costumes, accessories, bookings, and booking items
- **Migrations**: Drizzle-kit for database migrations with schema-first approach

## Authentication and Authorization
- **Session Management**: Uses connect-pg-simple for PostgreSQL-backed session storage
- **User Management**: Basic user schema with email, name, and phone fields
- **Role-based Access**: Admin dashboard functionality separated from customer interface

## External Dependencies
- **Database Provider**: Neon PostgreSQL serverless database
- **UI Components**: Extensive use of Radix UI primitives for accessible components
- **Styling**: Tailwind CSS with custom design tokens and theming
- **Date Handling**: date-fns for date manipulation and formatting
- **Form Validation**: Zod for runtime type checking and validation
- **Development Tools**: tsx for TypeScript execution, esbuild for production builds

The architecture follows a monorepo structure with shared schema definitions between client and server, enabling type safety across the full stack. The application uses modern web development patterns with server-side rendering capabilities and responsive design principles.