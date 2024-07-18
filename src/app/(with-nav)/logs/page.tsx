"use client";
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase.js";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import styles from './Logs.module.css';
import FilterInput from "@/components/filter/Filter";
import MonthNavigator from "@/components/MonthNavigator";

const Logs = () => {
  const [user, loading, error] = useAuthState(auth);
  const [logs, setLogs] = useState<any[]>([]);

  const [peopleFilters, setPeopleFilters] = useState<string[]>([]);
  const [placesFilters, setPlacesFilters] = useState<string[]>([]);

  const [filteredLogs, setFilteredLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const router = useRouter();
  let date = new Date().toDateString();
  const formatDate = (date: Date) => {
    const options = { month: "short", day: "numeric" } as const;
    return date.toLocaleDateString(undefined, options);
  };

    useEffect(() => {
    const fetchLogs = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        console.log("Fetching user posts...");
        const userPosts = await getDocs(collection(db, `users/${user.uid}/logs`));
        const postsData = userPosts.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt ? data.createdAt.toDate() : null
          };
        });
        postsData.sort((a, b) => (b.createdAt ? b.createdAt - a.createdAt : 1));

        setLogs(postsData);
        setFilteredLogs(postsData);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    if (!loading) {
      fetchLogs();
    }
  }, [user, loading, router]);


  useEffect(() => {
    handleSearch(searchQuery); // Update filtered logs based on search query
  }, [logs, searchQuery, sortOrder, peopleFilters, placesFilters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    let filtered = logs.filter((log) =>
        log.title.toLowerCase().includes(query.toLowerCase())
    );

    if (peopleFilters.length > 0) {
      filtered = filtered.filter((log) =>
          peopleFilters.every((person) => log.people.includes(person))
      );
    }

    if (placesFilters.length > 0) {
      filtered = filtered.filter((log) =>
          placesFilters.every((place) => log.places.includes(place))
      );
    }

    filtered.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.createdAt - b.createdAt;
      } else {
        return b.createdAt - a.createdAt;
      }
    });

    setFilteredLogs(filtered);
  };


  const handleSortOrderChange = (order: "asc" | "desc") => {
    setSortOrder(order);
  };



  return (

      <div className={styles.page}>

        <div className={styles.logs}>
          <h1>LOGS</h1>
          <div className={styles.date}>
            {date}
          </div>
          <div className={styles.filters}>
            <input
                className={styles.filter}
                type="text"
                placeholder="Search by title"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <FilterInput
                className={styles.filter}
                userId={user?.uid || ""}
                collectionName="people"
                placeholder="Filter by people"
                filters={peopleFilters}
                setFilters={setPeopleFilters}
            />
            <FilterInput
                className={styles.filter}
                userId={user?.uid || ""}
                collectionName="places"
                placeholder="Filter by places"
                filters={placesFilters}
                setFilters={setPlacesFilters}
            />

            <button className={styles.sortButton} onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
              Sort by {sortOrder === "asc" ? "newest" : "oldest"}
            </button>
          </div>

          <ul className={styles.logList}>
            {filteredLogs.map((log) => (
                <li key={log.id}>
                  <Link href={`/logs/${log.id}`}>
                  <div className={styles.details}>

                      <div className={styles.createdAt}>
                        {formatDate(log.createdAt)}
                      </div>
                      <div className={styles.title}>{log.title}</div>
                  </div>
                  </Link>

                </li>
            ))}
          </ul>
        </div>
      </div>
  )

  // return (
  //   <div>
  //     {loading && <div>Loading...</div>}
  //     {user && (
  //       <div className={styles.logs}>
  //         <h1>LOGS</h1>
  //         <MonthNavigator />
  //         {logs.length === 0 ? (
  //           <p>No posts found</p>
  //         ) : (
  //             <div className={styles.list}>
  //               <ul >
  //                 {logs.map((log) => (
  //                     <li key={log.id}>
  //                       <Link href={`/logs/${log.id}`}>
  //                         {log.title}
  //                       </Link>
  //                     </li>
  //                 ))}
  //               </ul>
  //             </div>
  //         )}
  //       </div>
  //     )}
  //   </div>
  // );
};

export default Logs;
