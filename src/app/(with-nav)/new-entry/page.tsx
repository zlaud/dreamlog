"use client";

import {useEffect, useState} from "react";
import {
  addDoc,
  collection,
  doc,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc
} from "firebase/firestore";
import {onAuthStateChanged } from 'firebase/auth';
import {auth, db} from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "./NewEntry.module.css";
import { User as FirebaseUser } from "firebase/auth";
import TagInput from "@/components/taginput/TagInput";
import ThumbnailDropdown from "@/components/ThumbnailDropdown/ThumbnailDropdown";

interface PersonPlaceData {
  name: string;
  count: number;
}

const NewEntry = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dreamThumbnail, setDreamThumbnail] = useState("Moon1");
  // const [dreamType, setDreamType] = useState("Regular Dream");
  const [dreamLength, setDreamLength] = useState(3);
  const [emotions, setEmotions] = useState("");
  const [people, setPeople] = useState<string[]>([]);
  const [places, setPlaces] = useState<string[]>([]);

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

  const incrementMentionCount = async (collectionRef: any, name: string) => {
    const q = query(collectionRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docRef = querySnapshot.docs[0].ref;
      const data = querySnapshot.docs[0].data() as PersonPlaceData;
      await updateDoc(docRef, {
        count: data.count + 1,
      });
    } else {
      await addDoc(collectionRef, { name, count: 1 });
    }
  };

  const createPost = async () => {
    if (!user) {
      alert("You need to be logged in to create a post");
      return;
    }
    const userPostsCollectionRef = collection(db, `users/${user.uid}/logs`);
    await addDoc(userPostsCollectionRef, {
      title,
      description,
      dreamThumbnail,
      // dreamType,
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

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.data();
    const lastLogDate = userData?.lastLogDate?.toDate() || null;
    const currentDate = new Date();
    const isSameDay = lastLogDate && (lastLogDate.toDateString() === currentDate.toDateString());
    const isConsecutiveDay = lastLogDate && (new Date(lastLogDate.getTime() + 86400000).toDateString() === currentDate.toDateString());

    let currentStreak = userData?.currentStreak || 0;
    let longestStreak = userData?.longestStreak || 0;
    if (isSameDay) {
    } else if (isConsecutiveDay) {
      currentStreak += 1;
      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }
    } else {
      currentStreak = 1;
    }

    await updateDoc(userDocRef, {
      totalLogs: (userData?.totalLogs || 0) + 1,
      currentStreak,
      longestStreak,
      lastLogDate: currentDate,
    });

    const peopleCollectionRef = collection(db, `users/${user.uid}/people`);
    for (const person of people) {
      await incrementMentionCount(peopleCollectionRef, person);
    }

    const placesCollectionRef = collection(db, `users/${user.uid}/places`);
    for (const place of places) {
      await incrementMentionCount(placesCollectionRef, place);
    }

    router.push("/logs");
  };

  const renderThumbnailOption = (label: string, ThumbnailComponent: any) => (
      <option value={label}>
        <ThumbnailComponent />
      </option>
  );

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
                  {/*<select*/}
                  {/*    value={dreamType}*/}
                  {/*    onChange={(e) => setDreamType(e.target.value)}*/}
                  {/*>*/}
                  {/*  <option value="Regular Dream">Regular Dream</option>*/}
                  {/*  <option value="Nightmare">Nightmare</option>*/}
                  {/*</select>*/}
                  <ThumbnailDropdown
                      selectedThumbnail={dreamThumbnail}
                      setSelectedThumbnail={setDreamThumbnail}
                  />
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
                      placeholder="Type the name of the person and press &quot;Enter&quot;"
                      tags={people}
                      setTags={setPeople}
                  />
                </li>
                <li>
                  <label>Places:</label>
                  <TagInput
                      userId={user?.uid || ""}
                      collectionName="places"
                      placeholder="Type the name of the place and press &quot;Enter&quot;"
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
