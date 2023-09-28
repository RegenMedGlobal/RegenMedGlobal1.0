// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAyTCM9B8ha5W0eVs84qLzfzBBPMUFZK8o',
  authDomain: 'regenmedglobal-75fda.firebaseapp.com',
  projectId: 'regenmedglobal-75fda',
  storageBucket: 'regenmedglobal-75fda.appspot.com',
  messagingSenderId: '524388347934',
  appId: '1:524388347934:web:5b6d2d1aa4432769ccfe0f',
  measurementId: 'G-S6Y0L5WDKS'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore()

export const analytics = getAnalytics(app)


