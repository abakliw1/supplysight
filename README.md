# SupplySight — Daily Inventory Dashboard

A full-stack supply chain "Daily Inventory Dashboard" built with modern web technologies:

- **Backend**: Node.js + TypeScript, Apollo GraphQL Server, Prisma ORM, PostgreSQL
- **Frontend**: React 19 + Vite, Tailwind CSS, Apollo Client, Recharts
- **Infrastructure**: Docker Compose for easy deployment

## Features

- 📊 **Real-time Inventory Dashboard** with KPIs and trend charts
- 🔍 **Advanced Filtering** by warehouse, status, and search terms
- 📈 **Interactive Charts** showing stock and demand trends over time
- 🔄 **Stock Management** - update demand and transfer stock between warehouses
- 📱 **Responsive Design** optimized for desktop and mobile
- ⚡ **GraphQL API** with real-time data fetching

## Quick Start (Docker) - Recommended

The easiest way to get started is using Docker Compose, which will set up the database, backend, and frontend automatically.

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/)
- Git

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/supply-sight.git
   cd supply-sight
   ```

2. **Build and run all services**
   ```bash
   docker compose up --build -d
   ```

3. **Access the application**
   - **Frontend Dashboard**: http://localhost:5173
   - **GraphQL Playground**: http://localhost:4000/graphql

4. **Stop the services** (when done)
   ```bash
   docker compose down
   ```

### What happens during startup

The Docker setup automatically:
- Starts a PostgreSQL database with sample data
- Runs Prisma migrations and seeds the database
- Starts the GraphQL backend server
- Starts the React frontend development server
- Sets up all necessary environment variables

## Local Development Setup

If you prefer to run the services locally for development:

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [PostgreSQL](https://www.postgresql.org/download/) (v14 or higher)
- Git

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the `backend` directory:
   ```env
   DATABASE_URL="postgresql://supplysight:supplysight@localhost:5432/supplysight?schema=public"
   ```

4. **Set up the database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed the database with sample data
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The backend will be available at http://localhost:4000

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables** (optional)
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:4000
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:5173

## Database Setup

### Using Docker (Automatic)

The Docker setup automatically creates and configures the PostgreSQL database. No manual setup required.

### Manual PostgreSQL Setup

1. **Create a PostgreSQL database**
   ```sql
   CREATE DATABASE supplysight;
   CREATE USER supplysight WITH PASSWORD 'supplysight';
   GRANT ALL PRIVILEGES ON DATABASE supplysight TO supplysight;
   ```

2. **Run Prisma commands**
   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   npm run seed
   ```

## Project Structure

```
supply-sight/
├── backend/                 # GraphQL API server
│   ├── src/
│   │   ├── index.ts        # Main server entry point
│   │   └── schema.graphql  # GraphQL schema definition
│   ├── prisma/
│   │   ├── schema.prisma   # Database schema
│   │   └── seed.ts         # Database seeding script
│   └── Dockerfile
├── frontend/               # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── connection/     # Apollo Client setup
│   │   ├── routes/         # Application routes
│   │   └── types.ts        # TypeScript type definitions
│   └── Dockerfile
├── docker-compose.yml      # Multi-service orchestration
└── README.md
```

## API Documentation

### GraphQL Endpoint
- **URL**: http://localhost:4000/graphql
- **Playground**: http://localhost:4000/graphql (interactive documentation)

### Key Queries
- `products` - Get inventory products with filtering
- `warehouses` - Get available warehouses
- `kpis` - Get KPI data for trend charts

### Key Mutations
- `updateDemand` - Update product demand
- `transferStock` - Transfer stock between warehouses

## Available Scripts

