import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

// Notice the () right after the font names here!
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--clivo-font",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400"],
  subsets: ["latin"],
  variable: "--clivo-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Clivo — Split your video into clips",
  description:
    "Upload a video, choose a clip interval, and download clean clips — instantly. No account needed.",
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='9' fill='%230a0a0a'/><path d='M10 10 L16 16 L10 22' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'/><path d='M17 10 L23 16 L17 22' stroke='white' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' opacity='0.45'/></svg>",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&family=DM+Mono:wght@300;400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
