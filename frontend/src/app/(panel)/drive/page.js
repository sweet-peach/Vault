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
    const [isSearching, setSearching] = useState(false);

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

    function openDirectory(directory) {
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
        setSearching(false);
        fetchFiles();
    }, [directoryId, fetchFiles])

    function refresh() {
        fetchFiles();
    }

    function search(){

    }

    let searchTimeout = null;
    function handleSearch(event){
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(async ()=>{
            const searchValue = event.target.value;
            if(!searchValue){
                setSearching(false);
                if(directoryId === null){
                    return refresh();
                }
                setDirectoryId(null);
                return;
            }
            setIsGettingFiles(true);
            setSearching(true);
            try {
                const searchResult = await FilesService.search(searchValue);
                setDirectoryTrace([]);
                setFiles(searchResult);
            } catch (e) {
                alert(`Search failed: ${e.message}`)
            } finally {
                setIsGettingFiles(false);
            }
        },400)
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
                    <div className={styles.addressBar}>
                        <button className={styles.path} onClick={() => {
                            if (directoryId !== null) setDirectoryId(null)
                            if(isSearching) refresh()
                        }}>home
                        </button>
                        <p className={styles.slash}>/</p>
                        {isSearching ?
                            <button className={styles.searchResult} >Search result</button>
                            : directoryTrace.slice(0, directoryTraceIndex + 1).map((directory, index) => {
                                return <div className={styles.pathGroup} key={index}>
                                    <button className={styles.path} onClick={() => {
                                        if (directoryId !== directory.id) setDirectoryId(directory.id)
                                    }}>{directory.name}</button>
                                    <p className={styles.slash}>/</p>
                                </div>
                            })}
                    </div>
                    <div className={styles.searchBar}>
                        <input onChange={handleSearch} type="text"
                               placeholder={`search everywhere`}/>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                             viewBox="0 0 256 256">
                            <path
                                d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
                        </svg>
                    </div>

                </header>
                <div className={styles.driveContainer}>
                    <div className={styles.actionsTrail}>
                        <CreateButton></CreateButton>
                    </div>
                    <div className={styles.driveView}>
                        <FilesTable isSearching={isSearching} isGettingFiles={isGettingFiles}></FilesTable>
                    </div>
                </div>
            </ModalProvider>
        </DriveContext.Provider>
    );
}
