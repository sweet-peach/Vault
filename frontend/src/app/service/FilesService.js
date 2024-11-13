import axiosClient from "@/app/lib/axiosClient";


class FilesService {
    static async getFiles(directoryId) {
        const response = await axiosClient.get('/api/files', {
            params: {directoryId},
            withCredentials: true
        })
        return response.data;
    }

    static async createFolder(folderName, directoryId) {
        const response = await axiosClient.post('/api/files/mkdir', {
            name: folderName,
            parentDirectoryId: directoryId
        })
        return response.data;
    }

    static async search(fileName) {
        const response = await axiosClient.get('/api/files/search', {
            params:{
                fileName: fileName
            }
        })
        return response.data;
    }

    static async uploadFile(file, directoryId, onUploadProgress) {
        const formData = new FormData();
        formData.append('file', file);
        if (directoryId) {
            formData.append('directoryId', directoryId);
        }
        const response = await axiosClient.post("/api/files/upload", formData, {
            onUploadProgress: onUploadProgress
        })
        return response.data;
    }

}

export default FilesService;