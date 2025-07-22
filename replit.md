# Railway Monitoring Dashboard

## Overview

This is a modern Railway Monitoring Dashboard built as a full-stack web application. The system provides real-time monitoring of train positions, speed tracking, traffic light status, and activity logging for a railway system. It's designed to replace an existing vanilla PHP/JS/CSS dashboard with a modern React-based architecture.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The client-side application is built with React 18 and TypeScript, using Vite as the build tool and development server. The UI is styled with Tailwind CSS and uses the shadcn/ui component library for consistent, accessible components. The application follows a component-based architecture with:

- **Component Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: React Query for server state and React Context for client state
- **Routing**: Wouter for lightweight client-side routing
- **Theme Support**: Custom dark/light mode implementation

### Backend Architecture
The server is built with Express.js and TypeScript, providing a REST API architecture:

- **Framework**: Express.js with TypeScript
- **Build System**: ESBuild for server bundling
- **Development**: Hot reloading with Vite integration
- **Storage Interface**: Abstracted storage layer with in-memory implementation

### Data Layer
The application uses Drizzle ORM with PostgreSQL for data persistence:

- **ORM**: Drizzle with PostgreSQL dialect
- **Database**: Configured for PostgreSQL via environment variables
- **Migrations**: Drizzle Kit for schema management
- **Connection**: Neon Database serverless driver

## Key Components

### Frontend Components

1. **Dashboard**: Main page component that orchestrates all monitoring panels
2. **Header**: Navigation with theme toggle and last update timestamp
3. **TrackVisualization**: Visual representation of railway track with traffic lights and train positions
4. **SpeedPanel**: Real-time speed monitoring with historical data visualization
5. **StatusPanels**: Train status display (running/parked trains)
6. **ActivityLog**: Chronological log of system events and train activities

### Data Management

1. **API Layer**: Abstracted fetch functions with error handling and response validation
2. **React Query Hooks**: Custom hooks for data fetching with automatic refetching
3. **Schema Validation**: Zod schemas for type-safe API responses
4. **Error Handling**: Comprehensive error boundaries and user feedback

### UI/UX Features

1. **Responsive Design**: Mobile-first approach with breakpoint-specific layouts
2. **Theme System**: Light/dark mode with railway-specific color palette
3. **Real-time Updates**: Automatic polling every 2 seconds for live data
4. **Loading States**: Skeleton loaders and loading indicators
5. **Error States**: User-friendly error messages and retry mechanisms

## Data Flow

### Client-Side Data Flow
1. Dashboard component mounts and initializes React Query hooks
2. Custom hooks (useRailwayStatus, useSpeedData, useSpeedHistory) fetch data from API endpoints
3. Data is cached and automatically refetched based on configured intervals
4. Components receive data through props and render current state
5. Error states are handled gracefully with user feedback

### Server-Side Data Flow
1. Express server receives API requests
2. Route handlers process requests and interact with storage layer
3. Storage interface abstracts data access (currently in-memory, designed for database extension)
4. Responses are validated and returned as JSON
5. Logging middleware tracks API performance and responses

### Real-time Updates
The system uses polling-based real-time updates with React Query:
- Status data: 2-second intervals
- Speed data: 2-second intervals  
- Speed history: 10-second intervals
- Automatic retry with exponential backoff on failures

## External Dependencies

### Core Framework Dependencies
- **React 18**: UI framework with hooks and concurrent features
- **TypeScript**: Type safety and developer experience
- **Vite**: Build tool and development server
- **Express.js**: Backend web framework

### Database and ORM
- **Drizzle ORM**: Type-safe database toolkit
- **@neondatabase/serverless**: PostgreSQL connection for serverless environments
- **connect-pg-simple**: PostgreSQL session store (for future session management)

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **class-variance-authority**: Utility for conditional CSS classes

### Data Fetching and Validation
- **@tanstack/react-query**: Server state management
- **Zod**: Runtime type validation
- **date-fns**: Date manipulation utilities

### Development Tools
- **@replit/vite-plugin-runtime-error-modal**: Development error overlay
- **@replit/vite-plugin-cartographer**: Development tools integration

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend integration
- **Hot Reloading**: Automatic refresh on file changes
- **Environment Variables**: Database configuration through .env files
- **Error Overlay**: Runtime error modal for debugging

### Production Build
- **Client Build**: Vite builds static assets to dist/public
- **Server Build**: ESBuild bundles server code to dist/index.js
- **Asset Optimization**: Automatic minification and optimization
- **Environment Detection**: NODE_ENV-based configuration

### Database Setup
- **Schema Management**: Drizzle Kit for migration management
- **Connection**: PostgreSQL via DATABASE_URL environment variable
- **Session Storage**: Ready for PostgreSQL session storage implementation

### Monitoring and Logging
- **Request Logging**: Automatic logging of API requests with timing
- **Error Handling**: Centralized error middleware
- **Performance Tracking**: Request duration and response size monitoring

The architecture is designed to be scalable, maintainable, and ready for production deployment while maintaining excellent developer experience during development.