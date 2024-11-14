import {Modal} from "@/app/components/Modal/Modal";
import {useActionState, useContext, useEffect, useImperativeHandle, useRef, useState} from "react";
import {z} from "zod";
import FilesService from "@/app/service/FilesService";
import {DriveContext} from "@/app/(panel)/drive/page";

const FolderSchema = z
    .string()
    .trim()
    .min(1, {message: 'Folder name cannot be empty'});

export default function CreateFolderModal({ref}) {
    const modal = useRef(null);
    const {directoryId, setFiles, files} = useContext(DriveContext);
    const [actionState, action] = useActionState(createFolder, {})
    const {error} = actionState;

    const setVisibility = (newValue) => {
        modal?.current?.setVisibility(newValue);
    }
    useImperativeHandle(ref, () => ({
        setVisibility,
    }));



    async function createFolder(state, formData) {
        const name = formData.get('name');

        const validatedFields = FolderSchema.safeParse(name)
        if (!validatedFields.success) {
            return {error: {name: validatedFields.error.flatten().formErrors}}
        }

        try {
            const newDirectory = await FilesService.createFolder(name, directoryId);
            setFiles([...files, newDirectory]);
            setVisibility(false);
        } catch (e) {
            alert(`Failed to create a folder: ${e.message}`)
            return {}
        }
        return {};
    }

    return <Modal
        key="create-folder"
        ref={modal}
        title="create folder"
        confirmText="create"
        action={action}
    >
        <input autoComplete="off" name="name" className="secondary full" type="text" placeholder="folder name"/>
        {error?.name ? <p className="error">{error.name}</p> : ""}
    </Modal>
}