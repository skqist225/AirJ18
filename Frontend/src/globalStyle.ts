import styled, { createGlobalStyle } from 'styled-components';
import { Link } from 'react-router-dom';

const GlobalStyle = createGlobalStyle`
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

    .flex {
        display: flex;
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

    .col-flex {
        display: flex;
        flex-direction: column;
    }

    .flex-1 {
        flex: 1;
        max-width: 50%;
    }

    .f1 {
        flex: 1;
    }

    .inline-block {
        display: inline-block;
    }

    .overflow-hidden {
        overflow: hidden;
    }

    .p-relative {
        position: relative;
    }

    .w100-h100 {
        width: 100%;
        height: 100%;
    }
`;

export const MainButton = styled.button`
    cursor: pointer;
    display: inline-block;
    margin: 0px;
    position: relative;
    text-align: center;
    text-decoration: none;
    touch-action: manipulation;
    font-size: 16px;
    line-height: 20px;
    font-weight: 600;
    border-radius: 8px;
    outline: none;
    padding: 14px 24px;
    transition: box-shadow 0.2s ease 0s, -ms-transform 0.1s ease 0s, -webkit-transform 0.1s ease 0s,
        transform 0.1s ease 0s;
    -webkit-tap-highlight-color: transparent;
    border: none;
    background: linear-gradient(
        to right,
        rgb(230, 30, 77) 0%,
        rgb(227, 28, 95) 50%,
        rgb(215, 4, 102) 100%
    );
    color: rgb(255, 255, 255);
    width: 100%;
`;

export const Divider = styled.div`
    width: 100%;
    height: 1px;
    background-color: rgb(228, 228, 228);
`;

interface DivProps {
    width?: string;
    height?: string;
}

export const DivWithHeightAndWidth = styled.div`
    width: ${(props: DivProps) => props.width || '100%'};
    height: ${(props: DivProps) => props.height || '100%'};
`;

export default GlobalStyle;
