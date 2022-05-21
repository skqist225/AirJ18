import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { fetchRoomById, roomState } from "../../features/room/roomSlice";
import { getImage } from "../../helpers";
import { getRoomlocation } from "../../utils/getLocation";
import Header from "../Header";
import { Amenity, Rule, ReserveRoom } from "./components";
import roomDetails from "./script/room_details";
import { BookingCalendar, ClientReview, LocationAndLikeShare, RoomImages } from "../room_details";
import { Div, Image } from "../../globalStyle";
import { userState } from "../../features/user/userSlice";

import $ from "jquery";
import "./css/room_details.css";

interface IRoomDetailsProps {}

const RoomDetails: FC<IRoomDetailsProps> = () => {
    const dispatch = useDispatch();
    const { pathname } = useLocation();
    const { room, loading } = useSelector(roomState);
    const { user, wishlistsIDs } = useSelector(userState);

    const initComp = () => {
        $("html,body").scrollTop(0);
        roomDetails(wishlistsIDs, user!);
    };

    useEffect(() => {
        dispatch(fetchRoomById({ roomid: pathname.split("/").pop()! }));
    }, [dispatch, pathname]);

    useEffect(() => {
        if (room !== null) {
            getRoomlocation(
                room.latitude,
                room.longitude,
                room.host.id,
                room.host.avatar,
                room.host.name
            );

            initComp();
        }
    }, [room]);

    return (
        <>
            <Header excludeBecomeHostAndNavigationHeader={false} includeMiddle={false} />
            {room && !loading && (
                <main>
                    <div id='rdt__header--container'>
                        <h1 className='rdt__header--name'>{room.name}</h1>
                        <LocationAndLikeShare room={room} />
                        <RoomImages room={room} />

                        <div className='rdt_body'>
                            <div className='grid__2_1'>
                                <article>
                                    <div className='rdt_room__count flex'>
                                        <div>
                                            <h2 className='rdt__body--hostDetails'>
                                                {room.privacy} tại {room.name}. Chủ nhà{" "}
                                                {room.host.name}
                                            </h2>
                                            <p className='rdt__body--room-infos'>
                                                {room.guest} khách · {room.bedroom} phòng ngủ ·{" "}
                                                {room.bed} giường · {room.bathroom} phòng tắm riêng
                                            </p>
                                        </div>
                                        <div>
                                            <Image
                                                src={getImage(room.host.avatar)}
                                                size='56px'
                                                className='rdt__host--avatar'
                                            />
                                        </div>
                                    </div>
                                    <div className='rdt__description rdt_body__common'>
                                        <p>{room.description}</p>
                                    </div>
                                    <div className='rdt_bedroom_info rdt_body__common'>
                                        <div className='rdt_amentity__header'>
                                            Nơi bạn sẽ ngủ nghỉ
                                        </div>
                                        <div>
                                            <div
                                                className='normal-flex'
                                                style={{
                                                    marginBottom: "16px",
                                                }}
                                            >
                                                <Image
                                                    src={getImage(room.images[2])}
                                                    width='318px'
                                                    height='212px'
                                                    style={{ borderRadius: "8px" }}
                                                />
                                            </div>
                                            <Div margin='0 0 8px 0' className='fs-16 fw-500'>
                                                Phòng ngủ
                                            </Div>
                                            <div className='fs-14'>{room.bed} giường đơn</div>
                                        </div>
                                    </div>
                                    <div className='rdt_amentity rdt_body__common'>
                                        <h4 className='rdt_amentity__header'>
                                            Nơi này có những gì cho bạn
                                        </h4>
                                        <div className='rdt__amenities--container'>
                                            {room.amenities.map(amenity => (
                                                <Amenity amenity={amenity} key={amenity.name} />
                                            ))}
                                        </div>
                                    </div>
                                    <BookingCalendar room={room} />
                                </article>

                                <ReserveRoom room={room} />
                            </div>
                            <ClientReview room={room} />
                            <section>
                                <div id='rdt__location'>
                                    <div className='rdt_amentity__header'>Nơi bạn sẽ đến</div>
                                    <div id='map'></div>
                                </div>
                                <div className='rdt_host rdt_body__common'>
                                    <div className='host_info'>
                                        <div>
                                            <img
                                                src={getImage(room.host.avatar)}
                                                className='rdt__host--avatar'
                                                alt={room.host.avatar}
                                            />
                                        </div>
                                        <div style={{ marginLeft: "20px" }}>
                                            <h2 className='room-hostName'>{room.host.name}</h2>
                                            <div className='room-createdDate'>
                                                {room.host.createdDate}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='rdt_rules rdt_body__common'>
                                    <h4 className='rdt_amentity__header'>Những điều cần biết</h4>
                                    {room.rules.map(rule => (
                                        <Rule rule={rule} key={rule.title} />
                                    ))}
                                </div>
                            </section>
                        </div>
                    </div>
                </main>
            )}
        </>
    );
};

export default RoomDetails;
