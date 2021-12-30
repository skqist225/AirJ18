import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HomeCategories } from '../components/home/HomeCategories';
import { fetchCategories } from '../features/category/categorySlice';
import { fetchRoomsByCategoryId } from '../features/room/roomSlice';
import { RootState } from '../store';
import '../components/home/home.css';
import { Rooms } from '../components/home/Rooms';
import Header from '../components/Header';
import { relative } from 'path/posix';
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

            <main style={{ position: 'relative' }}>
                <div className='home__body'>
                    {!categoryLoading && <HomeCategories categories={categories} />}
                    <div>{!roomLoading && <Rooms rooms={rooms} />}</div>
                </div>
            </main>
        </div>
    );
};

export default HomePage;
