import {getUserDataFromServer} from "@/app/lib/getUserFromServer";
import {redirect} from "next/navigation";
import styles from "./auth.module.scss";
import Logo from "@/app/components/Logo/Logo";

export default async function AuthLayout({children}) {

    const user = await getUserDataFromServer();

    if (user) {
        redirect('/drive');
    }

    return (
        <div className={styles.authWrapper}>
            <div className={styles.authContainer}>
                <div className={styles.infoContainer}>
                    <Logo size="20"></Logo>
                    <div className={styles.infoWrapper}>
                        <a href="https://github.com/sweet-peach/vault">source-code</a>
                    </div>
                </div>
                <div className={styles.authBox}>
                    {children}
                </div>
            </div>
        </div>
    );
}
