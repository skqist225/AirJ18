import { FC } from 'react';
import { seperateNumber } from '../../helpers';
import { IRoomDetails } from '../../types/room/type_RoomDetails';
import Calendar, { getElementsOfDate } from '../utils/Calendar';

import $ from 'jquery';

interface IBookingCalendarProps {
    room: IRoomDetails;
}

const BookingCalendar: FC<IBookingCalendarProps> = ({ room }) => {
    function displayStartDateAndEndDate(startDateArgs: string, endDateArgs: string) {
        $('#fromDayToDayContainer').css('display', 'block');
        $('#beforeEndDateContainer').css('display', 'none');
        $('#fromDay').text(startDateArgs);
        $('#toDay').text(endDateArgs);
    }

    function setCheckInAndOutDate(startDateArgs: string, endDateArgs: string) {
        $('#checkinDate').text(startDateArgs);
        $('#checkoutDate').text(endDateArgs);
    }

    function displayNumberOfDays(manyDays: number) {
        $('#numberOfDaysContainer').css('display', 'block');
        $('#numberOfDaysContainer').siblings('div').css('display', 'none');
        $('#daysAtHere').text(manyDays + 2);
        $('#numberOfNight').text(manyDays + 2);
        displayPreviewLine();
        setTotalPrice(manyDays + 2, room!.price);
    }

    function setTotalPrice(manyDays: any, roomPrice: number) {
        manyDays = parseInt(manyDays);

        const totalRoomPrice = roomPrice * manyDays;
        const siteFee = totalRoomPrice * 0.05;

        $('#totalPrice').text(seperateNumber(manyDays * roomPrice));
        $('#siteFee').text(seperateNumber(Math.ceil(siteFee)));
        $('#finalTotalPrice').text(seperateNumber(Math.ceil(totalRoomPrice + siteFee)));
    }

    function displayPreviewLine() {
        $('.previewPrice-line').addClass('active');
        $('.previewPrice-line').last().css('border-bottom', '1px solid rgb(211,211,211)');
    }

    function lockBookedDatesInCalendar() {
        room!.bookedDates.forEach(
            ({ checkinDate, checkoutDate }: { checkinDate: string; checkoutDate: string }) => {
                blockBetween(checkinDate, checkoutDate);
            }
        );
    }

    function blockBetween(startDateArgs: string, endDateArgs: string) {
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

    function addBlockClassAndRemoveClick(self: JQuery<HTMLElement>) {
        self.addClass('block__date');
        self.removeClass('false');
    }

    return (
        <div id='rdt_calender'>
            <div>
                <div className='rdt__body--calendar__chooseStartDateTitle'>
                    Chọn ngày nhận phòng
                </div>
                <div className='rdt__body--calendar__chooseEndDateTitle' id='numberOfDaysContainer'>
                    <span id='daysAtHere'>1</span> đêm tại
                    <span> </span>
                    {room!.cityName}
                </div>
            </div>
            <div style={{ color: '#717171' }}>
                <div id='beforeEndDateContainer'>
                    <span id='beforeChooseDay' className='fs-14'>
                        Thêm ngày đi để biết giá chính xác
                    </span>
                </div>
                <div style={{ display: 'none' }} id='fromDayToDayContainer'>
                    <span id='fromDay'>Từ ngày</span> -<span id='toDay'>đến ngày</span>
                </div>
            </div>
            <Calendar
                displayStartDateAndEndDate={displayStartDateAndEndDate}
                setCheckInAndOutDate={setCheckInAndOutDate}
                displayNumberOfDays={displayNumberOfDays}
                lockBookedDatesInCalendar={lockBookedDatesInCalendar}
                bookedDates={room!.bookedDates}
            />
        </div>
    );
};

export default BookingCalendar;
