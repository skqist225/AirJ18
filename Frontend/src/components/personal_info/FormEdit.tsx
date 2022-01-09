import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { AddressEdit } from './components/AddressEdit';
import { AvatarEdit } from './components/AvatarEdit';
import { BirthdayEdit } from './components/BirthdayEdit';
import { EmailEdit } from './components/EmailEdit';
import { FirstNameAndLastNameEdit } from './components/FirstNameAndLastNameEdit';
import { PasswordEdit } from './components/PasswordEdit';
import { PhoneNumberEdit } from './components/PhoneNumberEdit';
import { SexEdit } from './components/SexEdit';
import { UserEditError } from './components/UserEditError';

interface IFormEditProps {
    dataEdit: string;
}

export const FormEdit: FC<IFormEditProps> = ({ dataEdit }) => {
    const { handleSubmit, register } = useForm();
    const { user } = useSelector((state: RootState) => state.user);

    const onSubmit = (data: any) => console.log(data);
    //        action='/user/update-personal-info'
    return (
        <>
            {user !== null && (
                <form onSubmit={handleSubmit(onSubmit)} className={'formEdit_' + dataEdit}>
                    <input type='hidden' value={user.id} name='id' />
                    <input type='hidden' name='updatedField' value={dataEdit} />
                    <div></div>
                    {dataEdit === 'firstNameAndLastName' && (
                        <FirstNameAndLastNameEdit
                            firstName={user.firstName}
                            lastName={user.lastName}
                            register={register}
                        />
                    )}

                    {dataEdit === 'sex' && <SexEdit register={register} defaultValue={user.sex} />}
                    {dataEdit === 'birthday' && (
                        <BirthdayEdit birthday={user.birthday} register={register} />
                    )}
                    {dataEdit === 'email' && (
                        <EmailEdit register={register} defaultValue={user.email} />
                    )}
                    {dataEdit === 'password' && <PasswordEdit register={register} />}
                    {dataEdit === 'phoneNumber' && <PhoneNumberEdit register={register} />}
                    {dataEdit === 'address' && (
                        <AddressEdit register={register} address={user.addressDetails} />
                    )}
                    {dataEdit === 'avatar' && <AvatarEdit register={register} />}

                    <button type='button' className='saveEditBtn' data-edit={dataEdit}>
                        <span className='_ftj2sg4'>Lưu</span>
                    </button>
                </form>
            )}
        </>
    );
};
