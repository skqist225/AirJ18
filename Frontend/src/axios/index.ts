import axios from 'axios';

const multipartFormData = 'multipart/form-data';

const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
        'Content-Type': multipartFormData,
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
