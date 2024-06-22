import axios from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";
import { useNavigate } from "react-router-dom";

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { userSignOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        console.error("Interceptor error", error.response);
        if (error.response.status === 401 || error.response.status === 403) {
          await userSignOut();
          navigate("/login");
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [userSignOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;
