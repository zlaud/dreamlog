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
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const emailRef = useRef<HTMLInputElement>(null);
  const firstNameRef = useRef<HTMLInputElement>(null);
  const lastNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const handleSignUp = async () => {
    const db = getFirestore(app);
    setLoading(true);
    setError(null);

    try {
      if (!email || !password || !firstName || !lastName) {
        throw new Error("All fields are required.");
      }

      const isValidEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
      if (!email.match(isValidEmail)) {
        throw new Error("Invalid email address.");
      }

      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters.");
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

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextInputRef?: React.RefObject<HTMLInputElement>
  ) => {
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
      <div className="flex-col">
        <div className={styles.auth}>
          <h1>Sign Up</h1>
          {error && <p className={styles.eMsg}>{error}</p>}
          <ul>
            <div className={styles.name}>
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
                  onKeyDown={(e) => handleKeyDown(e, emailRef)}
                />
              </li>
            </div>

            <li>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                ref={emailRef}
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
        <div className={styles.signup}>
          <p>Already have an account?</p>
          <Link href={"/login"}> Log in</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
