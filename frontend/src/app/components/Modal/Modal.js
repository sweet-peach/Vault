import styles from "./Modal.module.scss"
import {useFormStatus} from "react-dom";
import {useEffect, useImperativeHandle, useRef, useState} from "react";

export function Modal({children, title, confirmText, action, ref, ignoreRefs = []}) {
    const [isVisible, setVisibility] = useState(false)
    const modal = useRef(null);

    const handleClickOutside = (event) => {
        if (modal.current && !modal.current.contains(event.target)) {
            const isIgnoredClick = ignoreRefs.some(ref => ref.current && ref.current.contains(event.target));

            if (!isIgnoredClick) {
                setVisibility(false);
            }
        }
    };

    function toggleModal(){
        setVisibility(!isVisible);
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });

    useImperativeHandle(ref, () => ({
        setVisibility,
    }));

    function SubmitButton() {
        const {pending} = useFormStatus()
        return (
            <button className="primary" disabled={pending} type="submit">
                {pending ? "Loading..." : confirmText}
            </button>
        )
    }

    if(isVisible){
        return (
            <div className={styles.modalContainer}>
                <form ref={modal} action={action} className={styles.modalWrapper}>
                    <p className={styles.heading}>{title}</p>
                    <div className={styles.content}>
                        {children}
                    </div>
                    <div className={styles.actions}>
                        <button type="button" className="text" onClick={() => {
                            setVisibility(false)
                        }}>cancel
                        </button>
                        <SubmitButton></SubmitButton>
                    </div>
                </form>
            </div>
        )
    }

    return (
        <></>
    )
}