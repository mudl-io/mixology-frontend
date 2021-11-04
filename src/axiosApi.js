import axios from "axios";

const apiLocation = process.env.REACT_APP_API_LOCATION;

const axiosInstance = axios.create({
  baseURL: `${apiLocation}/api/`,
  timeout: 5000,
  headers: {
    Authorization: "JWT " + localStorage.getItem("access_token"),
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

const axiosImageInstance = axios.create({
  baseURL: `${apiLocation}/api/`,
  timeout: 5000,
  headers: {
    Authorization: "JWT " + localStorage.getItem("access_token"),
    "Content-Type": "multipart/form-data",
    accept: "application/json",
  },
});

[axiosInstance, axiosImageInstance].forEach((instance) => {
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const originalRequest = error.config;

      // Prevent infinite loops
      if (
        error.response.status === 401 &&
        originalRequest.url.indexOf("/token/refresh/") > -1
      ) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refesh_token");
        localStorage.removeItem("user");
        return Promise.reject(error);
      }

      if (
        error.response.status === 401 &&
        error.response.statusText === "Unauthorized"
      ) {
        const refresh_token = localStorage.getItem("refresh_token");

        if (!refresh_token) return;

        return axiosInstance
          .post("/token/refresh/", { refresh: refresh_token })
          .then((response) => {
            localStorage.setItem("access_token", response.data.access);
            localStorage.setItem("refresh_token", response.data.refresh);

            axiosInstance.defaults.headers["Authorization"] =
              "JWT " + response.data.access;
            originalRequest.headers["Authorization"] =
              "JWT " + response.data.access;

            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            console.log(err);
          });
      }
      return Promise.reject(error);
    }
  );
});
export { axiosInstance, axiosImageInstance };
