import { FC, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Div, MainButton } from '../../globalStyle';
import $ from 'jquery';
import './css/right_content.css';
import StepProcess from './StepProcess';
import { accessToken } from '../../utils/getLocation';

interface IRightPageContentProps {
    nextPage: string;
    prevPage: string;
    MainContent: React.ReactNode;
    stepNumber: number;
    backgroundColor?: string;
    beforeMiddle?: React.ReactNode;
}

const RightPageContent: FC<IRightPageContentProps> = ({
    nextPage,
    prevPage,
    MainContent,
    stepNumber,
    backgroundColor,
    beforeMiddle,
}) => {
    function moveToNextPage() {
        let room = {};
        switch (stepNumber) {
            case 1: {
                const choosenGroup = $('div.room-group__box').filter('.active');

                if (!localStorage.getItem('room')) {
                    room = {
                        roomGroup: parseInt(choosenGroup.data('group-id')! as string),
                        roomGroupText: choosenGroup.data('group-name'),
                    };
                } else {
                    room = JSON.parse(localStorage.getItem('room')!);
                    room = {
                        ...room,
                        roomGroup: parseInt(choosenGroup.data('group-id')! as string),
                        roomGroupText: choosenGroup.data('group-name'),
                    };
                }
                break;
            }
            case 2: {
                const choosenCategory = $('div.category__box').filter('.active');

                if (!localStorage.getItem('room')) {
                    room = {
                        category: choosenCategory.data('category-id'),
                    };
                } else {
                    room = JSON.parse(localStorage.getItem('room')!);
                    room = {
                        ...room,
                        category: choosenCategory.data('category-id'),
                    };
                }
                break;
            }
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
                        to={`/become-a-host/${prevPage}`}
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
