# Karishma & Ashita -- New Theme (from scratch)

## Why this project exists
karishmaashita.com previously ran on Shopify's Dawn theme. A redesigned prototype was built and implementation kept breaking against Dawn's section schema, color-scheme system, and CSS/JS architecture (see the old project at Github/shopify-theme-github for the full history -- a long string of "fix" commits chasing Dawn conflicts). Decision: stop fighting Dawn. Build a brand-new theme from scratch with no inherited theme, no inherited constraints -- including color, typography, and spacing, which are being reconsidered from zero, not just layout.

## Build order
Home page -> Collection page -> Product page -> Cart page. One page at a time: audit -> redesign -> prototype -> review/approve -> build spec -> implement -> QA verify -> next page. Other pages (About, Appointment, Contact, Footer) follow after these four are solid.

## Agents
- `.claude/agents/creative-director.md` -- K&A Creative Director. Designs unrestricted, prototypes in plain HTML/CSS/JS, hands off a platform-agnostic build spec.
- `.claude/agents/technical-director.md` -- Builds the actual Shopify theme (Liquid/JSON templates, sections, assets) from the approved spec. Does a feasibility skim against real Shopify-platform limits (not Dawn) before full build.
- `.claude/agents/qa-reviewer.md` -- Independently verifies the live build against the approved prototype. Never trusts another agent's self-report.

## Reference (history only, not constraints)
`Reference/legacy-dawn-prototypes/` contains the old homepage prototype, the old design-system file, and the old product-page prototype from the Dawn attempt. Useful for what emotionally worked before; not binding on color, type, layout, or anything else this time around.

## Brand
K&A by Karishma and Ashita -- luxury Indian bridal couture (corsets with drape sarees, lehengas, Indo-Western, festive wear), Mumbai-based, price point roughly Rs 38,000-80,000+ per piece, made-to-order with WhatsApp concierge customization, free worldwide shipping, in-store/virtual styling appointments, editorial/celebrity styling history, strong Instagram presence, "Client Diaries" lookbook content.

## Medium-term: platform portability
Possible future move off Shopify (per-order commission doesn't suit low-volume luxury pricing). Build properly for Shopify now -- do not under-build for this. What's already portable by construction: Creative Director's HTML/CSS/JS prototypes, design tokens, copy, photography -- none of that is Shopify-specific. What is NOT portable, no matter how carefully built: Liquid templates, JSON section schema, cart/checkout endpoints, customer accounts -- these are Shopify-specific and will be rebuilt from the same approved prototypes against whatever stack is chosen, if/when a move happens. Cheap habits worth keeping anyway, not because of this: CSS/JS scoped per section (already a Technical Director rule), avoid letting a third-party Shopify app become load-bearing for core UX if a custom version is just as easy to build, keep domain registration independent of Shopify. None of this should slow down or complicate the current build.
