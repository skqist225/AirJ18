import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { FormGroup } from '../../utils';
import { UserEditError } from './UserEditError';

interface IFirstNameAndLastNameEditProps {
    register: UseFormRegister<FieldValues>;
    firstName: string;
    lastName: string;
}

const FirstNameAndLastNameEdit: FC<IFirstNameAndLastNameEditProps> = ({
    register,
    firstName,
    lastName,
}) => {
    return (
        <div className='normal-flex' style={{ marginTop: '20px' }}>
            <div>
                <FormGroup
                    label='Tên'
                    register={register}
                    fieldName='firstName'
                    type='text'
                    value={firstName}
                />
                <UserEditError id='firstNameError' />
            </div>
            <div style={{ marginLeft: '15px' }}>
                <FormGroup
                    label='Họ'
                    register={register}
                    fieldName='lastName'
                    type='text'
                    value={lastName}
                />
                <UserEditError id='lastNameError' />
            </div>
        </div>
    );
};

export default FirstNameAndLastNameEdit;
