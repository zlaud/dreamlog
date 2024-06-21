"use client";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import styles from "./NewEntry.module.css"; // Import the CSS module

import { onAuthStateChanged } from "firebase/auth";
const NewEntry = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dreamType, setDreamType] = useState("Regular Dream");
  const [dreamLength, setDreamLength] = useState(3);
  const [emotions, setEmotions] = useState("");
  const [people, setPeople] = useState("");
  const [places, setPlaces] = useState("");

  const [user, setUser] = useState(null);
  const router = useRouter();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleSidebarToggle = (isOpen: boolean) => {
    setIsSidebarOpen(isOpen);
  };

  const postsCollectionRef = collection(db, "posts");
  const createPost = async () => {
    // if (!user) {
    //     alert("You need to be logged in to create a post");
    //     return;
    // }

    await addDoc(postsCollectionRef, {
      title,
      description,
      dreamType,
      dreamLength,
      emotions,
      people,
      places,
    });
    router.push("/");
  };

  return (
    <div className={styles.newEntry}>
      <div className={styles.createNewEntry}>
        <h1 className={styles.header}>New Entry</h1>

        <div className={styles.title}>
          <input
            placeholder={"Title"}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className={styles.description}>
          <textarea
            placeholder={"Story time..."}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>

        {/* Details section */}
        <div className={styles.detailsHeader}>
          <label>Details</label>
        </div>
        <div className={styles.details}>
          <div className={styles.detailItem}>
            <label>Dream Type:</label>
            <select
              value={dreamType}
              onChange={(e) => setDreamType(e.target.value)}
            >
              <option value="Regular Dream">Regular Dream</option>
              <option value="Nightmare">Nightmare</option>
            </select>
          </div>

          <div className={styles.detailItem}>
            <label>Dream Length (1-5):</label>
            <input
              type="number"
              value={dreamLength}
              onChange={(e) => setDreamLength(parseInt(e.target.value))}
              min={1}
              max={5}
              required
            />
          </div>

          <div className={styles.detailItem}>
            <label>Emotions:</label>
            <input
              type="text"
              placeholder="Emotions"
              value={emotions}
              onChange={(e) => setEmotions(e.target.value)}
            />
          </div>

          <div className={styles.detailItem}>
            <label>People:</label>
            <input
              type="text"
              placeholder="People"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
            />
          </div>

          <div className={styles.detailItem}>
            <label>Places:</label>
            <input
              type="text"
              placeholder="Places"
              value={places}
              onChange={(e) => setPlaces(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.submitButton}>
          <button onClick={createPost}>Submit Dream</button>
        </div>
      </div>
    </div>
  );
};

export default NewEntry;
