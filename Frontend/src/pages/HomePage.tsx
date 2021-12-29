import React, { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HomeCategories } from '../components/home/HomeCategories';
import { fetchCategories } from '../features/category/categorySlice';
import { fetchRoomsByCategoryId } from '../features/room/roomSlice';
import { RootState } from '../store';
type HomeProps = {};

const HomePage: FC<HomeProps> = () => {
    const dispatch = useDispatch();
    const categoryId = 1;

    const { rooms, loading } = useSelector((state: RootState) => state.room);
    const { categories, loading: categoryLoading } = useSelector(
        (state: RootState) => state.category
    );
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchRoomsByCategoryId({ categoryId }));
    }, [dispatch, categoryId]);

    console.log(categoryLoading);

    return <>{!categoryLoading && <HomeCategories categories={categories} />}</>;
};

export default HomePage;
