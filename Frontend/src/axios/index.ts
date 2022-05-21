import axios from "axios";

const multipartFormData = "multipart/form-data";

const api = axios.create({
    baseURL: `${
        process.env.REACT_APP_NODE_ENV === "development"
            ? process.env.REACT_APP_LOCAL_SERVER_URL
            : process.env.REACT_APP_REMOTE_SERVER_URL
    }/api`,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.request.use(req => {
    return req;
});

api.interceptors.response.use(
    ({ data }) => {
        return data;
    },
    ({ response: { data } }) => {
        return Promise.reject({ data });
    }
);

export default api;
