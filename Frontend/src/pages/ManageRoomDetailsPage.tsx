import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import { fetchRoomById, roomState } from "../features/room/roomSlice";

import {
    EditLocation,
    EditRoomCount,
    EditRoomInfo,
    SideBar,
    EditImage,
    EditAmenity,
    ViewRoom,
} from "../components/manage_room_details";
import { amenityState, fetchAmenities } from "../features/amenity/amenitySlice";
import "./css/manage_room_details.css";
import { initComp } from "./script/manage_your_space";
import Toast from "../components/notify/Toast";

interface IManageRoomDetailsPageProps {}

const ManageRoomDetailsPage: FC<IManageRoomDetailsPageProps> = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();

    const { room } = useSelector(roomState);
    const { amenities } = useSelector(amenityState);

    useEffect(() => {
        dispatch(fetchRoomById({ roomid: pathname.split("/")[2] }));

        dispatch(fetchAmenities());
    }, []);

    useEffect(() => {
        if (room) initComp(room, amenities);
    }, [room, amenities]);

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />

            {room && (
                <div id='main'>
                    <div id='manage-ys__container'>
                        <SideBar roomName={room.name} />
                        <div className='manage-ys__right'>
                            <ViewRoom status={room.status} roomid={room.id} />
                            <div className='manage-ys__right-content'>
                                <EditImage images={room!.images} roomid={room.id} />
                                <EditRoomInfo room={room} />
                                <EditAmenity amenities={amenities} />
                                <EditLocation room={room} />
                                <EditRoomCount room={room} />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Toast />
        </>
    );
};

export default ManageRoomDetailsPage;
