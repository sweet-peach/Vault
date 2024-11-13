'use client'
import React, {createContext, useContext, useState, useCallback} from 'react';

const ModalContext = createContext();

export const useModals = () => {
    return useContext(ModalContext);
};


export const ModalProvider = ({children}) => {
    const [modals, setModals] = useState([]);
    const addModal = useCallback((modal) => {
        setModals((prevModals) => [...prevModals, modal]);
    }, []);

    const removeModal = useCallback((modalId) => {
        setModals((prevModals) => prevModals.filter((modal) => modal.id !== modalId));
    }, []);

    return (
        <>
            <ModalContext.Provider value={{modals, addModal, removeModal}}>
                {children}
            </ModalContext.Provider>
            <div className="modals">
                {modals.map((jsx, index) => {
                    return <div key={index}>{jsx}</div>
                })}
            </div>

        </>

    );
};
