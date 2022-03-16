const active = 'active';
let haveStartDate = false;
let haveEndDate = false;
let startDate = '';
let endDate = '';

$(document).ready(async function () {
    getRoomlocation();
    const date = new Date();
    const month = date.getMonth();
    const year = date.getFullYear();

    const closeShowImgBtn = $('#closeShowImgBtn');
    closeShowImgBtn.click(function () {
        toggleHiddenImages();
    });

    const firstMonthAndYear = $('.firstMonthAndYear').first();
    const secondMonthAndYear = $('.secondMonthAndYear').first();
    const getTheNextTwoMonth = $('.getTheNextTwoMonth').first();

    await fetchTheNextCoupleOfMonth(firstMonthAndYear, secondMonthAndYear, month, year);

    getTheNextTwoMonth.on('click', async function () {
        const currentFirstMonthInCalendar = secondMonthAndYear.text().split(' ')[1];
        const currentYearInCalendar = secondMonthAndYear.text().split(' ')[3];

        await fetchTheNextCoupleOfMonth(
            firstMonthAndYear,
            secondMonthAndYear,
            currentFirstMonthInCalendar * 1,
            currentYearInCalendar * 1
        );
    });

    $('.getThePrevTwoMonth').click(async function () {
        const currentFirstMonthInCalendar = secondMonthAndYear.text().split(' ')[1];
        const currentYearInCalendar = secondMonthAndYear.text().split(' ')[3];

        await fetchThePrevCoupleOfMonth(
            firstMonthAndYear,
            secondMonthAndYear,
            currentFirstMonthInCalendar * 1,
            currentYearInCalendar * 1
        );
    });

    let isClicked = false;
    const navMenu = $('.loginAndLogoutHidden').first();
    $('.account__button')
        .first()
        .click(function () {
            if (!isClicked) {
                navMenu.addClass('active');
                isClicked = true;
            } else {
                navMenu.removeClass('active');
                isClicked = false;
            }
        });

    addClickEventForLoveButton(wishlists, user);
    updateRatingUI();
});

function displayStartDateAndEndDate(startDateArgs, endDateArgs) {
    $('#fromDayToDayContainer').css('display', 'block');
    $('#beforeEndDateContainer').css('display', 'none');
    $('#fromDay').text(startDateArgs);
    $('#toDay').text(endDateArgs);
}

function setCheckInAndOutDate(startDateArgs, endDateArgs) {
    $('#checkinDate').text(startDateArgs);
    $('#checkoutDate').text(endDateArgs);
}

function displayNumberOfDays(manyDays) {
    $('#numberOfDaysContainer').css('display', 'block');
    $('#numberOfDaysContainer').siblings('div').css('display', 'none');
    $('#daysAtHere').text(manyDays + 2);
    $('#numberOfNight').text(manyDays + 2);
    displayPreviewLine();
    setTotalPrice(manyDays + 2);
}

function setTotalPrice(manyDays) {
    manyDays *= 1;

    const totalRoomPrice = roomPrice * manyDays;
    console.log(totalRoomPrice);
    const siteFee = totalRoomPrice * 0.05;

    console.log(siteFee);
    totalPrice = totalRoomPrice + siteFee;

    $('#totalPrice').text(seperateNumber(manyDays * roomPrice));
    $('#siteFee').text(seperateNumber(Math.ceil(siteFee)));
    $('#finalTotalPrice').text(seperateNumber(Math.ceil(totalPrice)));
}

function displayPreviewLine() {
    $('.previewPrice-line').css('display', 'block');
    $('.previewPrice-line').last().css('border-bottom', '1px solid rgb(211,211,211)');
}

function getElementsOfDate(date) {
    return [date.split('/')[0] * 1, date.split('/')[1] * 1, date.split('/')[2] * 1];
}

function addBlockClassAndRemoveClick(self) {
    self.addClass('block__date');
    self.removeClass('false');
}

function blockBetween(startDateArgs, endDateArgs) {
    const [startDateDate, startDateMonth, startDateYear] = getElementsOfDate(startDateArgs);
    const [endDateDate, endDateMonth, endDateYear] = getElementsOfDate(endDateArgs);

    $('.dayInWeek.false').each(function () {
        const [currDate, currMonth, currYear] = getElementsOfDate(
            $(this).text() + '/' + $(this).data('month') + '/' + $(this).data('year')
        );

        if (currMonth === startDateMonth && currMonth === endDateMonth) {
            if (
                currDate > startDateDate &&
                currDate < endDateDate &&
                currMonth >= startDateMonth &&
                currMonth <= endDateMonth &&
                currYear >= startDateYear &&
                currYear <= endDateYear
            ) {
                addBlockClassAndRemoveClick($(this));
            }
        }
        if (startDateMonth !== endDateMonth) {
            if (currMonth === startDateMonth) {
                if (currDate > startDateDate) {
                    addBlockClassAndRemoveClick($(this));
                }
            } else if (currMonth === endDateMonth) {
                if (currDate < endDateDate) {
                    addBlockClassAndRemoveClick($(this));
                }
            } else {
                if (currMonth > startDateMonth && currMonth < endDateMonth) {
                    addBlockClassAndRemoveClick($(this));
                }
            }
        }
    });
}

