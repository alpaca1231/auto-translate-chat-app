import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const SignUp = () => {
  const [value, setValue] = useState({ email: "", password: "" });
  const { signUp, error } = useAuth();

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
      <button onClick={() => signUp(email, password)}>Sign up</button>
      {error && <p>{error.message}</p>}
    </>
  );
};
