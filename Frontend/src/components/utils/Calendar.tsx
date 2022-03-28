import { FC, useEffect } from 'react';
import { getImage, callToast } from '../../helpers';
import Month from './Month';
import axios from '../../axios';
import $ from 'jquery';
import { ToastContainer } from 'react-toastify';
import { IBookedDate } from '../../types/room/type_RoomDetails';

interface ICalendarProps {
    displayStartDateAndEndDate?: Function;
    setCheckInAndOutDate?: Function;
    displayNumberOfDays?: Function;
    lockBookedDatesInCalendar?: Function;
    bookedDates?: IBookedDate[];
    cleanCalendar?: boolean;
    setCleanCalendar?: React.Dispatch<React.SetStateAction<boolean>>;
    resetCheckoutDate?: boolean;
    setResetCheckoutDate?: React.Dispatch<React.SetStateAction<boolean>>;
    resetChangeBookingDateBox?: Function;
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
    cleanCalendar = false,
    setCleanCalendar,
    resetCheckoutDate = false,
    setResetCheckoutDate,
    resetChangeBookingDateBox,
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

    async function sadf(
        firstMonthAndYear: JQuery<HTMLElement>,
        secondMonthAndYear: JQuery<HTMLElement>
    ) {
        await fetchTheNextTwoMonths(firstMonthAndYear, secondMonthAndYear, month, year);
    }

    useEffect(() => {
        console.log('called');

        firstMonthAndYear = $('.firstMonthAndYear').first();
        secondMonthAndYear = $('.secondMonthAndYear').first();
        sadf(firstMonthAndYear, secondMonthAndYear);

        if (firstMonthAndYear && secondMonthAndYear) {
            $('.getTheNextTwoMonths')
                .off('click')
                .on('click', async function () {
                    const currentFirstMonthInCalendar = secondMonthAndYear.text().split(' ')[1];
                    const currentYearInCalendar = secondMonthAndYear.text().split(' ')[3];

                    await fetchTheNextTwoMonths(
                        firstMonthAndYear,
                        secondMonthAndYear,
                        parseInt(currentFirstMonthInCalendar),
                        parseInt(currentYearInCalendar)
                    );
                });

            $('.getThePreviousTwoMonths')
                .off('click')
                .on('click', async function () {
                    const currentFirstMonthInCalendar = secondMonthAndYear.text().split(' ')[1];
                    const currentYearInCalendar = secondMonthAndYear.text().split(' ')[3];

                    await fetchThePreviousTwoMonths(
                        firstMonthAndYear,
                        secondMonthAndYear,
                        parseInt(currentFirstMonthInCalendar),
                        parseInt(currentYearInCalendar)
                    );
                });
        }
    }, []);

    useEffect(() => {
        if (cleanCalendar) {
            $('.dayInWeek.false').filter('.checked').last().trigger('click');
            $('.dayInWeek.false').filter('.checked').first().trigger('click');
            if (setCleanCalendar) setCleanCalendar(false);
        }
    }, [cleanCalendar]);

    useEffect(() => {
        if (resetCheckoutDate) {
            $('.dayInWeek.false').filter('.checked').last().trigger('click');
            if (setResetCheckoutDate) setResetCheckoutDate(false);
        }
    }, [resetCheckoutDate]);

    const fetchDatesInMonth = async (month: number, year: number) => {
        const {
            data: { daysInMonth, startInWeek },
        } = await axios.get(`/calendar/${month + 1}/${year}`);
        return Promise.resolve({ daysInMonth, startInWeek });
    };

