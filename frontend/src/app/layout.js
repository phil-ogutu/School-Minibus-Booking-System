// Here is the Next.js App Router pages
// Root layout
import "../styles/globals.css";
// import { Providers } from "./providers"; // NextAuth wrapper
import { UserProvider } from "@/context/UserContext"; // Import the UserProvider

export const metadata = {
  title: "SkoolaBus",
  description: "Affordable, Reliable School Transport for Every Family",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
// This is the root layout for the Next.js application
// It wraps the entire application with the Providers component, which includes session management.
// The "use client" directive indicates that this component should be rendered on the client side.
// The metadata object defines the title and description for the application, which can be used for SEO purposes.
// The global styles are imported from the globals.css file.
