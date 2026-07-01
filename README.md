# Library API

I built this as a backend API for managing a small library system — think books, authors, and the users who can manage them. It's a straightforward REST API with JWT-based auth, role-based permissions (so only admins can add or remove things), and the usual CRUD you'd expect.

## What's under the hood

- **Node.js + Express** for the server
- **PostgreSQL** for storage
- **JWT** for authentication
- **bcryptjs** for hashing passwords (never stored in plain text)
- **express-rate-limit** to slow down brute-force attempts on login

## Getting it running

I tried to keep this part painless. If you've got Node and PostgreSQL installed, you should be up and running in a few minutes.

First, clone the repo and install the dependencies:

```bash
git clone https://github.com/your-username/library-api.git
cd library-api
npm install
```

Next, copy the example environment file and fill in your own values:

```bash
cp .env.example .env
```

You'll mainly need to update your PostgreSQL password and pick a JWT secret (any random string works for local development).

Then create the database itself — open psql or pgAdmin and run:

```sql
CREATE DATABASE library_db;
```

With the database in place, run the migration script. This sets up all the tables for you, so there's no manual SQL to write:

```bash
npm run migrate
```

If you want some data to play with right away instead of starting from an empty database, run the seed script too:

```bash
npm run seed
```

This adds an admin account, a regular user account, a few authors, and a handful of books.

Finally, start the server:

```bash
npm run dev
```

It'll be running at `http://localhost:3000`.

## Test accounts

If you ran the seed script, these two accounts are ready to log in with:

- **Admin** — admin@library.com / 123456
- **Regular user** — user@library.com / 123456

The admin account can create, update, and delete books and authors. The regular user can only read.

## How the API is laid out

**Auth**

You register with `POST /auth/register` and log in with `POST /auth/login`. Login gives you back a JWT token, which is valid for a day. For any protected route, pass it along like this:

**Books**

Anyone can browse books with `GET /books` (this also supports searching and pagination — more on that below) or look up a single one with `GET /books/:id`. Creating, updating, and deleting books requires an admin token: `POST /books`, `PUT /books/:id`, and `DELETE /books/:id`. Updates are partial, meaning if you only send `published_year`, the rest of the book's fields stay untouched.

**Authors**

Same pattern as books — public reads, admin-only writes. `GET /authors`, `GET /authors/:id` for anyone; `POST /authors`, `PUT /authors/:id`, `DELETE /authors/:id` for admins.

## Searching and paging through books

The books endpoint accepts a couple of query parameters if you don't want the whole list at once: