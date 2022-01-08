import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { UserEditError } from './UserEditError';

interface IEmailEditProps {
    register: UseFormRegister<FieldValues>;
}

export const EmailEdit: FC<IEmailEditProps> = ({ register }) => {
    return (
        <div>
            <label>Sử dụng địa chỉ mà bạn luôn có quyền truy cập.</label>
            <input
                type='email'
                id='email'
                className='form-control'
                {...register('email')}
                required
            />
            <UserEditError id='emailError' />
        </div>
    );
};
