'use client'
import styles from "./FileCreateButton.module.scss";
import {useEffect, useRef} from "react";
import Dropdown from "@/app/components/Dropdown/Dropdown";
import {useModals} from "@/app/components/Modal/ModalContext";
import CreateFolderModal from "@/app/(panel)/drive/FileCreateButton/CreateFolderModal/CreateFolderModal";

export default function CreateButton() {
    const dropdown = useRef(null);
    const toggleRef = useRef(null);
    const {addModal, removeModal} = useModals();
    const createFolderModal = useRef(null);
    const fileInputRef = useRef(null);

    useEffect(() => {
        addModal(<CreateFolderModal ref={createFolderModal}></CreateFolderModal>);
        return () => removeModal(<CreateFolderModal ref={createFolderModal}></CreateFolderModal>);
    }, [addModal, removeModal]);

    async function handleFileUpload(event){
        const selectedFiles = event.target.files
        if(selectedFiles.length === 0){
            return;
        }
    }


    const dropdownElements = [
        {
            icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" viewBox=\"0 0 256 256\"> <path d=\"M216,72H131.31L104,44.69A15.86,15.86,0,0,0,92.69,40H40A16,16,0,0,0,24,56V200.62A15.4,15.4,0,0,0,39.38,216H216.89A15.13,15.13,0,0,0,232,200.89V88A16,16,0,0,0,216,72ZM40,56H92.69l16,16H40ZM216,200H40V88H216Z\"></path> </svg>",
            text: "create folder",
            onClick: ()=>{
                createFolderModal?.current?.setVisibility(true);
            },
            hideAfterClick: true,
        },
        {
            icon: "<svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"currentColor\" viewBox=\"0 0 256 256\"> <path d=\"M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Zm-42.34-61.66a8,8,0,0,1,0,11.32l-24,24a8,8,0,0,1-11.32,0l-24-24a8,8,0,0,1,11.32-11.32L120,164.69V120a8,8,0,0,1,16,0v44.69l10.34-10.35A8,8,0,0,1,157.66,154.34Z\"></path> </svg>",
            text: "upload file",
            onClick: ()=>{
            },
            hideAfterClick: true,
        },

    ]

    return (
        <div className={styles.buttonContainer}>
            <input
                type="file"
                ref={fileInputRef}
                style={{display: 'none'}}
                onChange={handleFileUpload}
            />
            <Dropdown
                className={styles.fileCreateDropdown}
                ref={dropdown}
                ignoreRefs={[toggleRef]}
                elements={dropdownElements}
            >
            </Dropdown>
            <button ref={toggleRef} onClick={() => {
                dropdown.current.toggleDropdown()
            }} className="primary">
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                     viewBox="0 0 256 256">
                    <path
                        d="M228,128a12,12,0,0,1-12,12H140v76a12,12,0,0,1-24,0V140H40a12,12,0,0,1,0-24h76V40a12,12,0,0,1,24,0v76h76A12,12,0,0,1,228,128Z"></path>
                </svg>
                create
            </button>
        </div>
    )
}