"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import styles from "@/styles/auth.module.css";
import Link from "next/link";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const passwordRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      router.push("/logs");
      return;
    }
    setLoading(false);
  }, []);

  const handleLogin = async () => {
    try {
      setError(null);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("User logged in:", userCredential.user);
      setEmail("");
      setPassword("");
      router.push("/logs");
    } catch (e: any) {
      console.error(e);
      if (
        e.code === "auth/invalid-email" ||
        e.code === "auth/invalid-credential"
      ) {
        setError(
          "The username or password you entered is incorrect. Please check your details and try again."
        );
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
        handleLogin();
      }
    }
  };

  return (
    <div className={styles.page}>
      <span className={styles.logo}>DreamLog</span>
      <Link href={"/"}> {"<-"} Back to Landing Page</Link>
      {loading}
      {!loading && (
        <div className="flex-col">
          <div className={styles.auth}>
            <h1>Log In</h1>
            {error && <p className={styles.eMsg}>{error}</p>}
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e, passwordRef)}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
              ref={passwordRef}
            />
            <Button onClick={handleLogin}>
              <span>Log In</span>
            </Button>
            <Link href={"/"}> Forgot Password?</Link>
          </div>
          <div className={styles.signup}>
            <p>Do not have an account?</p>
            <Link href={"/sign-up"}> Get started here!</Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
