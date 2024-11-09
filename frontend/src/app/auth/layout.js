import {getUserDataFromServer} from "@/app/lib/getUserFromServer";
import {redirect} from "next/navigation";
import Image from "next/image";
import styles from "./auth.module.scss";

export default async function AuthLayout({children}) {

    const user = await getUserDataFromServer();

    if (user) {
        redirect('/drive');
    }

    return (
        <div className={styles.authWrapper}>
            <div className={styles.authContainer}>
                <div className={styles.infoContainer}>
                    <div className={styles.logoContainer}>
                        <Image
                            aria-hidden
                            src="/just-logo-white.svg"
                            alt="Logo icon"
                            width={20}
                            height={20}
                        />
                        vault
                    </div>
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
