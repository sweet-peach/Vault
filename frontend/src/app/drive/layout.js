import {getUserDataFromServer} from "@/app/lib/getUserFromServer";
import {redirect} from "next/navigation";

export default async function DriveLayout({children}) {

    const user = await getUserDataFromServer();

    if (!user) {
        redirect('/auth');
    }

    return (
        <div>
            Vault
            <div>
                {children}
            </div>
        </div>
    );
}
