import axios from "axios";

export enum DataType {
    MULTIPARTFORMDATA = "multipart/form-data",
    APPLICATIONJSON = "application/json",
}

//  `${
//         process.env.REACT_APP_NODE_ENV === "development"
//             ? process.env.REACT_APP_LOCAL_SERVER_URL
//             : process.env.REACT_APP_REMOTE_SERVER_URL
//     }/api`

// REACT_APP_REMOTE_SERVER_URL = "https://airj18.skqist225.xyz/api";

const api = axios.create({
    baseURL: `${
        process.env.REACT_APP_NODE_ENV === "development"
            ? process.env.REACT_APP_LOCAL_SERVER_URL
            : process.env.REACT_APP_REMOTE_SERVER_URL
    }/api`,
    headers: {
        "Content-Type": DataType.APPLICATIONJSON,
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

const makeApiRequest = async (method: string, uri: string, data?: object, contentType?: string) => {
    let response: {
        data: any;
    } = {
        data: null,
    };
    const config = {
        headers: {
            "Content-Type": contentType != null ? contentType : DataType.APPLICATIONJSON,
        },
    };

    switch (method) {
        case "GET": {
            response = await api.get(uri);
            break;
        }
        case "POST": {
            response = await api.post(uri, data, config);
            break;
        }
        case "PUT": {
            response = await api.put(uri, data, config);
            break;
        }
        case "DELETE": {
            response = await api.delete(uri);
            break;
        }
    }

    return response;
};

export const makeGetRequest = async (uri: string) => {
    return await makeApiRequest("GET", uri);
};

export const makePostRequest = async (uri: string, data: object, contentType: string) => {
    return await makeApiRequest("POST", uri, data, contentType);
};

export const makePutRequest = async (uri: string, data: object, contentType: string) => {
    return await makeApiRequest("PUT", uri, data, contentType);
};

export const makeDeleteRequest = async (uri: string) => {
    return await makeApiRequest("DELETE", uri);
};

export default api;
