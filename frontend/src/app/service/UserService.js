import axiosClient from "@/app/lib/axiosClient";

class UserService{
    static async uploadAvatar(picture){
        const formData = new FormData();
        formData.append('file', picture);
        const response = await axiosClient.post('/api/me/avatar/upload', formData, {withCredentials: true})
        return response.data;
    }

    static async changePassword(oldPassword, newPassword){
        const response = await axiosClient.post('/api/me/password',{
            oldPassword: oldPassword,
            newPassword: newPassword
        })
        return response.data;
    }
}

export default UserService;