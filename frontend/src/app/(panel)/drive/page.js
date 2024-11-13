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
    const [directoryTrace, setDirectoryTrace] = useState([]);

    useEffect(()=>{
        document.addEventListener("mouseup", handleMouse);
        return ()=>{
            document.removeEventListener("mouseup", handleMouse)
        }
    })

    function goBack (){
        const index = directoryTrace.findIndex((directory) => directory.id === directoryId);
        if(index === -1) return
        if (index === 0) {
            setDirectoryId(null)
        } else{
            setDirectoryId(directoryTrace[index - 1].id);
        }
    }

    function goForward() {
        const index = directoryTrace.findIndex((directory) => directory.id === directoryId);
        if (index !== directoryTrace.length - 1) {
            setDirectoryId(directoryTrace[index + 1].id);
        }
    }

    function handleMouse(event){
        if (event.button === 3) {
            event.preventDefault();
            goBack();
        } else if (event.button === 4) {
            event.preventDefault();
            goForward();
        }
    }

    const openDirectory = useCallback((directory) => {
        const index = directoryTrace.findIndex((dir) => dir.id === directoryId);
        if (index !== -1) {
            setDirectoryTrace(prevTrace => [...prevTrace.slice(0, index + 1), directory]);
        } else {
            setDirectoryTrace(prevValue => [...prevValue, directory]);
        }
        setDirectoryId(directory.id);
    }, [directoryTrace, directoryId]);

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
        <DriveContext.Provider value={{files, setFiles,addFile, directoryId, openDirectory}}>
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
