import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { UserEditError } from './UserEditError';

interface IPasswordEditProps {
    register: UseFormRegister<FieldValues>;
}

const PasswordEdit: FC<IPasswordEditProps> = ({ register }) => {
    return (
        <div>
            <div className='form-group'>
                <label>Mật khẩu cũ</label>
                <input
                    type='password'
                    className='form-control'
                    id='oldPassword'
                    {...register('oldPassword')}
                    autoComplete='true'
                />
                <UserEditError id='oldPasswordError' />
            </div>
            <div className='form-group'>
                <label>Mật khẩu mới</label>
                <input
                    type='password'
                    className='form-control'
                    id='newPassword'
                    autoComplete='true'
                    {...register('newPassword')}
                />
                <UserEditError id='newPasswordError' />
            </div>
        </div>
    );
};

export default PasswordEdit;
