import {getUserDataFromServer} from "@/app/lib/getUserFromServer";
import {redirect} from "next/navigation";
import Logo from "@/app/components/Logo/Logo";
import styles from "./layout.module.scss";
import ProfileDropdown from "@/app/components/ProfileDropdown/ProfileDropdown";

export default async function DriveLayout({children}) {

    const user = await getUserDataFromServer();

    if (!user) {
        redirect('/auth');
    }


    return (
        <div className={styles.container}>
                <div className={styles.content}>
                    {children}
                </div>
                <footer>
                    <Logo size="20"></Logo>
                    <ProfileDropdown user={user}></ProfileDropdown>
                </footer>
        </div>
    );
}