### Backend Scripts
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run seed         # Seed database with sample data
npx prisma studio    # Open Prisma Studio (database GUI)
```

### Frontend Scripts
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Production Deployment

### Using Docker Compose

1. **Build and run production services**
   ```bash
   docker compose --profile prod up --build -d
   ```

2. **Access the application**
   - **Frontend**: http://localhost:8080
   - **Backend API**: http://localhost:4000

### Manual Deployment

1. **Build the frontend**
   ```bash
   cd frontend
   npm run build
   ```

2. **Build the backend**
   ```bash
   cd backend
   npm run build
   ```

3. **Set up production environment variables**
   ```env
   NODE_ENV=production
   DATABASE_URL="your-production-database-url"
   ```

4. **Start the services**
   ```bash
   # Backend
   cd backend && npm start
   
   # Frontend (serve dist folder with your preferred web server)
   ```

## Troubleshooting

### Common Issues

1. **Database connection errors**
   - Ensure PostgreSQL is running
   - Check DATABASE_URL in environment variables
   - Verify database credentials

2. **Port conflicts**
   - Backend: Change port 4000 in docker-compose.yml or backend configuration
   - Frontend: Change port 5173 in docker-compose.yml or Vite configuration

3. **Docker issues**
   - Ensure Docker and Docker Compose are installed
   - Try `docker compose down -v` to remove volumes and start fresh

4. **Node.js version issues**
   - Ensure you're using Node.js v18 or higher
   - Use `nvm` to manage Node.js versions if needed

### Development Tips

- Use `npx prisma studio` to inspect and modify database data
- Check the GraphQL playground at http://localhost:4000/graphql for API testing
- Enable hot reload by keeping the development servers running
- Use browser dev tools to inspect network requests and GraphQL queries

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Architecture Decisions & Trade-offs

This section outlines the key architectural decisions made during development, the trade-offs considered, and potential improvements for future iterations.

### Technology Stack Decisions

#### Backend Architecture
- **GraphQL over REST**: Chose GraphQL for its flexible querying capabilities, allowing the frontend to request exactly the data it needs. This reduces over-fetching and under-fetching issues common with REST APIs.
- **Apollo Server**: Selected for its excellent TypeScript support, built-in playground, and comprehensive documentation.
- **Prisma ORM**: Chose Prisma for its type-safe database queries, excellent migration system, and seamless integration with TypeScript.
- **PostgreSQL**: Selected for its reliability, ACID compliance, and excellent support for complex queries and relationships.

#### Frontend Architecture
- **React 19**: Latest version for improved performance and new features like concurrent rendering.
- **Vite**: Chose over Create React App for faster development builds and hot module replacement.
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development and consistent design system.
- **Apollo Client**: GraphQL client with excellent caching, optimistic updates, and TypeScript integration.
- **Recharts**: Lightweight charting library with good React integration and customization options.

### Database Design Decisions

#### Schema Design
- **Composite Keys**: Used `productId_warehouseCode` composite unique constraint for inventory to ensure one record per product per warehouse.
- **Normalized Structure**: Separated products, warehouses, and inventory into distinct tables for data integrity and flexibility.
- **KPI Snapshots**: Created separate table for historical KPI data to enable trend analysis without affecting real-time inventory queries.

#### Trade-offs
- **Denormalization**: Some product data is duplicated in GraphQL responses for performance, but source of truth remains normalized.
- **Real-time vs Historical**: KPI data is pre-computed and stored as snapshots rather than calculated on-demand for better performance.

### API Design Decisions

#### GraphQL Schema
- **Flexible Filtering**: Products query supports multiple filter parameters (search, warehouse, status) for comprehensive data exploration.
- **Status Calculation**: Product status (Healthy/Low/Critical) is calculated on-the-fly rather than stored to ensure real-time accuracy.
- **Mutation Design**: Focused on business operations (updateDemand, transferStock) rather than generic CRUD operations.

#### Trade-offs
- **Complexity**: GraphQL adds complexity compared to REST but provides better developer experience and performance.
- **Caching**: GraphQL caching is more complex than REST but Apollo Client handles this well with type policies.

### Frontend Architecture Decisions

#### Component Structure
- **Feature-based Organization**: Components are organized by feature rather than type for better maintainability.
- **State Management**: Used React hooks and Apollo Client cache for state management, avoiding additional state management libraries.
- **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints.

#### Trade-offs
- **Bundle Size**: Including full Tailwind CSS increases bundle size but provides rapid development and consistent design.
- **Component Coupling**: Some components are tightly coupled to specific data structures, but this improves type safety.

### Deployment & Infrastructure

#### Docker Strategy
- **Multi-stage Builds**: Separate development and production Dockerfiles for optimized images.
- **Service Orchestration**: Docker Compose for local development and testing.
- **Environment Configuration**: Environment variables for configuration management.

#### Trade-offs
- **Development Complexity**: Docker adds complexity but ensures consistent environments across team members.
- **Resource Usage**: Running full stack locally requires more resources but provides complete development environment.

## Potential Improvements

### Short-term Enhancements (1-2 weeks)

1. **Authentication & Authorization**
   - Add JWT-based authentication
   - Role-based access control (admin, warehouse manager, viewer)
   - Secure API endpoints

2. **Real-time Updates**
   - Implement WebSocket subscriptions for live inventory updates
   - Add notifications for low stock alerts
   - Real-time dashboard updates

3. **Enhanced Filtering & Search**
   - Add date range filters for historical data
   - Implement full-text search across product names and SKUs
   - Add sorting options for all data tables

4. **Data Validation & Error Handling**
   - Add comprehensive input validation
   - Improve error messages and user feedback
   - Add loading states and skeleton screens

### Medium-term Improvements (1-2 months)

1. **Advanced Analytics**
   - Add forecasting algorithms for demand prediction
   - Implement inventory optimization recommendations
   - Create custom KPI dashboards

2. **Bulk Operations**
   - Bulk stock transfers between warehouses
   - Batch demand updates
   - Import/export functionality for inventory data

3. **Audit Trail**
   - Track all inventory changes with timestamps and user information
   - Add change history for products and warehouses
   - Implement rollback capabilities

4. **Performance Optimizations**
   - Implement GraphQL query batching
   - Add Redis caching for frequently accessed data
   - Optimize database queries with proper indexing

### Long-term Enhancements (3-6 months)

1. **Multi-tenant Architecture**
   - Support multiple organizations/companies
   - Tenant isolation and data segregation
   - Customizable branding and configurations

2. **Advanced Reporting**
   - Custom report builder
   - Scheduled report generation and email delivery
   - Export to various formats (PDF, Excel, CSV)

3. **Integration Capabilities**
   - REST API endpoints for external integrations
   - Webhook support for real-time notifications
   - Third-party ERP system integrations

4. **Mobile Application**
   - React Native mobile app for warehouse operations
   - Barcode scanning capabilities
   - Offline functionality for remote locations

### Technical Debt & Refactoring

1. **Testing Strategy**
   - Add comprehensive unit tests for backend resolvers
   - Implement integration tests for GraphQL API
   - Add end-to-end tests for critical user flows
   - Set up automated testing pipeline

2. **Code Quality**
   - Implement stricter TypeScript configurations
   - Add ESLint rules for consistent code style
   - Set up pre-commit hooks for code quality checks

3. **Documentation**
   - Add JSDoc comments for all functions
   - Create API documentation with examples
   - Add architecture decision records (ADRs)

4. **Monitoring & Observability**
   - Add application performance monitoring (APM)
   - Implement structured logging
   - Set up error tracking and alerting
   - Add health check endpoints

### Scalability Considerations

1. **Database Optimization**
   - Implement database connection pooling
   - Add read replicas for heavy query loads
   - Consider database sharding for large datasets

2. **Caching Strategy**
   - Implement Redis for session management
   - Add CDN for static assets
   - Cache frequently accessed GraphQL queries

3. **Microservices Architecture**
   - Split monolithic backend into domain-specific services
   - Implement event-driven architecture for data consistency
   - Add API gateway for service orchestration

These improvements would transform SupplySight from a demo application into a production-ready, enterprise-grade inventory management system.
