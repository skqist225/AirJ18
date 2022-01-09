import { userInfo } from 'os';
import { FC, useEffect } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../../../features/country/countrySlice';
import { RootState } from '../../../store';
import { IAddress } from '../../../type/type_User';
import { DropDown, FormGroup } from '../../utils';
import { IOption } from '../../utils/DropDown';

interface IAddressEditProps {
    register: UseFormRegister<FieldValues>;
    address: IAddress;
}

export const AddressEdit: FC<IAddressEditProps> = ({ register, address }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCountries());
    }, []);

    const { countries } = useSelector((state: RootState) => state.country);
    const countryOptions: IOption[] = countries.map(country => ({
        value: country.id.toString(),
        displayText: country.name,
    }));

    return (
        <div>
            <input type='hidden' value={address.country.name} id='userCountryName' />
            <input type='hidden' value={address.state.name} id='userStateName' />
            <div>
                <DropDown
                    register={register}
                    name='userCountryId'
                    id='countryNameSelect'
                    fieldName='userCountryId'
                    label='Quốc gia/khu vực'
                    options={countryOptions}
                    selected={'Việt Nam'}
                />
            </div>
            <div>
                {/* <DropDown
                    register={register}
                    name='userCountryId'
                    id='countryNameSelect'
                    fieldName='userCountryId'
                    label='Tỉnh/thành phố'
                    options={countryOptions}
                    selected={'Việt Nam'}
                /> */}

                {/* <label for=''></label>
                <select name='userStateId' id='stateNameSelect' className='custom-select'>
                    <option each='s : ${states}' value='${s.id}' text='${s.name}'></option>
                </select>
                <div id='stateNameDivCode'></div> */}
            </div>
            <div>
                {/* <DropDown
                    register={register}
                    name='userCityId'
                    id='cityNameSelect'
                    fieldName='userCityId'
                    label='Quận/huyện'
                    options={[{ value: '', displayText: '' }]}
                />

                <select className='custom-select'>
                    <option
                        each='c : ${cities}'
                        value='${c.id}'
                        text='${c.name}'
                        selected="${user.address != null ? (c.name == user.address.city.name) : (c.name == 'Thành phố Thủ Dầu Một')}"
                    ></option>
                </select> */}
                <div id='cityNameDivCode'></div>
            </div>
            <FormGroup
                fieldName='aprtNoAndStreet'
                placeholder='Tên/số nhà + đường/phố'
                register={register}
                label='Địa chỉ đường/phố'
                type='text'
                value={address.aprtNoAndStreet}
            />
        </div>
    );
};
