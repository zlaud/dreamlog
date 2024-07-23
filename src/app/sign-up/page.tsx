"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useRef } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app, auth } from "@/lib/firebase";
import styles from "@/styles/auth.module.css";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Signup = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [displayName, setDisplayName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const displayNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSignUp = async () => {
    const db = getFirestore(app);
    setLoading(true);
    setError(null);

    try {
      if (!email || !password || !firstName || !lastName || !displayName) {
        throw new Error("All fields are required");
      }

      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
      );

      const user = userCredential?.user;
      if (user) {
        console.log("User signed up:", user);

        await setDoc(doc(db, "users", user.uid), {
          firstName,
          lastName,
          email,
          displayName,
          uid: user.uid,
          totalLogs: 0,
          currentStreak: 0,
          longestStreak: 0,
          createdAt: new Date(),
        });

        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
        setDisplayName("");

        router.push("/logs");
      }
    } catch (e: any) {
      console.error(e);
      if (e.code === "auth/email-already-in-use") {
        setError("Email already in use!");
      } else {
        setError(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextInputRef?: React.RefObject<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (nextInputRef && nextInputRef.current) {
        nextInputRef.current.focus();
      } else {
        handleSignUp();
      }
    }
  };

  return (
      <div className={styles.page}>
        <span className={styles.logo}>DreamLog</span>
        <Link href={"/"}> {"<-"} Back to Landing Page</Link>
        <div className={styles.auth}>
          <h1>Sign Up</h1>
          {error && <p className={styles.eMsg}>{error}</p>}
          <ul>
            <li>
              <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  ref={emailRef}
                  onKeyDown={(e) => handleKeyDown(e, firstNameRef)}
              />
            </li>
            <li>
              <Input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  ref={firstNameRef}
                  onKeyDown={(e) => handleKeyDown(e, lastNameRef)}
              />
            </li>
            <li>
              <Input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  ref={lastNameRef}
                  onKeyDown={(e) => handleKeyDown(e, displayNameRef)}
              />
            </li>
            <li>
              <Input
                  type="text"
                  placeholder="Display Name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  ref={displayNameRef}
                  onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              />
            </li>
            <li>
              <Input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  ref={passwordRef}
                  onKeyDown={(e) => handleKeyDown(e)}
              />
            </li>
          </ul>
          <Button onClick={handleSignUp} disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </div>
      </div>
  );
};

export default Signup;
