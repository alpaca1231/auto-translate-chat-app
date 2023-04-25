import { FC, ReactNode } from "react";
import { useAuth, useUser } from "@/hooks";
import { SignOut, SignIn, SignUp } from "@/components";

type LayoutProps = {
  children: ReactNode;
};

export const Layout: FC<LayoutProps> = ({ children }) => {
  const { session } = useAuth();
  const { user } = useUser();
  return (
    <>
      <header>
        {session ? (
          <>
            <p>{user?.name}</p>
            <SignOut />
          </>
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
