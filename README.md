# Furry Love - Pet Management Application

A full-stack pet management application built with React, TypeScript, Express, and PostgreSQL.

## Features

- 🐾 Pet Management (Create, view, edit, delete pets)
- 💉 Medical Records (Vaccinations and allergies tracking)
- 🔍 Search & Filter (Find pets by name or type)
- 📊 Admin Dashboard (Statistics and upcoming vaccinations)
- 🖼️ Image Selection (Unsplash integration)
- ✅ Form Validation (Comprehensive client-side validation)

## Tech Stack

- **Frontend**: React 19, TypeScript, Vite, React Router 7
- **Backend**: Express 5, TypeScript, Node.js
- **Database**: PostgreSQL 16 with Prisma ORM
- **Deployment**: Docker & Docker Compose

---

## 🚀 Quick Start (Docker)

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and [Docker Compose](https://docs.docker.com/compose/install/) installed
- (Optional) [Unsplash API Key](https://unsplash.com/developers) for pet images

### Setup in 1 Command

**Option 1: Using Makefile** (Recommended)

```bash
make setup
```

**Option 2: Using Docker Compose directly**

```bash
docker-compose up --build -d
```

That's it! 🎉

### Access the Application

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api

The database will be automatically:
- Created
- Migrated with schema
- Seeded with sample data

Wait ~10-15 seconds for all services to start up.

### (Optional) Add Unsplash API Key

For pet image selection feature:

1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Add your Unsplash API key:
   ```
   VITE_UNSPLASH_ACCESS_KEY=your_actual_key_here
   ```

3. Restart:
   ```bash
   make restart
   # or
   docker-compose restart
   ```

### Other Commands

```bash
make start    # Start all services
make stop     # Stop all services
make logs     # View logs
make restart  # Restart all services
make clean    # Remove everything including database (⚠️ deletes data)
make help     # Show all available commands
```

---

## 💻 Local Development (Without Docker)

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL 16+ running locally

### 1. Clone the Repository

```bash
git clone <repository-url>
cd furry-love
```

### 2. Set Up PostgreSQL Database

Start a PostgreSQL container:

```bash
docker run -d \
  --name furry-love-db \
  -e POSTGRES_DB=furry_love \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine
```

### 3. Server Setup

```bash
cd server
npm install

# Create .env file
cat > .env << EOF
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/furry_love?schema=public"
PORT=3001
EOF

# Run migrations and seed
npx prisma migrate dev
node prisma/seed.js

# Start server
npm run dev
```

Server runs on http://localhost:3001

### 4. Client Setup

In a new terminal:

```bash
cd client
npm install

# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=http://localhost:3001/api
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_key_here
EOF

# Start client
npm run dev
```

Client runs on http://localhost:5173

---

## 📁 Project Structure

```
furry-love/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── hooks/         # Custom hooks (useFetch)
│   │   └── lib/           # API, models, validators
│   └── Dockerfile
├── server/                # Express backend
│   ├── routes/           # API routes
│   ├── middlewares/      # Auth middleware
│   ├── prisma/           # Database schema & migrations
│   └── Dockerfile
├── docker-compose.yml    # Multi-container setup
├── Makefile             # Easy commands
└── README.md
```

## 🗄️ Database Schema

- **User** - User accounts (email, role)
- **Pet** - Pet information (name, type, DOB, image)
- **Vaccination** - Vaccine records (name, dates)
- **Allergy** - Allergy records (reactions, severity)

## 🔐 Authentication

Currently using hardcoded user ID for MVP demo. For production:

- Implement JWT token generation/verification
- Add login/register endpoints
- Use middleware for ownership checks
- Enable role-based access control (ADMIN vs USER)

## 🧪 Testing

To add tests (not currently implemented):

```bash
# Backend
cd server
npm test

# Frontend
cd client
npm test
```

## 📝 API Endpoints

### Pets
- `GET /api/pets` - Get all pets
- `GET /api/pets/:id` - Get pet details
- `GET /api/pets/search?name=...` - Search by name
- `GET /api/pets/filter?type=...` - Filter by type
- `POST /api/pets` - Create pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

### Medical Records
- `POST /api/medical-records/pets/:id/vaccinations` - Add vaccination
- `POST /api/medical-records/pets/:id/allergies` - Add allergy
- `PUT /api/medical-records/vaccinations/:id` - Update vaccination
- `PUT /api/medical-records/allergies/:id` - Update allergy
- `DELETE /api/medical-records/vaccinations/:id` - Delete vaccination
- `DELETE /api/medical-records/allergies/:id` - Delete allergy

### Admin
- `GET /api/admin/stats` - Dashboard statistics

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Stop existing services
make stop

# Or change ports in docker-compose.yml
```

**Database connection issues:**
```bash
# Check if database is running
docker ps

# View logs
make logs

# Reset everything
make clean
make setup
```

**Hot reload not working in Docker:**
```bash
# Volumes are configured for hot reload
# If issues persist, restart containers
make restart
```

## 📄 License

This project is licensed under the MIT License.
