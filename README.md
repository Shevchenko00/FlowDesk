# 🚀 FlowDesk

A modern, full-stack **Order & Inventory Management System** built with **FastAPI** (Python), **React 19**, and **PostgreSQL**. FlowDesk streamlines order processing, product management, and employee collaboration with role-based access control and real-time tracking.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Database Schema](#database-schema)
- [Getting Started](#getting-started)
- [Future Roadmap](#future-roadmap)

---

## 🎯 Overview

FlowDesk is designed for **businesses managing orders and inventory** across multiple operational roles:

- **Customers**: Browse products, place orders, track shipments
- **Employees**: Manage inventory, process orders, update stock levels
- **Admins**: System-wide control, user management, performance monitoring

The platform features JWT-based authentication, role-based access control (RBAC), rate limiting, and async database operations for high-performance order handling.

---

## ✨ Key Features

### Authentication & Authorization
- ✅ User registration and secure password hashing
- ✅ JWT-based access/refresh token authentication
- ✅ Role-based access control (Admin, Employee, Customer)
- ✅ First-login password setup flow
- ✅ Invitation system with token expiration
- ✅ Session tracking and last-activity monitoring

### Order Management
- ✅ Create, read, and update orders
- ✅ Order status tracking (Pending → Confirmed → Shipped → Delivered)
- ✅ Order cancellation with status validation
- ✅ Customer order history
- ✅ Employee order queue (pending orders view)
- ✅ Delivery method configuration

### Product Management
- ✅ Product creation with image uploads
- ✅ Inventory tracking and stock level management
- ✅ Dynamic pricing updates
- ✅ Product availability toggling
- ✅ Price history tracking
- ✅ Employee-only product creation

### Employee Features
- ✅ Manage inventory counts
- ✅ Update product pricing
- ✅ Process and track orders
- ✅ View all pending orders
- ✅ Manage delivery methods

### Security & Performance
- ✅ Rate limiting (10 requests/minute default)
- ✅ CORS middleware for secure cross-origin requests
- ✅ Password strength validation
- ✅ HTTP-only secure cookies
- ✅ Async/await for non-blocking operations

---

## 🛠 Tech Stack

### Backend
| Component | Technology |
|-----------|-----------|
| Framework | **FastAPI 0.136+** |
| Language | **Python 3.13** |
| Database | **PostgreSQL 15** |
| ORM | **SQLAlchemy 2.0** |
| Migrations | **Alembic** |
| Auth | **PyJWT, bcrypt, passlib** |
| Rate Limiting | **slowapi** |
| Server | **Uvicorn** |

### Frontend
| Component | Technology |
|-----------|-----------|
| Framework | **React 19** |
| Language | **TypeScript 6.0** |
| Build Tool | **Vite 8** |
| State Management | **Redux Toolkit 2.12** |
| Routing | **React Router v7** |
| Styling | **SCSS** |

### Infrastructure
| Component | Technology |
|-----------|-----------|
| Containerization | **Docker & Docker Compose** |
| Database Container | **PostgreSQL 15** |
| Frontend Port | **5177** |
| Backend Port | **2222** |
| DB Port | **5433** |

---

## 🏗 Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     USER BROWSER                             │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/HTTPS
                         ▼
┌─────────────────────────────────────────────────────────────┐
│              FRONTEND (React 19 + Redux)                     │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages: Landing, Login, Dashboard, Invite            │   │
│  │ Features: Routing, State Management, UI/UX          │   │
│  └──────────────────────────────────────────────────────┘   │
│  Port: 5177 (Vite Dev Server)                               │
└─────────────────────────┬────────────────────────────────────┘
                         │ REST API (Port 2222)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│          BACKEND (FastAPI + Async Python)                   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ API Routes:                                          │   │
│  │ • /auth - Authentication & Authorization            │   │
│  │ • /employee - Employee Management                   │   │
│  │ • /product - Product CRUD & Inventory               │   │
│  │ • /order - Order Processing & Tracking              │   │
│  │ • /customer - Customer Management                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  Middleware: CORS, Rate Limiting, Error Handling            │
│  Port: 2222 (Uvicorn Server)                               │
└─────────────────────────┬────────────────────────────────────┘
                         │ Async SQLAlchemy ORM
                         ▼
┌─────────────────────────────────────────────────────────────┐
│         DATABASE (PostgreSQL 15)                             │
│  Tables: users, products, orders, roles, delivery_methods   │
│  Port: 5433 (Internal: 5432)                                │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow Example: Placing an Order

```
Customer                Frontend              Backend              Database
   │                       │                     │                    │
   │ Click "Place Order"   │                     │                    │
   ├──────────────────────>│                     │                    │
   │                       │ POST /order/create  │                    │
   │                       ├────────────────────>│                    │
   │                       │                     │ Validate JWT       │
   │                       │                     │ Check stock        │
   │                       │                     ├───────────────────>│
   │                       │                     │ Insert Order       │
   │                       │                     │<───────────────────┤
   │                       │ {order_id, status}  │                    │
   │                       │<────────────────────┤                    │
   │ Order Confirmation    │                     │                    │
   │<──────────────────────┤                     │                    │
   │                       │                     │                    │
```

---

## 📁 Project Structure

```
FlowDesk/
├── backend/                          # FastAPI Application
│   ├── app/
│   │   ├── main.py                  # FastAPI app initialization, middleware setup
│   │   ├── api/                     # API route modules
│   │   │   ├── routers.py           # API v1 router aggregation
│   │   │   ├── auth_api.py          # Authentication endpoints
│   │   │   ├── employee_api.py      # Employee management endpoints
│   │   │   ├── product_api.py       # Product management endpoints
│   │   │   ├── order_api.py         # Order processing endpoints
│   │   │   └── customer_api.py      # Customer-related endpoints
│   │   ├── models/                  # SQLAlchemy ORM models
│   │   │   ├── base_model.py        # Base model with timestamps
│   │   │   ├── user_model.py        # User entity
│   │   │   ├── product_model.py     # Product entity
│   │   │   ├── order_model.py       # Order entity with status enum
│   │   │   ├── roles_model.py       # Role definitions (Admin, Employee, Customer)
│   │   │   ├── delivery_method_model.py # Delivery options
│   │   │   └── associations.py      # Many-to-many relationships
│   │   ├── schemas/                 # Pydantic request/response models
│   │   │   ├── auth_schema.py       # Login/token schemas
│   │   │   ├── user_schema.py       # User creation/viewing schemas
│   │   │   ├── product_schema.py    # Product CRUD schemas
│   │   │   ├── order_schema.py      # Order CRUD schemas
│   │   │   └── set_password_schema.py # Password update schema
│   │   ├── services/                # Business logic layer
│   │   │   ├── user_service.py      # User CRUD & auth logic
│   │   │   ├── product_service.py   # Product operations & inventory
│   │   │   ├── order_service.py     # Order processing & tracking
│   │   │   └── employee_service.py  # Employee operations
│   │   ├── repositories/            # Data access layer
│   │   │   └── base_repository.py   # Generic repository pattern
│   │   ├── dependencies/            # FastAPI dependency injection
│   │   │   ├── user_dependencies.py # User service & current user
│   │   │   ├── product_dependencies.py # Product service
│   │   │   └── order_dependencies.py   # Order service
│   │   ├── core/                    # Configuration & setup
│   │   │   ├── database_config.py   # Database connection & session
│   │   │   ├── project_config.py    # Environment variables & settings
│   │   │   ├── limiter.py           # Rate limiting configuration
│   │   │   └── seed.py              # Database seeding (admin user)
│   │   └── utils/                   # Utility functions
│   │       ├── password_utils.py    # Hashing & verification
│   │       └── ...
│   ├── migrations/                  # Alembic database migrations
│   ├── Dockerfile                   # Python 3.13 slim image
│   ├── requirements.txt              # Python dependencies
│   └── alembic.ini                  # Alembic configuration
│
├── fe/                               # React Frontend
│   ├── src/
│   │   ├── App.tsx                  # Main routing component
│   │   ├── main.tsx                 # React entry point with Redux Provider
│   │   ├── pages/                   # Page components
│   │   │   ├── LandingPage/         # Public landing page
│   │   │   ├── LoginPage/           # Authentication page
│   │   │   ├── DashboardPage/       # Main dashboard (protected)
│   │   │   └── InvitePage/          # User invitation acceptance
│   │   ├── components/              # Reusable UI components
│   │   │   ├── ProtectedRoute/      # Private route wrapper
│   │   │   └── ...
│   │   ├── features/                # Redux slices & state management
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API client services
│   │   ├── app/                     # Redux store configuration
│   │   ├── types/                   # TypeScript interfaces
│   │   ├── styles/                  # Global SCSS stylesheets
│   │   ├── utils/                   # Helper utilities
│   │   └── index.css                # Global styles
│   ├── Dockerfile                   # Node.js build image
│   ├── package.json                 # npm dependencies
│   ├── vite.config.ts               # Vite configuration
│   ├── tsconfig.json                # TypeScript configuration
│   └── index.html                   # HTML entry point
│
├── docker-compose.yml               # Multi-container orchestration
├── .gitignore
└── README.md
```

---

## 🔌 API Routes

### Authentication (`/auth`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/auth/sign_up` | Register new user | ❌ | Public |
| POST | `/auth/sign_in` | Login with email/password | ❌ | Public |
| POST | `/auth/set-password` | Update password (first login) | ✅ | All |
| POST | `/auth/refresh` | Refresh access token | ✅ | All |
| POST | `/auth/logout` | Clear authentication cookies | ✅ | All |
| GET | `/auth/me` | Get current user profile | ✅ | All |

**Example Request - Sign Up:**
```bash
POST /auth/sign_up
Content-Type: application/json

{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "SecurePass123!"
}
```

**Example Response:**
```json
{
  "id": 1,
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "is_active": false,
  "is_first_login": true,
  "roles": []
}
```

---

### Products (`/product`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/product/create` | Create new product | ✅ | Employee, Admin |
| GET | `/product/get_all` | Get all products | ❌ | Public |
| DELETE | `/product/{product_id}` | Delete product | ✅ | Creator, Admin |
| PATCH | `/product/{product_id}/count` | Update stock count | ✅ | Employee, Admin |
| PATCH | `/product/{product_id}/price` | Update price | ✅ | Employee, Admin |
| PATCH | `/product/{product_id}/availability` | Toggle availability | ✅ | Employee, Admin |
| POST | `/product/{product_id}/order` | Quick order product | ✅ | Customer |

**Example Request - Create Product:**
```bash
POST /product/create
Content-Type: multipart/form-data
Authorization: Bearer <token>

Form Data:
  name: "Laptop Pro 15"
  count: 50
  price: 1299.99
  file: <image_file>
```

**Example Response:**
```json
{
  "id": 5,
  "name": "laptop pro 15",
  "count": 50,
  "price": 1299.99,
  "image_path": "/media/products/laptop_pro_15_xyz.jpg",
  "created_by": 1
}
```

---

### Orders (`/order`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/order/create` | Create new order | ✅ | Customer |
| GET | `/order/my` | Get user's orders | ✅ | Customer |
| GET | `/order/all` | Get all orders (filtered) | ✅ | Employee, Admin |
| GET | `/order/all_pending` | Get pending orders only | ✅ | Employee, Admin |
| PATCH | `/order/{order_id}/status` | Update order status | ✅ | Employee, Admin |
| POST | `/order/{order_id}/cancel` | Cancel order | ✅ | Owner, Admin |
| GET | `/order/delivery-methods` | Get active delivery methods | ❌ | Public |
| POST | `/order/delivery-methods/create` | Create delivery method | ✅ | Employee, Admin |
| PUT | `/order/delivery-methods/{method_id}` | Update delivery method | ✅ | Employee, Admin |

**Example Request - Create Order:**
```bash
POST /order/create
Content-Type: application/json
Authorization: Bearer <token>

{
  "product_id": 5,
  "delivery_method_id": 1,
  "quantity": 2,
  "address": "123 Main St, City, State 12345"
}
```

**Example Response:**
```json
{
  "id": 12,
  "product_id": 5,
  "customer_id": 1,
  "delivery_method_id": 1,
  "status": "pending",
  "quantity": 2,
  "ordered_at": "2026-01-15T10:30:00Z",
  "is_processed": false
}
```

**Order Status Flow:**
```
pending → confirmed → shipped → delivered
   ↓
canceled
```

---

### Employees (`/employee`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| POST | `/employee/create` | Invite new employee | ✅ | Admin |
| GET | `/employee/list` | List all employees | ✅ | Admin |
| PUT | `/employee/{employee_id}` | Update employee | ✅ | Admin |
| DELETE | `/employee/{employee_id}` | Remove employee | ✅ | Admin |

---

### Customers (`/customer`)

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/customer/list` | List all customers | ✅ | Admin, Employee |
| GET | `/customer/{customer_id}` | Get customer details | ✅ | Admin, Employee |

---

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR UNIQUE NOT NULL,
  first_name VARCHAR NOT NULL,
  last_name VARCHAR NOT NULL,
  password VARCHAR,
  is_active BOOLEAN DEFAULT false,
  is_first_login BOOLEAN DEFAULT true,
  last_login TIMESTAMP NULL,
  invite_token VARCHAR NULL,
  invite_expires_at TIMESTAMP NULL,
  country VARCHAR NULL,
  city VARCHAR NULL,
  street VARCHAR NULL,
  postal_code VARCHAR NULL,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Products Table
```sql
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,
  count INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  is_available BOOLEAN DEFAULT true,
  image_path VARCHAR NULL,
  created_by_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

### Orders Table
```sql
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  product_id INTEGER NOT NULL REFERENCES products(id),
  customer_id INTEGER NOT NULL REFERENCES users(id),
  delivery_method_id INTEGER NOT NULL REFERENCES delivery_methods(id),
  status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'canceled') DEFAULT 'pending',
  quantity INTEGER NOT NULL DEFAULT 1,
  is_processed BOOLEAN DEFAULT false,
  is_successful BOOLEAN NULL,
  ordered_at TIMESTAMP DEFAULT now(),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  CHECK (quantity > 0)
);
```

### Roles Table
```sql
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL,  -- 'admin', 'employee', 'customer'
  created_at TIMESTAMP DEFAULT now()
);
```

### User-Roles Association (Many-to-Many)
```sql
CREATE TABLE user_roles (
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  role_id INTEGER REFERENCES roles(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, role_id)
);
```

### Delivery Methods Table
```sql
CREATE TABLE delivery_methods (
  id SERIAL PRIMARY KEY,
  name VARCHAR NOT NULL,        -- 'Standard', 'Express', etc.
  price NUMERIC(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
```

---

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local frontend development)
- Python 3.13+ (for local backend development)
- PostgreSQL 15+ (handled by Docker)

### Quick Start with Docker

1. **Clone the repository:**
```bash
git clone https://github.com/Shevchenko00/FlowDesk.git
cd FlowDesk
```

2. **Start all services:**
```bash
docker-compose up --build
```

3. **Access the application:**
- Frontend: `http://localhost:5177`
- Backend API: `http://localhost:2222`
- API Docs (Swagger): `http://localhost:2222/docs`
- Database: `localhost:5433` (user: postgres, password: postgres)

4. **Default admin credentials:**
```
Email: admin@example.com
Password: admin (from environment, check docker-compose.yml)
```

### Local Development Setup

#### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --host 0.0.0.0 --port 2222 --reload
```

#### Frontend Setup
```bash
cd fe

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

### Environment Variables

**Backend (.env):**
```env
DEBUG=True
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5433/flow_desk_postgres
SECRET_KEY=your_secret_key_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin_password
ALLOWED_ORIGINS=["http://localhost:5177", "http://localhost:3000"]
ALLOWED_CREDENTIALS=True
```

---

## 🔐 Authentication Flow

### JWT Token Strategy

1. **Access Token** (1 hour expiry)
   - Stored in HTTP-only cookie
   - Used for API requests
   - Contains user email and claims

2. **Refresh Token** (30 days expiry)
   - Stored in HTTP-only cookie
   - Used to obtain new access token
   - Prevents re-authentication

### User Login Sequence

```
User Registration/Login
         ↓
Hash Password (bcrypt)
         ↓
Store in Database
         ↓
Generate JWT Tokens
         ↓
Set HTTP-Only Cookies
         ↓
Check First Login Status
         ↓
If First Login → Redirect to Password Reset
If Regular Login → Grant Access
```

---

## 🛡️ Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: RS256 algorithm support
- **Rate Limiting**: 10 requests/minute by default (configurable)
- **CORS Protection**: Configurable allowed origins
- **HTTP-Only Cookies**: Prevents XSS attacks
- **SQL Injection Prevention**: SQLAlchemy parameterized queries
- **HTTPS Support**: Ready for production deployment
- **Role-Based Access Control**: Granular permission management

---

## 📈 Performance Features

- **Async/Await**: Non-blocking database operations with asyncpg
- **Connection Pooling**: SQLAlchemy connection pool optimization
- **Lazy Loading**: Selective relationship loading with `selectin`
- **Rate Limiting**: SlowAPI middleware prevents abuse
- **Compression**: Response compression for large payloads

---

## 🔮 Future Roadmap

- 📊 **Manager Monitoring**: Activity tracking and performance analytics
- 📦 **Order Tracking**: Real-time shipment status updates with WebSocket support
- 🏭 **Warehouse Overview**: Multi-warehouse management and inventory distribution
- 👥 **Manager Management**: Advanced role hierarchy and permission matrix
- 📝 **Order History**: Detailed historical analytics and reporting
- 🔔 **Notifications**: Email/SMS alerts for order updates and low stock
- 📊 **Advanced Reporting**: Sales analytics, trends, and business intelligence
- 💾 **Audit Logging**: Complete action history for compliance
- 🔍 **Search & Filter**: Advanced product and order search capabilities
- 📱 **Mobile App**: Native iOS/Android applications
- 🤖 **AI Features**: Order recommendations and demand forecasting

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the MIT License.

---

## 👤 Author

**Shevchenko00** - [GitHub Profile](https://github.com/Shevchenko00)

---

## 📞 Support

For issues, questions, or suggestions:
- Open an [Issue](https://github.com/Shevchenko00/FlowDesk/issues)
- Check [Discussions](https://github.com/Shevchenko00/FlowDesk/discussions)

---

## 🎓 Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [SQLAlchemy ORM](https://docs.sqlalchemy.org/)
- [JWT Authentication](https://jwt.io/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Last Updated**: January 2026  
**Version**: 0.1.0 (Beta)
