import { userInfo } from 'os';
import { FC } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { DropDown } from '../../utils';
import { UserEditError } from './UserEditError';

interface IBirthdayEditProps {
    birthday: never[];
    register: UseFormRegister<FieldValues>;
}

export const BirthdayEdit: FC<IBirthdayEditProps> = ({ birthday, register }) => {
    const date = new Date();

    const years = [];
    for (var i = 1900; i <= date.getFullYear(); i++) {
        years.push(i);
    }

    const dayOptions: { value: string; displayText: string }[] = Array.from(
        Array(31).keys(),
        (_, v) => v + 1
    ).map(day => ({
        value: day.toString(),
        displayText: day.toString(),
    }));

    return (
        <div className='flex'>
            <div>
                <DropDown
                    fieldName='day'
                    label='Ngày sinh'
                    id='userDayOfBirth'
                    name='userDayOfBirth'
                    register={register}
                    options={dayOptions}
                />
                <UserEditError id='userDayOfBirthError' />
            </div>

            <div>
                <select className='custom-select' name='userMonthOfBirth' id='userMonthOfBirth'>
                    <option disabled value=''>
                        Tháng
                    </option>
                    {Array.from(Array(12).keys(), (_, v) => v + 1).map(month => (
                        <option value={month} selected={month === birthday[1]}>
                            tháng {month}
                        </option>
                    ))}
                </select>
                <UserEditError id='userMonthOfBirthError' />
            </div>

            <div>
                <select className='custom-select' name='userYearOfBirth' id='userYearOfBirth'>
                    <option disabled value=''>
                        Năm
                    </option>
                    {years.map(year => (
                        <option value={year} selected={year === birthday[0]}>
                            {year}
                        </option>
                    ))}
                </select>
                <UserEditError id='userYearOfBirthError' />
            </div>
        </div>
    );
};
