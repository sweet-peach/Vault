import "./globals.scss";
import {Inter} from 'next/font/google'
import NavigationTransition from "@/app/components/NavigationTransition/NavigationTransition";

const inter = Inter({
    subsets: ['latin'],
    display: 'swap',
})

export const metadata = {
    title: "Vault",
    description: "Cloud storage",
};

export default function RootLayout({children}) {

    return (
        <html lang="en">
        <head>
            <link rel="icon" href="/favicon.ico" sizes="any"/>
        </head>
        <body>
            <NavigationTransition>{children}</NavigationTransition>
        </body>
        </html>
    );
}
