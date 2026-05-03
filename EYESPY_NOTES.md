# EyeSpy Dev Notes

## Current Version: 1.2.3

---

## ✅ Completed (v1.2.3 — May 2026)
- Removed capture="environment" from photo input so players can
  select from camera roll instead of being forced to take a new photo.

## ✅ Completed (v1.2.2 — May 2026)
- WelcomeModal now shows only the latest changelog entry on updates,
  full welcome message on first install. Full history always
  available in the About sheet.

## ✅ Completed (v1.2.1 — May 2026)
- AboutSheet component: version, tagline, credits, Clocktzee mention,
  terms/waiver, full changelog. Accessible by tapping EYESPY title
  from header or welcome modal.
- PlayerProfileSheet: tap any leaderboard row to see total pts,
  best find, full match count, streak, and last 10 finds with
  matched word chips and streak bonus indicators.

## ✅ Completed (v1.2.0 — May 2026)
- Word bank restructured: descriptor/noun/verb types, 75+75+35 words
- Daily draw: 1-2 descriptors + 1-2 nouns + 0-1 verbs (seeded, deterministic)
- Community word bank: Firestore wordBank collection, player suggestions,
  admin approve/reject flow, approved words merged into daily draw pool
- Streak system: getStreakLength + getStreakBonus helpers,
  +2 flat bonus on first daily submit at 3+ day streak, 🔥 on leaderboard
- Duplicate prevention: hasDuplicateMatchToday checks matched word ID combo
- Image purge: expired imageData written as null back to Firestore on load
- Category labels removed from all word chips and today tab
- SuggestWordModal component, accessible from Today tab and Rules tab

## ✅ Completed (v1.1.1 — May 2026)
- Responsive sizing fixes across all screens and modals
- Nav tabs use overflowX:auto with minWidth so they scroll on small screens
- First player created automatically gets isAdmin:true

## ✅ Completed (v1.1.0 — May 2026)
- ProfileSheet — tap avatar to view stats (total pts, best find, full matches), switch games, toggle theme, switch player
- Admin tab — PIN-gated (GPJ), manage players (toggle isAdmin, edit), view games + join codes, bulk-delete submissions and champions
- Theme toggle moved into ProfileSheet (still works from header too)

## ✅ Completed (v1.0.2 — May 2026)
- Deterministic daily word generation — seeded by date string, same words
  for all players regardless of who opens the app first
- PWA manifest.json added with theme color, display mode, icons
- index.html updated with full PWA meta tags for iOS and Android

## ✅ Completed (v1.0.1 — May 2026)
- Nav moved to top (sticky header)
- Submissions query fixed — client-side filtering, no composite index needed
- Join code shown to creator on Game Select screen, editable anytime
- CreateGameModal shows auto-generated code with option to customize before creating
- SVG favicon added

## ✅ Completed (v1.0.0 — May 2026)
- Initial scaffold: React + Vite + Firebase + gh-pages
- Gruvbox Dark/Light theme with ThemeContext
- Player system: create, select, edit players
- Games system: create/join with code, weekly periods
- Daily word system: 3–5 words auto-generated from word bank, one per category
- Scoring: 1/4/10/20/35 pts + 5pt full-match bonus
- Submit flow: tag matched words + proof photo
- Leaderboard: weekly period scores
- Feed: recent finds with matched word chips, reactions, proof photos
- Champions: weekly Top Score + Most Finds
- Cache-first loading (localStorage → Firestore background)
- Welcome/changelog modal with Terms

---

## 🐛 Open Bugs
- None known

---

## ✏️ Improvements Queued
- Admin tab (manage players, view all submissions, reset scores)
- Profile sheet (stats, game switching, theme toggle)

---

## 📅 Status: Development — v1.2.3
