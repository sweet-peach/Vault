import axios from "axios";
import {cookies} from "next/headers";

export async function getUserDataFromServer() {
    const userCookies = await cookies();

    const token = userCookies.get('token')?.value

    if (!token) return null;

    try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/me`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        if(error.response && error.response.status === 401){
            return null;
        } else {
            return null;
            //TODO Handle server not response
        }
    }
}
