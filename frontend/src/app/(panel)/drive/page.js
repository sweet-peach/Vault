'use client'
import styles from "./Drive.module.scss";
import CreateButton from "@/app/(panel)/drive/FileCreateButton/CreateButton";
import {createContext, useCallback, useEffect, useState} from "react";
import FilesService from "@/app/service/FilesService";
import FilesTable from "@/app/(panel)/drive/FilesTable/FilesTable";
import {ModalProvider} from "@/app/components/Modal/ModalContext";

export const DriveContext = createContext();

export default function Drive() {
    const [directoryId, setDirectoryId] = useState(null);
    const [isGettingFiles, setIsGettingFiles] = useState(true);
    const [files, setFiles] = useState([]);

    const addFile = useCallback((file)=>{
        setFiles((prevFiles)=>[...prevFiles, file])
    },[])

    useEffect(() => {
        async function fetchFiles() {
            try {
                setIsGettingFiles(true)
                const files = await FilesService.getFiles(directoryId);
                setFiles(files);
            } catch (e) {
                alert(`Error while getting files: ${e.message}`)
            } finally {
                setIsGettingFiles(false)
            }
        }

        fetchFiles();
    }, [directoryId])

    return (
        <DriveContext.Provider value={{files, setFiles,addFile, directoryId, setDirectoryId}}>
            <ModalProvider>
                    <header className={styles.driveHeader}>

                    </header>
                    <div className={styles.driveContainer}>
                        <div className={styles.actionsTrail}>
                            <CreateButton></CreateButton>
                        </div>
                        <div className={styles.driveView}>
                            <FilesTable setDirectory={setDirectoryId} isGettingFiles={isGettingFiles}
                                        files={files}></FilesTable>
                        </div>
                    </div>
            </ModalProvider>
        </DriveContext.Provider>
    );
}
