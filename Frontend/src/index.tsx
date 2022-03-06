import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import store from './store';
import { Provider } from 'react-redux';
import GlobalStyle from './globalStyle';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
            <GlobalStyle />
        </React.StrictMode>
    </Provider>,
    document.getElementById('root')
);
