# Shree Kusheshwar Baba Krishi Sahakari Sanstha Limited

Production-oriented bilingual public website and lightweight CMS for a Nepali cooperative. It manages institutional content only; it is **not** a core-banking, accounting, transaction, KYC, or member-balance system.

## Technology choices

- **Next.js 16 / React 19 / TypeScript**: maintained, widely adopted full-stack framework with server rendering and minimal public JavaScript.
- **PostgreSQL + Drizzle ORM**: typed queries, migrations/schema push, parameterized SQL, and a small runtime. Drizzle is used because it is the repository's supported database layer.
- **Auth.js + bcrypt**: established session/authentication library and adaptive password hashing; JWT sessions expire after eight hours.
- **Zod**: mature runtime validation.
- **Tailwind CSS 4 + Lucide**: accessible styling primitives and permissively licensed iconography.
- **S3-compatible configuration**: MinIO locally and R2/S3 in production, avoiding provider lock-in. Database records hold URLs and metadata, not binaries.

## Requirements

Node.js 22+, npm, and PostgreSQL 15+. MinIO is optional when using remote file URLs or another S3-compatible provider.

## Installation

```bash
npm install
cp .env.example .env
npx drizzle-kit push
npm run dev
```

The initial organization data is inserted idempotently on the first application request. It includes only supplied content. Missing information is labeled `राख्न बाँकी / To be updated`.

## First administrator

No password is committed. Generate a strong bcrypt hash locally:

```bash
node -e "require('bcryptjs').hash(process.argv[1],12).then(console.log)" 'A-strong-unique-password'
```

Set `ADMIN_EMAIL`, `ADMIN_NAME`, and `ADMIN_PASSWORD_HASH` in the private environment. On the first successful login, the Super Admin is created in PostgreSQL. Remove bootstrap variables after creation. Use at least 14 characters with mixed character classes and a unique password. Admin login: `/admin/login`.

Roles are `SUPER_ADMIN`, `ADMIN`, `EDITOR`, and `VIEWER`; Viewer writes are rejected server-side. Important creates, deletes, status updates, page edits, and settings edits are logged.

## Database and seed

`src/db/schema.ts` is the schema source. Apply it with `npx drizzle-kit push`. `src/lib/data.ts` is the idempotent seed definition. Back up before schema changes:

```bash
pg_dump "$DATABASE_URL" -Fc > cooperative.dump
pg_restore --clean --if-exists --dbname "$DATABASE_URL" cooperative.dump
```

Use managed PostgreSQL point-in-time recovery in production. Test restoration quarterly.

## Storage

Set all `STORAGE_*` variables to an S3-compatible private bucket. Configure bucket CORS for the production origin and serve public website assets through a controlled public/CDN URL. Restrict credentials to one bucket. Enable bucket versioning and lifecycle rules. Back up or replicate object storage independently from PostgreSQL. The Version 1 CMS accepts controlled object URLs and validates document URLs; production deployments should add presigned direct upload using these variables when editors need large uploads.

## Development and production

```bash
npm run dev
npm exec tsc -- --noEmit
npm run build
npm run start
```

For containers: set `AUTH_SECRET` and run `docker compose up --build`. Apply `npx drizzle-kit push` against the Compose database before first use. For Vercel: deploy the Next.js project, attach managed PostgreSQL and S3/R2, configure all environment values, then apply the schema from a secure CI job.

## Security operations

TLS is required in production. Security headers, CSP, HttpOnly Auth.js cookies, role checks, Zod validation, parameterized ORM queries, contact throttling and honeypot protection are enabled. Rotate `AUTH_SECRET` only with a planned session reset. Never expose database/storage credentials through `NEXT_PUBLIC_*`. Review dependency advisories during each release and apply non-breaking security updates. Audit logs contain administrative metadata, not passwords.

## Content operations

Administrators can edit settings and homepage sections; create/publish/archive notices; manage services, savings, loans, staff, committees, centers and documents; handle contact messages; inspect roles and audit logs. English and Nepali are stored independently. Financial values not supplied by the institution remain explicitly unconfigured.

## Backup and recovery

Use daily encrypted database backups with point-in-time recovery and retention required by organizational policy. Enable object versioning plus cross-region/provider replication. Keep encrypted copies of environment variables in an access-controlled secrets manager. A restore drill must cover PostgreSQL, bucket objects, DNS, and application secrets.
