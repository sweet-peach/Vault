import {create} from "zustand";

const useUploadStore = create((set) => ({
    uploadFiles: [],
    setUploadFiles: (files) =>
        set(() => ({
            uploadFiles: files,
        })),

    addUploadFile: (file) =>
        set((state) => ({
            uploadFiles: [...state.uploadFiles, file],
        })),

    removeUploadFile: (fileId) =>
        set((state) => ({
            uploadFiles: state.uploadFiles.filter((file) => file.id !== fileId),
        })),

    changeUploadFileProgression: (fileId, progress) =>
        set((state) => ({
            uploadFiles: state.uploadFiles.map((file) =>
                file.id === fileId ? { ...file, progress } : file
            ),
        })),
}));

export default useUploadStore;
