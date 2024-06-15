"use client";
import { Navbar } from "@/components/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import Log from "@/components/Log";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";

interface User {
  uid: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const { uid } = firebaseUser;
        setUser({ uid });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Cleanup function to unsubscribe from auth state listener
  }, []);

  if (user) {
    return (
      <div>
        <Navbar />
        <div className="relative left-16 w-[calc(100%_-_4rem)]">
          <Log />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <h1>Hello</h1>
      </div>
    );
  }
};

export default Home;
