import React, { useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase.config";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleProvider = new GoogleAuthProvider();

  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Observer to track auth state
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
             setUser(currentUser);
             setLoading(false);
             localStorage.removeItem('dbUser'); // Clear DB user if Firebase user exists
        } else {
            // Check for persistent DB user if no Firebase user
            const dbUser = localStorage.getItem('dbUser');
            if (dbUser) {
                setUser(JSON.parse(dbUser));
                setLoading(false);
            } else {
                setUser(null);
                setLoading(false);
            }
        }
    });
    return () => unSubscribe();
  }, []);
  const updateUserProfile = (name, photo) => {
    setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };


  const dbLogin = (userObj) => {
       setUser(userObj);
       localStorage.setItem('dbUser', JSON.stringify(userObj));
       setLoading(false);
  }

  const logOut = () => {
    setLoading(true);
    localStorage.removeItem('dbUser'); // Clear DB user on logout
    // Also sign out from Firebase just in case
    return signOut(auth).then(() => {
        setUser(null);
        setLoading(false);
    });
  };

  const authInfo = {
    registerUser,
    signInUser,
    signInGoogle,
    user,
    loading,
    logOut,
    updateUserProfile,
    dbLogin
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
