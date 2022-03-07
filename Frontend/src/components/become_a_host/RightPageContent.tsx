import { FC } from 'react';
import { Link } from 'react-router-dom';
import { Div, MainButton } from '../../globalStyle';
import PropertyGroupPartial from './PropertyGroupMainContent';

interface IRightPageContentProps {
    nextPageURL: string;
    MainContent: React.ReactNode;
}

const RightPageContent: FC<IRightPageContentProps> = ({ nextPageURL, MainContent }) => {
    function moveToNextPage() {
        const choosenRoomGroup = parseInt(
            $('div.room-group__box').filter('.active').children('input').val()! as string
        );
        const choosenRoomGroupText = $('div.room-group__box')
            .filter('.active')
            .children('.room-type__name')
            .text();

        let room = {};
        if (!localStorage.getItem('room')) {
            room = {
                roomGroup: choosenRoomGroup,
                roomGroupText: choosenRoomGroupText,
            };
        } else {
            room = JSON.parse(localStorage.getItem('room')!);
            room = {
                ...room,
                roomGroup: choosenRoomGroup,
                roomGroupText: choosenRoomGroupText,
            };
        }
        localStorage.setItem('room', JSON.stringify(room));

        window.location.href = `${window.location.origin}${nextPageURL}`;
    }

    function backToHomePage() {
        window.location.href = window.location.origin;
    }

    return (
        <Div className='room-group__right col-flex' width='50%' height='100%'>
            <Div className='normal-flex jc-fe' height='88px' padding='0 20px 0 0'>
                <button className='become-a-host__right-cancelBtn' onClick={backToHomePage}>
                    <span className='fw-500'>Lưu và thoát</span>
                </button>
            </Div>

            <div className='flex-center f1'>{MainContent}</div>

            <div className='stepProcess room-group-step'></div>
            <Div className='flex-space' height='80px' padding='16px'>
                <div>
                    <Link to={`/become-a-host/intro`} className='room-group__prev-step'>
                        Quay lại
                    </Link>
                </div>
                <MainButton width='120px' height='48px' onClick={moveToNextPage}>
                    <span className='fw-500'>Tiếp theo</span>
                </MainButton>
            </Div>
        </Div>
    );
};

export default RightPageContent;
