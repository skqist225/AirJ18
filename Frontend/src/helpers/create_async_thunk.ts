import { createAsyncThunk } from "@reduxjs/toolkit";
import { makeGetRequest, makePostRequest, makePutRequest, makeDeleteRequest } from "../axios";
import { setUser } from "../features/user/userSlice";
import makeGetURI from "./make_get_uri";

interface IRequest {
    uri: string;
    contentType?: string;
}

interface IGetRequest extends IRequest {
    fieldName?: string;
    insertIntoURIPosition?: number;
    isLogout?: boolean;
    isLogin?: boolean;
}

export const makeGetAsyncThunk = (thunkName: string, request: IGetRequest, callback?: Function) => {
    const { uri } = request;

    return createAsyncThunk(
        thunkName,
        async (requestData: any, { rejectWithValue, getState, dispatch }) => {
            try {
                let finalURI = uri;
                if (request.insertIntoURIPosition && request.fieldName)
                    finalURI = makeGetURI(
                        uri,
                        requestData[request.fieldName],
                        request.insertIntoURIPosition
                    );

                const { data } = await makeGetRequest(finalURI);

                if (data) {
                    if (callback) callback();
                    if (request.isLogout) dispatch(setUser(null));
                }

                return { data };
            } catch ({ data: { error } }) {
                return rejectWithValue(error);
            }
        }
    );
};

interface IPostRequest extends IRequest {}

export const makePostAsyncThunk = (
    thunkName: string,
    request: IPostRequest,
    callback?: Function
) => {
    const { uri } = request;
    const contentType = request.contentType || "application/json";
    return createAsyncThunk(
        thunkName,
        async (requestData: any, { rejectWithValue, getState, dispatch }) => {
            try {
                const { data } = await makePostRequest(uri, requestData, contentType);

                if (data) {
                    if (callback) callback();
                }

                return { data };
            } catch ({ data: { error } }) {
                return rejectWithValue(error);
            }
        }
    );
};
