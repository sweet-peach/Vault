'use client'
import {useEffect, useImperativeHandle, useRef, useState} from "react";

export default function Dropdown({children, ref, className, ignoreRefs = [], elements}) {
    const [isVisible, setVisibility] = useState(false);
    const dropdown = useRef(null);

    const handleClickOutside = (event) => {
        if (dropdown.current && !dropdown.current.contains(event.target)) {
            const isIgnoredClick = ignoreRefs.some(ref => ref.current && ref.current.contains(event.target));

            if (!isIgnoredClick) {
                setVisibility(false);
            }
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    });

    function toggleDropdown() {
        setVisibility(!isVisible);
    }

    useImperativeHandle(ref, () => ({
        toggleDropdown,
    }));

    if (isVisible) {
        return (
            <div ref={dropdown} className={`${className} dropdown`}>
                {elements.map((element, index) => {
                    if (element.tag === "a") {
                        return (
                            <a
                                key={index}
                                href={element.href}
                                className="dropdown-element"
                                dangerouslySetInnerHTML={{__html: element.icon + element.text}}
                            >
                            </a>
                        )
                    }
                    return (
                        <button
                            key={element.text}
                            onClick={() => {
                                element.onClick();
                                if (element.hideAfterClick) {
                                    setVisibility(false);
                                }
                            }}
                            className="dropdown-element"
                            dangerouslySetInnerHTML={{__html: element.icon + element.text}}
                        >
                        </button>
                    )
                })}
                {children}
            </div>
        )

    }

    return (
        <></>
    )
}