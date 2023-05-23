"use client"; // Supabase auth needs to be triggered client-side

import { useState } from "react";

import { useAuth } from "@/hooks/useAuth";

export const SignIn = () => {
  const [value, setValue] = useState({ email: "", password: "" });
  const { signIn } = useAuth();

  const { email, password } = value;
  return (
    <>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setValue((prev) => ({ ...prev, email: e.target.value }))}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setValue((prev) => ({ ...prev, password: e.target.value }))}
      />
      <button onClick={() => signIn(email, password)}>Sign in</button>
    </>
  );
};
