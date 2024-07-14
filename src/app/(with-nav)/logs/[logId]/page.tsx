"use client";
import { useEffect, useState } from "react";
import {usePathname, useRouter} from "next/navigation"; // Import useRouter from next/router
import { db, auth } from "@/lib/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

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

    return (
        <div>
            <h1>{log.title}</h1>
            <p>{log.description}</p>
            <p>Dream Type: {log.dreamType}</p>
            <p>Dream Length: {log.dreamLength}</p>
            <p>Emotions: {log.emotions}</p>
            <p>People: {log.people}</p>
            <p>Places: {log.places}</p>
            <p>Created At: {log.createdAt?.toDate().toString()}</p>
            <p>Author: {log.author.displayName || log.author.email}</p>
        </div>
    );
};

export default ViewLog;
