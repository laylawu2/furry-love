# Furry Love - Pet Management Application

A full-stack pet management application built with React, TypeScript, Express, and PostgreSQL.

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

## License

This project is licensed under the MIT License.
