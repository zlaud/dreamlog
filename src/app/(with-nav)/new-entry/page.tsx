"use client";

import {useEffect, useState, useRef} from "react";
import {addDoc, collection, doc, query, where, getDocs, limit} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {auth, db} from "@/lib/firebase";
import { useRouter } from "next/navigation";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import styles from "./NewEntry.module.css";
import { User as FirebaseUser } from "firebase/auth";
import TagInput from "@/components/taginput/TagInput";

const NewEntry = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dreamType, setDreamType] = useState("Regular Dream");
  const [dreamLength, setDreamLength] = useState(3);
  const [emotions, setEmotions] = useState("");
  const [people, setPeople] = useState<string[]>([]);
  const [places, setPlaces] = useState<string[]>([]);


  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
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
      createdAt: new Date(),
      author: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
      },
    });

    const saveTags = async (tags: string[], collectionName: string) => {
      const collectionRef = collection(db, `users/${user.uid}/${collectionName}`);
      for (const tag of tags) {
        const q = query(collectionRef, where('name', '==', tag));
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
          await addDoc(collectionRef, { name: tag });
        }
      }
    };

    await saveTags(people, 'people');
    await saveTags(places, 'places');

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
                  <TagInput
                      userId={user?.uid || ""}
                      collectionName="people"
                      placeholder="People"
                      tags={people}
                      setTags={setPeople}
                  />
                </li>
                <li>
                  <label>Places:</label>
                  <TagInput
                      userId={user?.uid || ""}
                      collectionName="places"
                      placeholder="Places"
                      tags={places}
                      setTags={setPlaces}
                  />
                </li>
              </ul>


            <button className={styles.submitButton} onClick={createPost}>
              <div className={styles.btnColor}></div>
              <span>Submit Dream</span>
            </button>
          </div>
        </div>
  );
};

export default NewEntry;
