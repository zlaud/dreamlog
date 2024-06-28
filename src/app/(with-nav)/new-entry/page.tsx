"use client";

import {useEffect, useState} from "react";
import {addDoc, collection, doc} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import {auth, db} from "@/lib/firebase";
import { useRouter } from "next/navigation";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import styles from "./NewEntry.module.css";
import {User} from "next-auth";

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
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  const postsCollectionRef = collection(db, "posts");


  const createPost = async () => {
    if (!user) {
      alert("You need to be logged in to create a post");
      return;
    }

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

  const handleEmojiClick = (emojiObject: EmojiClickData) => {
    const emoji = emojiObject.emoji;
    setSelectedEmojis([...selectedEmojis, emoji]);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedEmojis(e.target.value.split(' '));
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
            <div className={styles.details}>
              <h1>Details</h1>
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
                    value={places}
                    onChange={handleInputChange}
                    // onChange={(e) => setEmotions(e.target.value)}
                />
                {/*<button onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}>+</button>*/}
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


            <button className={styles.submitButton} onClick={createPost}>Submit Dream</button>
          </div>

          {isEmojiPickerOpen && (
              <div className={styles.emojiPicker}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
          )}
        </div>
  );
};

export default NewEntry;