    async function fetchThePreviousTwoMonths(
        firstMonthAndYear: JQuery<HTMLElement>,
        secondMonthAndYear: JQuery<HTMLElement>,
        monthOfSecondMonth: number,
        yearOfSecondYear: number
    ) {
        let secondMonth;
        let monthOfFirstMonth;
        let yearOfFirstMonth;

        if (monthOfSecondMonth === 1) {
            secondMonth = await fetchDatesInMonth(10, yearOfSecondYear - 1);
            firstMonthAndYear.text(`Tháng 10 năm ${yearOfSecondYear - 1}`);
            secondMonthAndYear.text(`Tháng 11 năm ${yearOfSecondYear - 1}`);

            monthOfFirstMonth = 10;
            yearOfFirstMonth = yearOfSecondYear - 1;
        } else if (monthOfSecondMonth === 2) {
            secondMonth = await fetchDatesInMonth(11, yearOfSecondYear - 1);
            firstMonthAndYear.text(`Tháng 11 năm ${yearOfSecondYear - 1}`);
            secondMonthAndYear.text(`Tháng 12 năm ${yearOfSecondYear - 1}`);

            monthOfFirstMonth = 11;
            yearOfFirstMonth = yearOfSecondYear - 1;
        } else if (monthOfSecondMonth === 3) {
            secondMonth = await fetchDatesInMonth(1, yearOfSecondYear);
            firstMonthAndYear.text(`Tháng 12 năm ${yearOfSecondYear - 1}`);
            secondMonthAndYear.text(`Tháng 1 năm ${yearOfSecondYear}`);

            monthOfFirstMonth = 12;
            yearOfFirstMonth = yearOfSecondYear - 1;
        } else {
            secondMonth = await fetchDatesInMonth(monthOfSecondMonth - 3, yearOfSecondYear);
            firstMonthAndYear.text(`Tháng ${monthOfSecondMonth - 3} năm ${yearOfSecondYear}`);
            secondMonthAndYear.text(`Tháng ${monthOfSecondMonth - 2} năm ${yearOfSecondYear}`);

            monthOfFirstMonth = monthOfSecondMonth - 3;
            yearOfFirstMonth = yearOfSecondYear;
        }

        const firstMonth = await fetchDatesInMonth(monthOfFirstMonth - 1, yearOfFirstMonth);
        t(monthOfFirstMonth, yearOfFirstMonth, firstMonth, secondMonth);
    }

    function t(
        monthOfFirstMonth: number,
        yearOfFirstMonth: number,
        firstMonth: {
            daysInMonth: any;
            startInWeek: any;
        },
        secondMonth: {
            daysInMonth: any;
            startInWeek: any;
        }
    ) {
        const monthDates = $('#month__dates').first();
        const monthDatesNext = $('#month__dates--next').first();

        let decidedMonth = 0;
        if (monthOfFirstMonth === 12) decidedMonth = 1;
        else if (monthOfFirstMonth === 1) decidedMonth = 2;
        else decidedMonth = monthOfFirstMonth + 1;

        const daysInMonthJs1 = getDatesInMonth(
            firstMonth.daysInMonth,
            monthOfFirstMonth,
            yearOfFirstMonth
        );
        const daysInMonthJs2 = getDatesInMonth(
            secondMonth.daysInMonth,
            decidedMonth,
            yearOfFirstMonth
        );

        monthDates.empty();
        monthDatesNext.empty();

        daysInMonthJs1.forEach(day => {
            monthDates.append(day);
        });
        daysInMonthJs2.forEach(day => {
            monthDatesNext.append(day);
        });

        addClickEventForDay();
        if (lockBookedDatesInCalendar) lockBookedDatesInCalendar();

        startDate = '';
        endDate = '';
        haveStartDate = false;
        haveEndDate = false;
    }

