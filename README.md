# 🚀 Task Flow

**Task Flow** is a modern Android task manager application built using **React Native** and **Expo**.  
It provides secure authentication using Firebase and allows users to manage their daily tasks efficiently with a clean UI and dark mode support.

---

## 📱 Features

### 🔐 Authentication
- Firebase Authentication
- Login & Signup

### 📝 Task Management
- Task List Screen
- Add / Edit Task Screen
- Task Detail Screen
- Real-time updates

### 🎨 UI & Experience
- Dark Mode support
- System theme detection
- Custom Toast component
- Animated logo using custom hook
- Smooth navigation using React Navigation (Stack Navigator)

### 🧠 State Management
- Redux Toolkit
- AsyncStorage for persistence

### 🧩 Custom Hooks
- `useLogoAnimation`
- `useTheme`

### 🧱 Custom Components
- `ThemeBackground`
- `SystemThemeListener`
- `CustomToast`

---

## 🛠 Tech Stack

- **React Native**
- **Expo**
- **Firebase**
- **Redux Toolkit**
- **React Navigation (Stack Navigator)**
- **AsyncStorage**
- **NativeWind (Tailwind for React Native)**
- **Reanimated**
- **Axios**

---

## 📦 Dependencies

```json
{
  "@react-native-async-storage/async-storage": "^2.2.0",
  "@react-navigation/native": "^7.1.31",
  "@react-navigation/stack": "^7.8.2",
  "@reduxjs/toolkit": "^2.11.2",
  "axios": "^1.13.6",
  "expo": "~55.0.4",
  "firebase": "^12.10.0",
  "nativewind": "^4.2.2",
  "react": "19.2.0",
  "react-native": "0.83.2",
  "react-redux": "^9.2.0"
}
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Muhammad-Arsl/Task-Manager.git
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Configure Firebase

Place Your Firebase configuration in the following file:

```
src/services/firebase.js
```

Add your Firebase credentials inside it.

⚠️ Make sure this file is added to `.gitignore`.

---

### 4️⃣ Start the Project

```bash
npx expo start
```

Run on:
- Android Emulator
- Physical Android device using Expo Go

---

## 🌙 Dark Mode

Task Flow supports:
- Manual theme switching
- System theme detection
- Persistent theme storage using AsyncStorage

---

## 🗂 Project Structure (Simplified)

```
src/
 ├── components/
 ├── hooks/
 ├── navigation/
 ├── redux/
 ├── screens/
 └── services/
```

---

## 📄 License

This project is created for learning and development purposes.

---

## 👨‍💻 Author
Muhammad Arslan
Developed using ❤️ with React Native & Expo.
