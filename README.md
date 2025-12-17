# Furry Love - Pet Management Application

A full-stack pet management application built with React, TypeScript, Express, and PostgreSQL.

## Features

- 🐕 Pet management (create, view, update, delete)
- 💉 Vaccination tracking
- 🩺 Allergy management
- 🖼️ Image selection via Unsplash API
- 📊 Admin statistics dashboard

## Tech Stack

**Frontend:**
- React 19
- TypeScript
- Vite
- React Router v7
- Axios
- CSS Modules

**Backend:**
- Node.js
- Express
- TypeScript
- Prisma ORM v7
- PostgreSQL

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **Docker** (for PostgreSQL)
- **Git**

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd furry-love
```

### 2. Set Up PostgreSQL Database

Start a PostgreSQL container using Docker:

```bash
docker run -d \
  --name furry-love-db \
  -e POSTGRES_DB=furry_love \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:16-alpine
```

**Note:** If port 5432 is already in use, you can use a different port (e.g., 5433):

```bash
docker run -d \
  --name furry-love-db \
  -e POSTGRES_DB=furry_love \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5433:5432 \
  postgres:16-alpine
```

If using port 5433, update the `DATABASE_URL` in `server/.env` accordingly.

### 3. Server Setup

#### Install Dependencies

```bash
cd server
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `server` directory:

```bash
# server/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/furry_love?schema=public"
PORT=3001
```

**Note:** If using port 5433 for PostgreSQL, update the URL:
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/furry_love?schema=public"
```

#### Run Database Migrations

```bash
npx prisma migrate deploy
```

#### Seed the Database

```bash
node prisma/seed.js
```

This will create:
- 3 users
- 5 pets
- 7 vaccinations
- 4 allergies

### 4. Client Setup

#### Install Dependencies

```bash
cd ../client
npm install
```

#### Configure Environment Variables

Create a `.env` file in the `client` directory:

```bash
# client/.env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

**Getting an Unsplash Access Key:**

1. Go to [https://unsplash.com/developers](https://unsplash.com/developers)
2. Create a free account
3. Click "New Application"
4. Accept the API guidelines
5. Give your app a name and description
6. Copy the "Access Key" and paste it in the `.env` file

### 5. Running the Application

#### Start the Server

```bash
cd server
npm run dev
```

The server will start on `http://localhost:3001`

#### Start the Client

In a new terminal:

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173`

### 6. Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Available Scripts

### Server

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npx prisma migrate dev` - Create a new migration
- `npx prisma migrate deploy` - Apply migrations
- `npx prisma studio` - Open Prisma Studio (database GUI)

### Client

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Database Schema

### Models

- **User** - Pet owners
- **Pet** - Pets with basic information
- **Vaccination** - Vaccination records
- **Allergy** - Allergy records

### Relationships

- A User can have multiple Pets
- A Pet belongs to one User
- A Pet can have multiple Vaccinations
- A Pet can have multiple Allergies

## API Endpoints

### Pets

- `GET /api/pets` - Get all pets
- `GET /api/pets/:id` - Get a specific pet
- `POST /api/pets` - Create a new pet
- `PUT /api/pets/:id` - Update a pet
- `DELETE /api/pets/:id` - Delete a pet
- `GET /api/pets/search?query=name` - Search pets by name

### Medical Records

- `GET /api/medical-records/pets/:id` - Get all medical records for a pet
- `POST /api/medical-records/pets/:id/vaccinations` - Add a vaccination
- `POST /api/medical-records/pets/:id/allergies` - Add an allergy

### Admin

- `GET /api/admin/stats` - Get statistics (total pets, pets by type, upcoming vaccinations)

## Troubleshooting

### Port 5432 Already in Use

If you get an error that port 5432 is already in use:

1. Either stop the existing PostgreSQL container:
   ```bash
   docker ps  # Find the container ID
   docker stop <container-id>
   ```

2. Or use a different port for furry-love-db (see step 2 above)

### Database Connection Issues

If you get authentication errors:

1. Verify the database container is running:
   ```bash
   docker ps | grep furry-love-db
   ```

2. Check the DATABASE_URL in `server/.env` matches your container configuration

3. Restart the server after updating `.env`:
   ```bash
   cd server
   npm run dev
   ```

### Unsplash Images Not Loading

1. Verify you have a valid Unsplash Access Key in `client/.env`
2. Check the browser console for API errors
3. Ensure you haven't exceeded the free tier limit (50 requests/hour)

## Development Notes

### Database Migrations

When you modify the Prisma schema:

```bash
cd server
npx prisma migrate dev --name describe_your_change
```

### Regenerating Prisma Client

After schema changes:

```bash
npx prisma generate
```

### Adding Indexes

Database indexes are already configured for optimal performance on:
- Foreign keys (ownerId, petId)
- Frequently queried fields (expiresAt)

## Project Structure

```
furry-love/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── lib/            # API client and models
│   │   └── pages/          # Page components
│   └── .env               # Client environment variables
│
├── server/                 # Express backend
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   ├── migrations/    # Database migrations
│   │   └── seed.js        # Seed data
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   └── .env              # Server environment variables
│
└── README.md
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
