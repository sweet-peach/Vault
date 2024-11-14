import styles from "./FileContextMenu.module.scss";
import {useEffect, useImperativeHandle, useLayoutEffect, useRef, useState} from "react";

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

export default function FileContextMenu({ref, ignoreRefs = []}) {
    const [file, setFile] = useState(null);

    const [isVisible, setVisibility] = useState(false);
    const [position, setPosition] = useState({x: 0, y: 0});
    const windowDimensionsForResize = useRef(null)
    const dimensions = useRef(null);
    const [callerEvent, setCallerEvent] = useState(null);
    const callerEventRef = useRef(null);

    const contextMenuRef = useRef(null);

    useLayoutEffect(() => {
        if (!contextMenuRef?.current) return;
        const {width, height} = contextMenuRef.current.getBoundingClientRect();
        dimensions.current = {width: width, height: height};
    }, [isVisible]);

    useLayoutEffect(() => {
        console.log("adj")
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
            console.log("Created");
            document.addEventListener('mousedown', handleMouseDown, true);
            document.addEventListener('mouseup', handleMouseUp, true);
            window.addEventListener('resize', adjustPosition);
            return () => {
                console.log("Destroyed");
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
                <div>
                    test
                </div>
            </div>
        )
    }
}