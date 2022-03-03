import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Room } from './Room';
import { fetchWishlistsOfCurrentUser } from '../../features/user/userSlice';
import { addClickEventForLoveButton } from '../../components/home/js/addToWishlists';

export interface IRoom {
    id: number;
    thumbnail: string;
    images: string[];
    likedByUsers: number[];
    price: number;
    name: string;
    currency: string;
    stay_type: string;
}

interface IRoomsProps {
    rooms: Array<IRoom>;
}

export const Rooms: FC<IRoomsProps> = ({ rooms }) => {
    const dispatch = useDispatch();
    const { user, wishlists, wishlistsFetching } = useSelector((state: RootState) => state.user);

    useEffect(() => {
        if (user !== null) dispatch(fetchWishlistsOfCurrentUser());
    }, [user]);

    useEffect(() => {
        if (!wishlistsFetching) addClickEventForLoveButton(wishlists, user);
    }, [wishlists, user]);

    return (
        <section className='room__section'>
            <div id='rooms__container'>
                {rooms.length > 0 &&
                    rooms.map((room: IRoom, index: number) => {
                        return (
                            <div id='rooms__component--wrapper' key={room.name + '-' + room.id}>
                                <Room room={room} index={index} />
                            </div>
                        );
                    })}
            </div>
        </section>
    );
};
