import axios from "axios";
//Можно писать код axios.get короче прописав базу
const axiosBase = axios.create({
  baseURL: "http://localhost:4444",
});
// middleware - проверка авторизованы мы или нет с помощью
// токена который в localStorage, отправляя запрос
// на "/auth/login",
axiosBase.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token");
  return config;
});

export default axiosBase;
