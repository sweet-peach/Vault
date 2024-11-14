import styles from "./FileContextMenu.module.scss";
import {useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState} from "react";
import {DriveContext} from "@/app/(panel)/drive/page";

function throttle(func, limit) {
    let lastFunc;
    let lastRan;
    return function () {
        const context = this;
        const args = arguments;
        if (!lastRan) {
            func.apply(context, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(function () {
                if ((Date.now() - lastRan) >= limit) {
                    func.apply(context, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    }
}

// TODO make them disappear after cursor goes out or window changes
// TODO dropdown element and modal share same styles
// TODO make delete change cancelable in 10 seconds
// TODO implement use optimistic
export default function FileContextMenu({ref, ignoreRefs = []}) {
    const {deleteFile, downloadFile} = useContext(DriveContext);

    const [file, setFile] = useState(null);

    const [isVisible, setVisibility] = useState(false);
    const [position, setPosition] = useState({x: 0, y: 0});
    const windowDimensionsForResize = useRef(null)
    const dimensions = useRef(null);
    const [callerEvent, setCallerEvent] = useState(null);
    const callerEventRef = useRef(null);

    const contextMenuRef = useRef(null);;

    useLayoutEffect(() => {
        if (!contextMenuRef?.current) return;
        const {width, height} = contextMenuRef.current.getBoundingClientRect();
        dimensions.current = {width: width, height: height};
    }, [isVisible]);

    useLayoutEffect(() => {
        if (!dimensions || !callerEventRef.current) return;
        adjustPosition();
    }, [dimensions, callerEventRef.current]);

    function adjustPosition(resizeEvent) {
        const callerEvent = callerEventRef.current;
        let x = callerEvent.clientX;
        let y = callerEvent.clientY;
        let newPosition;
        const currentWindow = {width: window.innerWidth, height: window.innerHeight}

        if (resizeEvent) {
            const originalWindow = windowDimensionsForResize.current;
            x = originalWindow.width > currentWindow.width ? x - (originalWindow.width / currentWindow.width) : x + (currentWindow.width - originalWindow.width);
            y = originalWindow.height > currentWindow.height ? y - (originalWindow.height - currentWindow.height) : y + (currentWindow.height - originalWindow.height);
        }

        windowDimensionsForResize.current = currentWindow;
        newPosition = {
            x: (currentWindow.width < x + dimensions.current.width) ? x - dimensions.current.width : x,
            y: (currentWindow.height < y + dimensions.current.height) ? y - dimensions.current.height : y
        }
        if (newPosition.x + dimensions.current.width > currentWindow.width) newPosition.x = currentWindow.width - dimensions.current.width;
        if (newPosition.y + dimensions.current.height > currentWindow.height) newPosition.y = currentWindow.height - dimensions.current.height;

        setPosition(newPosition);
    }

    const isMouseStartedOutside = useRef(false);
    const handleMouseDown = (event) => {
        if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
            isMouseStartedOutside.current = true;
        } else {
            isMouseStartedOutside.current = false;
        }
    };

    const handleMouseUp = (event) => {
        if (isMouseStartedOutside.current && contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
            let ignoreClick = false;
            for (const ref of ignoreRefs) {
                if (ref.current.contains(event.target)) {
                    ignoreClick = true;
                    return
                }
            }
            if (ignoreClick) {
                return;
            }
            setVisibility(false);
        }
        isMouseStartedOutside.current = false;
    };

    useEffect(() => {
        if (isVisible) {
            document.addEventListener('mousedown', handleMouseDown, true);
            document.addEventListener('mouseup', handleMouseUp, true);
            window.addEventListener('resize', adjustPosition);
            return () => {
                document.removeEventListener('mousedown', handleMouseDown, true);
                document.removeEventListener('mouseup', handleMouseUp, true);
                window.removeEventListener('resize', adjustPosition);
            }
        }
    }, [isVisible])

    useImperativeHandle(ref, () => ({
        callContextMenu: (callerEvent, file) => {
            setVisibility(true);
            setFile(file);
            setCallerEvent(callerEvent);
            callerEventRef.current = callerEvent;
        },
        setVisibility,
        setFile,
        callerEventRef
    }));

    if (isVisible) {
        return (
            <div
                ref={contextMenuRef}
                className={styles.contextMenu}
                style={{top: `${position.y}px`, left: `${position.x}px`}}
            >
                <button onClick={()=>{downloadFile(file);setVisibility(false)}} disabled={file.type === "dir"} className={styles.contextButton}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                         viewBox="0 0 256 256">
                        <path
                            d="M224,144v64a8,8,0,0,1-8,8H40a8,8,0,0,1-8-8V144a8,8,0,0,1,16,0v56H208V144a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,124.69V32a8,8,0,0,0-16,0v92.69L93.66,98.34a8,8,0,0,0-11.32,11.32Z"></path>
                    </svg>
                    download
                </button>
                <button onClick={()=>{deleteFile(file.id);setVisibility(false)}} className={`${styles.delete} ${styles.contextButton}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                         viewBox="0 0 256 256">
                        <path
                            d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16h8V208a16,16,0,0,0,16,16H192a16,16,0,0,0,16-16V64h8a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96Zm96,168H64V64H192ZM112,104v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Zm48,0v64a8,8,0,0,1-16,0V104a8,8,0,0,1,16,0Z"></path>
                    </svg>
                    delete
                </button>
            </div>
        )
    }
}