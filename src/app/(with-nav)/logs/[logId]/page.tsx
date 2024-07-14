"use client";
import { useEffect, useState } from "react";
import {useSearchParams } from "next/navigation"; // Import useNavigation and useSearchParams from next/navigation
import { db, auth } from "@/lib/firebase.js";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const ViewLog = () => {
    const searchParams = useSearchParams(); // Use useSearchParams hook
    const [user, loading, error] = useAuthState(auth);
    const [log, setLog] = useState<any>(null);

    useEffect(() => {
        const fetchLog = async () => {
            const logId = "6HdSXXiqzUUQNZiFzbpR"
            console.log(user?.uid)
            console.log(logId)
            if (logId && user) {
                const logRef = doc(db, `users/${user.uid}/logs`, logId as string);

                const logSnap = await getDoc(logRef);
                console.log("success")
                if (logSnap.exists()) {
                    setLog(logSnap.data());
                } else {
                    console.error("No such document!");
                }
            } else {
                console.log("failed")
            }
        };

        if (!loading && user) {
            fetchLog();
        }
    }, [searchParams, user, loading]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!log) {
        return <div>No log found.</div>;
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
