import styled from 'styled-components';
import { Div } from '../../globalStyle';

export { default as ContactHost } from './ContactHost';
export { default as PaymentInfo } from './PaymentInfo';
export { default as PaymentMethod } from './PaymentMethod';
export { default as PreviewBookingInfo } from './PreviewBookingInfo';
export { default as RoomAndPricePreview } from './RoomAndPricePreview';
export { default as PaymentError } from './PaymentError';
export { default as CancelPolicy } from './CancelPolicy';
export { default as AcceptPolicy } from './AcceptPolicy';

export const PBRoomInfo = styled(Div).attrs(props => ({
    className: 'start-flex',
}))``;

export const ProgressBookingContainer = styled(Div).attrs(props => ({
    className: 'col-flex-center',
    width: '1440px',
    margin: '0 auto',
    padding: '64px 80px',
}))``;

export const PBTitleSection = styled.div.attrs(props => ({
    className: 'normal-flex',
}))`
    justify-content: flex-start;
    width: 100%;
    padding-bottom: 32px;

    button {
        display: inline-block;
        padding-right: 32px;
    }

    h1 {
        cursor: pointer;
        font-size: 32px;
        font-weight: 600;
        margin-bottom: 0;
    }
`;
