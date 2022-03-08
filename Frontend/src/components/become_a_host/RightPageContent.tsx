import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Div, MainButton } from '../../globalStyle';
import $ from 'jquery';
import './css/right_content.css';
import StepProcess from './StepProcess';
import { accessToken } from '../../utils/getLocation';

interface IRightPageContentProps {
    nextPage: string;
    MainContent: React.ReactNode;
    stepNumber: number;
    backgroundColor?: string;
    beforeMiddle?: React.ReactNode;
}

const RightPageContent: FC<IRightPageContentProps> = ({
    nextPage,
    MainContent,
    stepNumber,
    backgroundColor,
    beforeMiddle,
}) => {
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

        window.location.href = `${window.location.origin}/become-a-host/${nextPage}`;
    }

    function backToHomePage() {
        window.location.href = window.location.origin;
    }

    const jQueryCode = () => {
        const addressSearchInput = $('#addressLocation');
        addressSearchInput.on('focus', function () {
            $('.location__search-location').first().addClass('input-focus');
            $('.location__location-option-box').first().addClass('input-focus');
        });

        // $('#location__search-btn').on('click', function () {
        //     getPositionFromInput(addressSearchInput.val()! as string, accessToken);
        // });
    };

    useEffect(() => {
        if (beforeMiddle !== null) jQueryCode();
    }, []);

    return (
        <Div
            className='col-flex p-relative'
            width='50%'
            height='100%'
            backgroundColor={backgroundColor}
        >
            <Div className='normal-flex jc-fe' height='88px' padding='0 20px 0 0'>
                <button
                    className='become-a-host__right-cancelBtn'
                    onClick={backToHomePage}
                    style={
                        stepNumber === 4
                            ? {
                                  position: 'absolute',
                                  zIndex: 101,
                                  top: 'calc(88px / 2 - 32px)',
                              }
                            : {}
                    }
                >
                    <span className='fw-500'>Lưu và thoát</span>
                </button>
            </Div>
            {stepNumber === 4 && beforeMiddle}

            {stepNumber === 6 ? (
                <div
                    className='flex-center f1'
                    style={{
                        overflowY: 'scroll',
                        flex: 1,
                        padding: '0 48px',
                        maxWidth: '90%',
                        margin: '0 auto',
                    }}
                >
                    {MainContent}
                </div>
            ) : (
                <div className='flex-center f1'>{MainContent}</div>
            )}

            <StepProcess stepNumber={stepNumber} />
            <Div
                className='flex-space'
                height='80px'
                padding='16px'
                style={
                    stepNumber === 4
                        ? {
                              position: 'absolute',
                              zIndex: 100,
                              bottom: '0',
                              backgroundColor: '#fff',
                          }
                        : {}
                }
            >
                <div>
                    <Link
                        to={`/become-a-host/intro`}
                        id='right--content__prev--step'
                        style={{ color: backgroundColor === '#000000' ? '#fff' : '#222' }}
                    >
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
