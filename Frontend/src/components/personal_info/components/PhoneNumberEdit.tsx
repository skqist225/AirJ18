import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { UserEditError } from './UserEditError';

interface IPhoneNumberEditProps {
    register: UseFormRegister<FieldValues>;
    defaultValue: string;
}

const PhoneNumberEdit: FC<IPhoneNumberEditProps> = ({ register, defaultValue }) => {
    return (
        <div className='input-group mb-3'>
            <div className='input-group-prepend'>
                <span className='input-group-text' id='basic-addon1'>
                    +84
                </span>
            </div>
            <input
                type='text'
                className='form-control'
                placeholder='Số điện thoại'
                {...register('phoneNumber')}
                defaultValue={defaultValue}
            />
            <UserEditError id='phoneNumberError' />
        </div>
    );
};

export default PhoneNumberEdit;
