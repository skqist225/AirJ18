import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
    // html {
    //     font-size: 62.5%;
    // }

    body {
        margin: 0;
        padding: 0;
        font-family: 'Open Sans', sans-serif;
    }

    *,*::before, *::after {
        box-sizing: border-box;
    }

    ul {
        padding-left: 0;
    }

    a {
        text-decoration: none;
    }

    .normal-flex {
        display: flex;
        align-items: center;
    }

    .flex-space {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .flex-center {
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;

export default GlobalStyle;
