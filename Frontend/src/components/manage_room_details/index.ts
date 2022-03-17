import styled from 'styled-components';

export { default as SideBar } from './SideBar';
export { default as EditImage } from './EditImage';
export { default as EditRoomInfo } from './EditRoomInfo';
export { default as EditAmenity } from './EditAmenity';
export { default as EditLocation } from './EditLocation';
export { default as EditRoomCount } from './EditRoomCount';
export { default as ViewRoom } from './ViewRoom';

interface IManageYSContainer {
    height?: string;
}

export const ManageYSContainer = styled.article`
    width: 853px;
    ${(props: IManageYSContainer) => props.height && 'height:' + props.height};
    margin-bottom: 48px;
    border-bottom: 1px solid #d3d6db;

    &:nth-child(3),
    &:nth-child(4) {
        padding-bottom: 48px;
    }

    .manage--ys__section--title {
        font-size: 18px;
        line-height: 26px;
        color: #222;
        font-weight: 600;
    }
`;
