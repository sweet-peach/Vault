import axios from 'axios';

const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_BASE_URL
});


axiosClient.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    config.withCredentials = true;
    return config;
});

axiosClient.interceptors.response.use(
    (response) => {
        return response;
    },
    error => {
        if (error.response) {
            // Handling HTTP status errors
            console.error(`HTTP error: ${error.response.status} - ${error.response.statusText}`);

            // if(error.response.status === 409 && isClient) {
            //     window.location.href = '/login';
            // }

            throw {
                status: error.response.status,
                message: error.response.data.message || error.response.statusText,
                data: error.response.data,
            };
        } else if (error.request) {
            // The request was made, but no response was received
            console.error('No Response error:', error.request);
            throw {message: 'No response was received'};
        } else {
            // Error in setting the query
            console.error('Request Setup error:', error.message);
            throw {message: error.message};
        }
    }
);

export default axiosClient;