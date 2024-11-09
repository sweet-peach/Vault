import "./globals.scss";
import {Inter} from 'next/font/google'

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
})

export const metadata = {
    title: "Vault",
    description: "Cloud storage",
};

export default async function RootLayout({children}) {
    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
        </head>
        <body>
        {children}
        </body>
        </html>
    );
}
