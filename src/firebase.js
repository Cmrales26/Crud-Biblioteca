import app from "firebase/app";
import 'firebase/firestore';
import 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDfhZQrldDE2Fnzq7vcIWjrOp_IaGJ4_4g",
  authDomain: "bibliorecacrud.firebaseapp.com",
  projectId: "bibliorecacrud",
  storageBucket: "bibliorecacrud.appspot.com",
  messagingSenderId: "280458277109",
  appId: "1:280458277109:web:5db365145f50b95140d5bc"
};

app.initializeApp(firebaseConfig);
const db = app.firestore();
const auth = app.auth();

export{db, auth};