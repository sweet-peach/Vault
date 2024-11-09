'use client';
import styles from "./NavigationTransition.module.scss";
import {Suspense, useTransition} from "react";
import Image from "next/image";


export function NavigationLoader() {
    return (
        <div className={styles.loaderWrapper}>
            <div className={styles.loaderBox}>
                <div className={styles.logoContainer}>
                    <Image
                        aria-hidden
                        src="/just-logo-white.svg"
                        alt="Logo icon"
                        width={64}
                        height={64}
                    />
                    vault
                </div>
            </div>
        </div>
    )
}

export default function NavigationTransition({children}) {
    const [isPending, startTransition] = useTransition();

    return (
        <Suspense fallback={<NavigationLoader />}>
            {isPending && <NavigationLoader/>}
                {children}
        </Suspense>
    )
}