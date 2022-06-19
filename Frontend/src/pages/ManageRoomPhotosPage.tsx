import { FC, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import Header from "../components/Header";
import { fetchRoomById, roomState, setPhotos } from "../features/room/roomSlice";
import { userState } from "../features/user/userSlice";
import { Div, Image } from "../globalStyle";
import { callToast, getImage } from "../helpers";

import $ from "jquery";
import "./css/manage_photos.css";
import Toast from "../components/notify/Toast";
import axios from "../axios";
import { IUser } from "../types/user/type_User";
import { IRoomDetails } from "../types/room/type_RoomDetails";

interface IManageRoomPhotosPageProps {}

let photos: File[] = [];
let fileReaderResult = new Map();
let isUploaded = false;

const ManageRoomPhotosPage: FC<IManageRoomPhotosPageProps> = () => {
    const dispatch = useDispatch();
    const { roomid } = useParams();
    const { room } = useSelector(roomState);
    const { user } = useSelector(userState);
    const { pathname } = useLocation();
    const [firstTime, setFirstTime] = useState(true);

    useEffect(() => {
        dispatch(fetchRoomById({ roomid: roomid! }));
    }, []);

    useEffect(() => {
        if (user && room) {
            const uploadPhotos: JQuery<HTMLInputElement> = $("#uploadPhotos");
            $("#triggerUploadPhotosInput").on("click", function (e) {
                e.preventDefault();
                uploadPhotos.trigger("click");
            });

            uploadPhotos.off("change").on("change", function () {
                readURL(this.files as any, uploadPhotos);
            });

            if (firstTime) {
                restoreRoomImages(uploadPhotos);
                setFirstTime(false);
            }
        }
    }, [user, room]);

    // useEffect(() => {
    //     if (user && room) {
    //         initComp(user, room);
    //     }
    // }, [user, room]);

    async function restoreRoomImages(uploadPhotos: JQuery<HTMLInputElement>) {
        let username: string = "",
            roomImages: string[] = [];

        if (pathname!.toString().includes("details/photos")) {
            roomImages = room!.images;
            username = user!.email;
        } else if (localStorage.getItem("room")) {
            const roomLS = JSON.parse(localStorage.getItem("room")!);
            roomImages = roomLS.roomImages.push as string[];
            username = roomLS.username;
        }

        if (roomImages && roomImages.length >= 5) {
            isUploaded = true;
        }

        const formData = new FormData();
        formData.set("username", username);
        formData.set("folderno", room!.id + "");
        roomImages.forEach((image: string) =>
            formData.append("roomImages", image.split("/")[image.split("/").length - 1])
        );
        formData.append("roomImages", room!.thumbnail.split("/").pop()!);

        const data = await axios.post(`/become-a-host/get-upload-photos`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        if (data) {
            const filesArr = (data as any).roomImages.map((e: any) => {
                console.log(e);
                var array = new Uint8Array(e.bytes);
                const blob = new Blob([array], { type: "image/jpeg" });
                return new File([blob], e.name, {
                    type: `image/jpeg`,
                });
            });
            readURL(filesArr, uploadPhotos);
        }
    }

    function previewImage(
        file: File,
        parent: JQuery<HTMLElement>,
        thumbnail = false,
        modifier: number
    ) {
        const defer = $.Deferred();
        const fileReader = new FileReader();
        const photoAction = $(`
        <div class="photoAction">
            <button class="photo-action__btn" data-index="${modifier}">
                <span>
                    <img src="${getImage(
                        "/amentity_images/threedot.svg"
                    )}" width="16px" height="16px"/>
                </span>
            </button>
            <div class="photo-action__div-hidden">
                <ul data-index="${modifier}">
               

                    <li class="deleteImage">Xóa ảnh</li>
                </ul>
            </div>
        </div>
    `);

        //  <li class="moveImageBackward">Di chuyển về phía sau</li>
        // <li class="moveImageForward">Di chuyển về phía trước</li>
        // <li class="makeMainImage">Chọn làm ảnh chính</li>

        fileReader.onload = function (e: any) {
            if (!thumbnail) {
                const div = $(`
                <div class="photo-cover">
                    <img class="photo" src="${e.target.result}" data-index="${modifier}"/>
                </div>
            `);

                div.append(photoAction);
                parent.append(div);
            } else {
                const image = $(
                    ` <img class="photo" src="${e.target.result}" data-index="${modifier}"/>`
                );
                parent.append(image);
                // parent.append(photoAction);
            }
            console.log(modifier);
            fileReaderResult.set(modifier, e.target.result);
            console.log(fileReaderResult.keys());
        };

        fileReader.onloadend = function () {
            $(".photo-action__btn").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        displayAction($(this));
                    });
            });

            $(".moveImageBackward").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        moveImageBackward(parseInt($(this).parent("ul").data("index")));
                    });
            });

            $(".moveImageForward").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        moveImageForward(parseInt($(this).parent("ul").data("index")));
                    });
            });

            $(".makeMainImage").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        makeMainImage(parseInt($(this).parent("ul").data("index")));
                    });
            });

            $(".deleteImage").each(function () {
                $(this)
                    .off("click")
                    .on("click", function () {
                        deleteImage(parseInt($(this).parent("ul").data("index")));
                    });
            });

            defer.resolve();
        };

        fileReader.readAsDataURL(file);
        return defer.promise();
    }

    function doPreviewImage(files: File[] | FileList, subImagesContainer: JQuery<HTMLElement>) {
        //first image for thumbnail
        const defer = $.Deferred();
        let fileIndex = 0;
        for (let i = 0; i < files.length; i++) {
            if (files[i].name.toString() === room?.thumbnail.split("/").pop()) {
                fileIndex = i;
                break;
            }
        }

        var promise = previewImage(files[fileIndex], $("#thumbnailPhotos"), true, 0);

        (promise as any).done(function () {
            photos.push(files[fileIndex]);
            // dispatch(setPhotos(files[fileIndex]));
            // setPhotos(photos => [...photos, files[fileIndex]]);

            if (photos.length === files.length) {
                defer.resolve();
            }

            for (let i = 0; i < files.length; i++) {
                if (i === fileIndex) continue;
                const promise = previewImage(files[i], subImagesContainer, false, i);
                promise.done(function () {
                    photos.push(files[i]);
                    // dispatch(setPhotos(files[i]));
                    // setPhotos(photos => [...photos, files[i]]);
                    if (photos.length === files.length) defer.resolve();
                });
            }
        });

        //the rest of images
        return defer.promise();
    }

    function doPreviewImageSecondTime(
        files: File[] | FileList,
        subImagesContainer: JQuery<HTMLElement>
    ) {
        const defer = $.Deferred();
        let count = 0;

        var promise = previewImage(files[0], subImagesContainer, false, photos.length);

        promise.done(function () {
            // setPhotos(photos => {
            //     console.log(photos);
            //     return [...photos, files[0]];
            // });
            // dispatch(setPhotos(files[0]));
            photos.push(files[0]);
            count++;

            if (count === files.length) {
                defer.resolve();
            } else {
                let lastIndex = photos.length;

                for (let i = 1; i < files.length; i++) {
                    const promise = previewImage(files[i], subImagesContainer, false, lastIndex++);

                    promise.done(function () {
                        photos.push(files[i]);
                        // dispatch(setPhotos(files[i]));
                        // setPhotos(photos => [...photos, files[i]]);
                        count++;
                        if (count === files.length) {
                            defer.resolve();
                        }
                    });
                }
            }
        });

        return defer.promise();
    }

    function readURL(files: File[] | FileList, uploadPhotos: JQuery<HTMLInputElement>) {
        const subImagesContainer = $("#subImages");
        console.log(files);
        console.log("photos.length: ", photos.length);
        if (photos.length === 0) {
            if (files.length > 0) {
                $(".photosContainer").addClass("active");
                $(".drag_n_drop_zone").addClass("disabled");

                if (files.length === 5) $("#addAtLeast5Images").text("Hoàn tất! Bạn thấy thế nào?");

                var promise = doPreviewImage(files, subImagesContainer);
                promise.done(function () {
                    console.log("promise call back");
                    addEmptyImage(files, uploadPhotos, subImagesContainer);
                });
            }
        } else {
            if (files.length > 0) {
                console.log("doPreviewImageSecondTime");
                const singleImageContainer = $(".singleImageContainer");
                singleImageContainer.remove();

                if (photos.length === 5)
                    $("#addAtLeast5Images").text("Hoàn tất! Bạn thấy thế nào?");

                var promise = doPreviewImageSecondTime(files, subImagesContainer);
                promise.done(function () {
                    addEmptyImage(photos, uploadPhotos, subImagesContainer);
                });
            }
        }
    }

    function addEmptyImage(
        files: File[] | FileList,
        uploadPhotos: JQuery<HTMLInputElement>,
        subImagesContainer: JQuery<HTMLElement>
    ) {
        if (files.length - 1 < 4) {
            for (let i = 0; i <= 4 - files.length; i++) {
                const div = $(
                    `<div class="singleImageContainer containerOfImageIcon">
                    <img class="imageIcon" src="${getImage("/amentity_images/single_image.svg")}"/>
                </div>`
                );
                subImagesContainer.append(div);
            }
        } else {
            const div = $(
                `<div class="singleImageContainer containerOfImageIcon">
                <img class="imageIcon" src="${getImage("/amentity_images/single_image.svg")}"/>
            </div>`
            );

            subImagesContainer.append(div);
        }

        const singleImageContainer = $(".singleImageContainer");
        if (singleImageContainer.length > 0) {
            singleImageContainer.each(function (e) {
                if (
                    !$(this).children(`img[src="${getImage("/amentity_images/single_image.svg")}"]`)
                ) {
                    $(this).removeClass("singleImageContainer");
                    $(this).off("click");
                } else {
                    $(this)
                        .off("click")
                        .on("click", function (e) {
                            e.preventDefault();
                            e.stopPropagation();

                            uploadPhotos.trigger("click");
                        });
                }
            });
        }
    }

    function displayAction(self: JQuery<HTMLElement>) {
        const sibling = self.siblings(".photo-action__div-hidden");

        if (sibling.hasClass("active")) sibling.removeClass("active");
        else sibling.addClass("active");
    }

    function swapPosition(firstEl: any, secondEl: any) {
        const temp = photos[firstEl];
        photos[firstEl] = photos[secondEl];
        photos[secondEl] = temp;
    }

    function changePreviewImage(firstEl: any, secondEl: any, fromDelete: boolean = false) {
        console.log(fileReaderResult.keys());
        const fr1 = fileReaderResult.get(firstEl);
        const fr2 = fileReaderResult.get(secondEl);

        if (fromDelete) {
            $("#subImages")
                .children(".photo-cover")
                .children(`img[data-index="${firstEl}"]`)
                .empty();

            return;
        }

        console.log(fr1);
        console.log(fr2);

        if (firstEl === 0 && !fromDelete) {
            $("#thumbnailPhotos").children("img").attr("src", fr2);
        } else {
            $("#subImages")
                .children(".photo-cover")
                .children(`img[data-index="${firstEl}"]`)
                .attr("src", fr2);
        }

        if (secondEl === 0) {
            $("#thumbnailPhotos").children("img").attr("src", fr1);
        } else {
            $("#subImages")
                .children(".photo-cover")
                .children(`img[data-index="${secondEl}"]`)
                .attr("src", fr1);
        }
        if (!fromDelete) {
            fileReaderResult.set(firstEl, fr2);
            fileReaderResult.set(secondEl, fr1);
        } else {
            // fileReaderResult.delete(firstEl);
        }
    }

    function closeAction(index: number) {
        const _self = $(`button[data-index="${index}"]`);

        const sibling = _self.siblings(".photo-action__div-hidden");
        if (sibling.hasClass("active")) sibling.removeClass("active");
    }

    function makeMainImage(index: number) {
        swapPosition(0, index);
        changePreviewImage(0, index);
        closeAction(index);
    }

    function moveImageBackward(index: number) {
        if (index === 1) {
            makeMainImage(index);
        } else {
            swapPosition(index, index - 1);
            changePreviewImage(index, index - 1);
            closeAction(index);
        }
    }

    function moveImageForward(index: number) {
        if (index === 0) {
            makeMainImage(index + 1);
        } else {
            swapPosition(index, index + 1);
            changePreviewImage(index, index + 1);
            closeAction(index);
        }
    }

    function deleteImage(index: number) {
        if (photos.length === 1) {
            // if just one image left
            photos = [];
            $("#thumbnailPhotos").children(".photo").remove();
            $(".photosContainer").removeClass("active");
            $(".drag_n_drop_zone").removeClass("disabled");
            $("#subImages").empty();
        }

        photos.splice(index + 1, 1);

        // Remove preview image
        // const lastElement = $("#subImages").children(".photo-cover").last();
        // lastElement.remove();

        const subImagesContainer = $("#subImages");
        const uploadPhotos: JQuery<HTMLInputElement> = $("#uploadPhotos");
        let b = 0;
        if (photos.length < 4) {
            $(".singleImageContainer.containerOfImageIcon").length > 2
                ? (b = 1)
                : addEmptyImage(photos, uploadPhotos, subImagesContainer);
        }

        uploadImages();
    }

    function backToEditPage() {
        window.location.href = `${window.location.origin}/manage-your-space/${room?.id}/details`;
    }

    function displayEditThumbnailBox() {
        $(".radioThumbnail").each(function () {
            if ($(this).val() === room?.thumbnail.split("/").pop()!) {
                $(this).prop("checked", true);
            } else $(this).prop("checked", false);
        });

        $("#chooseRoomThumbnail").css("display", "block");
    }

    function uploadImages() {
        uploadImagesToFolder(user!, room!);
    }

    async function uploadImagesToFolder(user: IUser, room: IRoomDetails) {
        const formData = new FormData();
        formData.set("host", user.email);
        formData.set("roomId", room?.id.toString());
        console.log(photos);
        photos
            .filter(photo => photo !== undefined)
            .forEach(photo => formData.append("photos", photo));
        // console.log(formData);

        console.log(photos);

        const data = await axios.post(`/become-a-host/update/upload-room-photos`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });

        console.log(data);

        if (data) {
            window.location.href = `${window.location.origin}/manage-your-space/${
                room!.id
            }/details/photos`;
        }
    }

    let allRoomImages: string[] = [];
    function hideEditThumbnailBox() {
        $(".radioThumbnail").each(function () {
            if ($(this).val() === room?.thumbnail.split("/").pop()!) {
                $(this).prop("checked", true);
            } else $(this).prop("checked", false);
        });

        allRoomImages.concat(room!.images).push(room!.thumbnail);

        $("#chooseRoomThumbnail").css("display", "none");
    }

    function dropHandler(e: React.DragEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();

        // FileList object.
        var files = e.dataTransfer.files;
        const uploadPhotos: JQuery<HTMLInputElement> = $("#uploadPhotos");
        readURL(files, uploadPhotos);
    }

    function dragoverHandler(e: React.DragEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();
        // Explicitly show this is a copy.
        e.dataTransfer.dropEffect = "copy";
    }

    function previewRoom() {
        window.location.href = `${window.location.origin}/room/${room?.id}`;
    }

    async function saveNewThumbnail() {
        const postURL = `/manage-your-space/update/${room?.id}/thumbnail`;
        const thumbnailName = $('input[type="radio"]:checked').val();

        console.log(thumbnailName);

        const data = await axios.post(
            postURL,
            {
                thumbnail: thumbnailName,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (data)
            window.location.href = `${window.location.origin}/manage-your-space/${room?.id}/details/photos`;
    }

    return (
        <Div className='p-relative' height='100vh'>
            <Header includeMiddle={true} excludeBecomeHostAndNavigationHeader={true} />
            <div id='main'>
                <div id='manage-photos__container'>
                    <div className='manage-ys__left'>
                        <div id='roomName'>{room?.name}</div>
                        <div className='manage-ys__left-scrolling-menu'>
                            <div className='manage-ys__left-room-details normal-flex'>
                                <span
                                    style={{
                                        display: "inline-block",
                                        marginRight: "5px",
                                        cursor: "pointer",
                                    }}
                                    onClick={backToEditPage}
                                >
                                    <Image src={getImage("/svg/close3.svg")} size='15px' />{" "}
                                </span>
                                <span className='inline-block'>Ảnh</span>
                            </div>
                            <div style={{ height: "fit-content" }} className='menuContainer'>
                                <ul style={{ height: "100%" }}>
                                    <li className='active' data-index='1'>
                                        <div className='li-before'></div>
                                        <a
                                            className='manage-ys__changeView'
                                            data-scroll='#roomThumbnail'
                                        >
                                            Ảnh bìa
                                        </a>
                                    </li>
                                    <li data-index='2'>
                                        <div className='li-before'></div>
                                        <a
                                            className='manage-ys__changeView'
                                            data-scroll='#roomAllImages'
                                        >
                                            Tất cả ảnh
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className='manage-ys__right'>
                        <div style={{ maxWidth: "869px" }}>
                            <div className='flex-space' style={{ marginBottom: "48px" }}>
                                <div className='normal-flex'>
                                    <div>
                                        <button className='manage-ys__transparent-btn'>
                                            <span>
                                                {!room?.status ? (
                                                    <Image
                                                        src={getImage("/svg/reddot.svg")}
                                                        size='10px'
                                                    />
                                                ) : (
                                                    <Image
                                                        src={getImage("/svg/greendot.svg")}
                                                        size='10px'
                                                    />
                                                )}
                                            </span>
                                            <span>
                                                {" "}
                                                <span>
                                                    {!room?.status ? "Đã hủy đăng" : "Đang đăng"}
                                                </span>
                                            </span>
                                        </button>
                                    </div>
                                    <div>
                                        <button className='manage-ys__transparent-btn'>
                                            <span>
                                                <Image
                                                    src={getImage("/svg/thunder.svg")}
                                                    size='10px'
                                                />
                                            </span>
                                            <span>Chế độ đặt ngay đang bật</span>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        className='manage-photos__normal-btn'
                                        onClick={previewRoom}
                                    >
                                        Xem trước nhà phòng cho thuê
                                    </button>
                                </div>
                            </div>

                            <div
                                className='normal-flex'
                                style={{
                                    borderBottom: "1px solid rgb(211, 211, 211)",
                                    height: "328px",
                                }}
                            >
                                <div className='flex-50'>
                                    <div className='manage-photos__title' id='roomThumbnail'>
                                        Ảnh bìa
                                    </div>
                                    <div
                                        className='manage-photos__subtitle'
                                        style={{ marginTop: "15px" }}
                                    >
                                        Ảnh bìa là ấn tượng đầu tiên của khách về nhà/phòng cho thuê
                                        của bạn.
                                    </div>
                                    <div style={{ marginTop: "30px" }}>
                                        <button
                                            className='manage-photos__normal-btn'
                                            onClick={displayEditThumbnailBox}
                                        >
                                            Thay đổi ảnh
                                        </button>
                                    </div>
                                </div>
                                <div className='flex-50' id='thumbnailPhotos'></div>
                            </div>

                            <div style={{ marginTop: "50px" }}>
                                <div className='flex-space'>
                                    <div className='manage-photos__title' id='roomAllImages'>
                                        Tất cả ảnh
                                    </div>
                                    <div>
                                        <button
                                            className='manage-photos__normal-btn'
                                            onClick={uploadImages}
                                        >
                                            <Image
                                                src={getImage("/amentity_images/upload.svg")}
                                                size='22px'
                                            />
                                            <span>Tải ảnh lên</span>
                                        </button>
                                    </div>
                                </div>
                                <div id='photosContainer__body'>
                                    <input
                                        type='file'
                                        name='room_photos'
                                        id='uploadPhotos'
                                        accept='images/*'
                                        hidden
                                        multiple
                                    />
                                    <div id='subImages'></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id='chooseRoomThumbnail'>
                <div className='flex flex jc-center'>
                    <div className='innerWrapper'>
                        <div id='boxHeader' className='normal-flex'>
                            <div onClick={hideEditThumbnailBox}>
                                <Image
                                    src={getImage("/svg/close2.svg")}
                                    size='16px'
                                    style={{ cursor: "pointer" }}
                                />
                            </div>
                            <div className='manage-photos__title jc-center flex f1'>
                                Chọn ảnh bìa
                            </div>
                        </div>
                        <div id='boxBody'>
                            <div className='grid-3'>
                                {room?.images.map(image => (
                                    <div
                                        key={image}
                                        style={{
                                            width: "calc(712px / 3)",
                                            height: "calc(296px / 2)",
                                            position: "relative",
                                        }}
                                    >
                                        <img src={getImage(image)} className='w-100 h-100 of-c' />
                                        <div
                                            style={{
                                                position: "absolute",
                                                top: "8px",
                                                left: "8px",
                                            }}
                                        >
                                            <input
                                                type='radio'
                                                className='radioThumbnail'
                                                value={
                                                    image.split("/")[image.split("/").length - 1]
                                                }
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div id='boxFooter' className='flex-space'>
                            <div>
                                {/* <button
                                    className='manage-ys__transparent-btn'
                                    id='triggerUploadPhotosInput'
                                >
                                    Tải ảnh lên
                                </button> */}
                                <button
                                    className='manage-photos__cancel-btn'
                                    onClick={hideEditThumbnailBox}
                                >
                                    Hủy
                                </button>
                            </div>
                            <div>
                                <button
                                    className='manage-photos__save-edit-btn'
                                    onClick={saveNewThumbnail}
                                >
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast />
        </Div>
    );
};

export default ManageRoomPhotosPage;
