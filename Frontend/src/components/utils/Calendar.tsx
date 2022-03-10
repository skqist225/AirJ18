import { FC } from 'react';
import { getImage } from '../../helpers/getImage';
import Month from './Month';

interface ICalendarProps {}

const Calendar: FC<ICalendarProps> = () => {
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
            </div>
        </div>
    );
};

export default Calendar;
