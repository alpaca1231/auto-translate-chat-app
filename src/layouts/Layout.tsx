import { FC, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";
import { SignOut } from "@/components/SignOut";
import { SignIn } from "@/components/SignIn";
import { SignUp } from "@/components/SignUp";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { session } = useAuth();
  return (
    <>
      <header>
        {session ? (
          <SignOut />
        ) : (
          <>
            <SignIn />
            <SignUp />
          </>
        )}
      </header>

      <main>{children}</main>

      <footer>Footer</footer>
    </>
  );
};
