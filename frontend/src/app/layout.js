// Here is the Next.js App Router pages
// Root layout
import "./globals.css";

export const metadata = {
  title: "SkoolaBus",
  description: "Affordable, Reliable School Transport for Every Family",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
