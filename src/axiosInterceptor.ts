import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true, // Include cookies in requests
});

axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshTokenUrl = `${window.__ENV__.GO_BASE_URL}${window.__ENV__.REFRESH_TOKEN_URL}`;
            try{
                const response = await axios.post(refreshTokenUrl, {}, {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                });
            if(response.status === 200) {
                // If refresh token is successful, retry the original request
                return axiosInstance(originalRequest); 
            }

            }catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                return Promise.reject(refreshError);
            }
        return Promise.reject(error);
        }
    }
)

export default axiosInstance;