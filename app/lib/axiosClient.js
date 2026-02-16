import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:4000/graphql",
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => {

    const graphQLData = response?.data?.data;

    if (graphQLData) {
      const isUnauthenticated = Object.values(graphQLData).some(
        (item) =>
          item?.message === "Not authenticated" 
          // || item?.status === "failed"
      );

      if (isUnauthenticated) {
        if (typeof window !== "undefined" &&
            window.location.pathname !== "/login") {
          window.location.replace("/login");
        }
      }
    }

    return response;
  },

  (error) => {
    if (error?.response?.status === 401) {
      if (typeof window !== "undefined" &&
          window.location.pathname !== "/login") {
        window.location.replace("/login");
      }
    }

    return Promise.reject(error);
  }
);


export default axiosClient;
