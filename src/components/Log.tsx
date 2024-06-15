"use client";
import { useState, useEffect } from "react";
import MonthNavigator from "@/components/MonthNavigator";
import {
  collection,
  getDocs,
  QuerySnapshot,
  DocumentData,
} from "firebase/firestore";

import { db, auth } from "@/lib/firebase";

interface LogDocument {
  id: string;
  data: DocumentData;
}

const Log = () => {
  const user = auth.currentUser;
  const [docs, setDocs] = useState<LogDocument[]>([]);

  useEffect(() => {
    const fetchDocs = async () => {
      if (user) {
        try {
          const logsCollection = collection(db, `users/${user.uid}/logs`);
          const querySnapshot: QuerySnapshot<DocumentData> = await getDocs(
            logsCollection
          );
          const fetchedDocs: LogDocument[] = [];

          querySnapshot.forEach((doc) => {
            fetchedDocs.push({ id: doc.id, data: doc.data() });
          });

          setDocs(fetchedDocs);
          console.log("Fetched Documents:", fetchedDocs);
        } catch (error) {
          console.error("Error fetching documents: ", error);
        }
      }
    };

    fetchDocs();
  }, [user]);

  return (
    <div>
      <h1 className="text-transform: uppercase font-bold">Dream Log</h1>
      <MonthNavigator />
      <div>
        {docs.map((doc) => (
          <div key={doc.id}>
            <h3>{doc.data.story}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Log;
