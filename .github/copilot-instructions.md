# Copilot Instructions for Lizard Interactive Online

## Project Overview

**Lizard Interactive** is a Next.js marketing & developer hub that showcases services, shares tech content, and manages user comments. It's a decoupled frontend paired with **RonDevServer** backend that aggregates APIs, content, and external services.

## Architecture

### Frontend (This Project - Next.js 16)

- **Pages Router**: Dynamic blog posts via MDX/Markdown with static generation
- **Auth0 Integration**: User authentication for commenting via `@auth0/auth0-react`
- **Real-time Comments**: Upstash Redis backend with SWR for data fetching
- **Styling**: TailwindCSS with custom themes (dark-bg: #1d4ed8)
- **Content**: Markdown files in `_posts/` with gray-matter frontmatter parsing

### Backend Integration

- **RonDevServer** (Express + MongoDB, separate repo): REST API for products, analytics, profiles
- **Upstash Redis**: Serverless comment storage (singleton pattern in `lib/redis.ts`)
- **Auth0 API**: Token verification for comment authorization via `lib/getUser.ts`
- **External**: Cloudinary for media, MDX loader for content rendering

## Key Patterns & Conventions

### Data Fetching & State Management

- **SWR (stale-while-revalidate)** for client-side data fetching (see `hooks/useComment.ts`)
- **Static generation** for blog posts: `getStaticProps` + `getStaticPaths` in `pages/posts/[slug].tsx`
- **Singleton Redis connection**: Use `lib/redis.ts` getter to avoid multiple instances
- **Token-based auth**: Comments require Auth0 token in `Authorization` header

### Type Definitions

All types centralized in `interfaces/index.ts`:

- `Comment`: { id, created_at, url, text, user }
- `User`: { name, picture, sub, email } (from Auth0)
- `Post`: { slug, title, author, date, content, excerpt, coverImage, contentImages }

### API Route Pattern

- Use method-based routing in `pages/api/comment.ts` (GET/POST/DELETE)
- Handlers in `lib/` folder separated by concern (createComment, fetchComment, deleteComment)
- Validate auth tokens early; return 400 for missing params, 403 for auth failures

### Component Patterns

- **Container**: Wrapper for max-width layout (see `components/container.tsx`)
- **Comment system**: Form + List + Index for modular rendering
- **Form components**: Conditional rendering based on `useAuth0()` state (see `components/comment/form.tsx`)

### Markdown & Blog Posts

- **Format**: Gray-matter frontmatter (YAML) + Markdown body
- **Fields**: title, author, date, excerpt, coverImage (required for post card display)
- **Rendering**: `markdownToHtml` utility converts MD → HTML; rendered with `prose` class
- **Static generation**: Slugs from filesystem; post content fetched via `getPostBySlug()`

### Styling

- **TailwindCSS JIT mode** with custom theme extensions (fonts, colors)
- **Typography plugin** for prose rendering: `@tailwindcss/typography`
- **Responsive**: Mobile-first, breakpoints via `sm:`, `lg:` prefixes
- **Custom colors**: dark-bg (#1d4ed8), light-gray (#f8fafc)

## Development Workflow

### Setup & Run

```bash
npm install                    # Install dependencies
npm run dev                    # Start dev server (http://localhost:3000)
npm run build                  # Production build
npm start                      # Serve built site
```

### Environment Variables

Required in `.env.local`:

- `NEXT_PUBLIC_AUTH0_DOMAIN`: Auth0 tenant domain
- `NEXT_PUBLIC_AUTH0_CLIENT_ID`: Auth0 SPA client ID
- `REDIS_URL`: Upstash Redis connection string (URI format with auth)
- `AUTH0_SECRET`: For server-side Auth0 operations (if needed)

### Adding Blog Posts

1. Create `.md` file in `_posts/` with gray-matter frontmatter:
   ```yaml
   ---
   title: "Post Title"
   author: "Ronan"
   date: "2025-01-15"
   excerpt: "Short summary for cards"
   coverImage: "https://cloudinary-url.jpg"
   ---
   ```
2. Content below the `---` is Markdown (supports MDX syntax)
3. Files auto-indexed; slug derived from filename

### Testing Comments Flow

- Authenticate via Auth0 popup in UI
- POST to `/api/comment` includes Authorization header
- Redis stores comments keyed by URL path
- Comments fetched via GET from same endpoint

## Critical Implementation Details

### Redis URL Format Fixing

The `lib/redis.ts` module auto-fixes Redis URIs (prepends auth user if missing). This handles Upstash URL quirks—never bypass this singleton.

### Image Handling

- Use Next.js `<Image>` component with domain whitelisting in `next.config.js`
- Cover images: Set in frontmatter `coverImage` field
- Cloudinary integration assumed for external media serving

### URL Normalization

- `clearUrl()` utility removes query params/hashes from post URLs for comment grouping
- Ensures comments on `post-slug` and `post-slug?utm=x` appear together

### Strict TypeScript (Off)

- `tsconfig.json` has `"strict": false`—type safety not enforced project-wide
- Define types explicitly in components/APIs for clarity despite relaxed settings

## Common Modifications

**Add a new API endpoint**: Create handler in `lib/`, wire to `pages/api/[name].ts`
**Update blog layout**: Edit `pages/posts/[slug].tsx` template section
**Change theme colors**: Update `tailwind.config.js` theme.extend.colors
**Add Auth0 rules**: Verify user permissions in `lib/getUser.ts` before comment creation

## Files of Interest

- `lib/getPost.ts`: Blog post discovery & parsing
- `lib/createComment.ts`: Comment validation & Redis storage
- `hooks/useComment.ts`: SWR hook for comment CRUD + Auth0 tokens
- `pages/posts/[slug].tsx`: Dynamic blog post page layout
- `components/comment/`: Modular comment UI components
