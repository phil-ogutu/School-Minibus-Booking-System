// layout.server.js (Server-Side, NO "use client")

export const metadata = {
  title: "SkoolaBus",
  description: "Affordable, Reliable School Transport for Every Family",
};

export default function RootLayoutServer({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
