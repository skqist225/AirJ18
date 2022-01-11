import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HomeCategories } from '../components/home/HomeCategories';
import { fetchCategories } from '../features/category/categorySlice';
import { fetchRoomsByCategoryId } from '../features/room/roomSlice';
import { RootState } from '../store';
import { Rooms } from '../components/home/Rooms';
import Header from '../components/Header';

import '../components/home/css/home.css';

type HomeProps = {};

const HomePage: FC<HomeProps> = () => {
    const dispatch = useDispatch();
    const categoryId = 1;

    const { rooms, loading: roomLoading } = useSelector((state: RootState) => state.room);
    const { categories, loading: categoryLoading } = useSelector(
        (state: RootState) => state.category
    );

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchRoomsByCategoryId({ categoryId }));
    }, [dispatch, categoryId]);

    return (
        <div>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />

            <div id='home__main--container'>
                <div className='home__body'>
                    {!categoryLoading && <HomeCategories categories={categories} />}
                    <div>{!roomLoading && <Rooms rooms={rooms} />}</div>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
