import {create} from "zustand";

const useUploadStore = create((set) => ({
    uploadFiles: [
        {
            id: 1,
            name: "Test",
            progress: 20,
        },
        {
            id: 2,
            name: "Mania",
            progress: 100,
        },
    ],

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
