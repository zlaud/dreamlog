"use client";
import '@/styles/globals.css';
import { useState, useEffect } from "react";
import { db, auth } from "@/lib/firebase.js";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Filter } from 'lucide-react';
import { useRouter } from "next/navigation";
import Link from 'next/link';
import styles from './Logs.module.css';
import FilterInput from "@/components/filter/Filter";

const Logs = () => {
  const [user, loading, error] = useAuthState(auth);
  const [logs, setLogs] = useState<any[]>([]);

  const [peopleFilters, setPeopleFilters] = useState<string[]>([]);
  const [placesFilters, setPlacesFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState<boolean>(false);
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

  const renderPeoplePlaces = (items: string[], label: string) => {
    if (!items || items.length === 0) return null;

    const displayedItems = items.slice(0, 2).join(", ");
    const moreCount = items.length > 2 ? ` and ${items.length - 2}+` : "";

    return (
        <div className={styles.peoplePlaces} title={items.join(", ")}>
          <strong>{label}: </strong>{displayedItems}{moreCount}
        </div>
    );
  };

  return (
      <div className={styles.page}>
        <div className={styles.logs}>
          <h1>LOGS</h1>
          <div className={styles.date}>{date}</div>

          <div className={styles.top}>
            <div className={styles.topleft}>
              <input
                  className={styles.searchbar}
                  type="text"
                  placeholder="Search by title"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
              />
              <button
                  className={styles.sortButton}
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                Sort by {sortOrder === "asc" ? "newest" : "oldest"}
              </button>
            </div>
            <div className={styles.topright}>
              <div className={styles.filters}>
                {showFilters && (
                    <div className={styles.filterInputs}>
                      <FilterInput
                          userId={user?.uid || ""}
                          collectionName="people"
                          placeholder="Filter by people"
                          filters={peopleFilters}
                          setFilters={setPeopleFilters}
                      />
                      <FilterInput
                          userId={user?.uid || ""}
                          collectionName="places"
                          placeholder="Filter by places"
                          filters={placesFilters}
                          setFilters={setPlacesFilters}
                      />
                    </div>
                )}
              </div>
              <button
                  className={styles.filterButton}
                  onClick={() => setShowFilters(!showFilters)}
              >
                <Filter />
              </button>
            </div>
          </div>

          {logs.length === 0 ? (
              <p className={styles.noLogsMessage}>You don't have any logs. Start Journaling!</p>
          ) : filteredLogs.length === 0 ? (
              <p className={styles.noLogsMessage}>No such log found.</p>
          ) : (
              <ul className={styles.logList}>
                {filteredLogs.map((log) => (
                    <li key={log.id}>
                      <Link href={`/logs/${log.id}`}>
                        <div className={styles.details}>
                          <div className={styles.detailsL}>
                            <div className={styles.createdAt}>
                              {formatDate(log.createdAt)}
                            </div>
                            <div className={styles.title}>{log.title}</div>
                          </div>
                          <div className={styles.detailsR}>
                            <div className={styles.people}>
                              {renderPeoplePlaces(log.people, "People")}
                            </div>
                            <div className={styles.places}>
                              {renderPeoplePlaces(log.places, "Places")}
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                ))}
              </ul>
          )}
        </div>
      </div>
  );
};

export default Logs;
