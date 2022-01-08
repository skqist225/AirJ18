import { userInfo } from 'os';
import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';
import { DropDown, FormGroup } from '../../utils';

interface IAddressEditProps {
    register: UseFormRegister<FieldValues>;
}

export const AddressEdit: FC<IAddressEditProps> = ({ register }) => {
    return (
        <div>
            <input
                type='hidden'
                value="${user.address != null ? user.address.country.name : ''}"
                id='userCountryName'
            />
            <input
                type='hidden'
                value="${user.address != null ? user.address.state.name : ''}"
                id='userStateName'
            />
            <div>
                <DropDown
                    register={register}
                    name='userCountryId'
                    id='countryNameSelect'
                    fieldName='userCountryId'
                    options={}
                />
                <label>Quốc gia/khu vực</label>
                <select className='custom-select'>
                    <option
                        each='c : ${countries}'
                        value='${c.id}'
                        text='${c.name}'
                        selected="${user.address != null ? (c.name == user.address.country.name) : (c.name == 'Vietnam')}"
                    ></option>
                </select>
            </div>
            <div>
                <label for=''>Tỉnh/thành phố</label>
                <select name='userStateId' id='stateNameSelect' className='custom-select'>
                    <option each='s : ${states}' value='${s.id}' text='${s.name}'></option>
                </select>
                <div id='stateNameDivCode'></div>
            </div>
            <div>
                <label for=''>Quận/huyện</label>
                <select name='userCityId' id='cityNameSelect' className='custom-select'>
                    <option
                        each='c : ${cities}'
                        value='${c.id}'
                        text='${c.name}'
                        selected="${user.address != null ? (c.name == user.address.city.name) : (c.name == 'Thành phố Thủ Dầu Một')}"
                    ></option>
                </select>
                <div id='cityNameDivCode'></div>
            </div>
            <FormGroup
                fieldName=''
                placeholder='Tên/số nhà + đường/phố'
                register={register}
                label='Địa chỉ đường/phố'
                type='text'
                value={userInfo.address}
            />
            <div>
                <label for=''></label>
                <input
                    type='text'
                    className='form-control'
                    placeholder=''
                    field='*{address.aprtNoAndStreet}'
                />
            </div>
        </div>
    );
};
