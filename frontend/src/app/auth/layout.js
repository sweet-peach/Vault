import {getUserDataFromServer} from "@/app/lib/getUserFromServer";
import {redirect} from "next/navigation";

export default async function AuthLayout({children}) {

    const user = await getUserDataFromServer();

    if (user) {
        redirect('/drive');
    }

    return (
        <html lang="en">
        <body>
        <div>
            Vault
            <div>
                {children}
            </div>
        </div>
        </body>
        </html>
    );
}
