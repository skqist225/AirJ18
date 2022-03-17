import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Header from '../components/Header';
import { fetchRoomById, roomState } from '../features/room/roomSlice';

import {
    EditLocation,
    EditRoomCount,
    EditRoomInfo,
    SideBar,
    EditImage,
    EditAmenity,
    ViewRoom,
} from '../components/manage_room_details';
import { amenityState, fetchAmenities } from '../features/amenity/amenitySlice';
import './css/manage_room_details.css';

interface IManageRoomDetailsPageProps {}

const ManageRoomDetailsPage: FC<IManageRoomDetailsPageProps> = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const { room } = useSelector(roomState);
    const { amenities } = useSelector(amenityState);

    useEffect(() => {
        dispatch(fetchRoomById({ roomid: pathname.split('/')[2] }));

        dispatch(fetchAmenities());
    }, []);

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />

            {room && (
                <div id='main'>
                    <div id='manage-ys__container'>
                        <SideBar roomName={room.name} />
                        <div className='manage-ys__right'>
                            <ViewRoom status={room.status} />
                            <div className='manage-ys__right-content'>
                                <EditImage images={room!.images} />
                                <EditRoomInfo room={room} />
                                <EditAmenity amenities={amenities} />
                                <EditLocation room={room} />
                                <EditRoomCount room={room} />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ManageRoomDetailsPage;
