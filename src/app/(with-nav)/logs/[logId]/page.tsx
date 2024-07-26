"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation"; // Import useRouter from next/router
import { db, auth } from "@/lib/firebase.js";
import { deleteDoc, doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { Pencil, Trash } from "lucide-react";
import styles from '../../new-entry/NewEntry.module.css';
import Modal from "@/components/modal/Modal";

const ViewLog = () => {
    const router = useRouter(); // Use useRouter hook
    const logId = usePathname().split("/")[2]; // Extract logId from pathname
    const [user, loading, error] = useAuthState(auth);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [log, setLog] = useState<any>(null);

    useEffect(() => {
        const fetchLog = async () => {
            if (logId && user) {
                const logRef = doc(db, `users/${user.uid}/logs`, logId);
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

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

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
        router.push(`/logs/${logId}/edit`);
    };

    const handleDelete = async () => {
        if (!user) {
            alert("User not authenticated");
            return;
        }

        try {
            const postDocRef = doc(db, `users/${user.uid}/logs`, logId);
            await deleteDoc(postDocRef);

            const userDocRef = doc(db, "users", user.uid);
            const userDoc = await getDoc(userDocRef);
            if (userDoc.exists()) {
                const userData = userDoc.data();
                const totalLogs = userData.totalLogs || 0;

                // Update totalLogs count
                await updateDoc(userDocRef, {
                    totalLogs: Math.max(totalLogs - 1, 0)
                });
            }
            router.push("/logs");
        } catch (error) {
            console.error("Error deleting post: ", error);
            alert("Error deleting post");
        }
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
                        <p>People: {log.people?.join(", ")}</p>
                    </li>
                    <li>
                        <p>Places: {log.places?.join(", ")}</p>
                    </li>
                </ul>
                <div className={styles.btn}>
                    <button className={styles.editbtn} onClick={handleEdit}>
                        <Pencil />
                    </button>
                    <button className={styles.deletebtn} onClick={() => setShowDeleteModal(true)}>
                        <Trash />
                    </button>
                </div>

                <div className={styles.nameNtime}>
                    <p>Created At: {log.createdAt ? formatDate(log.createdAt.toDate()) : 'N/A'}</p>
                    <p>Author: {log.author.displayName || log.author.email}</p>
                </div>
            </div>

            <Modal
                show={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Confirmation"
            >
                <p>Do you really want to delete this log?</p>
            </Modal>
        </div>
    );
};

export default ViewLog;
