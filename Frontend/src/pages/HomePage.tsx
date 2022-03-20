import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HomeCategories } from '../components/home/HomeCategories';
import { fetchCategories } from '../features/category/categorySlice';
import {
    fetchRoomPrivacies,
    fetchRoomsByCategoryAndConditions,
    findAverageRoomPriceByType,
    roomState,
    setMockingRoomLoading,
} from '../features/room/roomSlice';
import { Rooms } from '../components/home/Rooms';
import Header from '../components/Header';
import { Image } from '../globalStyle';
import { getImage } from '../helpers';
import { ToastContainer } from 'react-toastify';
import { fetchAmenities } from '../features/amenity/amenitySlice';
import FilterRoomBox from '../components/home/FilterRoomBox';
import { animated, useSpring } from '@react-spring/web';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import '../components/home/css/home.css';

export const FadeIn = ({ children, delayTime }: { children: any; delayTime: number }) => {
    const props = useSpring({ to: { opacity: 1 }, from: { opacity: 0 }, delay: delayTime });

    return <animated.div style={props}>{children}</animated.div>;
};
type HomeProps = {};

const HomePage: FC<HomeProps> = () => {
    const dispatch = useDispatch();
    const categoryidString = new URLSearchParams(window.location.search).get('categoryid') || '1';
    const categoryid = parseInt(categoryidString);
    let { rooms, mockingRoomLoading, loading } = useSelector(roomState);

    useEffect(() => {
        dispatch(fetchRoomsByCategoryAndConditions({ categoryid }));
    }, [categoryid]);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchRoomPrivacies());
        dispatch(fetchAmenities());
        dispatch(findAverageRoomPriceByType('PER_NIGHT'));
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(setMockingRoomLoading(false));
        }, 1000);

        return () => clearTimeout(timer);
    }, [rooms]);

    return (
        <div className='p-relative' id='home__mainContainer'>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={false} />

            <div>
                <div className='home__body'>
                    <HomeCategories />

                    {!mockingRoomLoading ? (
                        !loading && (
                            <div>
                                <FadeIn delayTime={333} children={<Rooms rooms={rooms} />} />
                            </div>
                        )
                    ) : (
                        <div id='test'>
                            {Array.from({ length: 20 }).map((_, index) => (
                                <SkeletonTheme key={index}>
                                    <p style={{ marginRight: '10px' }}>
                                        <Skeleton
                                            count={1}
                                            height='300px'
                                            width='300px'
                                            duration={1}
                                        />
                                    </p>
                                </SkeletonTheme>
                            ))}
                        </div>
                    )}
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
