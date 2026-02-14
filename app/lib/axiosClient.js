import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: "http://localhost:4000",
//   withCredentials: true, // 🔥 REQUIRED for cookies
//   headers: {
//     "Content-Type": "application/json",
//   },
// });
const axiosClient = axios.create({
  baseURL: "http://localhost:4000/graphql",
  withCredentials: true,
});

axiosClient.interceptors.response.use(
  (response) => {
    // 🔴 HANDLE GRAPHQL AUTH ERRORS (200 OK case)
    const errors = response?.data?.errors;
    if (
      errors?.some(
        (err) =>
          err.message === "Not authenticated" ||
          err.message === "Unauthorized" ||
          err.extensions?.code === "UNAUTHENTICATED"
      )
    ) {
      document.cookie = "token=; Max-Age=0; path=/";
      window.location.href = "/login";
    }

    return response;
  },
  (error) => {
    // 🔴 HANDLE HTTP 401 (REST or GraphQL server-level)
    if (error?.response?.status === 401) {
      document.cookie = "token=; Max-Age=0; path=/";
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
