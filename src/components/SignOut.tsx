"use client"; // Supabase auth needs to be triggered client-side

import { FC } from "react";

import { useAuth } from "@/hooks/useAuth";

type SignOutProps = {};

export const SignOut: FC<SignOutProps> = () => {
  const { signOut } = useAuth();
  return <button onClick={signOut}>Sign out</button>;
};
