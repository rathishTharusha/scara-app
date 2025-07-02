# SCARA Bot Web App (Firebase + Raspberry Pi)

This project lets a user select a shape and color from a web app. Their selection is sent to a Raspberry Pi to control a SCARA robot arm.

---

## 🧰 What it does
- Google Login using Firebase Auth
- User selects a shape and a color
- Data stored in Firebase Firestore
- Firebase Cloud Function sends selection to Raspberry Pi (Flask server)

---

## 🪜 Step-by-Step Setup Guide (for beginners)

### ✅ 1. Clone the GitHub Repository

If you're a beginner, you can download the code without using Git:
1. Visit the GitHub repo URL.
2. Click the green "Code" button → choose "Download ZIP".
3. Extract the ZIP file on your computer.

If you're familiar with Git:
```bash
git clone https://github.com/your-username/scara-web-app.git
cd scara-web-app
```

---

### ✅ 2. Create a Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" → give it a name (e.g., `ScaraBotApp`).
3. Skip Google Analytics.
4. Once created, go to **Project Settings** → **General**.
5. Click "</>" to create a web app → name it `scara-app`.
6. Copy the Firebase config object it gives you. It looks like this:

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  ...
};
```

7. Paste this into `public/app.js` where it says `firebaseConfig`.

---

### ✅ 3. Enable Firebase Authentication (Google)

1. In Firebase Console → go to **Build > Authentication > Get Started**
2. Go to the **Sign-in method** tab.
3. Enable **Google** login → set a project support email.

---

### ✅ 4. Enable Firestore Database

1. In Firebase Console → go to **Build > Firestore Database**
2. Click "Create Database"
3. Start in **test mode** for now
4. Choose a region (close to you)

---

### ✅ 5. Install Firebase CLI on your PC

Install Node.js if you don’t have it: https://nodejs.org/
Then in terminal:
```bash
npm install -g firebase-tools
firebase login
firebase init
```
During `firebase init`:
- Select: **Hosting**, **Functions**
- Use existing project → choose your Firebase project
- Set `public/` as your hosting folder
- Set up JavaScript functions when asked

---

### ✅ 6. Deploy Frontend & Cloud Function

From your project root:
```bash
firebase deploy --only hosting
firebase deploy --only functions
```

This uploads your website and backend function to Firebase servers.

---

### ✅ 7. Setup Raspberry Pi (Flask server)

1. Install Flask:
```bash
sudo apt update
sudo apt install python3-pip
pip3 install flask flask-cors
```

2. Go to `raspberry-pi/` folder
3. Run the server:
```bash
python3 receive.py
```
This will start your Flask server at `http://<PI_IP>:5000/receive_command`

---

### ✅ 8. Expose Raspberry Pi to Internet (using ngrok)

Your Pi needs to be reachable from Firebase Cloud Functions.
Install ngrok:
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
  sudo apt update && sudo apt install ngrok
```

Start ngrok tunnel:
```bash
ngrok http 5000
```
Copy the HTTPS URL it shows (e.g., `https://abc123.ngrok.io`)

---

### ✅ 9. Update Cloud Function with Pi URL

In `functions/index.js`, update this line:
```js
await axios.post("http://YOUR_PI_PUBLIC_URL:5000/receive_command", payload);
```
Replace `YOUR_PI_PUBLIC_URL` with your ngrok URL.
Then redeploy:
```bash
firebase deploy --only functions
```

---

### ✅ 10. DONE! Try the app

- Visit your Firebase-hosted URL (shown after deploy)
- Login with Google
- Select a shape and color → click Submit
- Pi receives it and prints it in terminal

---

## 🧪 Troubleshooting

- 🔥 If Cloud Functions fail: check Firebase Logs (Console → Functions → Logs)
- 🌐 If Pi not reachable: recheck ngrok or firewall settings
- 🔑 Want authentication to Pi endpoint? Use a secret token

---

## 🧱 Project Structure
```
/scara-app
├── public/            # Frontend (HTML/CSS/JS)
├── functions/         # Firebase Cloud Functions (Node.js)
├── raspberry-pi/      # Flask backend (runs on Pi)
└── firebase.json      # Firebase config
```

Let me know if you'd like help adding user history, command queueing, or securing your Raspberry Pi!
