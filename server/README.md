# URL Shortener — Backend

A production-ready Node.js + Express REST API for a URL shortener with user authentication, Redis caching, async click analytics via a job queue, and rate limiting.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Folder Structure](#folder-structure)
- [File Reference](#file-reference)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Request / Response Flow](#request--response-flow)

---

## Tech Stack

### Runtime & Framework

| Package | Version | Why |
|---|---|---|
| `node` | 18+ | ES Modules support (`"type": "module"`), native async/await |
| `express` | ^5 | Minimal, unopinionated HTTP framework; v5 has built-in async error propagation |
| `nodemon` | ^3 | Dev server auto-restart on file changes |

### Database

| Package | Why |
|---|---|
| `mongoose` | ODM for MongoDB — schema validation, model abstraction, and query builder on top of the MongoDB driver |

### Caching & Queue

| Package | Why |
|---|---|
| `ioredis` | Redis client used for two purposes: URL cache lookups and as the BullMQ connection. Chosen over the official `redis` package because BullMQ requires ioredis specifically |
| `bullmq` | Job queue backed by Redis. Used to process click analytics asynchronously so redirects are never slowed down by analytics writes |

### Authentication & Security

| Package | Why |
|---|---|
| `bcryptjs` | Password hashing with salt rounds. Pure JS implementation — no native bindings required |
| `jsonwebtoken` | Signs and verifies JWTs. Access tokens (15min) + refresh tokens (7 days) |
| `cookie-parser` | Parses `Cookie` header so `req.cookies` is available — needed to read the httpOnly refresh token cookie |
| `cors` | Cross-Origin Resource Sharing headers so the frontend (different origin) can call the API |

### Validation & Rate Limiting

| Package | Why |
|---|---|
| `express-validator` | Declarative input validation using chainable rules (`body("email").isEmail()`) applied per-route before controllers run |
| `express-rate-limit` | IP-based rate limiting to prevent abuse. Two tiers: global (100 req/15min) and per-endpoint (10 shorten/hr) |

### Analytics

| Package | Why |
|---|---|
| `ua-parser-js` | Parses `User-Agent` strings into structured browser name + device type (mobile/tablet/desktop) |
| `geoip-lite` | Offline IP-to-country lookup using a bundled MaxMind database. No external API calls needed |
| `nanoid` | Cryptographically random URL-safe string generator. Used to produce 6-character short codes |

### Config

| Package | Why |
|---|---|
| `dotenv` | Loads `.env` file into `process.env`. Imported via `import "dotenv/config"` so it runs before anything else |

---

## Architecture Overview

```
Client
  │
  ▼
Express App (index.js)
  │
  ├── globalLimiter        ← rate limit all requests
  ├── cors / json / cookies
  │
  ├── /api/auth            ← register, login, logout, refresh token
  ├── /api/url             ← shorten, list, delete (protected)
  ├── /api/analytics       ← click stats per short code (protected)
  ├── /api/health          ← liveness check
  └── /:shortCode          ← public redirect
        │
        ├── Redis cache hit → redirect immediately
        │     └── enqueue analytics job (non-blocking)
        │
        └── Redis cache miss → MongoDB lookup → cache → redirect
              └── enqueue analytics job (non-blocking)

BullMQ Worker (same process)
  └── processes "analytics" queue
        └── ua-parser-js + geoip-lite → save Click to MongoDB

Databases
  ├── MongoDB  — Users, Urls, Clicks
  └── Redis    — URL cache (TTL 1hr) + BullMQ queue storage
```

---

## Folder Structure

```
server/
├── index.js                 # App entry point
├── package.json
├── .env                     # Environment variables (not committed)
│
├── services/                # Shared infrastructure connections
│   ├── db.js                # MongoDB connection
│   ├── redis.js             # ioredis client for caching
│   ├── queue.js             # BullMQ Queue + Worker setup
│   └── analytics.js        # BullMQ job processor function
│
├── models/                  # Mongoose schemas
│   ├── User.js
│   ├── Url.js
│   └── Click.js
│
├── controllers/             # Route handler logic
│   ├── authController.js
│   ├── urlController.js
│   └── analyticsController.js
│
├── middleware/              # Express middleware
│   ├── auth.js              # JWT Bearer token verification
│   ├── rateLimiter.js       # express-rate-limit instances
│   ├── validate.js          # express-validator runner
│   └── errorHandler.js      # Global error handler
│
└── routes/                  # Express routers
    ├── authRoutes.js
    ├── urlRoutes.js
    ├── analyticsRoutes.js
    └── health.js
```

---

## File Reference

### `index.js`

App entry point. Responsibilities:
- Imports and mounts all routers
- Applies `globalLimiter` as the first middleware (before everything)
- Registers the public `GET /:shortCode` redirect route
- Registers `errorHandler` as the last middleware (catches all `next(err)` calls)
- Calls `connectDB()` and starts the HTTP server only after MongoDB connects

---

### `services/db.js`

Exports `connectDB()` — calls `mongoose.connect()` with `MONGO_URI`. Called once at startup in `index.js`. If it fails, the process exits.

---

### `services/redis.js`

Creates and exports a single shared `ioredis` client using `REDIS_URL`. Used by `urlController.js` for cache get/set/del operations. Logs connection status and errors.

---

### `services/queue.js`

Creates a BullMQ `Queue` ("analytics") and a BullMQ `Worker` both using a dedicated ioredis connection (separate from the cache client, with `maxRetriesPerRequest: null` as required by BullMQ). The Worker calls `processClick` from `analytics.js` for each job. Exports `analyticsQueue` so controllers can enqueue jobs.

---

### `services/analytics.js`

Exports `processClick(job)` — the BullMQ job processor. For each click event it:
1. Parses `userAgent` with `ua-parser-js` → extracts browser name and device type
2. Looks up `ip` with `geoip-lite` → extracts country code
3. Saves a `Click` document to MongoDB

---

### `models/User.js`

| Field | Type | Notes |
|---|---|---|
| `name` | String | required |
| `email` | String | required, unique |
| `password` | String | bcrypt hash, required |
| `createdAt` | Date | default: now |

---

### `models/Url.js`

| Field | Type | Notes |
|---|---|---|
| `originalUrl` | String | required |
| `shortCode` | String | unique, 6-char nanoid |
| `userId` | ObjectId | ref: User, nullable (guest links) |
| `clicks` | Number | default: 0 (legacy, analytics tracked in Click) |
| `createdAt` | Date | default: now |
| `expiresAt` | Date | optional, null by default |

---

### `models/Click.js`

One document per redirect event. Populated asynchronously by the BullMQ worker.

| Field | Type | Notes |
|---|---|---|
| `urlId` | ObjectId | ref: Url, required |
| `shortCode` | String | required (denormalized for query performance) |
| `timestamp` | Date | default: now |
| `ip` | String | raw IP from `req.ip` |
| `country` | String | ISO country code, default: "Unknown" |
| `device` | String | "mobile" / "tablet" / "desktop" |
| `browser` | String | browser name from ua-parser-js |
| `referrer` | String | `Referer` header value, default: "Direct" |

---

### `controllers/authController.js`

| Function | Description |
|---|---|
| `register` | Validates uniqueness, bcrypt-hashes password (10 rounds), saves User |
| `login` | Verifies email + password, signs access token (15min JWT) + refresh token (7d JWT), sends refresh token as httpOnly cookie, returns access token + user info |
| `logout` | Clears the httpOnly refresh token cookie |
| `refreshToken` | Reads refresh token from cookie, verifies it, issues new access token |

The two JWTs use separate secrets (`JWT_SECRET` / `JWT_REFRESH_SECRET`) so a leaked access token secret doesn't compromise refresh tokens.

---

### `controllers/urlController.js`

| Function | Description |
|---|---|
| `shortenUrl` | Generates a 6-char nanoid short code, saves to MongoDB, returns the full short URL |
| `redirectUrl` | Cache-first lookup: checks Redis → on miss queries MongoDB and caches result with 1hr TTL → redirects. Enqueues analytics job non-blocking after redirect. Returns 410 if `expiresAt` is in the past |
| `getMyUrls` | Returns all URLs owned by `req.user.id`, sorted newest first |
| `deleteUrl` | Deletes URL by ID only if `userId` matches — prevents deleting another user's links. Also removes the Redis cache key |

---

### `controllers/analyticsController.js`

`getUrlAnalytics` — verifies the shortCode belongs to `req.user`, then runs 6 MongoDB aggregations in parallel via `Promise.all`:

| Metric | Method |
|---|---|
| Total clicks | `countDocuments` |
| Clicks per day (last 7 days) | `$group` by `$dateToString` |
| Top 5 countries | `$group` + `$sort` + `$limit 5` |
| Device breakdown | `$group` by device type |
| Browser breakdown | `$group` by browser name |
| Top 5 referrers | `$group` + `$sort` + `$limit 5` |

---

### `middleware/auth.js`

Reads `Authorization: Bearer <token>` header, verifies the JWT with `JWT_SECRET`, and attaches `{ id }` to `req.user`. Returns 401 if missing or invalid.

---

### `middleware/rateLimiter.js`

| Limiter | Window | Max | Applied to |
|---|---|---|---|
| `globalLimiter` | 15 min | 100 req | All routes (in `index.js`) |
| `shortenLimiter` | 1 hour | 10 req | `POST /api/url/shorten` only |

Uses `standardHeaders: true` so clients receive `RateLimit-*` response headers.

---

### `middleware/validate.js`

`validate(rules)` returns an Express middleware that:
1. Runs each express-validator rule against `req`
2. Calls `validationResult(req)` to collect errors
3. Returns `400 { errors: [...] }` if any errors exist, otherwise calls `next()`

This keeps route files clean — validation rules are defined inline in the router, not scattered across controllers.

---

### `middleware/errorHandler.js`

Four-argument Express error handler `(err, req, res, next)`. Catches any error passed to `next(err)` from controllers. Returns the actual error message in development, a generic `"Something went wrong"` in production.

---

### `routes/authRoutes.js`

| Method | Path | Middleware | Handler |
|---|---|---|---|
| POST | `/api/auth/register` | validate | `register` |
| POST | `/api/auth/login` | validate | `login` |
| POST | `/api/auth/logout` | — | `logout` |
| GET | `/api/auth/refresh` | — | `refreshToken` |

---

### `routes/urlRoutes.js`

| Method | Path | Middleware | Handler |
|---|---|---|---|
| POST | `/api/url/shorten` | authenticate, shortenLimiter, validate | `shortenUrl` |
| GET | `/api/url/my-urls` | authenticate | `getMyUrls` |
| DELETE | `/api/url/:id` | authenticate | `deleteUrl` |

---

### `routes/analyticsRoutes.js`

| Method | Path | Middleware | Handler |
|---|---|---|---|
| GET | `/api/analytics/:shortCode` | authenticate | `getUrlAnalytics` |

---

### `routes/health.js`

| Method | Path | Response |
|---|---|---|
| GET | `/api/health` | `{ status: "ok" }` |

Liveness check for uptime monitors and deployment health checks.

---

## API Reference

### Auth

```
POST   /api/auth/register     { name, email, password }
POST   /api/auth/login        { email, password }
POST   /api/auth/logout
GET    /api/auth/refresh
```

### URLs

```
POST   /api/url/shorten       { originalUrl, expiresAt? }   Authorization: Bearer <token>
GET    /api/url/my-urls                                      Authorization: Bearer <token>
DELETE /api/url/:id                                          Authorization: Bearer <token>
```

### Analytics

```
GET    /api/analytics/:shortCode                             Authorization: Bearer <token>
```

### Redirect (public)

```
GET    /:shortCode
```

### Health

```
GET    /api/health
```

---

## Environment Variables

```env
# MongoDB
MONGO_URI=mongodb+srv://...

# Redis
REDIS_URL=redis://default:<password>@<host>:<port>

# JWT
JWT_SECRET=<random 32+ char string>
JWT_REFRESH_SECRET=<different random 32+ char string>

# App
PORT=5000
BASE_URL=http://localhost:5000
NODE_ENV=development   # set to "production" in prod
```

Generate secure secrets with:
```bash
openssl rand -hex 32
```

---

## Request / Response Flow

### Shorten a URL

```
POST /api/url/shorten
  → globalLimiter (check IP rate)
  → authenticate (verify JWT)
  → shortenLimiter (check shorten-specific rate)
  → validate (isURL check)
  → shortenUrl controller
      → nanoid(6) → Url.create() → return { shortUrl, shortCode, ... }
```

### Redirect

```
GET /:shortCode
  → globalLimiter
  → redirectUrl controller
      → Redis GET url:<shortCode>
          HIT  → check expiry → analyticsQueue.add() → res.redirect()
          MISS → Url.findOne() → Redis SET (1hr TTL) → analyticsQueue.add() → res.redirect()

BullMQ Worker (async)
  → processClick(job)
      → UAParser(userAgent) → browser, device
      → geoip.lookup(ip) → country
      → Click.create()
```

### Token Refresh

```
GET /api/auth/refresh
  → reads httpOnly cookie "refreshToken"
  → jwt.verify() with JWT_REFRESH_SECRET
  → returns new accessToken (15min)
```
