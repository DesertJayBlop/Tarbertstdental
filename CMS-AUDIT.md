# Website CMS audit

## Existing implementation

The site is static HTML, CSS and browser JavaScript. There is no backend,
authentication service, package manifest or deployment configuration.

- `admin.html` is publicly accessible. Its edits go to browser localStorage.
- `scripts/content.js` and `data/content.json` contain placeholder staff and
  service records, different from those displayed on the public site.
- `scripts/about.js` contains the seven displayed staff profiles, including
  biographies, photos and expertise. These are the migration source for staff.
- `scripts/home.js` contains ten services. Navigation separately contains six.
- Two service detail pages contain static content: CEREC crowns and root canal.
- The image editor writes localStorage values, but public page images are not
  connected to that editor.
- The callback form displays success and clears inputs without submitting or
  storing a request. It must not be represented as a working booking system.
- Public pages currently request that search engines not index them.

## Content management requirements

1. Authenticated editing with permissions enforced by the content backend.
2. Shared, durable published content visible across browsers and devices.
3. Staff: name, role, group, photo, summary, biography, expertise, ordering and
   visibility; add and remove profiles.
4. Services: title, URL identifier, summary, image, full page sections, ordering
   and visibility; add and remove services. One collection must drive the home
   page and desktop/mobile navigation.
5. Practice settings: contact details, opening hours and page imagery.
6. Preserve existing content and visual design during migration.
7. Document client account ownership, publishing, backups and local operation.

## Architecture decision to resolve

Sanity Studio can run locally, but Sanity Content Lake and account authentication
are hosted services. A free Sanity project is subject to service quotas. Fully
local/self-hosted data requires a different backend.

Website content management does not itself provide customer records, an enquiry
inbox or appointment scheduling; those requirements must be distinguished before
building storage for visitor information.

## MCP setup

The official remote server is configured in the local Codex user configuration
as `sanity`, using `https://mcp.sanity.io`. OAuth authorization completed
successfully. No credentials belong in this repository.

## Prepared migration data

`migration/existing-content.json` preserves the seven displayed staff profiles,
ten service entries, and the complete structured content of the two existing
service pages (headings, paragraphs, images, cards, steps and calls to action).
The other eight services have no detail-page copy to migrate.

Run `python3 migration/extract-pages.py` to refresh the service page snapshots
from the existing HTML before migration. This command does not change or publish
the public website. All seven staff photos and both service page images were
verified to exist locally.

References:

- https://www.sanity.io/docs/ai/mcp-server
- https://www.sanity.io/pricing
- https://learn.chatgpt.com/docs/extend/mcp?surface=cli

## Implemented decision

The user approved Sanity cloud storage and limited today’s scope to website
editing. Project `xlw1z342` now holds the migrated website content. The original
issues above describe the pre-migration site. See README.md for the implemented
editor, public rendering, backup and handoff workflow. Migration page extraction
now reads the preserved originals in `migration/source/`.

## Completion verification (2026-09-24)

- Production build succeeded; Studio schema validation had zero errors/warnings.
- All 18 imported content documents passed schema validation.
- Browser tests passed for staff profiles/dialogs, service pages and legacy URLs,
  mobile navigation, login gate, safe rendering and unavailable service handling.
- Live API tests proved that drafts are private, authenticated writes publish,
  anonymous writes are rejected, and temporary test documents are removed.
- A staff introduction was edited and published through the actual Studio UI,
  observed on the public page, then restored and verified in both interfaces.
- `npm audit` reported zero vulnerabilities after patched dependency overrides.
- A local export includes 18 content documents and 11 assets at
  `backups/production-2026-09-24.tar.gz` (ignored by Git and excluded from builds).
- The website and authenticated editor run at localhost:4173. Production hosting
  and client invitations remain handoff steps documented in README.md; neither
  was requested as an external action in this session.