    function addClickEventForDay() {
        $('.dayInWeek.false').each(function () {
            $(this)
                .off('click')
                .on('click', function () {
                    console.log('------------------------');
                    console.log('start date:', startDate);
                    console.log('have sd: ', haveStartDate);
                    console.log('have ed: ', haveEndDate);

                    if (!haveStartDate && !haveEndDate) {
                        $(this).addClass('checked');
                        startDate +=
                            $(this).text() +
                            '/' +
                            $(this).data('month') +
                            '/' +
                            $(this).data('year');
                        haveStartDate = true;
                    } else if (haveStartDate && !haveEndDate && $(this).hasClass('checked')) {
                        $(this).removeClass('checked');
                        startDate = '';
                        haveStartDate = false;
                        removeBetweenClass();
                        if (resetChangeBookingDateBox) resetChangeBookingDateBox();
                    } else if (!haveStartDate && haveEndDate && $(this).hasClass('checked')) {
                        $(this).removeClass('checked');
                        endDate = '';
                        haveEndDate = false;
                        removeBetweenClass();
                        if (resetChangeBookingDateBox) resetChangeBookingDateBox();
                    } else if (haveStartDate && haveEndDate && $(this).hasClass('checked')) {
                        let mills1 = 0,
                            mills2 = 0,
                            mills3 = 0;
                        const firstCheckedDate = $('.dayInWeek.false').filter('.checked').first();
                        const lastCheckedDate = $('.dayInWeek.false').filter('.checked').last();

                        mills1 = new Date(
                            parseInt(firstCheckedDate.data('year')),
                            parseInt(firstCheckedDate.data('month')) - 1,
                            parseInt(firstCheckedDate.text())
                        ).getTime();

                        mills2 = new Date(
                            lastCheckedDate.data('year'),
                            lastCheckedDate.data('month') - 1,
                            parseInt(lastCheckedDate.text())
                        ).getTime();

                        mills3 = new Date(
                            $(this).data('year'),
                            $(this).data('month') - 1,
                            parseInt($(this).text())
                        ).getTime();

                        if (mills1 === mills3) {
                            console.log('true');
                            startDate = '';
                            haveStartDate = false;
                        }

                        if (mills2 === mills3) {
                            endDate = '';
                            haveEndDate = false;
                        }

                        $(this).removeClass('checked');
                    } else if (haveStartDate && haveEndDate) {
                        console.log('go continue');
                        const [currDate, currMonth, currYear] = getElementsOfDate(
                            $(this).text() +
                                '/' +
                                $(this).data('month') +
                                '/' +
                                $(this).data('year')
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
                            $(this).text() +
                                '/' +
                                $(this).data('month') +
                                '/' +
                                $(this).data('year')
                        );

                        const [startDateDate, startDateMonth, startDateYear] =
                            getElementsOfDate(startDate);
                        if (
                            (month2 < startDateMonth && year2 === startDateYear) ||
                            year2 < startDateYear ||
                            (month2 === startDateMonth && date2 < startDateDate)
                        ) {
                            callToast('error', 'Không thể chọn ngày bé hơn ngày bắt đầu!');

                            return false;
                        }

                        $(this).addClass('checked');
                        endDate = '';
                        endDate +=
                            $(this).text() +
                            '/' +
                            $(this).data('month') +
                            '/' +
                            $(this).data('year');
                        haveEndDate = true;

                        hightlightBetween(startDate, endDate);
                        if (displayStartDateAndEndDate)
                            displayStartDateAndEndDate(startDate, endDate);
                    }
                });
        });
    }

    function setMonthTitle(
        firstMonthAndYear: JQuery<HTMLElement>,
        secondMonthAndYear: JQuery<HTMLElement>,
        firstMonthTitle: string,
        secondMonthTitle: string
    ) {
        firstMonthAndYear.text(firstMonthTitle);
        secondMonthAndYear.text(secondMonthTitle);
    }

