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
             
             // Get Token
             const userInfo = { email: currentUser.email };
             fetch('http://localhost:3000/jwt', { 
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(userInfo)
             })
             .then(res => res.json())
             .then(data => {
                 if (data.token) {
                     localStorage.setItem('access-token', data.token);
                 }
                 setLoading(false);
             })
             .catch(err => {
                 console.error("JWT Fetch Error", err);
                 setLoading(false);
             });

             localStorage.removeItem('dbUser');

        } else {
             localStorage.removeItem('access-token');
             
            // Check for persistent DB user if no Firebase user
            const dbUser = localStorage.getItem('dbUser');
            if (dbUser) {
                const parsedUser = JSON.parse(dbUser);
                setUser(parsedUser);
                setLoading(false);
                
                // Refresh token for DB user too if needed (optional, but good practice)
                 const userInfo = { email: parsedUser.email };
                 fetch('http://localhost:3000/jwt', { 
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(userInfo)
                 })
                 .then(res => res.json())
                 .then(data => {
                     if (data.token) localStorage.setItem('access-token', data.token);
                 });
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
       
       // Get Token for DB User
       const userInfo = { email: userObj.email };
       fetch('http://localhost:3000/jwt', { 
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(userInfo)
       })
       .then(res => res.json())
       .then(data => {
            if (data.token) {
                localStorage.setItem('access-token', data.token);
            }
            setLoading(false);
       })
       .catch(err => {
            console.error(err);
            setLoading(false);
       });
  }

  const logOut = () => {
    setLoading(true);
    localStorage.removeItem('dbUser'); 
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
