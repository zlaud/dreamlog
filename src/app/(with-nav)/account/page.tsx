"use client";

import { useState, useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { updatePassword, updateProfile } from "firebase/auth";
import { auth, app } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import styles from "./Account.module.css";

const Account = () => {
    const [user, loading, error] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [newDisplayName, setNewDisplayName] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [newFirstName, setNewFirstName] = useState<string>("");
    const [newLastName, setNewLastName] = useState<string>("");

    const [people, setPeople] = useState<string[]>([]);
    const [places, setPlaces] = useState<string[]>([]);
    const [isEditingDisplayName, setIsEditingDisplayName] = useState<boolean>(false);
    const [isEditingPassword, setIsEditingPassword] = useState<boolean>(false);
    const [isEditingName, setIsEditingName] = useState<boolean>(false);

    const db = getFirestore(app);

    useEffect(() => {
        if (user) {
            const fetchUserInfo = async () => {
                const userDoc = await getDoc(doc(db, "users", user.uid));
                if (userDoc.exists()) {
                    const data = userDoc.data();
                    setUserInfo(data);
                    setNewFirstName(data.firstName);
                    setNewLastName(data.lastName);
                    setNewDisplayName(data.displayName);
                }
            };

            const fetchPeopleAndPlaces = async () => {
                const peopleCollection = collection(db, `users/${user.uid}/people`);
                const placesCollection = collection(db, `users/${user.uid}/places`);
                const peopleSnapshot = await getDocs(peopleCollection);
                const placesSnapshot = await getDocs(placesCollection);

                const fetchedPeople = peopleSnapshot.docs.map(doc => doc.data().name);
                const fetchedPlaces = placesSnapshot.docs.map(doc => doc.data().name);

                setPeople(fetchedPeople);
                setPlaces(fetchedPlaces);
            };

            fetchUserInfo();
            fetchPeopleAndPlaces();
        }
    }, [user, db]);

    const handleUpdateName = async () => {
        if (user && newFirstName && newLastName) {
            const fullName = `${newFirstName} ${newLastName}`;
            await updateProfile(user, { displayName: fullName });
            await updateDoc(doc(db, "users", user.uid), {
                firstName: newFirstName,
                lastName: newLastName,
                displayName: fullName
            });
            setUserInfo({ ...userInfo, firstName: newFirstName, lastName: newLastName, displayName: fullName });
            setIsEditingName(false);
        }
    };


    const handleUpdateDisplayName = async () => {
        if (user && newDisplayName) {
            await updateProfile(user, { displayName: newDisplayName });
            await updateDoc(doc(db, "users", user.uid), { displayName: newDisplayName });
            setUserInfo({ ...userInfo, displayName: newDisplayName });
            setIsEditingDisplayName(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (user && newPassword) {
            await updatePassword(user, newPassword);
            setNewPassword("");
            setIsEditingPassword(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (user) {
            const userDocRef = doc(db, "users", user.uid);
            await deleteDoc(userDocRef);
            await user.delete();
            // Redirect or update UI after account deletion
        }
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className={styles.page}>
        <div className={styles.accountPage}>
            {loading && <p>Loading...</p>}
            {userInfo && (
                <div className={styles.accountInfo}>
                    <div className={styles.updateSection}>
                        <ul>
                            <li>
                                {isEditingName ? (
                                    <>
                                        <Input
                                            type="text"
                                            placeholder="First Name"
                                            value={newFirstName}
                                            onChange={(e) => setNewFirstName(e.target.value)}
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Last Name"
                                            value={newLastName}
                                            onChange={(e) => setNewLastName(e.target.value)}
                                        />
                                        <Button onClick={handleUpdateName}>Update</Button>
                                        <Button onClick={() => { setIsEditingName(false); setNewFirstName(userInfo.firstName); setNewLastName(userInfo.lastName); }}>Cancel</Button>
                                    </>
                                ) : (
                                    <>
                                        <p>Name: {userInfo.firstName} {userInfo.lastName}</p>
                                        <Button onClick={() => setIsEditingName(true)}>Change</Button>
                                    </>
                                )}
                            </li>
                            <li>
                                {isEditingDisplayName ? (
                                <>
                                    <Input
                                        type="text"
                                        placeholder="New Display Name"
                                        value={newDisplayName}
                                        onChange={(e) => setNewDisplayName(e.target.value)}
                                    />
                                    <Button onClick={handleUpdateDisplayName}>Update</Button>
                                    <Button onClick={() => { setIsEditingDisplayName(false); setNewDisplayName(userInfo.displayName); }}>Cancel</Button>
                                </>
                            ) : (
                                <>
                                    <p>Display Name: {userInfo.displayName}</p>
                                    <Button onClick={() => setIsEditingDisplayName(true)}>Change</Button>
                                </>
                            )}
                            </li>
                        </ul>
                    </div>

                    <div className={styles.updateSection}>
                        <h2>Password</h2>
                        {isEditingPassword ? (
                            <>
                                <Input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <Button onClick={handleUpdatePassword}>Update</Button>
                                <Button onClick={() => { setIsEditingPassword(false); setNewPassword(''); }}>Cancel</Button>
                            </>
                        ) : (
                            <>
                                <p>Password: ********</p>
                                <Button onClick={() => setIsEditingPassword(true)}>Change</Button>
                            </>
                        )}
                    </div>

                    <div className={styles.updateSection}>
                        <h2>Delete Account</h2>
                        <Button onClick={handleDeleteAccount} className={styles.deleteButton}>Delete Account</Button>
                    </div>

                    <div className={styles.userData}>
                        <h2>Your People</h2>
                        <p>{people.join(", ")}</p>

                        <h2>Your Places</h2>
                        <p>{places.join(", ")}</p>
                    </div>
                </div>
            )}
        </div>
        </div>
    );
};

export default Account;