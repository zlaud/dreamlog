"use client";

import {useEffect, useState} from "react";
import {addDoc, collection, doc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {auth, db} from "@/lib/firebase";
import { useRouter } from "next/navigation";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import styles from "./NewEntry.module.css";
import { User as FirebaseUser } from "firebase/auth";

const NewEntry = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dreamType, setDreamType] = useState("Regular Dream");
  const [dreamLength, setDreamLength] = useState(3);
  const [emotions, setEmotions] = useState("");
  const [people, setPeople] = useState("");
  const [places, setPlaces] = useState("");

  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();

  const postsCollectionRef = collection(db, "posts");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, [router]);


  const createPost = async () => {
    if (!user) {
      alert("You need to be logged in to create a post");
      return;
    }
    const userPostsCollectionRef = collection(db, `users/${user.uid}/logs`);
    await addDoc(userPostsCollectionRef, {
      title,
      description,
      dreamType,
      dreamLength,
      emotions,
      people,
      places,
      createdAt: new Date(), // Timestamp for when the post was created
      author: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName, // Include displayName if available
      },
    });
    router.push("/logs");
  };

  return (
        <div className={styles.page}>
          <div className={styles.newEntry}>
            <h1> New Entry</h1>
            {/* Title and description */}
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
              <ul>
                <h1>Details</h1>
                <li>
                  <label>Dream Type:</label>
                  <select
                      value={dreamType}
                      onChange={(e) => setDreamType(e.target.value)}
                  >
                    <option value="Regular Dream">Regular Dream</option>
                    <option value="Nightmare">Nightmare</option>
                  </select>
                </li>
                <li>
                  <label>Dream Length (1-5):</label>
                  <input
                      type="number"
                      value={dreamLength}
                      onChange={(e) => setDreamLength(parseInt(e.target.value))}
                      min={1}
                      max={5}
                      required
                  />
                </li>
                <li>
                  <label>Emotions:</label>
                  <input
                      type="text"
                      placeholder="Emotions"
                      value={emotions}
                      onChange={(e)=> setEmotions(e.target.value)}
                  />
                </li>
                <li>
                  <label>People:</label>
                  <input
                      type="text"
                      placeholder="People"
                      value={people}
                      onChange={(e) => setPeople(e.target.value)}
                  />
                </li>
                <li>
                  <label>Places:</label>
                  <input
                      type="text"
                      placeholder="Places"
                      value={places}
                      onChange={(e) => setPlaces(e.target.value)}
                  />
                </li>
              </ul>

            <button className={styles.submitButton} onClick={createPost}>Submit Dream</button>
          </div>
        </div>
  );
};

export default NewEntry;