    async function fetchTheNextTwoMonths(
        firstMonthAndYear: JQuery<HTMLElement>,
        secondMonthAndYear: JQuery<HTMLElement>,
        monthOfSecondMonth: number,
        yearOfSecondYear: number
    ) {
        let secondMonth;
        let monthOfFirstMonth;
        let yearOfFirstMonth;

        if (monthOfSecondMonth === 11) {
            //if second month is Nov, next first month is Dec of current year and next second month is Jan of the next year
            secondMonth = await fetchDatesInMonth(0, yearOfSecondYear + 1);
            setMonthTitle(
                firstMonthAndYear,
                secondMonthAndYear,
                `Tháng 12 năm ${yearOfSecondYear}`,
                `Tháng 1 năm ${yearOfSecondYear + 1}`
            );

            monthOfFirstMonth = 12;
            yearOfFirstMonth = yearOfSecondYear;
        } else if (monthOfSecondMonth === 12) {
            //if second month is Dec
            //next first month is Jan of the next year, and second woule be Feb of the next year.
            secondMonth = await fetchDatesInMonth(1, yearOfSecondYear + 1);
            setMonthTitle(
                firstMonthAndYear,
                secondMonthAndYear,
                `Tháng 1 năm ${yearOfSecondYear + 1}`,
                `Tháng 2 năm ${yearOfSecondYear + 1}`
            );

            monthOfFirstMonth = 1;
            yearOfFirstMonth = yearOfSecondYear + 1;
        } else {
            secondMonth = await fetchDatesInMonth(monthOfSecondMonth + 1, yearOfSecondYear);

            setMonthTitle(
                firstMonthAndYear,
                secondMonthAndYear,
                `Tháng ${monthOfSecondMonth + 1} năm ${yearOfSecondYear}`,
                `Tháng ${monthOfSecondMonth + 2} năm ${yearOfSecondYear}`
            );

            monthOfFirstMonth = monthOfSecondMonth + 1;
            yearOfFirstMonth = yearOfSecondYear;
        }

        const firstMonth = await fetchDatesInMonth(monthOfSecondMonth, yearOfSecondYear);
        t(monthOfFirstMonth, yearOfFirstMonth, firstMonth, secondMonth);
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
        if (setCheckInAndOutDate) setCheckInAndOutDate(startDate, endDate, howManyDays + 2);
        if (displayNumberOfDays) displayNumberOfDays(howManyDays, startDate, endDate);
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

    function getDatesInMonth(daysInMonth: string, month: number, year: number) {
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
                    if (
                        year < date.getFullYear() ||
                        (month < date.getMonth() + 1 && year === date.getFullYear()) ||
                        (month === date.getMonth() + 1 && parseInt(dayInWeek) < date.getDate())
                    )
                        isBlocked = true;
                    else {
                        const dateThis =
                            (dayInWeek.length === 1 ? `0${dayInWeek}` : dayInWeek) +
                            '/' +
                            (month.toString().length === 1 ? `0${month}` : month) +
                            '/' +
                            year;

                        if (bookedDates)
                            bookedDates.forEach(({ checkinDate, checkoutDate }: IBookedDate) => {
                                if (checkinDate === dateThis || dateThis === checkoutDate) {
                                    isBlocked = true;
                                }
                            });
                    }

                    const dayInHtml = `<td><div data-is-blocked="${false}" data-month="${month}" data-year="${year}" class="dayInWeek ${
                        isBlocked && 'block__date'
                    }">${dayInWeek.trim()}</div></td>`;
                    daysInMonthJs.push(dayInHtml);
                } else if (dayInWeek.trim() === '_') daysInMonthJs.push('<td></td>');
            });
            daysInMonthJs.push('</tr></tbody>');
        });
        return daysInMonthJs;
    }

    return (
        <div className='rdt_calender__header' style={{ minHeight: '375px' }}>
            <div className='flex' style={{ alignItems: 'flex-start' }}>
                <Month
                    imageSrc={getImage('/svg/close3.svg')}
                    buttonClassName='getThePreviousTwoMonths'
                    titleClassName='firstMonthAndYear'
                    tableClassName='month__dates'
                />
                <Month
                    imageSrc={getImage('/svg/nextMonth.svg')}
                    buttonClassName='getTheNextTwoMonths'
                    titleClassName='secondMonthAndYear'
                    tableClassName='month__dates--next'
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
