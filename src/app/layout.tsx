import type { Metadata } from "next";
import "./globals.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "Alpha Tutor | The Matric Survival Hub",
  description:
    "High-yield Grade 12 summaries, formula sheets, subject preparation, and Ethiopia's National Mock Championship.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
