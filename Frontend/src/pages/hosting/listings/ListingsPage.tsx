import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Header from "../../../components/Header";
import { TableContent } from "../../../components/hosting/listings";
import hostingListings from "../../../components/hosting/listings/script/listings";
import { fetchAmenities } from "../../../features/amenity/amenitySlice";
import { fetchUserOwnedRoom, roomState, setListingPage } from "../../../features/room/roomSlice";
import { getImage, getPageNumber } from "../../../helpers";
import { Image } from "../../../globalStyle";

import FilterByLine from "../../../components/hosting/listings/FilterByLine";
import { userState } from "../../../features/user/userSlice";

import "./css/listings_page.css";
import { Pagination } from "../../../components/utils";

interface IListingsPageProps {}

const ListingsPage: FC<IListingsPageProps> = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading } = useSelector(userState);

    const {
        hosting: { rooms, totalRecords, totalPages, loading: roomsLoading },
        filterObject,
    } = useSelector(roomState);
    const params = useParams();

    const [commonNameCb, setCommonnameCb] = useState(false);
    const [bedCb, setBedCb] = useState(true);
    const [bedroomCb, setBedroomCb] = useState(true);
    const [bathroomCb, setBathroomCb] = useState(true);
    const [lastModifiedCb, setLastModifiedCb] = useState(true);

    useEffect(() => {
        if (user === null && !loading) {
            navigate("/login");
        }
    }, []);

    useEffect(() => {
        dispatch(fetchAmenities());
    }, []);

    useEffect(() => {
        dispatch(fetchUserOwnedRoom({ ...filterObject, page: parseInt(params.page!) }));
        dispatch(setListingPage(parseInt(params.page!)));
    }, [params.page]);

    useEffect(() => {
        hostingListings(
            setCommonnameCb,
            setBedCb,
            setBedroomCb,
            setBathroomCb,
            setLastModifiedCb,
            dispatch,
            params.page!
        );
    }, [rooms]);

    return (
        <>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />
            {rooms ? (
                <div id='listings__main-conainer'>
                    <div className='listings__container'>
                        <div className='listings__header flex'>
                            <div className='listings__header-rooms-length'>
                                {totalRecords} nhà/phòng cho thuê
                            </div>
                            <div>
                                <Link to={"/become-a-host/intro"}>
                                    {" "}
                                    <button className='listings__create-new-room'>
                                        <span>
                                            <Image
                                                src={getImage("/svg/plus.svg")}
                                                size='16px'
                                                style={{ objectFit: "cover" }}
                                            />
                                        </span>
                                        <div style={{ marginLeft: "10px" }}>Tạo mục cho thuê</div>
                                    </button>
                                </Link>
                            </div>
                        </div>
                        <FilterByLine />
                        <TableContent
                            commonNameCb={commonNameCb}
                            bedCb={bedCb}
                            bedroomCb={bedroomCb}
                            bathroomCb={bathroomCb}
                            lastModifiedCb={lastModifiedCb}
                            rooms={rooms}
                        />

                        <Pagination totalPages={totalPages} to='hosting' />
                    </div>
                </div>
            ) : (
                <div className='flex-2 no-room-style'>Không tìm thấy kết quả</div>
            )}
        </>
    );
};

export default ListingsPage;
