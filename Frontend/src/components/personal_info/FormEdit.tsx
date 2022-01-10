import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
    FirstNameAndLastNameEdit,
    SexEdit,
    BirthdayEdit,
    EmailEdit,
    PhoneNumberEdit,
    AvatarEdit,
    AddressEdit,
    PasswordEdit,
} from './components';
import {
    checkBirthdayIsGreaterThenPresent,
    checkEmailDuplicated,
    checkFirstNameAndLastNameConstraint,
    checkPasswordConstraint,
    checkPhoneNumberConstraint,
} from './js/check_constraints';
import $ from 'jquery';

interface IFormEditProps {
    dataEdit: string;
}

export const FormEdit: FC<IFormEditProps> = ({ dataEdit }) => {
    const { handleSubmit, register } = useForm();
    const { user } = useSelector((state: RootState) => state.user);

    const onSubmit = (data: any) => {
        console.log(data);

        switch (dataEdit) {
            case 'firstNameAndLastName': {
                checkFirstNameAndLastNameConstraint(data.firstName, data.lastName);
                break;
            }
            case 'sex': {
                break;
            }
            case 'birthday': {
                checkBirthdayIsGreaterThenPresent(
                    data.yearOfBirth,
                    data.monthOfBirth,
                    data.dayOfBirth
                );
                break;
            }
            case 'email': {
                checkEmailDuplicated(data.email, user!.id);
                break;
            }
            case 'password': {
                checkPasswordConstraint(data.oldPassword, data.newPassword, user!.id);
                break;
            }
            case 'phoneNumber': {
                checkPhoneNumberConstraint(data.phoneNumber);
                break;
            }
            case 'address': {
                break;
            }
            case 'avatar': {
                break;
            }
        }
    };
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
                    {dataEdit === 'phoneNumber' && (
                        <PhoneNumberEdit register={register} defaultValue={user.phoneNumber} />
                    )}
                    {dataEdit === 'address' && (
                        <AddressEdit
                            register={register}
                            address={user.addressDetails}
                            countryDefaultValue={user.addressDetails.country.id}
                            stateDefaultValue={user.addressDetails.state.id}
                            cityDefaultValue={user.addressDetails.city.id}
                        />
                    )}
                    {dataEdit === 'avatar' && <AvatarEdit register={register} />}

                    <button type='submit' className='saveEditBtn' data-edit={dataEdit}>
                        <span>Lưu</span>
                    </button>
                </form>
            )}
        </>
    );
};
