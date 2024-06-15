"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { app, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("User logged in:", userCredential.user);
      setEmail("");
      setPassword("");
      router.push("/");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Login;
