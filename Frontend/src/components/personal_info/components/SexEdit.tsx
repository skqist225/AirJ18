import { userInfo } from 'os';
import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { DropDown } from '../../utils';
import { IOption } from '../../utils/DropDown';

interface ISexEditProps {
    register: UseFormRegister<FieldValues>;
    defaultValue: string;
}

const SexEdit: FC<ISexEditProps> = ({ register, defaultValue }) => {
    const sexOptions: IOption[] = [
        {
            value: 'MALE',
            displayText: 'Nam',
        },
        {
            value: 'FEMALE',
            displayText: 'Nữ',
        },
        {
            value: 'OTHER',
            displayText: 'Khác',
        },
    ];

    return (
        <>
            <DropDown
                label='Giới tính'
                fieldName='sex'
                register={register}
                options={sexOptions}
                defaultValue={defaultValue}
            />
        </>
    );
};

export default SexEdit;
