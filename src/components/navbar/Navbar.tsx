"use client";

import { useState } from "react";
import { Menu, BookOpenText, BookPlus, LogOut, UserRound } from "lucide-react";
import Link from "next/link";
import { signOut } from "firebase/auth";
import styles from "./Navbar.module.css";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
      <>
        <div
            className={`${styles.sidebar} ${
                isSidebarOpen ? styles.sidebarOpen : ""
            }`}
        >
          <div className={styles.top}>
            <div className={styles.logo}>
              <span>Dream Log</span>
            </div>
            <button className={styles.menuButton} onClick={toggleSidebar}>
              <Menu />
            </button>


          </div>

          <ul>


            <li>
              <Link href="/logs">
                <i>
                  {" "}
                  <BookOpenText />{" "}
                </i>
                <span className={styles.navItem}>Logs</span>
              </Link>
              <span className={styles.tooltip}>Logs</span>
            </li>

            <li>
              <Link href="/new-entry">
                <i>
                  {" "}
                  <BookPlus />{" "}
                </i>
                <span className={styles.navItem}>New Entry</span>
              </Link>
              <span className={styles.tooltip}>New Entry</span>
            </li>

            <li>
              <Link href = "/account">
                <i>
                  <UserRound/>
                </i>
                <span className={styles.navItem}>Account</span>
              </Link>
              <span className={styles.tooltip}>Account</span>
            </li>

            <li className={styles.logoutButton}>
              <button onClick={handleSignOut}>
                <i>
                  <LogOut />
                </i>
                <span className={styles.navItem}>Log Out</span>
              </button>
              <span className={styles.tooltip}>Log Out</span>
            </li>
          </ul>
        </div>
      </>
  );
};