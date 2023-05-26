import { SignIn } from "@/components/SignIn";
import { SignOut } from "@/components/SignOut";
import { UserProvider } from "@/hooks/useUser";
import { serverClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Az",
  description: "Auto translate chat app",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = serverClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <UserProvider>
          <header>
            {session ? (
              <SignOut />
            ) : (
              <>
                <SignIn />
              </>
            )}
          </header>
          <main>{children}</main>
        </UserProvider>
      </body>
    </html>
  );
}
