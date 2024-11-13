import styles from "./Loader.module.scss";
import Image from "next/image";

export default function Loader({invert, scale = "1"}) {

    const logoSize = 30 * scale
    const fontSize = 1 * scale;

    if(invert){
        return (
            <div style={`fontSize: ${fontSize} em;`} className={styles.loaderWrapper}>
                <div className={styles.loaderBox}>
                    <div className={styles.logoContainer}>
                        <Image
                            aria-hidden
                            src="/just-logo-white.svg"
                            alt="Logo icon"
                            width={logoSize}
                            height={logoSize}
                        />
                        loading
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div style={{fontSize: fontSize + 'em'}} className={styles.loaderWrapper}>
            <div className={styles.loaderBox}>
                <div className={styles.logoContainer}>
                    <Image
                        aria-hidden
                        src="/just-logo-black.svg"
                        alt="Logo icon"
                        width={logoSize}
                        height={logoSize}
                    />
                    loading
                </div>
            </div>
        </div>

)
}