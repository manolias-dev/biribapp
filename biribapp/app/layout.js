import "./globals.css";

export const metadata = {
  title: "BiribAPP",
  description: "Score keeper for the Greek card game Biriba",
  manifest: "/manifest.json",
  applicationName: "BiribAPP",
  // Makes "Add to Home Screen" on iOS launch without Safari chrome
  // and use the shield icon rather than a page screenshot.
  appleWebApp: {
    capable: true,
    title: "BiribAPP",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#0A2818",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
