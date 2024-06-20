"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase.js";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import nookies from "nookies";

const Logs = () => {
  const [user, loading, error] = useAuthState(auth);
  console.log(user);
  const [logs, setLogs] = useState<any[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchLogs = async () => {
      if (!user) {
        router.push("/login");
        return;
      }
      //   const cookies = nookies.get(undefined);
      //   const token = cookies.token;
      //   console.log(token);
      //   if (!token) {
      //     router.push("/login");
      //     return;
      //   }
      try {
        console.log("Fetching user posts...");
        const userPosts = await getDocs(collection(db, "posts"));
        const postsData = userPosts.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setLogs(postsData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (!loading) {
      fetchLogs();
    }
  }, [user, loading, router]);

  return (
    <div>
      {loading && <div>Loading...</div>}
      {user && (
        <div>
          {" "}
          <h1>Your Posts</h1>
          {logs.length === 0 ? (
            <p>No posts found</p>
          ) : (
            <ul>
              {logs.map((log) => (
                <li key={log.id}>{log.title}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Logs;
