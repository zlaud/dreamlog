"use client";
import { Navbar } from "@/components/navbar/Navbar";
import { useState } from "react";
import styles from "@/components/navbar/Navbar.module.css";

const Home = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  return (
    <div>
      <Navbar onSidebarToggle={handleSidebarToggle} />
      <div
        className={`relative left-16 w-[calc(100%_-_4rem)] ${styles.content} ${
          isSidebarOpen ? styles.contentShift : ""
        }`}
      ></div>

      <div>
        <p>Hello</p>
      </div>
    </div>
  );
};

export default Home;
