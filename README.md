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
git clone https://github.com/rathishTharusha/scara-app.git
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

📍 Run these steps on your Raspberry Pi (not your laptop).

1. Transfer the `raspberry-pi/` folder to your Raspberry Pi (via SCP, USB, or Git clone on Pi).

2. Open a terminal on the Pi and install Flask:
```bash
sudo apt update
sudo apt install python3-pip -y
pip3 install flask flask-cors
```

3. Navigate to the `raspberry-pi/` directory:
```bash
cd ~/path-to-project/raspberry-pi
```

4. Run the server:
```bash
python3 receive.py
```

Your Flask server is now listening locally on:
```
http://<PI_LOCAL_IP>:5000/receive_command
```

---

### ✅ 8. Expose Raspberry Pi to Internet (using ngrok)

📍 Still on your Raspberry Pi:

We use ngrok so Firebase can reach the Pi from anywhere online.

1. Install ngrok:
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | \
  sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null && \
  echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | \
  sudo tee /etc/apt/sources.list.d/ngrok.list && \
  sudo apt update && sudo apt install ngrok -y
```

2. Start the tunnel:
```bash
ngrok http 5000
```

3. It will display a forwarding URL like:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:5000
```
Copy that `https://` URL — we will use it in the next step.

---

### ✅ 9. Update Cloud Function with Pi URL

📍 Back on your PC:

1. Open `functions/index.js`
2. Find this line:
```js
await axios.post("http://YOUR_PI_PUBLIC_URL:5000/receive_command", payload);
```
3. Replace `YOUR_PI_PUBLIC_URL` with the `https://` URL from ngrok (no port needed).

Example:
```js
await axios.post("https://abc123.ngrok.io/receive_command", payload);
```

4. Save the file and redeploy functions:
```bash
firebase deploy --only functions
```

---

### ✅ 10. DONE! Try the app

- Visit your Firebase-hosted URL (shown after deploy)
- Login with Google
- Select a shape and color → click Submit
- Your Raspberry Pi terminal will show the received selection 🎉

---

## 🧪 Troubleshooting

- 🔥 If Cloud Functions fail: check Firebase Logs (Console → Functions → Logs)
- 🌐 If Pi not reachable: restart ngrok and update the URL in `functions/index.js`
- 🔐 Want more security? Add a shared secret to the POST request

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
