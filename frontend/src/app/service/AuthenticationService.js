import axiosClient from "@/app/lib/axiosClient";

class AuthenticationService {
    static async checkEmailExistence(email) {
        const response = await axiosClient.post('/api/check-email-existence', {email})
        return response.data;
    }

    static async login(email, password) {
        const response = await axiosClient.post('/api/login', {email, password}, {withCredentials: true})
        return response.data;
    }

    static async register(email, password) {
        const response = await axiosClient.post('/api/register', {email, password}, {withCredentials: true})
        return response.data;
    }
}

export default AuthenticationService;