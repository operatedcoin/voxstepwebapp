import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAgqPwH8JG52jeDoWhZxvYD0prpM7DhoEU',
  authDomain: "voxstep-93f11.firebaseapp.com",
  projectId: "voxstep-93f11",
  storageBucket: "voxstep-93f11.appspot.com",
  messagingSenderId: "302564391357",
  appId: "1:302564391357:web:4c1222e498fa644fc9bad4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };