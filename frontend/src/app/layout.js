import "./globals.css";
import { Inter } from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
})

export const metadata = {
  title: "Vault",
  description: "Cloud storage",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
