// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3QO_6MscRUeeVmT_9RdZUO2QryIWGRQY",
  authDomain: "rtenant.firebaseapp.com",
  databaseURL: "https://rtenant-default-rtdb.firebaseio.com",
  projectId: "rtenant",
  storageBucket: "rtenant.appspot.com",
  messagingSenderId: "203593849981",
  appId: "1:203593849981:web:de3f0ae909569b9e666514"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app;