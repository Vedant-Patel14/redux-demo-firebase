import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAGyJuWhxaj0r69v1zyKPhIxe0eoD6ei0U",
  authDomain: "redux-demo-1dae5.firebaseapp.com",
  projectId: "redux-demo-1dae5",
  storageBucket: "redux-demo-1dae5.appspot.com",
  messagingSenderId: "218062658504",
  appId: "1:218062658504:web:448b54a8e1eedd93e9befd",
  // databaseURL: "https://console.firebase.google.com/u/0/project/redux-demo-1dae5/database/redux-demo-1dae5-default-rtdb/data/~2F"
};
export const app = initializeApp(firebaseConfig)
export const db = getFirestore(app);
export const storage = getStorage(app); 

