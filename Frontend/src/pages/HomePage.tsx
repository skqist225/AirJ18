import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HomeCategories } from '../components/home/HomeCategories';
import { fetchCategories } from '../features/category/categorySlice';
import {
    fetchRoomPrivacies,
    fetchRoomsByCategoryAndConditions,
    getAverageRoomPricePerNight,
} from '../features/room/roomSlice';
import { RootState } from '../store';
import { Rooms } from '../components/home/Rooms';
import Header from '../components/Header';

import '../components/home/css/home.css';
import { Div, Image } from '../globalStyle';
import { getImage } from '../helpers/getImage';
import { ToastContainer } from 'react-toastify';

import { fetchAmenities } from '../features/amenity/amenitySlice';
import { IncAndDecBtn } from '../components/hosting/listings/IncAndDecBtn';
import $ from 'jquery';
import FilterRoomBox from '../components/home/FilterRoomBox';

type HomeProps = {};

const HomePage: FC<HomeProps> = () => {
    const dispatch = useDispatch();
    const categoryid = 1;

    const { rooms, loading: roomLoading } = useSelector((state: RootState) => state.room);
    const { categories, loading: categoryLoading } = useSelector(
        (state: RootState) => state.category
    );

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchRoomsByCategoryAndConditions({ categoryid }));
    }, [dispatch, categoryid]);

    useEffect(() => {
        dispatch(fetchRoomPrivacies());
        dispatch(fetchAmenities());
    }, []);

    useEffect(() => {
        dispatch(getAverageRoomPricePerNight());
    }, []);

    return (
        <div className='p-relative' id='home__mainContainer'>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />

            <div>
                <div className='home__body'>
                    {!categoryLoading && <HomeCategories categories={categories} />}
                    <div>{!roomLoading && <Rooms rooms={rooms} />}</div>
                </div>
                <div>
                    <div>
                        <div>
                            <Image src={getImage('/svg/close.svg')} size='12px' />
                            <div>Danh sách yêu thích của bạn</div>
                        </div>
                        <div></div>
                    </div>
                </div>
            </div>

            <FilterRoomBox />

            <ToastContainer
                position='bottom-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </div>
    );
};

export default HomePage;
