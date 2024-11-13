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

    useEffect(() => {
        document.addEventListener("mouseup", handleMouse);
        return () => {
            document.removeEventListener("mouseup", handleMouse)
        }
    })

    const directoryTraceIndex = directoryTrace.findIndex((directory) => directory.id === directoryId);
    const isGoBackDisabled = directoryTraceIndex === -1;
    const isGoForwardDisabled = directoryTraceIndex === directoryTrace.length - 1

    function goBack() {
        if (isGoBackDisabled) return
        if (directoryTraceIndex === 0) {
            setDirectoryId(null)
        } else {
            setDirectoryId(directoryTrace[directoryTraceIndex - 1].id);
        }
    }

    function goForward() {
        console.log(directoryTraceIndex)
        if (isGoForwardDisabled) {
            return
        }
        setDirectoryId(directoryTrace[directoryTraceIndex + 1].id);
    }

    function handleMouse(event) {
        if (event.button === 3) {
            event.preventDefault();
            goBack();
        } else if (event.button === 4) {
            event.preventDefault();
            goForward();
        }
    }

    function openDirectory (directory) {
        const index = directoryTrace.findIndex((dir) => dir.id === directoryId);
        if (index !== -1) {
            setDirectoryTrace(prevTrace => [...prevTrace.slice(0, index + 1), directory]);
        } else {
            setDirectoryTrace([directory]);
        }
        setDirectoryId(directory.id);
    }

    const addFile = useCallback((file) => {
        setFiles((prevFiles) => [...prevFiles, file])
    }, [])

    const fetchFiles = useCallback(async () => {
        try {
            setIsGettingFiles(true);
            const files = await FilesService.getFiles(directoryId);
            setFiles(files);
        } catch (e) {
            alert(`Error while getting files: ${e.message}`);
        } finally {
            setIsGettingFiles(false);
        }
    }, [directoryId]);

    useEffect(() => {
        fetchFiles();
    }, [directoryId, fetchFiles])

    function refresh() {
        fetchFiles();
    }

    return (
        <DriveContext.Provider value={{files, setFiles, addFile, directoryId, openDirectory}}>
            <ModalProvider>
                <header className={styles.driveHeader}>
                    <div className={styles.actionsTrail}>
                        <button onClick={goBack} disabled={isGoBackDisabled}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                 viewBox="0 0 256 256">
                                <path
                                    d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"></path>
                            </svg>
                        </button>
                        <button onClick={goForward} disabled={isGoForwardDisabled}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                 viewBox="0 0 256 256">
                                <path
                                    d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
                            </svg>
                        </button>
                        <button onClick={refresh}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                                 viewBox="0 0 256 256">
                                <path
                                    d="M224,128a96,96,0,0,1-94.71,96H128A95.38,95.38,0,0,1,62.1,197.8a8,8,0,0,1,11-11.63A80,80,0,1,0,71.43,71.39a3.07,3.07,0,0,1-.26.25L44.59,96H72a8,8,0,0,1,0,16H24a8,8,0,0,1-8-8V56a8,8,0,0,1,16,0V85.8L60.25,60A96,96,0,0,1,224,128Z"></path>
                            </svg>
                        </button>
                    </div>
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
