import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { UserEditError } from './UserEditError';

interface IEmailEditProps {
    register: UseFormRegister<FieldValues>;
    defaultValue: string;
}

const EmailEdit: FC<IEmailEditProps> = ({ register, defaultValue }) => {
    return (
        <>
            <div>
                <label>Sử dụng địa chỉ mà bạn luôn có quyền truy cập.</label>
                <input
                    type='email'
                    id='email'
                    className='form-control'
                    defaultValue={defaultValue}
                    {...register('email')}
                    required
                />
                <UserEditError id='emailError' />
            </div>
        </>
    );
};

export default EmailEdit;
