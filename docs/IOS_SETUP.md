# 📱 StudyArena — iOS setup & App Store guide

StudyArena is wrapped as a native iOS app with **Capacitor**. This guide takes you from a fresh Mac to running the app on your iPhone and (optionally) submitting it to the App Store.

---

## 1. One-time prerequisites

| Need | How |
| --- | --- |
| **Xcode** (full app) | Install from the [Mac App Store](https://apps.apple.com/app/xcode/id497799835) (~7 GB). The Command Line Tools alone are **not** enough. |
| **Accept Xcode license** | After install, run `sudo xcodebuild -license accept`, then open Xcode once so it installs components. |
| **Point tools at Xcode** | `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer` |
| **Node on PATH** | Already set up for you in `~/.zshrc` (`~/.local/node`). If `npm` isn't found, run `export PATH="$HOME/.local/node/bin:$PATH"`. |

> ✅ Capacitor 8 uses **Swift Package Manager** — you do **not** need CocoaPods or Ruby gems.

To run on a **real iPhone** (not just the simulator) you also need a **free Apple ID** for development signing. To publish to the App Store you need the paid **[Apple Developer Program](https://developer.apple.com/programs/)** ($99/year).

---

## 2. Open & run the app

From the project root:

```bash
cd ~/Startupas
npm install        # first time only
npm run ios        # builds the web app, syncs it, and opens Xcode
```

In Xcode:

1. In the top toolbar, pick a target — an **iPhone simulator** (e.g. *iPhone 15*) or your **connected iPhone**.
2. Press **▶︎ Run** (or `⌘R`).
3. The app launches with the dark splash screen, then StudyArena. 🎉

### Running on your physical iPhone
1. Connect the iPhone with a cable and **trust** the computer.
2. In Xcode, select the **App** target → **Signing & Capabilities** tab.
3. Set **Team** to your Apple ID (add it via *Xcode → Settings → Accounts* if needed).
4. Change the **Bundle Identifier** if `com.majusmok.studyarena` is taken (it must be globally unique).
5. Press **▶︎ Run**. On the phone, approve the developer profile under *Settings → General → VPN & Device Management*.

---

## 3. After you change the web code

The native app runs a **built** copy of the web app, so after editing anything in `src/`:

```bash
npm run ios:sync   # rebuild + copy into the iOS project
```

…then re-run in Xcode. (`npm run ios` does this and opens Xcode in one go.)

> 💡 For fast UI iteration you don't need Xcode at all — use `npm run dev` and work in the browser. Only sync to iOS when you want to test on a device.

---

## 4. App icons & splash screen

The default Capacitor icon is a placeholder. To set your own:

1. Install the asset generator and drop a 1024×1024 `icon.png` (and optional `splash.png`) into a `resources/` folder:
   ```bash
   npm install -D @capacitor/assets
   npx capacitor-assets generate --ios
   ```
2. Re-run `npm run ios:sync`.

---

## 5. App Store submission checklist

When you're ready to publish:

- [ ] **Apple Developer Program** membership active ($99/yr).
- [ ] **App icon** set (no transparency, 1024×1024 for the store).
- [ ] **Unique bundle ID** registered, **Team** signing configured.
- [ ] Create the app record in [App Store Connect](https://appstoreconnect.apple.com): name, subtitle, category, description, keywords.
- [ ] **Screenshots** for required device sizes (6.7", 6.5", 5.5" etc.).
- [ ] **Privacy policy URL** + fill in the **App Privacy** questionnaire.
- [ ] In Xcode: **Product → Archive**, then **Distribute App → App Store Connect → Upload**.
- [ ] Submit for review in App Store Connect.

### ⚠️ Review rules that affect StudyArena specifically
- **Sign in with Apple (Guideline 4.8):** because the app offers Google login, Apple requires you to *also* offer Sign in with Apple.
- **Account deletion (5.1.1(v)):** if users can create accounts, the app must let them delete their account in-app.
- **Minimum functionality (4.2):** ship genuine native value — **push notifications** for streak reminders / battle results are the natural fit and strengthen the submission.
- **Real backend:** wire up Supabase (see `supabase/schema.sql`) — the localStorage demo mode is for development only.
- **In-app purchases:** if you ever sell coins/premium for real money, digital goods must use Apple IAP.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| `xcode-select: error: tool 'xcodebuild' requires Xcode` | Install full Xcode, then `sudo xcode-select -s /Applications/Xcode.app/Contents/Developer`. |
| `command not found: npm` | `export PATH="$HOME/.local/node/bin:$PATH"` |
| White flash on launch | Already themed dark via `capacitor.config.ts`; run `npm run ios:sync` after config changes. |
| Changes not showing in the app | You forgot to `npm run ios:sync` after editing `src/`. |
| Signing errors | Set a **Team** and a **unique Bundle Identifier** in *Signing & Capabilities*. |
