# SCARA Bot Web App (Firebase + Raspberry Pi)

## What it does
- Google login using Firebase Auth
- Lets user select shape & color
- Stores selection in Firestore
- Sends command to Raspberry Pi via Firebase Cloud Function

## Setup Steps
1. Clone this repo
2. Setup Firebase project → Enable Google Auth & Firestore
3. Replace Firebase config in public/app.js
4. Run `firebase init` → enable Hosting and Functions
5. Deploy frontend: `firebase deploy`
6. Deploy backend: `firebase deploy --only functions`
7. On Raspberry Pi, install Flask → run receive.py
8. Expose Pi endpoint (e.g. via ngrok)
9. Update Pi URL in functions/index.js → redeploy

You're done!
