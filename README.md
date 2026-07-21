This is a [Next.js](https://nextjs.org) blog application with PostgreSQL database integration.

## Database Setup

This application uses PostgreSQL to store blog posts. Follow these steps to set up the database:

1. Install PostgreSQL on your system if not already installed
2. Create a database for the application:
   ```bash
   createdb blog
   ```
3. Copy the environment variables template:
   ```bash
   cp .env.example .env
   ```
4. Configure your database credentials in `.env` file:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=blog
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

The database schema will be automatically initialized on the first API request.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## API Endpoints

- `GET /api/posts` - Fetch all blog posts
- `POST /api/posts` - Create a new blog post
- `PUT /api/posts/[id]` - Update a blog post
- `DELETE /api/posts/[id]` - Delete a blog post
- `POST /api/upload` - Upload images (returns base64 data URL)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

For production deployment, you'll need to:
1. Set up a PostgreSQL database (e.g., Neon, Supabase, or AWS RDS)
2. Add the database credentials as environment variables in Vercel
3. Deploy your application

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

