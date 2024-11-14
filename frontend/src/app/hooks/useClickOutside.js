import { useEffect, useRef } from 'react';

function useClickOutside(ref, onClickOutside) {
    const isMouseStartedOutside = useRef(false);

    const handleMouseDown = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            isMouseStartedOutside.current = true;
        } else {
            isMouseStartedOutside.current = false;
        }
    };

    const handleMouseUp = (event) => {
        if (isMouseStartedOutside.current && ref.current && !ref.current.contains(event.target)) {
            onClickOutside(event);
        }
        isMouseStartedOutside.current = false;
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleMouseDown, true);
        document.addEventListener('mouseup', handleMouseUp, true);

        return () => {
            document.removeEventListener('mousedown', handleMouseDown, true);
            document.removeEventListener('mouseup', handleMouseUp, true);
        };
    },[]);

    return;
}

export default useClickOutside;
