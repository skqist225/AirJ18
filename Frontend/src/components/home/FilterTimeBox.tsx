import React, { FC, useEffect, useState } from 'react';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';
import Calendar from '../utils/Calendar';
import $ from 'jquery';
import './css/filter_time.css';

interface IFilterTimeBoxProps {}

const FilterTimeBox: FC<IFilterTimeBoxProps> = ({}) => {
    const [calendarActivated, setCalendarActivated] = useState(false);

    function changeFilterTimeUI(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const self = $(event.currentTarget);

        if (self.text() === 'Lịch') {
            setCalendarActivated(true);
        } else {
            setCalendarActivated(false);
        }
    }
    return (
        <div id='filterTime__box'>
            <Div className='col-flex'>
                <Div padding='0 45px'>
                    <div className='flex-center filterTime__option--container'>
                        <div id='filterTime__option--wrapper'>
                            <div className='normal-flex'>
                                <button
                                    className={
                                        calendarActivated
                                            ? 'filterTime__filter--option active'
                                            : 'filterTime__filter--option'
                                    }
                                    onClick={changeFilterTimeUI}
                                >
                                    Lịch
                                </button>
                                <button
                                    onClick={changeFilterTimeUI}
                                    className={
                                        calendarActivated
                                            ? 'filterTime__filter--option'
                                            : 'filterTime__filter--option active'
                                    }
                                >
                                    Ngày linh hoạt
                                </button>
                            </div>
                        </div>
                    </div>
                    <Div>
                        {calendarActivated ? (
                            <Div className='f1 col-flex' height='calc(100% - 100px)'>
                                <Div>
                                    <Calendar />
                                </Div>

                                <div className='normal-flex' style={{ justifySelf: 'flex-end' }}>
                                    <div className='mr-10'>
                                        <button className='filterTime__flexibleDayBtn'>
                                            <span>
                                                <Image
                                                    src={getImage('/svg/plusAndMinus.svg')}
                                                    size='12px'
                                                />
                                            </span>
                                            1 ngày
                                        </button>
                                    </div>
                                    <div className='mr-10'>
                                        <button className='filterTime__flexibleDayBtn'>
                                            <span>
                                                <Image
                                                    src={getImage('/svg/plusAndMinus.svg')}
                                                    size='12px'
                                                />
                                            </span>
                                            2 ngày
                                        </button>
                                    </div>
                                    <div className='mr-10'>
                                        <button className='filterTime__flexibleDayBtn selected'>
                                            <span>
                                                <Image
                                                    src={getImage('/svg/plusAndMinus.svg')}
                                                    size='12px'
                                                />
                                            </span>
                                            3 ngày
                                        </button>
                                    </div>
                                    <div className='mr-10'>
                                        <button className='filterTime__flexibleDayBtn'>
                                            <span>
                                                <Image
                                                    src={getImage('/svg/plusAndMinus.svg')}
                                                    size='12px'
                                                />
                                            </span>
                                            7 ngày
                                        </button>
                                    </div>
                                </div>
                            </Div>
                        ) : (
                            <Div className='col-flex'>
                                <div className='col-flex-center'>
                                    <div className='filterTime__flexibleDay--title'>
                                        Bạn muốn ở trong bao lâu?
                                    </div>
                                    <div>
                                        <div>
                                            <button className='filterTime__flexibleDayBtn'>
                                                Cuối tuần
                                            </button>
                                            <button className='filterTime__flexibleDayBtn'>
                                                1 tuần
                                            </button>
                                            <button className='filterTime__flexibleDayBtn'>
                                                1 tháng
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className='filterTime__flexibleDay--title'>
                                        Bạn muốn đi khi nào?
                                    </div>
                                    <Div width='122px' height='122px'>
                                        <button className='filterTime__monthSelected'>
                                            <div>
                                                <Image
                                                    src={getImage('/svg/monthIcon.jpg')}
                                                    size='20px'
                                                />
                                            </div>
                                            <div>Tháng 3</div>
                                            <div>2022</div>
                                        </button>
                                    </Div>
                                </div>
                            </Div>
                        )}
                    </Div>
                </Div>
                <footer id='filterTime__footer' className='normal-flex jc-fe'>
                    <div>
                        <button className='filter--footer__applyBtn smaller'>Lưu</button>
                    </div>
                </footer>
            </Div>
        </div>
    );
};

export default FilterTimeBox;
