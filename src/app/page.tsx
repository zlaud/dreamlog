"use client";
import { Navbar } from "@/components/navbar/Navbar";
import { useState } from "react";
import styles from './LandingPage.module.css';
import Link from "next/link";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    // <div>
    //   <Navbar onSidebarToggle={handleSidebarToggle} />
    //   <div
    //     className={`relative left-16 w-[calc(100%_-_4rem)] ${styles.content} ${
    //       isSidebarOpen ? styles.contentShift : ""
    //     }`}
    //   ></div>
    //
    //   <div>
    //     <p>Hello</p>
    //   </div>
    // </div>
      <div className={styles.landingPage}>
          <nav className={styles.navbar}>
              <div className={styles.logo}>Dream Log</div>
              <div className={styles.authButtons}>
                  <Link href="/login"><button className={styles.loginButton}>Login</button></Link>
                  <Link href="/sign-up"><button className={styles.signupButton}>Sign Up</button></Link>
              </div>
          </nav>
          <div className={styles.mainContent}>
              <h1>Start Your Dream Journal Today</h1>
              <div className={styles.arrowContainer}>
                  <span className={styles.arrow}>↓</span>
              </div>
          </div>
          <div className={styles.secondaryContent}>
              <p>Dream Log is the easiest and fastest way to start journaling</p>
              <div className={styles.ctaButtons}>
                  <Link href="/sign-up"><button className={styles.ctaButton}>Sign Up Now</button></Link>
                  <Link href="/login"><button className={styles.ctaButton}>Login</button></Link>
              </div>
          </div>
      </div>
  );
};

export default Home;
