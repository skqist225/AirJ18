import { FC } from 'react';

interface IFirstNameAndLastNameEditProps {}

export const FirstNameAndLastNameEdit: FC<IFirstNameAndLastNameEditProps> = () => {
    return (
        <div className='flex'>
            <div className='form-group'>
                <label>Tên</label>
                <input
                    type='text'
                    className='form-control'
                    placeholder='Tên'
                    defaultValue={user.firstName}
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
                    defaultValue={user.lastName}
                    {...register('lastName')}
                />
                <UserEditError id='lastNameError' />
            </div>
        </div>
    );
};
