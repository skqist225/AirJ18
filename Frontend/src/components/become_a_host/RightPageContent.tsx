import { FC, useEffect } from "react";
import { Link } from "react-router-dom";
import { Div, MainButton } from "../../globalStyle";
import $ from "jquery";
import StepProcess from "./StepProcess";
import { ToastContainer } from "react-toastify";

import { callToast } from "../../helpers";
import { useDispatch, useSelector } from "react-redux";
import { addRoom, roomState } from "../../features/room/roomSlice";
import { IPostAddRoom, IRoomLocalStorage } from "../../types/room/type_Room";
import { userState } from "../../features/user/userSlice";

import "./css/right_content.css";

interface IRightPageContentProps {
    nextPage: string;
    prevPage: string;
    MainContent: React.ReactNode;
    stepNumber: number;
    backgroundColor?: string;
    beforeMiddle?: React.ReactNode;
    userLng?: number;
    userLat?: number;
    placeName?: string;
    descriptions?: string[];
}

const RightPageContent: FC<IRightPageContentProps> = ({
    nextPage,
    prevPage,
    MainContent,
    stepNumber,
    backgroundColor,
    beforeMiddle,
    userLng,
    userLat,
    placeName,
    descriptions,
}) => {
    // if (stepNumber !== 1 && !localStorage.getItem("room")) {
    //     window.location.href = "/";
    // }

    const dispatch = useDispatch();
    const { user } = useSelector(userState);
    const { newlyCreatedRoomId } = useSelector(roomState);
    function moveToNextPage() {
        let room: IRoomLocalStorage = {};
        switch (stepNumber) {
            case 1: {
                const choosenGroup = $("div.room-group__box").filter(".active");

                if (!localStorage.getItem("room")) {
                    room = {
                        roomGroup: parseInt(choosenGroup.data("group-id")! as string),
                        roomGroupText: choosenGroup.data("group-name"),
                    };
                } else {
                    room = JSON.parse(localStorage.getItem("room")!);
                    room = {
                        ...room,
                        roomGroup: parseInt(choosenGroup.data("group-id")! as string),
                        roomGroupText: choosenGroup.data("group-name"),
                    };
                }
                break;
            }
            case 2: {
                const choosenCategory = $("div.category__box").filter(".active");

                if (!localStorage.getItem("room")) {
                    room = {
                        category: choosenCategory.data("category-id"),
                    };
                } else {
                    room = JSON.parse(localStorage.getItem("room")!);
                    room = {
                        ...room,
                        category: choosenCategory.data("category-id"),
                    };
                }
                break;
            }
            case 3: {
                const choosenPrivacy = parseInt(
                    $("div.privacy-type__box").filter(".active").data("privacy-id")
                );

                if (!localStorage.getItem("room")) {
                    room = {
                        privacyType: choosenPrivacy,
                    };
                } else {
                    room = JSON.parse(localStorage.getItem("room")!);
                    room = {
                        ...room,
                        privacyType: choosenPrivacy,
                    };
                }
                break;
            }
            case 4: {
                if (!localStorage.getItem("room")) {
                    room = {
                        longitude: userLng,
                        latitude: userLat,
                        placeName,
                    };
                } else {
                    room = JSON.parse(localStorage.getItem("room")!);
                    room = {
                        ...room,
                        longitude: userLng,
                        latitude: userLat,
                        placeName,
                    };
                }
                break;
            }
            case 5: {
                const guestNumber = parseInt($("#guestNumber").text());
                const bedNumber = parseInt($("#bedNumber").text());
                const bedRoomNumber = parseInt($("#bedRoomNumber").text());
                const bathRoomNumber = parseInt($("#bathRoomNumber").text());

                if (!localStorage.getItem("room")) {
                    room = {
                        guestNumber,
                        bedNumber,
                        bedRoomNumber,
                        bathRoomNumber,
                    };
                } else {
                    room = JSON.parse(localStorage.getItem("room")!);
                    room = {
                        ...room,
                        guestNumber,
                        bedNumber,
                        bedRoomNumber,
                        bathRoomNumber,
                    };
                }
                break;
            }
            case 6: {
                const prominentAmentity = parseInt(
                    $(".prominentAmentities")
                        .filter(".choosen")
                        .children("input")
                        .first()
                        .val() as string
                );
                const prominentAmentityName = $(".prominentAmentities")
                    .filter(".choosen")
                    .children('input[class="amentityName"]')
                    .val()! as string;

                const prominentAmentityImageName = $(".prominentAmentities")
                    .filter(".choosen")
                    .children("input")
                    .last()
                    .val()! as string;

                const favoriteAmentity = parseInt(
                    $(".favoriteAmentities")
                        .filter(".choosen")
                        .children("input")
                        .first()
                        .val() as string
                );

                const favoriteAmentityImageName = $(".favoriteAmentities")
                    .filter(".choosen")
                    .children("input")
                    .last()
                    .val()! as string;

                const favoriteAmentityName = $(".favoriteAmentities")
                    .filter(".choosen")
                    .children('input[class="amentityName"]')
                    .val()! as string;
                const safeAmentity = parseInt(
                    $(".safeAmentities")
                        .filter(".choosen")
                        .children("input")
                        .first()
                        .val() as string
                );

                const safeAmentityImageName = $(".safeAmentities")
                    .filter(".choosen")
                    .children("input")
                    .last()
                    .val()! as string;

                const safeAmentityName = $(".safeAmentities")
                    .filter(".choosen")
                    .children('input[class="amentityName"]')
                    .val()! as string;

                if (isNaN(prominentAmentity) || isNaN(favoriteAmentity) || isNaN(safeAmentity)) {
                    callToast("error", "Vui lòng chọn tiện ích trước khi tiếp tục!");
                    return;
                }

                if (!localStorage.getItem("room")) {
                    room = {
                        prominentAmentity,
                        favoriteAmentity,
                        safeAmentity,
                        prominentAmentityImageName,
                        favoriteAmentityImageName,
                        safeAmentityImageName,
                        prominentAmentityName,
                        favoriteAmentityName,
                        safeAmentityName,
                    };
                } else {
                    room = JSON.parse(localStorage.getItem("room")!);
                    room = {
                        ...room,
                        prominentAmentity,
                        favoriteAmentity,
                        safeAmentity,
                        prominentAmentityImageName,
                        favoriteAmentityImageName,
                        safeAmentityImageName,
                        prominentAmentityName,
                        favoriteAmentityName,
                        safeAmentityName,
                    };
                }
                break;
            }
            case 7: {
                if (localStorage.getItem("room")) {
                    room = JSON.parse(localStorage.getItem("room")!);
                    if (room["roomImages"] && room.roomImages.length < 5) {
                        callToast("warning", "Vui lòng tải lên 5 ảnh");
                        return;
                    }
                }
                break;
            }
            case 8: {
                const roomTitle = $("textarea").val()! as string;

                if (!localStorage.getItem("room")) {
                    room = {
                        roomTitle,
                    };
                } else {
                    room = JSON.parse(localStorage.getItem("room")!);
                    room = {
                        ...room,
                        roomTitle,
                    };
                }
                break;
            }
            case 9: {
                if (descriptions && descriptions.length == 2) {
                    if (!localStorage.getItem("room")) {
                        room = {
                            descriptions,
                        };
                    } else {
                        room = JSON.parse(localStorage.getItem("room")!);
                        room = {
                            ...room,
                            descriptions,
                        };
                    }
                } else {
                    callToast("error", "Vui lòng chọn 2 mô tả cho nhà/phòng của bạn");
                    return;
                }
                break;
            }
            case 10: {
                const roomPricePerNight = ($("#room-price").val() as string).replace("₫", "");

                if (!localStorage.getItem("room")) {
                    room = {
                        roomPricePerNight,
                    };
                } else {
                    room = JSON.parse(localStorage.getItem("room")!);
                    room = {
                        ...room,
                        roomPricePerNight,
                    };
                }
                if (parseInt(($("#room-price").val() as string).replace("₫", "")) > 1000000000) {
                    callToast("warning", "Vui lòng nhập dưới 1.000.000.000đ");
                    return;
                }
                if (isNaN(parseInt(($("#room-price").val() as string).replace("₫", "")))) {
                    callToast("error", "Số tiền không hợp lệ");
                    return;
                }
                break;
            }
            case 11: {
                if (localStorage.getItem("room")) {
                    room = JSON.parse(localStorage.getItem("room")!);
                    const placeNameLength = room.placeName!.toString().split(",").length;
                    let country =
                        room.placeName!.toString().split(",")[placeNameLength - 1] || "no-country";
                    const state =
                        room.placeName!.toString().split(",")[placeNameLength - 2] || "no-state";
                    const city =
                        room.placeName!.toString().split(",")[placeNameLength - 3] || "no-city";
                    const street =
                        room.placeName!.toString().split(",")[placeNameLength - 4] || "no-street";

                    const fd = new FormData();

                    let amenities: number[] = [];
                    amenities.push(room.prominentAmentity!);
                    amenities.push(room.favoriteAmentity!);
                    amenities.push(room.safeAmentity!);

                    const roomEntity: IPostAddRoom = {
                        name: room.roomTitle!,
                        amentities: amenities!,
                        images: room.roomImages!,
                        country: 216,
                        state,
                        city,
                        street,
                        bedroomCount: room.bedRoomNumber!,
                        bathroomCount: room.bathRoomNumber!,
                        accomodatesCount: room.guestNumber!,
                        bedCount: room.bedNumber!,
                        currency: 2, // chose currency
                        category: room.category!,
                        roomGroup: room.roomGroup!,
                        description: room.descriptions?.join(",")!,
                        latitude: room.latitude!,
                        longitude: room.longitude!,
                        price: parseInt(room.roomPricePerNight!),
                        priceType: "PER_NIGHT",
                        host: user?.id!,
                        privacyType: room.privacyType!,
                    };

                    for (let key in roomEntity) {
                        fd.append(key, (roomEntity as any)[key]);
                    }
                    dispatch(addRoom(fd));
                }
                break;
            }
        }

        localStorage.setItem("room", JSON.stringify(room));
        if (stepNumber !== 11) {
            window.location.href = `${window.location.origin}/become-a-host/${nextPage}`;
        }
    }

    useEffect(() => {
        if (newlyCreatedRoomId) {
            window.location.href = `${window.location.origin}/become-a-host/${nextPage}/${newlyCreatedRoomId}`;
        }
    }, [newlyCreatedRoomId]);

    function backToHomePage() {
        window.location.href = window.location.origin;
    }

    return (
        <Div
            className='col-flex p-relative'
            width='50%'
            height='100%'
            backgroundColor={backgroundColor}
        >
            <Div className='normal-flex jc-fe' height='88px' padding='0 20px 0 0'>
                <button
                    className='become-a-host__right-cancelBtn'
                    onClick={backToHomePage}
                    style={
                        stepNumber === 4
                            ? {
                                  position: "absolute",
                                  zIndex: 101,
                                  top: "calc(88px / 2 - 32px)",
                              }
                            : {}
                    }
                >
                    <span className='fw-500'>Lưu và thoát</span>
                </button>
            </Div>
            {stepNumber === 4 && beforeMiddle}

            {stepNumber === 6 ? (
                <div
                    className='flex-center f1'
                    style={{
                        overflowY: "scroll",
                        flex: 1,
                        padding: "0 48px",
                        maxWidth: "90%",
                        margin: "0 auto",
                    }}
                >
                    {MainContent}
                </div>
            ) : (
                <div className='flex-center f1'>{MainContent}</div>
            )}

            <StepProcess stepNumber={stepNumber} />
            <Div
                className='flex-space'
                height='80px'
                padding='16px'
                style={
                    stepNumber === 4
                        ? {
                              position: "absolute",
                              zIndex: 100,
                              bottom: "0",
                              backgroundColor: "#fff",
                          }
                        : {}
                }
            >
                <div>
                    <Link
                        to={`/become-a-host/${prevPage}`}
                        id='right--content__prev--step'
                        style={{ color: backgroundColor === "#000000" ? "#fff" : "#222" }}
                    >
                        Quay lại
                    </Link>
                </div>
                <MainButton width='120px' height='48px' onClick={moveToNextPage}>
                    <span className='fw-500'>Tiếp theo</span>
                </MainButton>
            </Div>
            <ToastContainer
                position='top-center'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </Div>
    );
};

export default RightPageContent;
