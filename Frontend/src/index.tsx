import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import store from "./store";
import { Provider } from "react-redux";
import GlobalStyle from "./globalStyle";
import "bootstrap/dist/css/bootstrap.min.css";
import "antd/dist/antd.css";
import "mapbox-gl/dist/mapbox-gl.css";
import "react-loading-skeleton/dist/skeleton.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createRoot } from "react-dom/client";

// @ts-ignore
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID as string}>
            <React.StrictMode>
                <App />
                <GlobalStyle />
            </React.StrictMode>
        </GoogleOAuthProvider>
    </Provider>
);
