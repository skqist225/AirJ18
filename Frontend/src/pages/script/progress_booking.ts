export function getFormattedCheckinAndCheckoutDate(checkinDate: string, checkoutDate: string) {
    const [ciDate, ciMonth, ciYear] = checkinDate.split('-');
    const [coDate, coMonth, coYear] = checkoutDate.split('-');
    if (ciMonth === coMonth && ciYear === coYear)
        return `Ngày ${ciDate} - Ngày ${coDate} thg ${ciMonth}`;
    else if (ciMonth !== coMonth && ciYear === coYear)
        return `Ngày ${ciDate} thg ${ciMonth} - Ngày ${coDate} thg ${coMonth}`;
    else
        return `Ngày ${ciDate} thg ${ciMonth} năm ${ciMonth} - Ngày ${coDate} thg ${coMonth} năm ${coMonth}`;
}

export function calculateBeforeCheckinDateDateAndMonth(checkinDate: string) {
    const [ciDate, ciMonth, ciYear] = checkinDate.split('-');
    let ciDateNumber = parseInt(ciDate);
    let i = 7;

    const lastDateOfPrevMonth = new Date(parseInt(ciYear), parseInt(ciMonth) - 1, 0).getDate();
    if (ciDateNumber - 7 < 0) {
        while (ciDateNumber-- >= 0) {
            i--;
        }
        return [lastDateOfPrevMonth - i, parseInt(ciMonth) - 1];
    } else return [ciDateNumber - 7, parseInt(ciMonth)];
}
