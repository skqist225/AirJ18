import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ManageYSContainer } from '.';
import { countryState, fetchCountries } from '../../features/country/countrySlice';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers';
import { IRoomDetails } from '../../types/room/type_RoomDetails';
import BoxFooter from './BoxFooter';
import DisplayEditUI from './components/DisplayEditUI';
import HideEditBox from './components/HideEditBox';
import axios from 'axios';

import { hideEditBox } from '../../pages/script/manage_your_space';
import { userState } from '../../features/user/userSlice';

import $ from 'jquery';

interface IEditLocationProps {
    room: IRoomDetails;
}

const EditLocation: FC<IEditLocationProps> = ({ room }) => {
    const dispatch = useDispatch();
    const { countries } = useSelector(countryState);
    const { user } = useSelector(userState);

    useEffect(() => {
        dispatch(fetchCountries());
    }, []);

    function useCurrentPosition() {
        getLocation();
    }

    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition, showError, {
                timeout: 10000,
            });
        } else {
        }
    }

    function showError() {}
    let userLat = 0;
    let userLng = 0;
    async function showPosition(position: { coords: { latitude: number; longitude: number } }) {
        const accessToken =
            'pk.eyJ1IjoibG9yZGVkc3dpZnQyMjUiLCJhIjoiY2t3MDJvZ2E5MDB0dDJxbndxbjZxM20wOCJ9.hYxzgffyfc93Aiogipp5bA';
        userLat = position.coords.latitude;
        userLng = position.coords.longitude;

        const { data } = await axios.get(
            `https://api.mapbox.com/geocoding/v5/mapbox.places/${userLng},${userLat}.json?access_token=${accessToken}`,
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                },
            }
        );

        const { place_name } = data.features[0];
        console.log(place_name);

        if (place_name.length) {
            const placeNameLength = place_name.split(',').length;

            let country22 = place_name.toString().split(',')[placeNameLength - 1] || 'no-country';
            const state2 = place_name.toString().split(',')[placeNameLength - 2] || 'no-state';
            const city2 = place_name.toString().split(',')[placeNameLength - 3] || 'no-city';
            const street2 = place_name.toString().split(',')[placeNameLength - 4] || 'no-street';

            $('#manage-ys__location-country').val(216);
            $('#manage-ys__location-state').val(state2 === 'no-state' ? '' : state2);
            $('#manage-ys__location-city').val(city2 === 'no-city' ? '' : city2);
            $('#manage-ys__location-street').val(street2 === 'no-street' ? '' : street2);
        }
    }

    return (
        <ManageYSContainer id='roomLocation'>
            <div id='manage-ys__location-control-view'>
                <h3 className='manage--ys__section--title'>Vị trí</h3>
                <div>
                    <div className='flex-space'>
                        <div>
                            <div className='manage-ys__section-content-title'>Địa chỉ</div>
                            <div className='manage-ys__section-content-info'>
                                {room?.cityName}, {room?.stateName},{room?.countryName}
                            </div>
                        </div>
                        <div>
                            <DisplayEditUI sectionKey='location' />
                        </div>
                    </div>
                </div>
            </div>
            <div id='manage-ys__location-control-container'>
                <div className='manage-ys__location-control-content'>
                    <div className='flex-space'>
                        <div className='manage-ys__header-edit-main-title'>Địa chỉ</div>
                        <HideEditBox sectionKey='location' hideEditBox={hideEditBox} />
                    </div>
                    <div style={{ maxWidth: '584px' }}>
                        <div style={{ margin: '25px 0' }}>
                            <button
                                className='
                                                    manage-ys__location-control__useCurrentPosition-btn
                                                '
                                onClick={useCurrentPosition}
                            >
                                <span>
                                    <Image src={getImage('/svg/pin_drop.svg')} size='16px' />
                                </span>
                                <span>Sử dụng địa chỉ hiện tại</span>
                            </button>
                        </div>
                        <div>
                            <div>Quốc gia/Khu vực</div>
                            <select id='manage-ys__location-country' className='manage-ys__input'>
                                {countries.map(country => (
                                    <option
                                        key={country.id}
                                        value={country.id}
                                        selected={country.name == room?.countryName}
                                    >
                                        {country.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <div>Đường/phố</div>
                            <div>
                                <input
                                    type='text'
                                    value={room?.streetName}
                                    className='manage-ys__input'
                                    id='manage-ys__location-street'
                                />
                            </div>
                        </div>
                        <div>
                            <div className='grid-2'>
                                <div className='col-flex'>
                                    <div>Thành phố</div>
                                    <div>
                                        <input
                                            type='text'
                                            value={room?.cityName}
                                            className='manage-ys__input'
                                            id='manage-ys__location-city'
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div>Tỉnh</div>
                                    <div>
                                        <input
                                            type='text'
                                            value={room?.stateName}
                                            className='manage-ys__input'
                                            id='manage-ys__location-state'
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <BoxFooter sectionKey='location' idInput='' hideEditBox={hideEditBox} />
            </div>
        </ManageYSContainer>
    );
};

export default EditLocation;
