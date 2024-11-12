'use client'
import styles from "./Settings.module.scss";
import {usePathname} from "next/navigation";

export default function SettingsLayout({children}) {
    const pathname = usePathname();
    console.log(pathname);

    const settingsItems = [
        {
            text:"account",
            path:"account",
            icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" viewBox=\"0 0 256 256\"> <path d=\"M230.92,212c-15.23-26.33-38.7-45.21-66.09-54.16a72,72,0,1,0-73.66,0C63.78,166.78,40.31,185.66,25.08,212a8,8,0,1,0,13.85,8c18.84-32.56,52.14-52,89.07-52s70.23,19.44,89.07,52a8,8,0,1,0,13.85-8ZM72,96a56,56,0,1,1,56,56A56.06,56.06,0,0,1,72,96Z\"></path> </svg>",
        }
    ]

    const securityItems = [
        {
            text:"password",
            path:"password",
            icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" viewBox=\"0 0 256 256\"> <path d=\"M208,40H48A16,16,0,0,0,32,56v56c0,52.72,25.52,84.67,46.93,102.19,23.06,18.86,46,25.27,47,25.53a8,8,0,0,0,4.2,0c1-.26,23.91-6.67,47-25.53C198.48,196.67,224,164.72,224,112V56A16,16,0,0,0,208,40Zm0,72c0,37.07-13.66,67.16-40.6,89.42A129.3,129.3,0,0,1,128,223.62a128.25,128.25,0,0,1-38.92-21.81C61.82,179.51,48,149.3,48,112l0-56,160,0Z\"></path> </svg>",
        }
    ]

    const navigationList = [
        {
            heading: "settings",
            items: settingsItems
        },
        {
            heading: "security",
            items: securityItems
        }
    ]

    return (
        <>
            <header className={styles.settingsHeader}>
                <a className={styles.goBack} href={"/drive"}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
                        <path
                            d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                    </svg>
                    back to drive
                </a>
            </header>
            <div className={styles.settingsContainer}>
                <nav className={styles.navigationList}>
                    {navigationList.map((block)=>{
                        return (
                            <div key={block.heading} className={styles.navigationBlock}>
                                <div className={styles.heading}>{block.heading}</div>
                                {block.items.map((item)=>{
                                    if(pathname === `/settings/${item.path}`){
                                        return (
                                            <a
                                                key={item.path}
                                                className={`${styles.navigationItem} ${styles.selected}`}
                                                href="#"
                                                dangerouslySetInnerHTML={{ __html: `${item.icon} ${item.text}` }}
                                            >
                                            </a>
                                        )
                                    } else {
                                        return (
                                            <a
                                                key={item.path}
                                                className={`${styles.navigationItem}`}
                                                href={`/settings/${item.path}`}
                                                dangerouslySetInnerHTML={{ __html: `${item.icon} ${item.text}` }}
                                            >
                                            </a>
                                        )
                                    }
                                })}
                            </div>
                        )
                    })}
                </nav>
                <div className={styles.settingsContent}>
                    {children}
                </div>
            </div>
        </>
    )
}