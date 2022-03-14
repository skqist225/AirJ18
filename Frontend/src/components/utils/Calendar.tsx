import { FC, useEffect } from 'react';
import { getImage } from '../../helpers';
import Month from './Month';
import axios from '../../axios';
import $ from 'jquery';
import { toast, ToastContainer } from 'react-toastify';
import { IBookedDate } from '../../types/room/type_RoomDetails';

interface ICalendarProps {
    displayStartDateAndEndDate?: Function;
    setCheckInAndOutDate?: Function;
    displayNumberOfDays?: Function;
    lockBookedDatesInCalendar?: Function;
    bookedDates?: IBookedDate[];
}

export function getElementsOfDate(date: string) {
    return [
        parseInt(date.split('/')[0]),
        parseInt(date.split('/')[1]),
        parseInt(date.split('/')[2]),
    ];
}

const Calendar: FC<ICalendarProps> = ({
    displayStartDateAndEndDate,
    setCheckInAndOutDate,
    displayNumberOfDays,
    lockBookedDatesInCalendar,
    bookedDates,
}) => {
    let firstMonthAndYear: JQuery<HTMLElement>;
    let secondMonthAndYear: JQuery<HTMLElement>;

    let haveStartDate = false;
    let haveEndDate = false;
    let startDate = '';
    let endDate = '';
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();

    async function sadf() {
        await fetchTheNextCoupleOfMonth(firstMonthAndYear, secondMonthAndYear, month, year);
    }

    useEffect(() => {
        firstMonthAndYear = $('.firstMonthAndYear').first();
        secondMonthAndYear = $('.secondMonthAndYear').first();
        sadf();
    }, []);

    const fetchDaysInMonth = async (month: number, year: number) => {
        const {
            data: { daysInMonth, startInWeek },
        } = await axios.get(`/calendar/${month + 1}/${year}`);
        return Promise.resolve({ daysInMonth, startInWeek });
    };

    useEffect(() => {
        $('.getTheNextTwoMonth').on('click', async function () {
            const currentFirstMonthInCalendar = secondMonthAndYear.text().split(' ')[1];
            const currentYearInCalendar = secondMonthAndYear.text().split(' ')[3];

            await fetchTheNextCoupleOfMonth(
                firstMonthAndYear,
                secondMonthAndYear,
                parseInt(currentFirstMonthInCalendar),
                parseInt(currentYearInCalendar)
            );
        });

        $('.getThePrevTwoMonth').on('click', async function () {
            const currentFirstMonthInCalendar = secondMonthAndYear.text().split(' ')[1];
            const currentYearInCalendar = secondMonthAndYear.text().split(' ')[3];

            await fetchThePrevCoupleOfMonth(
                firstMonthAndYear,
                secondMonthAndYear,
                parseInt(currentFirstMonthInCalendar),
                parseInt(currentYearInCalendar)
            );
        });
    }, []);

    async function fetchThePrevCoupleOfMonth(
        firstMonthAndYear: JQuery<HTMLElement>,
        secondMonthAndYear: JQuery<HTMLElement>,
        month: number,
        year: number
    ) {
        let secondMonth;
        let copyMonth;
        let copyYear;

        if (month === 1) {
            secondMonth = await fetchDaysInMonth(10, year - 1);
            firstMonthAndYear.text(`Tháng 10 năm ${year - 1}`);
            secondMonthAndYear.text(`Tháng 11 năm ${year - 1}`);

            copyMonth = 10;
            copyYear = year - 1;
        } else if (month === 2) {
            secondMonth = await fetchDaysInMonth(11, year - 1);
            firstMonthAndYear.text(`Tháng 11 năm ${year - 1}`);
            secondMonthAndYear.text(`Tháng 12 năm ${year - 1}`);

            copyMonth = 11;
            copyYear = year - 1;
        } else if (month === 3) {
            secondMonth = await fetchDaysInMonth(1, year);
            firstMonthAndYear.text(`Tháng 12 năm ${year - 1}`);
            secondMonthAndYear.text(`Tháng 1 năm ${year}`);

            copyMonth = 12;
            copyYear = year - 1;
        } else {
            secondMonth = await fetchDaysInMonth(month - 3, year);
            firstMonthAndYear.html(`Tháng ${month * 1 - 3} năm ${year}`);
            secondMonthAndYear.html(`Tháng ${month * 1 - 2} năm ${year}`);

            copyMonth = month * 1 - 3;
            copyYear = year;
        }

        const firstMonth = await fetchDaysInMonth(copyMonth, copyYear);

        const rdt_calender__days = $('.rdt_calender__days').first();
        const rdt_calender__days_plus__1 = $('.rdt_calender__days_plus-1').first();

        const daysInMonthJs1 = getDaysInMonth(firstMonth.daysInMonth, copyMonth, copyYear);
        let decidedMonth = 0;
        if (copyMonth === 12) decidedMonth = 1;
        else if (copyMonth === 1) decidedMonth = 2;
        else decidedMonth = copyMonth + 1;

        const daysInMonthJs2 = getDaysInMonth(secondMonth.daysInMonth, decidedMonth, copyYear);

        rdt_calender__days.empty();
        rdt_calender__days_plus__1.empty();

        daysInMonthJs1.forEach(day => {
            rdt_calender__days.append(day);
        });
        daysInMonthJs2.forEach(day => {
            rdt_calender__days_plus__1.append(day);
        });

        addClickEventForDay();
        if (lockBookedDatesInCalendar) lockBookedDatesInCalendar();
    }

    function addClickEventForDay() {
        $('.dayInWeek.false').each(function () {
            $(this).on('click', function () {
                $('.dayInWeek.false').each(function () {
                    if ($(this).hasClass('checked')) {
                        haveStartDate = true;
                        return false;
                    }
                });

                if (!haveStartDate && !haveEndDate) {
                    $(this).addClass('checked');
                    startDate +=
                        $(this).text() + '/' + $(this).data('month') + '/' + $(this).data('year');
                } else if (haveStartDate && !haveEndDate && $(this).hasClass('checked')) {
                    $(this).removeClass('checked');
                    startDate = '';
                    haveStartDate = false;

                    removeBetweenClass();
                } else if (haveStartDate && haveEndDate && $(this).hasClass('checked')) {
                    $(this).removeClass('checked');
                    endDate = '';
                    haveEndDate = false;
                } else if (haveStartDate && haveEndDate) {
                    const [currDate, currMonth, currYear] = getElementsOfDate(
                        $(this).text() + '/' + $(this).data('month') + '/' + $(this).data('year')
                    );

                    const [startDateDate, startDateMonth, startDateYear] =
                        getElementsOfDate(startDate);
                    const [endDateDate, endDateMonth, endDateYear] = getElementsOfDate(endDate);

                    //if two month equal compare date
                    //CASE 1:
                    if (
                        currMonth === startDateMonth &&
                        currYear === startDateYear &&
                        currDate < startDateDate
                    ) {
                        setStartDate(
                            $(this),
                            startDateDate,
                            startDateMonth,
                            startDateYear,
                            currDate,
                            currMonth,
                            currYear
                        );
                        return;
                    }
                    if (currYear < startDateYear || currMonth < startDateMonth) {
                        setStartDate(
                            $(this),
                            startDateDate,
                            startDateMonth,
                            startDateYear,
                            currDate,
                            currMonth,
                            currYear
                        );
                        return;
                    }

                    //CASE 2:
                    if (currMonth === startDateMonth && currMonth === endDateMonth) {
                        if (
                            currDate > startDateDate &&
                            currDate < endDateDate &&
                            currMonth >= startDateMonth &&
                            currMonth <= endDateMonth &&
                            currYear >= startDateYear &&
                            currYear <= endDateYear
                        ) {
                            setStartDate(
                                $(this),
                                startDateDate,
                                startDateMonth,
                                startDateYear,
                                currDate,
                                currMonth,
                                currYear
                            );
                            return;
                        }
                    }
                    if (startDateMonth !== endDateMonth) {
                        if (currMonth === startDateMonth && currDate > startDateDate) {
                            setStartDate(
                                $(this),
                                startDateDate,
                                startDateMonth,
                                startDateYear,
                                currDate,
                                currMonth,
                                currYear
                            );
                            return;
                        } else if (currMonth === endDateMonth && currDate < endDateDate) {
                            setStartDate(
                                $(this),
                                startDateDate,
                                startDateMonth,
                                startDateYear,
                                currDate,
                                currMonth,
                                currYear
                            );
                            return;
                        } else {
                            if (currMonth > startDateMonth && currMonth < endDateMonth) {
                                setStartDate(
                                    $(this),
                                    startDateDate,
                                    startDateMonth,
                                    startDateYear,
                                    currDate,
                                    currMonth,
                                    currYear
                                );
                                return;
                            }
                        }
                    }

                    setEndDate(
                        $(this),
                        endDateDate,
                        endDateMonth,
                        endDateYear,
                        currDate,
                        currMonth,
                        currYear
                    );
                } else {
                    //end date
                    const [date2, month2, year2] = getElementsOfDate(
                        $(this).text() + '/' + $(this).data('month') + '/' + $(this).data('year')
                    );

                    const [startDateDate, startDateMonth, startDateYear] =
                        getElementsOfDate(startDate);
                    if (
                        (month2 < startDateMonth && startDateYear > year2) ||
                        (month2 === startDateMonth && date2 < startDateDate)
                    ) {
                        toast.error('🦄 Không thể chọn ngày bé hơn ngày bắt đầu!', {
                            position: 'top-center',
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        return false;
                    }

                    $(this).addClass('checked');
                    endDate = '';
                    endDate +=
                        $(this).text() + '/' + $(this).data('month') + '/' + $(this).data('year');
                    haveEndDate = true;

                    hightlightBetween(startDate, endDate);
                    if (displayStartDateAndEndDate) displayStartDateAndEndDate(startDate, endDate);
                    if (setCheckInAndOutDate) setCheckInAndOutDate(startDate, endDate);
                }
            });
        });
    }

    async function fetchTheNextCoupleOfMonth(
        firstMonthAndYear: JQuery<HTMLElement>,
        secondMonthAndYear: JQuery<HTMLElement>,
        month: number,
        year: number
    ) {
        let secondMonth;
        let copyMonth;
        let copyYear;

        if (month === 11) {
            secondMonth = await fetchDaysInMonth(0, year + 1);
            firstMonthAndYear.html(`Tháng 12 năm ${year}`);
            secondMonthAndYear.html(`Tháng 1 năm ${year + 1}`);

            copyMonth = 12;
            copyYear = year;
        } else if (month === 12) {
            secondMonth = await fetchDaysInMonth(1, year + 1);
            firstMonthAndYear.html(`Tháng 1 năm ${year + 1}`);
            secondMonthAndYear.html(`Tháng 2 năm ${year + 1}`);

            copyMonth = 1;
            copyYear = year + 1;
        } else {
            secondMonth = await fetchDaysInMonth(month + 1, year);
            firstMonthAndYear.html(`Tháng ${month * 1 + 1} năm ${year}`);
            secondMonthAndYear.html(`Tháng ${month * 1 + 2} năm ${year}`);

            copyMonth = month * 1 + 1;
            copyYear = year;
        }

        let decidedMonth = 0;
        let dicidedYear = 0;
        if (copyMonth === 12) {
            decidedMonth = 1;
            dicidedYear = copyYear + 1;
        } else if (copyMonth === 1) decidedMonth = 2;
        else decidedMonth = copyMonth + 1;

        const firstMonth = await fetchDaysInMonth(month, year);

        const rdt_calender__days = $('.rdt_calender__days').first();
        const rdt_calender__days_plus__1 = $('.rdt_calender__days_plus-1').first();
        let daysInMonthJs2;
        const daysInMonthJs1 = getDaysInMonth(firstMonth.daysInMonth, copyMonth, copyYear);
        if (copyMonth === 12) {
            daysInMonthJs2 = getDaysInMonth(secondMonth.daysInMonth, decidedMonth, copyYear + 1);
        } else daysInMonthJs2 = getDaysInMonth(secondMonth.daysInMonth, decidedMonth, copyYear);

        rdt_calender__days.empty();
        rdt_calender__days_plus__1.empty();

        daysInMonthJs1.forEach(day => {
            rdt_calender__days.append(day);
        });
        daysInMonthJs2.forEach(day => {
            rdt_calender__days_plus__1.append(day);
        });

        addClickEventForDay();
        if (lockBookedDatesInCalendar) lockBookedDatesInCalendar();
    }

    function removeBetweenClass() {
        $('.dayInWeek.false').each(function () {
            if ($(this).hasClass('between')) $(this).removeClass('between');
        });

        /* Hide start date and end date */
        $('#fromDayToDayContainer').css('display', 'none');
        $('#beforeEndDateContainer').css('display', 'block');
        $('#numberOfDaysContainer').css('display', 'none');
        $('#numberOfDaysContainer').siblings('div').css('display', 'block');
        $('.previewPrice-line').css('display', 'none');
        $('#checkinDate').text(startDate);
        $('#checkoutDate').text(endDate);
    }

    function hightlightBetween(startDateArgs: string, endDateArgs: string) {
        const [startDateDate, startDateMonth, startDateYear] = getElementsOfDate(startDateArgs);
        const [endDateDate, endDateMonth, endDateYear] = getElementsOfDate(endDateArgs);
        let howManyDays = 0;

        $('.dayInWeek.false').each(function () {
            const [currDate, currMonth, currYear] = getElementsOfDate(
                $(this).text() + '/' + $(this).data('month') + '/' + $(this).data('year')
            );
            let work = false;

            if (currMonth === startDateMonth && currMonth === endDateMonth) {
                if (
                    currDate > startDateDate &&
                    currDate < endDateDate &&
                    currMonth >= startDateMonth &&
                    currMonth <= endDateMonth &&
                    currYear >= startDateYear &&
                    currYear <= endDateYear
                ) {
                    $(this).addClass('between');
                    work = true;
                    howManyDays++;
                }
            }
            if (startDateMonth !== endDateMonth) {
                if (currMonth === startDateMonth) {
                    if (currDate > startDateDate) {
                        $(this).addClass('between');
                        work = true;
                        howManyDays++;
                    }
                } else if (currMonth === endDateMonth) {
                    if (currDate < endDateDate) {
                        $(this).addClass('between');
                        work = true;
                        howManyDays++;
                    }
                } else {
                    if (currMonth > startDateMonth && currMonth < endDateMonth) {
                        $(this).addClass('between');
                        work = true;
                        howManyDays++;
                    }
                }
            }

            if (!work) $(this).removeClass('between');
        });

        if (displayStartDateAndEndDate) displayStartDateAndEndDate(startDate, endDate);
        if (setCheckInAndOutDate) setCheckInAndOutDate(startDate, endDate);
        if (displayNumberOfDays) displayNumberOfDays(howManyDays);
    }

    function setStartDate(
        self: JQuery<HTMLElement>,
        startDateDate: number,
        startDateMonth: number,
        startDateYear: number,
        currDate: number,
        currMonth: number,
        currYear: number
    ) {
        const _self = $(self);
        $('.dayInWeek.false').each(function () {
            if (
                parseInt($(this).text()) === startDateDate &&
                parseInt($(this).data('month')) === startDateMonth &&
                parseInt($(this).data('year')) === startDateYear &&
                $(this).hasClass('checked')
            ) {
                $(this).removeClass('checked');
            }
        });
        _self.addClass('checked');
        startDate = '';
        startDate = currDate + '/' + currMonth + '/' + currYear;
        haveStartDate = true;
        console.log('start date', startDate);

        hightlightBetween(startDate, endDate);
    }

    function setEndDate(
        self: JQuery<HTMLElement>,
        endDateDate: number,
        endDateMonth: number,
        endDateYear: number,
        currDate: number,
        currMonth: number,
        currYear: number
    ) {
        const _self = $(self);
        $('.dayInWeek.false').each(function () {
            if (
                parseInt($(this).text()) === endDateDate &&
                parseInt($(this).data('month')) === endDateMonth &&
                parseInt($(this).data('year')) === endDateYear &&
                $(this).hasClass('checked')
            ) {
                $(this).removeClass('checked');
            }
        });
        _self.addClass('checked');
        endDate = '';
        endDate = currDate + '/' + currMonth + '/' + currYear;
        haveEndDate = true;
        console.log('end date', endDate);

        hightlightBetween(startDate, endDate);
    }

    function getDaysInMonth(daysInMonth: string, month: number, year: number) {
        const date = new Date();
        let daysInMonthJs: string[] = [];
        let weeks = daysInMonth.split('*');

        weeks.forEach(week => {
            daysInMonthJs.push('<tbody class="calendar"><tr>');
            const weekArray = week.trim().split(' ');
            weekArray.forEach((dayInWeek: string) => {
                if (dayInWeek === '') {
                } else if (dayInWeek.trim() !== '_') {
                    let isBlocked = false;

                    if (month < date.getMonth() + 1 && year <= date.getFullYear()) isBlocked = true;
                    else if (month === date.getMonth() + 1 && parseInt(dayInWeek) < date.getDate())
                        isBlocked = true;
                    else {
                        const dateThis =
                            (dayInWeek.length === 1 ? `0${dayInWeek}` : dayInWeek) +
                            '/' +
                            (month.toString().length === 1 ? `0${month}` : month) +
                            '/' +
                            year;

                        if (bookedDates)
                            bookedDates.forEach(
                                ({
                                    checkinDate,
                                    checkoutDate,
                                }: {
                                    checkinDate: string;
                                    checkoutDate: string;
                                }) => {
                                    if (checkinDate === dateThis || dateThis === checkoutDate) {
                                        isBlocked = true;
                                    }
                                }
                            );
                    }

                    const dayInHtml = `<td><div data-is-blocked="${false}" data-month="${month}" data-year="${year}" class="dayInWeek ${
                        isBlocked && 'block__date'
                    }">${dayInWeek.trim()}</div></td>`;
                    daysInMonthJs.push(dayInHtml);
                } else if (dayInWeek.trim() === '_') {
                    const dayInHtml = `<td></td>`;
                    daysInMonthJs.push(dayInHtml);
                }
            });
            daysInMonthJs.push('</tr></tbody>');
        });
        return daysInMonthJs;
    }

    return (
        <div className='rdt_calender__header'>
            <div className='flex' style={{ alignItems: 'flex-start' }}>
                <Month
                    imageSrc={getImage('/svg/close3.svg')}
                    buttonClassName='getThePrevTwoMonth'
                    titleClassName='firstMonthAndYear'
                    tableClassName='rdt_calender__days'
                />
                <Month
                    imageSrc={getImage('/svg/nextMonth.svg')}
                    buttonClassName='getTheNextTwoMonth'
                    titleClassName='secondMonthAndYear'
                    tableClassName='rdt_calender__days_plus-1'
                />
                <ToastContainer
                    position='top-center'
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />
            </div>
        </div>
    );
};

export default Calendar;
