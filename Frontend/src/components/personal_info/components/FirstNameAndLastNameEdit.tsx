import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { UserEditError } from './UserEditError';

interface IFirstNameAndLastNameEditProps {
    register: UseFormRegister<FieldValues>;
    firstName: string;
    lastName: string;
}

export const FirstNameAndLastNameEdit: FC<IFirstNameAndLastNameEditProps> = ({
    register,
    firstName,
    lastName,
}) => {
    return (
        <div className='flex'>
            <div className='form-group'>
                <label>Tên</label>
                <input
                    type='text'
                    className='form-control'
                    placeholder='Tên'
                    defaultValue={firstName}
                    {...register('firstName')}
                />
                <UserEditError id='firstNameError' />
            </div>
            <div className='form-group' style={{ marginLeft: '15px' }}>
                <label>Họ</label>
                <input
                    type='text'
                    className='form-control'
                    placeholder='Họ'
                    defaultValue={lastName}
                    {...register('lastName')}
                />
                <UserEditError id='lastNameError' />
            </div>
        </div>
    );
};
