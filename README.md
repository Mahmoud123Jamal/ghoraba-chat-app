# Ghoraba Chat App

A real-time, responsive chat application built with React, Firebase, and Zustand. Developed by **Mahmoud Ghoraba**, the app provides a seamless experience for chatting, sending emojis, and managing user sessions with live updates and toast notifications.

## Features

- **Real-time Messaging** with Firebase Firestore
- **User Authentication** using Firebase Auth
 - **Emoji Picker** integration (`emoji-picker-react`)
- **Seen Message Tracking** per user
- **Last Message Preview** in Chat List
- **Toast Notifications** using `react-toastify`
- **Responsive Design** using Bootstrap 5
- **State Management** with Zustand
- **Routing and Navigation** with `react-router-dom`

## Tech Stack

- **Frontend Framework**: React 19
- **Routing**: React Router DOM v7
- **State Management**: Zustand
- **Styling**: Bootstrap 5, React Bootstrap
- **Realtime & Auth**: Firebase (Auth, Firestore)
- **Emoji Support**: emoji-picker-react
- **Notifications**: React Toastify

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mahmoud123Jamal/ghoraba-chat-app.git
   cd ghoraba-chat-app
 ```

1. Install dependencies:

   ```bash
   npm install
   ```

1. Run the development server:

   ```bash
   npm run dev
   ```
# Firebase Setup

Follow these steps to configure Firebase for the Ghoraba Chat App:

---

## 🔧 Set up Firebase:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project

### ✅ Enable the following services:
- **Authentication** → Email/Password
- **Cloud Firestore**
- **Firebase Storage**

---

## 📋 Add Firebase Config

After creating your Firebase project, copy your app's configuration and replace the values in:

```ts
// src/lib/firebase.ts
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```
The app will be available at: `https://ghoraba-chat.netlify.app`

## Project Structure

```
├── src/
│   ├── assets/         # assets for your app
│   ├── Components/     # Reusable UI components
│   ├── lib/            # backend utilities
│   ├── pasges/         # pages of app
│   ├── styles/         # Custom CSS
│   ├── utilites/       # utilities
│   ├── App.tsx         # Main application component
│   └── global/         # global CSS
├── public/             # App logo
├── index.html          # App entry point
├── package.json        # Project metadata and dependencies
└── tsconfig.json       # TypeScript configuration
```
## To-Do & Improvements

-  Add message reactions

- Add message editing and deleting

- Add video/audio message support

- Add typing indicators

- Add online/offline user status

- Store messages/media with better compression

- Add private/public room logic

- Add unit & integration tests

- Add dark mode toggle

## Developer

Mahmoud Ghoraba

GitHub: [Mahmoud123Jamal](https://github.com/Mahmoud123Jamal)

Email: mahmoud1234goraba@gmail.com

## License

This project is open-source and available under the MIT License.
