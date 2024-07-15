"use client";
import { useEffect, useState } from "react";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import { db, auth } from "@/lib/firebase.js";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import styles from '../../../new-entry/NewEntry.module.css';

const EditLog = () => {
    const router = useRouter();
    const pathname = usePathname();
    const logId = pathname.split("/")[2];
    const [user, loading, error] = useAuthState(auth);
    const [log, setLog] = useState<any>(null);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        console.log(logId);
        const fetchLog = async () => {
            if (logId && user) {
                const logRef = doc(db, `users/${user.uid}/logs`, logId);
                const logSnap = await getDoc(logRef);
                if (logSnap.exists()) {
                    const data = logSnap.data();
                    setLog(data);
                    setFormData(data);
                } else {
                    console.error("No such document!");
                }
            }
        };

        if (!loading && user) {
            fetchLog();
        } else if (!loading && !user) {
            router.push("/login"); // Redirect to login if not authenticated
        }
    }, [logId, user, loading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (logId && user) {
            const logRef = doc(db, `users/${user.uid}/logs`, logId);
            await updateDoc(logRef, formData);
            router.push(`/logs/${logId}`); // Navigate back to the view log page
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!log) {
        return <div>No log found.</div>;
    }

    return (
        <div className={styles.page}>
            <div className={styles.edit}>
                <h1>Edit</h1>
                <form onSubmit={handleSubmit}>
                    <div className={styles.title}>
                        <input placeholder={"Title"} type="text" name="title" value={formData.title || ""} onChange={handleChange} />
                    </div>
                    <div className={styles.description}>
                        <textarea placeholder={"Story time..."} name="description" value={formData.description || ""} onChange={handleChange} />
                    </div>
                    {/* Details section*/}
                    <ul>
                        <h1>Details</h1>
                        <li>
                            <label>Dream Type:</label>
                            <select  name="dreamType" value={formData.dreamType || "Regular Dream"} onChange={handleChange}>
                                <option value="Regular Dream">Regular Dream</option>
                                <option value="Nightmare">Nightmare</option>
                            </select>
                        </li>
                        <li>
                            <label>Dream Length (1-5):</label>
                            <input  type="number" name="dreamLength" value={formData.dreamLength || 3} onChange={handleChange} min={1} max={5} required />
                        </li>
                        <li>
                            <label>Emotions:</label>
                            <input type="text" name="emotions" value={formData.emotions || ""} onChange={handleChange} />
                        </li>
                        <li>
                            <label>People:</label>
                            <input type="text" name="people" value={formData.people || ""} onChange={handleChange} />
                        </li>
                        <li>
                            <label>Places:</label>
                            <input type="text" name="places" value={formData.places || ""} onChange={handleChange} />
                        </li>
                    </ul>
                    <button type="submit">Save Changes</button>
                </form>
            </div>
        </div>
    );
};
export default EditLog;
