import { FC, useEffect } from "react";
import { FieldValues, UseFormRegister } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { fetchCitiesByState } from "../../../features/address/citySlice";
import { fetchStatesByCountry } from "../../../features/address/stateSlice";
import { fetchCountries } from "../../../features/country/countrySlice";
import { RootState } from "../../../store";
import { IAddress } from "../../../types/user/type_User";
import { DropDown, FormGroup } from "../../utils";
import { IOption } from "../../utils/DropDown";
import $ from "jquery";

interface IAddressEditProps {
    register: UseFormRegister<FieldValues>;
    address: IAddress;
    countryDefaultValue: number;
    stateDefaultValue: number;
    cityDefaultValue: number;
}

const AddressEdit: FC<IAddressEditProps> = ({
    register,
    address,
    countryDefaultValue,
    stateDefaultValue,
    cityDefaultValue,
}) => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchCountries());
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchStatesByCountry({ countryId: countryDefaultValue }));
    }, [countryDefaultValue]);

    useEffect(() => {
        dispatch(fetchCitiesByState({ stateId: stateDefaultValue }));
    }, [stateDefaultValue]);

    const { countries, loading: countryLoading } = useSelector((state: RootState) => state.country);
    const { states, loading: stateLoading } = useSelector((state: RootState) => state.state);
    const { cities } = useSelector((state: RootState) => state.city);

    const countryOptions: IOption[] = countries.map(country => ({
        value: country.id.toString(),
        displayText: country.name,
    }));

    const stateOptions: IOption[] = states.map(state => ({
        value: state.id.toString(),
        displayText: state.name,
    }));

    const cityOptions: IOption[] = cities.map(city => ({
        value: city.id.toString(),
        displayText: city.name,
    }));

    useEffect(() => {
        if (!countryLoading) {
            $("#countrySelect").on("change", function () {
                const countryId = parseInt($(this).children("option:selected").val() as string);

                if (countryDefaultValue && countryId !== countryDefaultValue) {
                    dispatch(fetchStatesByCountry({ countryId: countryDefaultValue }));
                }
            });
        }
    }, [countryLoading]);

    useEffect(() => {
        if (!stateLoading) {
            $("#stateSelect").on("change", function () {
                const stateId = parseInt($(this).children("option:selected").val() as string);

                if (stateDefaultValue && stateId !== stateDefaultValue) {
                    dispatch(fetchCitiesByState({ stateId: stateDefaultValue }));
                }
            });
        }
    }, [stateLoading]);

    return (
        <div>
            {address.country && (
                <input type='hidden' value={address.country.name} id='userCountryName' />
            )}
            {address.state && <input type='hidden' value={address.state.name} id='userStateName' />}
            <div>
                <DropDown
                    register={register}
                    id='countrySelect'
                    fieldName='country'
                    label='Quốc gia/khu vực'
                    options={countryOptions}
                    defaultValue={countryDefaultValue.toString()}
                />
            </div>
            <div>
                <DropDown
                    register={register}
                    id='stateSelect'
                    fieldName='state'
                    label='Tỉnh/thành phố'
                    options={stateOptions}
                    defaultValue={stateDefaultValue.toString()}
                />
                <div id='stateNameDivCode'></div>
            </div>
            <div>
                <DropDown
                    register={register}
                    id='citySelect'
                    fieldName='city'
                    label='Quận/huyện'
                    options={cityOptions}
                    defaultValue={cityDefaultValue.toString()}
                />
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

export default AddressEdit;
