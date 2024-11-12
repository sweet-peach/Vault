import Image from "next/image";
import styles from "./Logo.module.scss";

export default function Logo({size}){
    return (
        <div className={`${styles.logoContainer} ${styles.inverted}`}>
            <Image
                aria-hidden
                src="/just-logo-white.svg"
                alt="Logo icon"
                width={size}
                height={size}
            />
            vault
        </div>
    )
}