function hightlightBetween(startDateArgs, endDateArgs) {
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
    displayStartDateAndEndDate(startDate, endDate);
    setCheckInAndOutDate(startDate, endDate);
    displayNumberOfDays(howManyDays);
}

function setStartDate(
    self,
    startDateDate,
    startDateMonth,
    startDateYear,
    currDate,
    currMonth,
    currYear
) {
    const _self = $(self);
    $('.dayInWeek.false').each(function () {
        if (
            $(this).text() * 1 === startDateDate &&
            $(this).data('month') * 1 === startDateMonth &&
            $(this).data('year') * 1 === startDateYear &&
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

function setEndDate(self, endDateDate, endDateMonth, endDateYear, currDate, currMonth, currYear) {
    const _self = $(self);
    $('.dayInWeek.false').each(function () {
        if (
            $(this).text() * 1 === endDateDate &&
            $(this).data('month') * 1 === endDateMonth &&
            $(this).data('year') * 1 === endDateYear &&
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

function processBooking() {
    if (startDate === '' && endDate === '') {
        alertify.warning('Vui lòng chọn ngày bắt đầu và kết thúc');
        return;
    }
    if (user === null) {
        alertify.error('Vui lòng đăng nhập để đặt phòng');
        return;
    }

    const numberOfNights = $('#numberOfNight').text();
    window.location.href = `${baseURL}booking/${roomId}?checkin=${startDate.replace(
        /\//g,
        '-'
    )}&checkout=${endDate.replace(/\//g, '-')}&numberOfNights=${numberOfNights}`;
}

async function fetchThePrevCoupleOfMonth(firstMonthAndYear, secondMonthAndYear, month, year) {
    let secondMonth;
    let copyMonth;
    let copyYear;

    if (month === 1) {
        secondMonth = await fetchDaysInMonth(10, year - 1);
        firstMonthAndYear.html(`Tháng 10 năm ${year - 1}`);
        secondMonthAndYear.html(`Tháng 11 năm ${year - 1}`);

        copyMonth = 10;
        copyYear = year - 1;
    } else if (month === 2) {
        secondMonth = await fetchDaysInMonth(11, year - 1);
        firstMonthAndYear.html(`Tháng 11 năm ${year - 1}`);
        secondMonthAndYear.html(`Tháng 12 năm ${year - 1}`);

        copyMonth = 11;
        copyYear = year - 1;
    } else if (month === 3) {
        secondMonth = await fetchDaysInMonth(1, year);
        firstMonthAndYear.html(`Tháng 12 năm ${year - 1}`);
        secondMonthAndYear.html(`Tháng 1 năm ${year}`);

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
    bookedDates.forEach(({ checkinDate, checkoutDate }) => {
        blockBetween(checkinDate, checkoutDate);
    });
}

async function fetchTheNextCoupleOfMonth(firstMonthAndYear, secondMonthAndYear, month, year) {
    let secondMonth;
    let copyMonth;
    let copyYear;

    console.log(month);

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
    bookedDates.forEach(({ checkinDate, checkoutDate }) => {
        blockBetween(checkinDate, checkoutDate);
    });
}

const fetchDaysInMonth = async (month, year) => {
    const {
        data: { daysInMonth, startInWeek },
    } = await axios.get(`${baseURL}calendar/${month + 1}/${year}`);
    return Promise.resolve({ daysInMonth, startInWeek });
};

function getDaysInMonth(daysInMonth, month, year) {
    const date = new Date();
    let daysInMonthJs = [];
    let weeks = daysInMonth.split('*');

    weeks.forEach(week => {
        daysInMonthJs.push('<tbody><tr>');
        const weekArray = week.trim().split(' ');
        weekArray.forEach(dayInWeek => {
            if (dayInWeek === '') {
            } else if (dayInWeek.trim() !== '_') {
                let isBlocked = false;

                if (month < date.getMonth() + 1 && year <= date.getFullYear()) isBlocked = true;
                else if (month === date.getMonth() + 1 && dayInWeek < date.getDate())
                    isBlocked = true;
                else {
                    const dateThis =
                        (dayInWeek.length === 1 ? `0${dayInWeek}` : dayInWeek) +
                        '/' +
                        (month.length === 1 ? `0${month}` : month) +
                        '/' +
                        year;
                    bookedDates.forEach(({ checkinDate, checkoutDate }) => {
                        if (checkinDate === dateThis || dateThis === checkoutDate) {
                            isBlocked = true;
                        }
                    });
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

function toggleHiddenImages() {
    const hiddenSlider = $('.rdt_hidden').first();
    const fullScreen = $('.rdt__fullScreen').first();
    if (hiddenSlider.hasClass('show')) {
        hiddenSlider.removeClass('show');
    } else {
        hiddenSlider.addClass('show');
    }
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

function addClickEventForDay() {
    $('.dayInWeek.false').each(function () {
        $(this).click(function () {
            if (!haveStartDate && !haveEndDate) {
                $(this).addClass('checked');
                startDate +=
                    $(this).text() + '/' + $(this).data('month') + '/' + $(this).data('year');
                haveStartDate = true;
            } else if (haveStartDate && !haveEndDate && $(this).hasClass('checked')) {
                $(this).removeClass('checked');
                startDate = '';
                haveStartDate = false;
                removeBetweenClass();
            } else if (!haveStartDate && haveEndDate && $(this).hasClass('checked')) {
                $(this).removeClass('checked');
                endDate = '';
                haveEndDate = false;
                removeBetweenClass();
            } else if (haveStartDate && haveEndDate && $(this).hasClass('checked')) {
                $(this).removeClass('checked');
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
                    startDate = '';
                    haveStartDate = false;
                }
                if (mills2 === mills3) {
                    endDate = '';
                    haveEndDate = false;
                }

                $(this).removeClass('checked');
            } else if (haveStartDate && haveEndDate) {
                const [currDate, currMonth, currYear] = getElementsOfDate(
                    $(this).text() + '/' + $(this).data('month') + '/' + $(this).data('year')
                );

                const [startDateDate, startDateMonth, startDateYear] = getElementsOfDate(startDate);
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

                const [startDateDate, startDateMonth, startDateYear] = getElementsOfDate(startDate);
                if (
                    (month2 < startDateMonth && year2 === startDateYear) ||
                    year2 < startDateYear ||
                    (month2 === startDateMonth && date2 < startDateDate)
                ) {
                    alertify.error('Không thể chọn ngày bé hơn ngày bắt đầu');
                    return false;
                }

                $(this).addClass('checked');
                endDate = '';
                endDate +=
                    $(this).text() + '/' + $(this).data('month') + '/' + $(this).data('year');
                haveEndDate = true;

                hightlightBetween(startDate, endDate);
                displayStartDateAndEndDate(startDate, endDate);
                setCheckInAndOutDate(startDate, endDate);
            }
        });
    });
}

function updateRatingUI() {
    let cleanliness = 0;
    let contact = 0;
    let checkin = 0;
    let accuracy = 0;
    let location = 0;
    let value = 0;

    const cleanlinessRating = $('.cleanliness-rating');
    const contactRating = $('.contact-rating');
    const checkinRating = $('.checkin-rating');
    const accuracyRating = $('.accuracy-rating');
    const locationRating = $('.location-rating');
    const valueRating = $('.value-rating');

    cleanlinessRating.each(function () {
        cleanliness += $(this).val() * 1;
    });
    contactRating.each(function () {
        contact += $(this).val() * 1;
    });
    checkinRating.each(function () {
        checkin += $(this).val() * 1;
    });
    accuracyRating.each(function () {
        accuracy += $(this).val() * 1;
    });
    locationRating.each(function () {
        location += $(this).val() * 1;
    });
    valueRating.each(function () {
        value += $(this).val() * 1;
    });

    cleanliness /= cleanlinessRating.length || 1;
    contact /= contactRating.length || 1;
    checkin /= checkinRating.length || 1;
    accuracy /= accuracyRating.length || 1;
    location /= locationRating.length || 1;
    value /= valueRating.length || 1;

    $('#cleanlinessRating').css('width', `${(cleanliness / 5) * 100}%`);
    $('#contactRating').css('width', `${(contact / 5) * 100}%`);
    $('#checkinRating').css('width', `${(checkin / 5) * 100}%`);
    $('#accuracyRating').css('width', `${(accuracy / 5) * 100}%`);
    $('#locationRating').css('width', `${(location / 5) * 100}%`);
    $('#valueRating').css('width', `${(value / 5) * 100}%`);

    $('#averageCleanlinessRating').text(cleanliness);
    $('#averageContactRating').text(contact);
    $('#averageCheckinRating').text(checkin);
    $('#averageAccuracyRating').text(accuracy);
    $('#averageLocationRating').text(location);
    $('#averageValueRating').text(value);
}
