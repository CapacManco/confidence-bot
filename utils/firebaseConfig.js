// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyDHPlK4DI1LYnwzZxgSAoWXnuf9tmRaMj8',
  authDomain: 'confidence-bot.firebaseapp.com',
  projectId: 'confidence-bot',
  storageBucket: 'confidence-bot.appspot.com',
  messagingSenderId: '240128328327',
  appId: '1:240128328327:web:b836d6ccf66b927f6c2e22',
  measurementId: 'G-D06REPEGGW',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
