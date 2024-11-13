import axiosClient from "@/app/lib/axiosClient";

class FilesService{
    static async getFiles(directoryId){
        const response = await axiosClient.get('/api/files', {
            params:{directoryId},
            withCredentials: true
        })
        return response.data;
    }

    static async createFolder(folderName, directoryId){
        const response = await axiosClient.post('/api/files/mkdir', {
            name: folderName,
            parentDirectoryId: directoryId
        })
        return response.data;
    }

    static async uploadFiles(files){
        const formData = new FormData();
        formData.append('file',files);
        try {
            //TODO For each file add files upload
            // const uploadFile = {name: file.name, progress: 0};



            await FilesService.uploadFiles(selectedPicture);
            // location.reload();
        } catch (e) {
            alert(`Failed to upload some files: ${e.message}`);
        }
    }

}

export default FilesService;