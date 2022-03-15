import React, { FC, useEffect, useState } from 'react';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers';
import Calendar from '../utils/Calendar';
import $ from 'jquery';

import axios from '../../axios';
import {
    fetchRoomsByCategoryAndConditions,
    roomState,
    setCurrentFilterObject,
} from '../../features/room/roomSlice';
import { useDispatch, useSelector } from 'react-redux';

import './css/filter_time.css';

interface IFilterTimeBoxProps {
    categoryid: number;
    triggerButton: JQuery<HTMLElement>;
}

const FilterTimeBox: FC<IFilterTimeBoxProps> = ({ categoryid, triggerButton }) => {
    const dispatch = useDispatch();
    const [calendarActivated, setCalendarActivated] = useState(false);
    const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
    const { filterObject } = useSelector(roomState);

    const loopLength = 13 - currentMonth;
    const currentYear = new Date().getFullYear();
    const currentDate = new Date().getDate();

    function changeFilterTimeUI(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const self = $(event.currentTarget);

        if (self.text() === 'Lịch') {
            setCalendarActivated(true);
        } else {
            setCalendarActivated(false);
        }
    }

    function nextFlexibleDay() {
        setCurrentMonth(currentMonth + 2);
    }

    function selectMonth(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const self = $(event.currentTarget);

        if (self.hasClass('active')) {
            self.removeClass('active');
            self.children()
                .first()
                .children('img')
                .attr('src', getImage('/svg/unSelectedMonth.jpg'));
        } else {
            self.addClass('active');
            self.children().first().children('img').attr('src', getImage('/svg/selectedMonth.jpg'));
        }
    }

    async function f(selectedMonth: number[]) {
        const crtMonth = new Date().getMonth() + 1;
        let weekendInMonth2 = await selectedMonth.map(async month => {
            let weekendInMonth: string[] = [];
            const {
                data: { daysInMonth },
            } = await axios.get(`/calendar/${month}/${currentYear}`);

            const weeks: string[] = daysInMonth.split('*');
            const numberOfWeeks = weeks.length;
            weeks.forEach((week, index) => {
                const days = week.trim().split(' ');
                const sunday = days.shift()!;
                const saturday = days.pop()!;
                const filterDay = ['_', '', undefined];
                const dayFormat = `${currentYear}-${month}-`;

                //firstWeek
                if (index === 0 && !filterDay.includes(saturday)) {
                    if (month === crtMonth && parseInt(saturday) >= currentDate)
                        weekendInMonth.push(dayFormat + saturday);
                    else weekendInMonth.push(dayFormat + saturday);
                } else if (index + 1 === numberOfWeeks && !filterDay.includes(sunday)) {
                    if (month === crtMonth && parseInt(sunday) >= currentDate)
                        weekendInMonth.push(dayFormat + sunday);
                    else weekendInMonth.push(dayFormat + sunday);
                } else {
                    if (month === crtMonth) {
                        if (!filterDay.includes(sunday) && parseInt(sunday) >= currentDate) {
                            weekendInMonth.push(dayFormat + sunday);
                        }
                        if (!filterDay.includes(saturday) && parseInt(saturday) >= currentDate) {
                            weekendInMonth.push(dayFormat + saturday);
                        }
                    } else {
                        if (!filterDay.includes(sunday)) weekendInMonth.push(dayFormat + sunday);
                        if (!filterDay.includes(saturday))
                            weekendInMonth.push(dayFormat + saturday);
                    }
                }
            });
            return Promise.resolve(weekendInMonth);
        });

        return (await Promise.all(weekendInMonth2)).reduce((a, promise) => a.concat(promise), []);
    }

    async function filterRoomByTime() {
        if (!calendarActivated) {
            const stayTime = $('.filterTime__flexibleDayBtn').filter('.selected').data('time');
            const selectedMonth: number[] = [];

            $('.filterTime__monthSelected').each(function () {
                if ($(this).hasClass('active')) {
                    const month = $(this).data('month');
                    selectedMonth.push(parseInt(month));
                }
            });
            console.log(categoryid);
            switch (stayTime) {
                case 'weekend': {
                    const bookingDates = await f(selectedMonth);
                    const displayText = 'Tháng ' + selectedMonth.join(', ');
                    triggerButton.text(displayText);

                    dispatch(
                        fetchRoomsByCategoryAndConditions({
                            categoryid,
                            ...filterObject,
                            bookingDates,
                        })
                    );

                    dispatch(
                        setCurrentFilterObject({
                            ...filterObject,
                            bookingDates,
                        })
                    );

                    break;
                }
            }
        } else {
            let startDate = $('.dayInWeek.false.checked').first(),
                endDate = $('.dayInWeek.false.checked').last();
            let dates: string[] = [];

            dates.push(`${startDate.data('year')}-${startDate.data('month')}-${startDate.text()}`);

            $('.dayInWeek.false.between').each(function () {
                dates.push(`${$(this).data('year')}-${$(this).data('month')}-${$(this).text()}`);
            });

            dates.push(`${endDate.data('year')}-${endDate.data('month')}-${endDate.text()}`);
            console.log(dates);
            const plusDay = $('.filterTime__flexibleDayBtn.selected').text().replace('ngày', '');
            console.log(plusDay);
            let newDateInNextMonth = 1;
            Array.from({ length: parseInt(plusDay) }).forEach((_, index) => {
                if (
                    startDate.data('month') === currentMonth &&
                    parseInt(startDate.text()) >= currentDate
                )
                    dates.push(
                        `${startDate.data('year')}-${startDate.data('month')}-${
                            parseInt(startDate.text()) + index - parseInt(plusDay)
                        }`
                    );

                const nextEndDate = parseInt(endDate.text()) + index + 1;
                const lastDateInMonth = new Date(currentYear, endDate.data('month'), 0).getDate();
                console.log(lastDateInMonth);
                if (nextEndDate <= lastDateInMonth)
                    dates.push(`${endDate.data('year')}-${endDate.data('month')}-${nextEndDate}`);
                else
                    dates.push(
                        `${endDate.data('year')}-${
                            endDate.data('month') + 1
                        }-${newDateInNextMonth++}`
                    );
            });

            dispatch(
                fetchRoomsByCategoryAndConditions({
                    categoryid,
                    ...filterObject,
                    bookingDates: dates,
                })
            );

            dispatch(
                setCurrentFilterObject({
                    ...filterObject,
                    bookingDates: dates,
                })
            );
        }
    }

    useEffect(() => {
        $('.filterTime__flexibleDayBtn').on('click', function () {
            $('.filterTime__flexibleDayBtn').each(function () {
                $(this).removeClass('selected');
            });

            if ($(this).hasClass('selected')) $(this).removeClass('selected');
            else $(this).addClass('selected');
        });
    }, [calendarActivated]);

    return (
        <div id='filterTime__box' className={!calendarActivated ? 'smaller' : ''}>
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
                                <div className='col-flex-center' style={{ padding: '8px 0 16px' }}>
                                    <div className='filterTime__flexibleDay--title'>
                                        Bạn muốn ở trong bao lâu?
                                    </div>
                                    <div>
                                        <div>
                                            <button
                                                className='filterTime__flexibleDayBtn'
                                                data-time='weekend'
                                            >
                                                Cuối tuần
                                            </button>
                                            <button
                                                className='filterTime__flexibleDayBtn'
                                                data-time='week'
                                            >
                                                1 tuần
                                            </button>
                                            <button
                                                className='filterTime__flexibleDayBtn'
                                                data-time='month'
                                            >
                                                1 tháng
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className='filterTime__flexibleDay--title'>
                                        Bạn muốn đi khi nào?
                                    </div>
                                    <div className='normal-flex p-relative overflow-hidden'>
                                        {Array.from({ length: loopLength }).map((_, index) => {
                                            // if (index > 4) return null;

                                            return (
                                                <Div
                                                    width='120px'
                                                    height='120px'
                                                    margin='0 10px 0 0'
                                                    style={{ minWidth: '120px' }}
                                                    key={index}
                                                >
                                                    <button
                                                        className='filterTime__monthSelected'
                                                        onClick={selectMonth}
                                                        data-month={currentMonth + index}
                                                    >
                                                        <div>
                                                            <Image
                                                                src={getImage(
                                                                    '/svg/unselectedMonth.jpg'
                                                                )}
                                                                size='32px'
                                                            />
                                                        </div>
                                                        <div>Tháng {currentMonth + index}</div>
                                                        <div>{currentYear}</div>
                                                    </button>
                                                </Div>
                                            );
                                        })}
                                        <div className='filterTime__nextFlexibleDayBtn--wrapper'>
                                            <button
                                                className='filterTime__nextFlexibleDayBtn'
                                                onClick={nextFlexibleDay}
                                            >
                                                <span>
                                                    <Image
                                                        src={getImage('/svg/nextMonth.svg')}
                                                        size='12px'
                                                    />
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </Div>
                        )}
                    </Div>
                </Div>
                <footer id='filterTime__footer' className='normal-flex jc-fe'>
                    <div>
                        <button
                            className='filter--footer__applyBtn smaller'
                            onClick={filterRoomByTime}
                        >
                            Lưu
                        </button>
                    </div>
                </footer>
            </Div>
        </div>
    );
};

export default FilterTimeBox;
