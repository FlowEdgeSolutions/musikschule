import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Alfred Schnittke Akademie International",
    template: "%s | Alfred Schnittke Akademie",
  },
  description:
    "Private Musikakademie in Hamburg-Altona: Studium, Konzerte und Meisterkurse seit 1987.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased">{children}</body>
    </html>
  );
}
