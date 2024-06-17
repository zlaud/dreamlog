"use client";
import { Navbar } from "@/components/navbar/Navbar";
import { onAuthStateChanged } from "firebase/auth";
import Log from "@/components/Log";
import { auth } from "@/lib/firebase";
import { useState, useEffect } from "react";
import styles from '@/components/navbar/Navbar.module.css';

interface User {
  uid: string;
}

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  if (user) {
    return (
      <div>
        <Navbar onSidebarToggle={handleSidebarToggle}  />
        <div className={`relative left-16 w-[calc(100%_-_4rem)] ${styles.content} ${isSidebarOpen ? styles.contentShift : ''}`}>
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
