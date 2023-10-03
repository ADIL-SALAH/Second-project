import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCMVz8zBojZg1DJSWkDzVV79obwTJWBkGQ",
    authDomain: "resto-plaza.firebaseapp.com",
    projectId: "resto-plaza",
    storageBucket: "resto-plaza.appspot.com",
    messagingSenderId: "102001432791",
    appId: "1:102001432791:web:36230e169a24cc8fdaf892",
    measurementId: "G-KB3E0LNQ05"
};
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)
auth.languageCode = 'ml';

export { firebaseApp, auth };