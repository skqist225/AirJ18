import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { DropDown } from '../../utils';
import { IOption } from '../../utils/DropDown';

interface ISexEditProps {
    register: UseFormRegister<FieldValues>;
}

export const SexEdit: FC<ISexEditProps> = ({ register }) => {
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
                fieldName='userSex'
                register={register}
                options={sexOptions}
            />
        </>
    );
};
