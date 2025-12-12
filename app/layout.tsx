import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cache Components + loading.tsx Bug Reproduction",
  description: "Reproduction for Next.js ISR/Cache Components issue with loading.tsx",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
