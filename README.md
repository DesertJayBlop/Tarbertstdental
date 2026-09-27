# Tarbert Street Dental

Static public website with Sanity Studio at `/studio/`. Sanity stores content in
its free cloud project; the website and editor are built and managed locally.

## Run locally

Requires Node.js 22.12 or newer and an internet connection.

```sh
npm ci
npm run build
npm start
```

Open http://localhost:4173 for the website and http://localhost:4173/studio/ for
editing. The server binds to this computer only. `npm run studio` runs Studio's
schema-development server separately at http://localhost:3333/studio/.

Project: **Tarbert Street Dental**, `xlw1z342`; dataset: `production`.
Public identifiers are in `data/sanity-config.json`; they are not credentials.
No write token is included in the public website.

## Client editing

1. Open **Practice login** in the website footer and sign in with an invited
   Sanity account.
2. Choose **Staff**, **Services**, or **Practice & home page**.
3. Edit content, upload photos, and use **Publish** when ready. Saved drafts are
   not public. Refresh the website to see published changes.
4. For staff, select the correct team group and set **Display order** (lower
   numbers first). **Show on website** hides a record without deleting it.
5. For a service, generate its **Page URL**, add the introduction and page
   sections, then enable **Enable detail page**. Services without a detail page
   link to the contact section. New services appear automatically in navigation.
6. Use the document action menu to unpublish or delete a record. The original
   CEREC and root canal URLs remain supported while their records are published.

Photos support uploading, replacement and deletion. Image descriptions help
visitors using screen readers. Page sections and cards can be reordered using
Sanity's array controls. A service's original page URL is read-only so existing
links remain connected to it.

The free plan uses Administrator and Viewer roles. A client who edits needs
Administrator access; give each person their own account. The project owner can
invite the client through https://www.sanity.io/manage/project/xlw1z342. Do not
share your own sign-in. No invitation is sent by this repository.

The anniversary automatically increases on 1 January using New Zealand time.
In **Practice & home page**, the starting year is 1897 (129 years in 2026).
**Practice email** sets the address shown in the footer; leaving it blank keeps
the address already built into the pages.
Use `{years}` in the heritage introduction to keep its number in sync.

## Content and behaviour

Migrated: 7 staff profiles and their images, 10 services, both complete service
pages, home imagery, contact details, opening hours and FAQs. Eight services had
no detail pages in the original site; they remain contact links until the client
adds page copy. Static decorative layout and some marketing text remain in HTML.

The public site reads only published, visible records and never writes content.
Unpublished/deleted service pages show an unavailable message rather than old
copy. API failures show a clear message; static contact details remain available.
The original booking form is restored with its name, phone, reason and comments
fields. Configure **Callback form submission endpoint** in Sanity with an HTTPS
service that accepts JSON (`name`, `phone`, `email`, `reason`, `comments`) and permits your
website origin. No destination is configured yet: submitting shows an honest
unavailable message and preserves the inputs. Until that is set up, the practice
email address in the footer is the working route for written enquiries. Success is shown only after the
endpoint accepts the request. No enquiries are stored in the public Sanity
dataset. The floating **Call us** button appears at the bottom right when
scrolling and uses the practice phone number from Sanity. Customer records and
appointment scheduling remain outside today's scope.

## Animation

`styles/animations.css` and `scripts/reveal.js` add the scroll animations. Each
section flies in as it comes into view, the anniversary number counts up, and a
bobbing arrow at the bottom of the home page invites the first scroll.

To animate something new, add `data-reveal` to the element with one of `up`,
`down`, `left`, `right`, `zoom`, `flip` or `fade`. Put `data-reveal-stagger="110"`
on a parent to bring its children in one after another, or
`data-reveal-delay="200"` on a single element. Content that arrives from Sanity
is picked up automatically. Nothing else is needed and there is no library.

Animation never hides content: with JavaScript unavailable, or when the visitor's
device asks for reduced motion, every section renders in its final position and
the scroll arrow is not shown.

## Branches and GitHub Pages

`main` is the integration branch and **`production` is what goes live**. The
workflow in `.github/workflows/pages.yml` builds and deploys `dist/` on every
push to `production`; pushing to `main` deploys nothing. Pages uses **GitHub
Actions**, not the raw source branch. The workflow sets the Studio base path
from the Pages configuration.

`.github/workflows/check.yml` runs the build and the full test suite on pull
requests and on every push to `main`. It never deploys. Release by merging
`main` into `production` once that check is green:

```sh
git checkout production && git merge --ff-only main && git push
```

Content edits made in Sanity go live immediately and need no deployment. Only
code and schema changes need a release.
Public content configuration and editor links resolve relative to the project,
so `/Tarbertstdental/` and local root hosting both work. The generated `404.html`
restores Studio deep links on Pages, which does not support rewrite rules.

The production Sanity CORS origin is `https://desertjayblop.github.io` with
credentials enabled for invited Studio users. CORS origins contain no path.
The build has no write token and only publishes site files, not tooling/backups.

## Hosting and handoff

`npm run build` creates **dist/** with the public site and compiled Studio. Deploy
that folder to any static host. No paid Sanity service is required within the
free plan's quotas. Hosting/domain costs depend on the host you choose.

- Add the exact production origin in Sanity **API → CORS origins**, with
  credentials allowed for Studio login. Do not use a wildcard origin.
- Route `/studio/*` to `/studio/index.html` for Studio deep links. A `_redirects`
  file is included for hosts that support that format; the local server already
  handles this route. Other hosts need an equivalent rewrite.
- Keep the published content API public, but do not add customer/patient data to
  this dataset. It contains website content only.
- The original site's `noindex` tags and `robots.txt` block indexing; remove those
  intentionally when the client approves public launch.
- Confirm client access, final domain/CORS and backups before handoff. GitHub Pages is configured by the workflow above.

## Backups and maintenance

Authenticate the CLI with `npx sanity login`. Export the dataset, including
assets, to a locally managed backup:

```sh
mkdir -p backups
npx sanity dataset export production backups/production.tar.gz
```

Keep dated copies off this computer. To restore into a separate recovery dataset,
create it first and use `sanity dataset import`; review its contents before
switching the site's dataset. Avoid overwriting production without reviewing the
backup and making a new export first. Sanity's free plan has limited draft
history, so exports matter.

The initial import is repeatable with `npm run seed`. It uses the CLI login and
`createIfNotExists`, so existing records are never overwritten. Run it only for
initial setup or intentional recovery: it can recreate a deliberately deleted
original record. The migration folder is excluded from the public build.

## Verification

With `npm start` running, `npm test` checks the live public pages, mobile menu,
login gate, content rendering and removed-service behaviour. First install the
browser with `npx playwright install chromium` if needed.

`npx sanity schema validate` checks the Studio schema.
`npx sanity exec tooling/verify-cms.mjs --with-user-token` checks real draft
privacy, authenticated publishing/editing and rejection of anonymous writes. It
creates temporary verification records and removes them in a `finally` block;
run on a development project if the public site is already live. Its fixture
counts describe the initial migration.

The dependency overrides pin patched transitive versions. Review them when
upgrading Sanity; `npm audit` should remain clean. Rebuild after code/schema
changes; ordinary client content edits do not need a rebuild.
