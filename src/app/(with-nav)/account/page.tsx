"use client";

import { useState, useEffect, Fragment } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getFirestore, doc, getDoc, updateDoc, deleteDoc, collection, getDocs } from "firebase/firestore";
import { updatePassword, updateProfile, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { auth, app } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Modal from "@/components/modal/Modal";
import styles from "./Account.module.css";

const Account = () => {
    const [user, loading, error] = useAuthState(auth);
    const [userInfo, setUserInfo] = useState<any>(null);
    const [newFirstName, setNewFirstName] = useState<string>("");
    const [newLastName, setNewLastName] = useState<string>("");
    const [newDisplayName, setNewDisplayName] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [newEmail, setNewEmail] = useState<string>("");
    const [currentPassword, setCurrentPassword] = useState<string>("");
    const [people, setPeople] = useState<{ name: string, count: number }[]>([]);
    const [places, setPlaces] = useState<{ name: string, count: number }[]>([]);
    const [editingField, setEditingField] = useState<string>("");
    const [activeTab, setActiveTab] = useState<string>("stats");


    const [showDeleteModal, setShowDeleteModal] = useState(false);

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
                    setNewEmail(user.email || "");
                }
            };

            const fetchPeopleAndPlaces = async () => {
                const peopleCollection = collection(db, `users/${user.uid}/people`);
                const placesCollection = collection(db, `users/${user.uid}/places`);
                const peopleSnapshot = await getDocs(peopleCollection);
                const placesSnapshot = await getDocs(placesCollection);

                const fetchedPeople = peopleSnapshot.docs.map(doc => doc.data() as { name: string, count: number });
                const fetchedPlaces = placesSnapshot.docs.map(doc => doc.data() as { name: string, count: number });

                setPeople(fetchedPeople.sort((a, b) => b.count - a.count));
                setPlaces(fetchedPlaces.sort((a, b) => b.count - a.count));
            };

            fetchUserInfo();
            fetchPeopleAndPlaces();
        }
    }, [user, db]);

    const handleUpdate = async (field: string) => {
        if (!user) return;

        try {
            switch (field) {
                case "name":
                    if (newFirstName && newLastName) {
                        const fullName = `${newFirstName} ${newLastName}`;
                        await updateProfile(user, { displayName: fullName });
                        await updateDoc(doc(db, "users", user.uid), {
                            firstName: newFirstName,
                            lastName: newLastName,
                            displayName: fullName,
                        });
                        setUserInfo({ ...userInfo, firstName: newFirstName, lastName: newLastName, displayName: fullName });
                    }
                    break;
                case "displayName":
                    if (newDisplayName) {
                        await updateProfile(user, { displayName: newDisplayName });
                        await updateDoc(doc(db, "users", user.uid), { displayName: newDisplayName });
                        setUserInfo({ ...userInfo, displayName: newDisplayName });
                    }
                    break;
                case "email":
                    if (newEmail && currentPassword) {
                        const credential = EmailAuthProvider.credential(user.email || "", currentPassword);
                        await reauthenticateWithCredential(user, credential);
                        await updateEmail(user, newEmail);
                        await updateDoc(doc(db, "users", user.uid), { email: newEmail });
                        setUserInfo({ ...userInfo, email: newEmail });
                    }
                    break;
                case "password":
                    if (newPassword) {
                        await updatePassword(user, newPassword);
                        setNewPassword("");
                    }
                    break;
            }
            setEditingField("");
        } catch (error) {
            console.error(`Error updating ${field}:`, error);
            alert(`Failed to update ${field}. Please try again.`);
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

    const renderEditableField = (field: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, type: string = "text") => (
        <Fragment>
            <Input type={type} value={value} onChange={onChange} />
            <Button onClick={() => handleUpdate(field)}>Update</Button>
            <Button onClick={() => setEditingField("")}>Cancel</Button>
        </Fragment>
    );

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error.message}</p>;
    }

    return (
        <div className={styles.page}>
            <div className={styles.accountPage}>
                {userInfo && (
                    <div>
                        <div className={styles.tabs}>
                            <button onClick={() => setActiveTab("stats")} className={activeTab === "stats" ? styles.activeTab : ""}>Stats</button>
                            <button onClick={() => setActiveTab("account")} className={activeTab === "account" ? styles.activeTab : ""}>Account Info</button>
                        </div>

                        {activeTab === "stats" && (

                            <div className={styles.stats}>
                                <ul>
                                    <li className={styles.logStreak}>
                                            <li>
                                                <div className={styles.statNumber}>
                                                    {userInfo.totalLogs}
                                                </div>
                                                <span> Total Logs </span>
                                            </li>
                                            <li>
                                                <div className={styles.statNumber}>
                                                    {userInfo.currentStreak}
                                                </div>
                                                <span>Current Streak</span>
                                            </li>
                                            <li>
                                                <div className={styles.statNumber}>
                                                    {userInfo.longestStreak}
                                                </div>
                                                <span>Longest Streak</span>
                                            </li>
                                    </li>

                                    <li>
                                        <h2>Your People: </h2>
                                        <ul className={styles.scrollableList}>
                                            {people.map((person, index) => (
                                                <li key={index}>
                                                    <span>
                                                        {person.count} {person.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                    <li>
                                        <h2>Your Places: </h2>
                                        <ul className={styles.scrollableList}>
                                            {places.map((place, index) => (
                                                <li key={index}>
                                                    <span>
                                                        {place.count} {place.name}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </li>
                                </ul>
                            </div>
                        )}

                        {activeTab === "account" && (
                            <div className={styles.accountInfo}>
                                <ul>
                                    <li>
                                        {editingField === "name" ? (
                                            <Fragment>
                                                <Input type="text" value={newFirstName} onChange={(e) => setNewFirstName(e.target.value)} />
                                                <Input type="text" value={newLastName} onChange={(e) => setNewLastName(e.target.value)} />
                                                <Button onClick={() => handleUpdate("name")}>Update</Button>
                                                <Button onClick={() => setEditingField("")}>Cancel</Button>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <p>Name: {userInfo.firstName} {userInfo.lastName}</p>
                                                <Button onClick={() => setEditingField("name")}>Change</Button>
                                            </Fragment>
                                        )}
                                    </li>
                                    <li>
                                        {editingField === "displayName" ? (
                                            renderEditableField("displayName", newDisplayName, (e) => setNewDisplayName(e.target.value))
                                        ) : (
                                            <Fragment>
                                                <p>Display Name: {userInfo.displayName}</p>
                                                <Button onClick={() => setEditingField("displayName")}>Change</Button>
                                            </Fragment>
                                        )}
                                    </li>
                                    <li>
                                        {editingField === "password" ? (
                                            renderEditableField("password", newPassword, (e) => setNewPassword(e.target.value), "password")
                                        ) : (
                                            <Fragment>
                                                <p>Password: ********</p>
                                                <Button onClick={() => setEditingField("password")}>Change</Button>
                                            </Fragment>
                                        )}
                                    </li>
                                    <li>
                                        {editingField === "email" ? (
                                            <Fragment>
                                                <Input type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                                                <Input type="password" placeholder="Current Password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                                                <Button onClick={() => handleUpdate("email")}>Update</Button>
                                                <Button onClick={() => setEditingField("")}>Cancel</Button>
                                            </Fragment>
                                        ) : (
                                            <Fragment>
                                                <p>Email: {userInfo.email}</p>
                                                <Button onClick={() => setEditingField("email")}>Change</Button>
                                            </Fragment>
                                        )}
                                    </li>

                                    <li >
                                        <Button onClick={() => setShowDeleteModal(true)} className={styles.deleteButton}>Delete Account</Button>
                                    </li>
                                    <Modal
                                        show={showDeleteModal}
                                        onClose={() => setShowDeleteModal(false)}
                                        onConfirm={handleDeleteAccount}
                                        title="Delete Confirmation"
                                    >
                                        <p>Do you really want to permanantly delete your account?</p>
                                        <p>(It will be unrecoverable)</p>
                                    </Modal>
                                </ul>


                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Account;
