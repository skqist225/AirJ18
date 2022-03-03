import { userInfo } from 'os';
import { FC } from 'react';
import { Dropdown } from 'react-bootstrap';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { DropDown } from '../../utils';
import { IOption } from '../../utils/DropDown';
import { UserEditError } from './UserEditError';

interface IBirthdayEditProps {
    birthday: string;
    register: UseFormRegister<FieldValues>;
}

const BirthdayEdit: FC<IBirthdayEditProps> = ({ birthday, register }) => {
    const date = new Date();

    const years: number[] = [];
    for (var i = 1900; i <= date.getFullYear(); i++) {
        years.unshift(i);
    }

    const dayOptions: IOption[] = Array.from(Array(31).keys(), (_, v) => v + 1).map(day => ({
        value: day.toString(),
        displayText: day.toString(),
    }));

    const monthOptions: IOption[] = Array.from(Array(12).keys(), (_, v) => v + 1).map(month => ({
        value: month.toString(),
        displayText: month.toString(),
    }));

    const yearOptions: IOption[] = years.map(year => ({
        value: year.toString(),
        displayText: year.toString(),
    }));

    return (
        <div className='normal-flex'>
            <div style={{ flex: 1, maxWidth: 'calc(100% / 3)' }}>
                <DropDown
                    label='Ngày'
                    fieldName='dayOfBirth'
                    register={register}
                    options={dayOptions}
                    defaultValue={birthday.split('-')[2]}
                />
                <UserEditError id='userDayOfBirthError' />
            </div>

            <div style={{ flex: 1, maxWidth: 'calc(100% / 3)', margin: '0 10px' }}>
                <DropDown
                    label='Tháng'
                    fieldName='monthOfBirth'
                    register={register}
                    options={monthOptions}
                    defaultValue={
                        birthday.split('-')[1].startsWith('0')
                            ? birthday.split('-')[1].slice(1)
                            : birthday.split('-')[1]
                    }
                />
                <UserEditError id='userMonthOfBirthError' />
            </div>

            <div style={{ flex: 1, maxWidth: 'calc(100% / 3)' }}>
                <DropDown
                    label='Năm'
                    fieldName='yearOfBirth'
                    register={register}
                    options={yearOptions}
                    defaultValue={birthday.split('-')[0]}
                />
                <UserEditError id='userYearOfBirthError' />
            </div>
        </div>
    );
};

export default BirthdayEdit;
