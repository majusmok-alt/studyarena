# 🚀 StudyArena — Launch checklist

Your roadmap from "code on GitHub" to "live on the App Store." Items are grouped by phase and tagged:

- 🧑‍💻 **You** — needs your accounts, Mac, or money (I can't do these)
- 🤖 **Claude** — I can do this for you (just ask)
- ⏳ rough effort · 💶 cost

---

## Phase 1 — Run it on your Mac
> Goal: see StudyArena running as a real iOS app.

- [ ] 🧑‍💻 Install **Xcode** (full app, Mac App Store) — ⏳ ~30–60 min download · 💶 free
- [ ] 🧑‍💻 Point tools at it: `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` then `sudo xcodebuild -license accept`
- [ ] 🧑‍💻 Run `npm run ios` → in Xcode pick a simulator → press ▶︎ Run
- [ ] 🧑‍💻 (optional) Run on your **physical iPhone** — see [IOS_SETUP.md](IOS_SETUP.md) §2

## Phase 2 — Make it real (backend)
> Goal: real accounts + multiplayer leaderboards instead of on-device demo data.

- [ ] 🧑‍💻 Create a **Supabase** project (supabase.com) — 💶 free tier is fine to start
- [ ] 🧑‍💻 Run [`supabase/schema.sql`](../supabase/schema.sql) in the Supabase SQL editor
- [ ] 🧑‍💻 Add `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` to a `.env` file
- [ ] 🧑‍💻 Enable **Apple** + **Google** providers in Supabase → Auth → Providers
- [ ] 🤖 **Wire the data layer to Supabase** (sessions, leaderboards, battles, friends) — I can do this once the project exists; today the app reads/writes local storage via `src/lib/store.ts`
- [ ] 🤖 Add a `delete_current_user` RPC + edge function for server-side account deletion

## Phase 3 — Apple Developer & signing
> Goal: be allowed to build a submittable app.

- [ ] 🧑‍💻 Enroll in the **Apple Developer Program** — ⏳ approval can take 24–48h · 💶 $99/year
- [ ] 🧑‍💻 In Xcode → App target → **Signing & Capabilities**: set your **Team**
- [ ] 🧑‍💻 Set a **unique Bundle ID** if `com.majusmok.studyarena` is taken
- [ ] 🧑‍💻 Add the **Sign in with Apple** capability (and enable it on the App ID) — [IOS_SETUP.md](IOS_SETUP.md) §4b

## Phase 4 — Store listing & assets
> Goal: everything App Store Connect asks for.

- [ ] 🧑‍💻 Create the app record in **App Store Connect** (appstoreconnect.apple.com)
- [ ] 🧑‍💻 Paste name/subtitle/description/keywords from [APP_STORE_LISTING.md](APP_STORE_LISTING.md) ✅ already written
- [ ] 🧑‍💻 **Host the Privacy Policy** at a public URL (the text is ready in [PRIVACY.md](PRIVACY.md)) — e.g. studyarena.app/privacy or GitHub Pages
- [ ] 🧑‍💻 Capture **screenshots** (6.7" iPhone) — Dashboard, Study+Victory, Battles, Leaderboard, Profile (Simulator: `⌘S`)
- [ ] 🧑‍💻 Fill the **App Privacy** questionnaire (answers drafted in [APP_STORE_LISTING.md](APP_STORE_LISTING.md))
- [ ] 🤖 (optional) A 1024 marketing icon / promo art variations

## Phase 5 — Submit
> Goal: shipped.

- [ ] 🧑‍💻 In Xcode: **Product → Archive → Distribute App → App Store Connect → Upload**
- [ ] 🧑‍💻 (recommended) Invite testers via **TestFlight** first
- [ ] 🧑‍💻 Submit for **review** in App Store Connect — ⏳ typically 1–3 days

---

## Nice-to-have before / soon after launch (all 🤖 I can build)
- [ ] 🤖 **Remote push notifications** (battle invites, "opponent finished") — beyond the local streak reminders already shipped
- [ ] 🤖 **Real-time leaderboards & live battles** via Supabase Realtime
- [ ] 🤖 **Onboarding flow** for first-time users
- [ ] 🤖 **Empty/loading/error states** polish for the networked version
- [ ] 🤖 **Android** build (`npx cap add android`) for Google Play
- [ ] 🤖 Basic **analytics** + crash reporting

---

### TL;DR — your next 3 moves
1. **Install Xcode** and run `npm run ios` to see it on a simulator.
2. **Enroll in the Apple Developer Program** (start early — approval has a lag).
3. Tell me to **wire up Supabase** once you've created the project — that's the big one that makes it a real multiplayer app, and it's mostly my work.
