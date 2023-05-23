import { SignOut, SignIn, SignUp } from "@/components";
import { UserProvider } from "@/hooks";
import SupabaseProvider from "@/lib/supabase-provider";
import { createServerClient } from "@/lib/supabase-server";

export const metadata = {
  title: "Az",
  description: "Auto translate chat app",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <body>
        <SupabaseProvider session={session}>
          <UserProvider>
            <header>
              {session ? (
                <SignOut />
              ) : (
                <>
                  <SignIn />
                  <br />
                  <SignUp />
                </>
              )}
            </header>
            <main>{children}</main>
          </UserProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
