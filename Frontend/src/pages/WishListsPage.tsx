import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { fetchWishlistsOfCurrentUser, userState } from '../features/user/userSlice';
import { getImage } from '../helpers';

import './css/wishlists.css';

interface WishListsPage {}

const WishListsPage: FC<WishListsPage> = () => {
    const dispatch = useDispatch();
    const { user, wishlists, wishlistsIDsFetching } = useSelector(userState);

    useEffect(() => {
        if (user !== null) dispatch(fetchWishlistsOfCurrentUser());
    }, [user]);

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />
            <div>
                <div className='wishlists__container'>
                    <div className='wishlists__word'>Yêu thích</div>

                    <div className='normal-flex' id='wishlists__wrapper'>
                        {wishlists.map(room => (
                            <Link to={`/room/${room.id}`}>
                                <div className='wishlists__room-box' key={room.id}>
                                    <div className='wishlists__room-thumbnail'>
                                        <img
                                            src={getImage(room.images[0])}
                                            alt={room.images[0]}
                                            className='of-c w100-h100'
                                        />
                                    </div>
                                    <div className='wishlists__room-image-2'>
                                        <img
                                            src={getImage(room.images[1])}
                                            alt={room.images[1]}
                                            className='of-c w100-h100'
                                        />
                                    </div>
                                    <div className='wishlists__room-image-3'>
                                        <img
                                            src={getImage(room.images[2])}
                                            alt={room.images[2]}
                                            className='of-c w100-h100'
                                        />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default WishListsPage;
