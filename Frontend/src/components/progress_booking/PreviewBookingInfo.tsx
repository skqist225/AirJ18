import { FC, useState } from 'react';
import Calendar from '../utils/Calendar';
import $ from 'jquery';
import { getImage } from '../../helpers';
import { Div, Image } from '../../globalStyle';
import { IRoomDetails } from '../../types/room/type_RoomDetails';

interface IPreviewBookingInfoProps {
    title: string;
    text: string;
    componentName: React.ReactNode;
    room: IRoomDetails;
}

const PreviewBookingInfo: FC<IPreviewBookingInfoProps> = ({ title, text, componentName, room }) => {
    const [show, setShow] = useState(false);

    function showTriggeredComponent() {
        setShow(true);
        if (componentName === 'calendar')
            $('.rdt_calender__header').css('display', 'block !important');
        else $('#guest').css('display', 'block');

        $('#progress--booking').addClass('remove-scroll');
    }

    function closeBox() {
        setShow(false);
        if (componentName === 'calendar')
            $('.rdt_calender__header').css('display', 'none !important');
        else $('#guest').css('display', 'none');
        $('#progress--booking').removeClass('remove-scroll');
    }

    function displayNumberOfDays(
        manyDays: number,
        newCheckinDate: string,
        newCheckoutDate: string
    ) {
        $('#numberOfNight').text(manyDays + 2 + ' đêm');
        $('#roomBedAndBathroom').text(room!.bed + ' giường · ' + room!.bathroom + ' phòng tắm');
        $('#checkIn-book_it').val(newCheckinDate);
        $('#checkOut-book_it').val(newCheckoutDate);
        // displayPreviewLine();
        // setTotalPrice(manyDays + 2, room!.price);
    }

    return (
        <>
            {' '}
            <div className='flex-space' style={{ paddingBottom: '24px' }}>
                <div className='col-flex'>
                    <div className='fs-16 fw-600'>{title}</div>
                    <div className='fs-16' style={{ marginTop: '4px', color: '#222' }}>
                        {text}
                    </div>
                </div>
                <div>
                    <button
                        className='progress--booking__transparentBtn'
                        onClick={showTriggeredComponent}
                    >
                        Chỉnh sửa
                    </button>
                </div>
            </div>
            {componentName === 'calendar' && show ? (
                <div id='progress--booking__changeBookingDate--box'>
                    <div className='p-relative'>
                        <div className='progress--booking__close--box__btn'>
                            <button
                                className='progress--booking__transparentBtn p-relative delete--date'
                                onClick={closeBox}
                            >
                                <Image
                                    src={getImage('/svg/close2.svg')}
                                    size='16px'
                                    className='p-relative'
                                />
                            </button>
                        </div>
                        <div className='flex-space'>
                            <div>
                                <div className='fs-22 fw-600' id='numberOfNight'>
                                    Chọn ngày
                                </div>
                                <div
                                    className='fs-14 717171'
                                    style={{ paddingTop: '8px' }}
                                    id='roomBedAndBathroom'
                                >
                                    Thêm ngày đi để biết giá chính xác
                                </div>
                            </div>
                            <div
                                className='normal-flex'
                                style={{
                                    border: '1px solid rgb(173,173,173)',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                }}
                            >
                                <div className='inputContainer active'>
                                    <div>
                                        <span>NHẬN PHÒNG</span>
                                    </div>
                                    <div className='normal-flex'>
                                        <div className='inputWrapper'>
                                            <input
                                                type='text'
                                                placeholder='Thêm ngày'
                                                id='checkIn-book_it'
                                            />
                                        </div>
                                        <button className='progress--booking__transparentBtn p-relative delete--date'>
                                            <span>
                                                <Image
                                                    src={getImage('/svg/close2.svg')}
                                                    size='12px'
                                                />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                <div className='inputContainer'>
                                    <div>
                                        <span>TRẢ PHÒNG</span>
                                    </div>
                                    <div className='normal-flex'>
                                        <div className='inputWrapper disabled'>
                                            <input
                                                type='text'
                                                placeholder='Thêm ngày'
                                                id='checkOut-book_it'
                                            />
                                        </div>
                                        <button className='progress--booking__transparentBtn p-relative delete--date'>
                                            <span>
                                                <Image
                                                    src={getImage('/svg/close2.svg')}
                                                    size='12px'
                                                />
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Calendar displayNumberOfDays={displayNumberOfDays} />
                        <div className='normal-flex' style={{ justifyContent: 'flex-end' }}>
                            <div>
                                <button className='progress--booking__transparentBtn'>
                                    Xóa ngày
                                </button>
                            </div>
                            <div>
                                <button disabled className='progress--booking__saveDateBtn'>
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div id='guest'></div>
            )}
        </>
    );
};

export default PreviewBookingInfo;
