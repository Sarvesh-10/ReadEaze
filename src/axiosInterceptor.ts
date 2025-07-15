import axios from "axios";

const axiosInstance = axios.create({
  withCredentials: true, // Include cookies in requests
});
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error:any,shouldRetry:boolean = true) =>{
    failedQueue.forEach((prom:any) => {
        if(shouldRetry) {
            prom.resolve();
        } else {
            prom.reject(error);
        }
    });
    failedQueue = [];
}
axiosInstance.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if(error.response?.status === 401 && !originalRequest._retry) {
            if(isRefreshing) {
                return new Promise((resolve, reject) =>{
                    failedQueue.push({ resolve: ()=> resolve(axiosInstance(originalRequest)), reject : () => reject(error) });
                });
            }
            originalRequest._retry = true;
            isRefreshing = true;
            const refreshTokenUrl = `${window.__ENV__.GO_BASE_URL}${window.__ENV__.REFRESH_TOKEN_URL}`;
            try{
                const response = await axios.post(refreshTokenUrl, {}, {
                    withCredentials: true,
                    headers: { "Content-Type": "application/json" }
                });
            if(response.status === 200) {
                // If refresh token is successful, retry the original request
                processQueue(null, true);
                isRefreshing = false;
                return axiosInstance(originalRequest); 
            }

            }catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                processQueue(refreshError, false);
                return Promise.reject(refreshError);
            }finally{
                isRefreshing = false;
            }
        return Promise.reject(error);
        }
    }
)

export default axiosInstance;