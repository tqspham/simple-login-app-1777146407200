import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Login",
  description: "User login page",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}
