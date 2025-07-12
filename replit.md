# FinanceTracker Application

## Overview

This is a full-stack expense tracking application built with React (frontend) and Express.js (backend). The application allows users to track their expenses, categorize them, and view analytics about their spending patterns. It features a clean, modern UI built with shadcn/ui components and uses PostgreSQL for data persistence through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a monorepo structure with separate client and server directories, sharing common code through a shared directory. It uses a traditional client-server architecture with a React SPA frontend communicating with a REST API backend.

### Directory Structure
- `client/` - React frontend application
- `server/` - Express.js backend API
- `shared/` - Shared code (database schema, types)
- `components.json` - shadcn/ui configuration

## Key Components

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite with custom configuration for development

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Validation**: Zod schemas shared between client and server
- **Storage**: Abstracted storage interface with in-memory implementation for development

### Database Schema
The application uses a simple expenses table with the following structure:
- `id` - Serial primary key
- `amount` - Decimal amount with precision 10, scale 2
- `category` - Text field for expense category
- `description` - Text description of the expense
- `date` - Date stored as YYYY-MM-DD string
- `createdAt` - Timestamp with default now()

Categories are predefined: food, transportation, entertainment, shopping, healthcare, utilities, other.

## Data Flow

1. **Expense Creation**: Users fill out a form → Form validation with Zod → API call to POST /api/expenses → Database insertion → UI updates via React Query
2. **Expense Retrieval**: Component mounts → React Query fetches from GET /api/expenses → Data displayed in UI
3. **Expense Management**: Edit/delete operations follow similar patterns with appropriate HTTP methods

## External Dependencies

### Frontend Dependencies
- **UI Components**: Extensive use of Radix UI primitives through shadcn/ui
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **State Management**: TanStack Query for server state synchronization

### Backend Dependencies
- **Database**: Neon Database (PostgreSQL) via @neondatabase/serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **Session Management**: connect-pg-simple for PostgreSQL-backed sessions

### Development Dependencies
- **Build Tools**: Vite for frontend, esbuild for backend
- **Type Checking**: TypeScript with strict configuration
- **Code Quality**: ESLint configuration (implied by project structure)

## Deployment Strategy

The application is configured for deployment with:
- **Production Build**: Vite builds the frontend to `dist/public`, esbuild bundles the backend to `dist/`
- **Environment Variables**: DATABASE_URL required for database connection
- **Static Serving**: Express serves built frontend files in production
- **Database Migrations**: Drizzle Kit handles schema migrations via `db:push` command

### Development vs Production
- **Development**: Vite dev server with HMR, in-memory storage fallback
- **Production**: Express serves static files, requires PostgreSQL database
- **Scripts**: 
  - `dev` - Development server with TypeScript execution
  - `build` - Production build for both frontend and backend
  - `start` - Production server startup

The application uses a flexible storage abstraction that currently implements in-memory storage but can be easily swapped for database-backed storage when PostgreSQL is available.