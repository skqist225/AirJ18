import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { Room } from './Room';
import { fetchWishlistsIDsOfCurrentUser } from '../../features/user/userSlice';
import { addClickEventForLoveButton } from './script/add_to_wishlists';

import { IRoom } from '../../types/room/type_Room';

interface IRoomsProps {
    rooms: IRoom[];
}

export const Rooms: FC<IRoomsProps> = ({ rooms }) => {
    const dispatch = useDispatch();
    const { user, wishlistsIDs, wishlistsIDsFetching } = useSelector(
        (state: RootState) => state.user
    );

    useEffect(() => {
        if (user !== null) dispatch(fetchWishlistsIDsOfCurrentUser());
    }, [user]);

    useEffect(() => {
        if (!wishlistsIDsFetching) addClickEventForLoveButton(wishlistsIDs, user);
    }, [wishlistsIDsFetching, user]);

    return (
        <>
            <section className='room__section'>
                <div id='rooms__container'>
                    {rooms?.length &&
                        rooms.map((room: IRoom, index: number) => {
                            return (
                                <div id='rooms__component--wrapper' key={room.name + '-' + room.id}>
                                    <Room room={room} index={index} />
                                </div>
                            );
                        })}
                </div>
            </section>
        </>
    );
};
