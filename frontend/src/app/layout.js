// Here is the Next.js App Router pages
// Root layout
// "use client";
import "../styles/globals.css";
// import { Providers } from "./providers"; // NextAuth wrapper
// import { MapProvider } from "@/context/MapContext";
import { AppWrapper } from "./AppWrapper";

export const metadata = {
  title: "SkoolaBus",
  description: "Affordable, Reliable School Transport for Every Family",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <MapProvider>
          <Providers>{children}</Providers>
        </MapProvider> */}
        <AppWrapper>{children}</AppWrapper>
      </body>
    </html>
  );
}
// This is the root layout for the Next.js application
// It wraps the entire application with the Providers component, which includes session management.
// The "use client" directive indicates that this component should be rendered on the client side.
// The metadata object defines the title and description for the application, which can be used for SEO purposes.
// The global styles are imported from the globals.css file.
