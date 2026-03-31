import axios from "axios";

// const graphqlURL =
//   process.env.NEXT_PUBLIC_GRAPHQL_URL || "http://localhost:4000/graphql";

// // ✅ Detect environment
// const isLocal =
//   typeof window !== "undefined" &&
//   window.location.hostname === "localhost";

// // ✅ SWITCH automatically
// const BASE_URL = isLocal
//   ? "http://localhost:4000" // 🖥️ LOCAL BACKEND
//   : "https://sms-backend-indol.vercel.app"; // 🌐 PRODUCTION BACKEND

const BASE_URL = "https://sms-backend-indol.vercel.app" || "http://localhost:4000";

const axiosClient = axios.create({
  baseURL: `${BASE_URL}/graphql`,
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
