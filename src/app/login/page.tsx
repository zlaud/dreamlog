"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import nookies from "nookies";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const cookies = nookies.get(undefined);
    const token = cookies.token;
    console.log(token);
    if (token) {
      router.push("/logs");
      return;
    }
    setLoading(false);
  }, []);

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await userCredential.user.getIdToken();
      nookies.set(undefined, "token", token, { path: "/" });

      console.log("User logged in:", userCredential.user);
      setEmail("");
      setPassword("");
      router.push("/logs");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading && (
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
      )}
    </div>
  );
};

export default Login;
