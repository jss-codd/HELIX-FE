import axios from "axios";
// import { notification } from 'antd'
import { useHistory } from "react-router-dom";

const apiClient = axios.create({
  baseURL: "/api",
  // timeout: 1000,
  // headers: { 'X-Custom-Header': 'foobar' }
});

apiClient.interceptors.request.use((request) => {
  const accessToken = localStorage.getItem("accessToken");
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
    request.headers.AccessToken = accessToken;
    request.headers["x-access-token"] = accessToken;
  }
  return request;
});

apiClient.interceptors.response.use(undefined, (error) => {
  // Errors handling
  if (error.status === 401) {
    localStorage.removeItem("accessToken")
    const history = useHistory();
    history.push("/login");
  }
});

export default apiClient;
