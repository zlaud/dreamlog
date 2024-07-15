"use client";
import { useEffect, useState } from "react";
import {usePathname, useRouter} from "next/navigation"; // Import useRouter from next/router
import { db, auth } from "@/lib/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from '../../new-entry/NewEntry.module.css';

const ViewLog = () => {
    const router = useRouter(); // Use useRouter hook
    const logId  = usePathname(); // Access logId directly from router.query
    const [user, loading, error] = useAuthState(auth);
    const [log, setLog] = useState<any>(null);

    useEffect(() => {
        const fetchLog = async () => {
            if (logId && user) {
                const logRef = doc(db, `users/${user.uid}`, logId as string);
                const logSnap = await getDoc(logRef);
                if (logSnap.exists()) {
                    setLog(logSnap.data());
                } else {
                    console.error("No such document!");
                }
            }
        };

        if (!loading && user) {
            fetchLog();
        } else if (!loading && !user) {
            router.push("/login"); // Navigate to login if not authenticated
        }
    }, [logId, user, loading, router]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!logId) {
        return <div>No log ID found.</div>; // Handle case where logId is not present
    }

    if (!log) {
        return <div>Loading log...</div>; // Handle case where log is still loading
    }
    const handleEdit = () => {
        router.push(`${logId}/edit`);
    };

    return (
        <div className={styles.page}>
            <div className={styles.viewEntry}>
                <h1>{log.title}</h1>
                <div className={styles.viewDescription}>{log.description}</div>

                {/* Details section */}
                <ul className={styles.viewDetails}>
                    <h1>Details</h1>
                    <li>
                        <p>Dream Type: {log.dreamType}</p>
                    </li>
                    <li>
                        <p>Dream Length: {log.dreamLength}</p>
                    </li>
                    <li>
                        <p>Emotions: {log.emotions}</p>
                    </li>
                    <li>
                        <p>People: {log.people}</p>
                    </li>
                    <li>
                        <p>Places: {log.places}</p>
                    </li>
                </ul>
                <button onClick={handleEdit}>Edit</button>
                <p>Created At: {log.createdAt?.toDate().toString()}</p>
                <p>Author: {log.author.displayName || log.author.email}</p>
            </div>
        </div>
    );
};

export default ViewLog;
