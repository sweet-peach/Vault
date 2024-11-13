'use client'
import styles from "./UploadFiles.module.scss"
import {useEffect, useRef, useState} from "react";
import useUploadStore from "@/app/(panel)/UploadFiles/uploadFilesStore";
// import useUploadStore from "@/app/(panel)/UploadFiles/uploadFilesStore";

export default function UploadFilesStatus() {
    const [isVisible, setVisibility] = useState(false);
    const uploadFiles = useUploadStore((state) => state.uploadFiles);
    const setUploadFiles = useUploadStore((state) => state.setUploadFiles);
    const popover = useRef(null);
    const toggle = useRef(null);

    const handleClickOutside = (event) => {
        if (popover.current && !popover.current.contains(event.target)) {
            const isIgnoredClick = toggle.current && toggle.current.contains(event.target);

            if (!isIgnoredClick) {
                setVisibility(false);
            }
        }
    };

    useEffect(() => {
        if(!isVisible){
            setUploadFiles(uploadFiles.filter((file)=> file.progress !== 100))
        }
    }, [isVisible]);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });

    return (
        <div className={styles.iconContainer}>
            {isVisible ?
                <div ref={popover} className={styles.popOver}>
                    <div className={styles.heading}>
                        files uploading status
                        <button onClick={()=>{setVisibility(false)}} className={styles.closeWrapper}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                 viewBox="0 0 256 256">
                                <path
                                    d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
                            </svg>
                        </button>
                    </div>
                    <div className={styles.filesList}>
                        {uploadFiles.map((file, index)=>{
                            return (
                                <div key={index} className={styles.file}>
                                    <div className={styles.name}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                             viewBox="0 0 256 256">
                                            <path
                                                d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM152,88V44l44,44Z"></path>
                                        </svg>
                                        <p>{file.name}</p>
                                    </div>
                                    {file.progress === 100 ?
                                        <p className={`${styles.progress}`}>done</p>
                                        :
                                        <p className={styles.progress}>{file.progress} %</p>
                                    }

                                </div>
                            )
                        })}
                    </div>
                </div> : ""}
            <button ref={toggle} onClick={()=>{setVisibility(!isVisible)}} className={styles.iconWrapper}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 256 256">
                        <path
                            d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"></path>
                    </svg>
            </button>
        </div>
    )
}