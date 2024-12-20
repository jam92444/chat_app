import { initializeApp } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyC4K9UAkHIzEUSt7FMc8P-enUM_bPNPrT4",
  authDomain: "chat-app-myj01.firebaseapp.com",
  projectId: "chat-app-myj01",
  storageBucket: "chat-app-myj01.appspot.com",
  messagingSenderId: "1045020814221",
  appId: "1:1045020814221:web:986d6cd7277ccd4044ebc4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Signup method
const signup = async (username, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Store user data in Firestore
    await setDoc(doc(db, "users", user.uid), {
      id: user.uid,
      username: username.toLowerCase(),
      email,
      name: "",
      avatar: "",
      bio: "Hey, there I am using chatapp-myj",
      lastSeen: Date.now(),
    });

    await setDoc(doc(db, "chats", user.uid), {
      chatsData: [],
    });
  } catch (error) {
    console.log(error.message);
    toast.error(error.code.split("/")[1].split("-").join(" "));
    // Use error.message for a clearer message
  }
};

// Login Method
const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};

// Logout Method
const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error(error);
    toast.error(error.code.split("/")[1].split("-").join(" "));
  }
};


//reset password 
const resetPass = async(email)=>{
  if(!email){
    toast.error("Enter your email");
    return null;
  }
  try {
    const userRef = collection(db,'users');
    const q = query(userRef,where('email',"==",email));
    const querySnap = await getDocs(q);
    if(!querySnap.empty){
      await sendPasswordResetEmail(auth,email);
      toast.success("Reset mail sent")
    }
    else{
      toast.error('Email does not exist');
    }
    
  } catch (error) {
      console.log(error.message);
      toast.error(error.message);
      
  }
}

export { signup, login,logout,auth,db,resetPass };
