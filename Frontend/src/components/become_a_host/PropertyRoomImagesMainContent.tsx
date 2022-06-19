import { FC, useEffect, useState } from "react";
import { Image } from "../../globalStyle";
import { callToast, getImage } from "../../helpers";
import axios from "../../axios";
import $ from "jquery";
import "./css/room_images_main_content.css";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { toast, ToastContainer } from "react-toastify";
import { addEmptyImage } from "../../pages/script/manage_photos";
import { userState } from "../../features/user/userSlice";

interface IPropertyRoomImagesMainContentProps {}

const PropertyRoomImagesMainContent: FC<IPropertyRoomImagesMainContentProps> = () => {
    let fileReaderResult = new Map();
    let isUploaded = false;

    const { user } = useSelector(userState);
    let photos: File[] = [];

    useEffect(() => {
        const uploadPhotos: JQuery<HTMLInputElement> = $("#uploadPhotos");
        $("#triggerUploadPhotosInput").on("click", function (e) {
            e.preventDefault();
            uploadPhotos.trigger("click");
        });

        uploadPhotos.on("change", function () {
            readURL(this.files as any, uploadPhotos);
        });

        restoreRoomImages(uploadPhotos);
    }, []);
    async function restoreRoomImages(uploadPhotos: JQuery<HTMLInputElement>) {
        if (localStorage.getItem("room")) {
            const { roomImages, username } = JSON.parse(localStorage.getItem("room")!);
            if (roomImages && roomImages.length >= 5) {
                isUploaded = true;
            }

            const formData = new FormData();
            formData.set("username", username);
            roomImages.forEach((image: string) => formData.append("roomImages", image));

            const data = await axios.post(`/become-a-host/get-upload-photos`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const filesArr = (data as any).roomImages.map((e: any) => {
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
                    <li class="moveImageBackward">Di chuyển về phía sau</li>
                    <li class="moveImageForward">Di chuyển về phía trước</li>
                    <li class="makeMainImage">Chọn làm ảnh chính</li>
                    <li class="deleteImage">Xóa ảnh</li>
                </ul>
            </div>
        </div>
    `);

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
                parent.append(photoAction);
            }

            fileReaderResult.set(modifier, e.target.result);
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

        var promise = previewImage(files[0], $("#thumbnailPhotos"), true, 0);
        promise.done(function () {
            photos.push(files[0]);

            if (photos.length === files.length) {
                defer.resolve();
            }

            for (let i = 1; i < files.length; i++) {
                const promise = previewImage(files[i], subImagesContainer, false, i);
                promise.done(function () {
                    photos.push(files[i]);
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

        if (photos.length === 0) {
            if (files.length > 0) {
                $(".photosContainer").addClass("active");
                $(".drag_n_drop_zone").addClass("disabled");

                if (files.length === 5) $("#addAtLeast5Images").text("Hoàn tất! Bạn thấy thế nào?");

                var promise = doPreviewImage(files, subImagesContainer);
                promise.done(function () {
                    addEmptyImage(files, uploadPhotos, subImagesContainer);
                });
            }
        } else {
            const singleImageContainer = $(".singleImageContainer");
            singleImageContainer.remove();

            if (photos.length === 5) $("#addAtLeast5Images").text("Hoàn tất! Bạn thấy thế nào?");

            var promise = doPreviewImageSecondTime(files, subImagesContainer);
            promise.done(function () {
                addEmptyImage(photos, uploadPhotos, subImagesContainer);
            });
        }
    }

    // function addEmptyImage(
    //     files: File[] | FileList,
    //     uploadPhotos: JQuery<HTMLInputElement>,
    //     subImagesContainer: JQuery<HTMLElement>
    // ) {
    //     if (files.length - 1 < 4) {
    //         for (let i = 0; i <= 4 - files.length; i++) {
    //             const div = $(
    //                 `<div class="singleImageContainer containerOfImageIcon">
    //                 <img class="imageIcon" src="${getImage('/amentity_images/single_image.svg')}"/>
    //             </div>`
    //             );
    //             subImagesContainer.append(div);
    //         }
    //     } else {
    //         const div = $(
    //             `<div class="singleImageContainer containerOfImageIcon">
    //             <img class="imageIcon" src="${getImage('/amentity_images/single_image.svg')}"/>
    //         </div>`
    //         );

    //         subImagesContainer.append(div);
    //     }

    //     const singleImageContainer = $('.singleImageContainer');
    //     if (singleImageContainer.length > 0) {
    //         singleImageContainer.each(function (e) {
    //             if (
    //                 !$(this).children(`img[src="${getImage('/amentity_images/single_image.svg')}"]`)
    //             ) {
    //                 $(this).removeClass('singleImageContainer');
    //                 $(this).off('click');
    //             } else {
    //                 $(this).on('click', function (e) {
    //                     e.preventDefault();
    //                     e.stopPropagation();

    //                     uploadPhotos.trigger('click');
    //                 });
    //             }
    //         });
    //     }
    // }

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

    function changePreviewImage(firstEl: any, secondEl: any) {
        const fr1 = fileReaderResult.get(firstEl);
        const fr2 = fileReaderResult.get(secondEl);

        if (firstEl === 0) {
            console.log("first ele = ", firstEl);
            $("#thumbnailPhotos").children("img").attr("src", fr2);
        } else {
            console.log("first ele = ", firstEl);
            $("#subImages")
                .children(".photo-cover")
                .children(`img[data-index="${firstEl}"]`)
                .attr("src", fr2);
        }

        if (secondEl === 0) {
            console.log("second ele = ", secondEl);
            $("#thumbnailPhotos").children("img").attr("src", fr1);
        } else {
            console.log("second ele = ", secondEl);
            $("#subImages")
                .children(".photo-cover")
                .children(`img[data-index="${secondEl}"]`)
                .attr("src", fr1);
        }

        fileReaderResult.set(firstEl, fr2);
        fileReaderResult.set(secondEl, fr1);
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

        for (let i = index + 1; i < photos.length; i++) {
            //shift left all remain image
            moveImageBackward(i);
        }

        console.log(photos[photos.length - 1]);
        if (localStorage.getItem("room")) {
            const room = JSON.parse(localStorage.getItem("room")!);
            if (room.roomImages && room.roomImages.length) {
                delete room.roomImages[index];
                room.roomImages.length--;
            }

            localStorage.setItem("room", JSON.stringify(room));
        }

        //delete image from photos
        delete photos[photos.length - 1];
        photos.length--;

        if (photos.length < 5) {
            isUploaded = false;
        }

        console.log(photos.length);
        // Remove preview image
        const lastElement = $("#subImages").children(".photo-cover").last();
        lastElement.remove();

        const subImagesContainer = $("#subImages");
        const uploadPhotos: JQuery<HTMLInputElement> = $("#uploadPhotos");
        let b = 0;
        if (photos.length < 4) {
            $(".singleImageContainer.containerOfImageIcon").length > 2
                ? (b = 1)
                : addEmptyImage(photos, uploadPhotos, subImagesContainer);
        }
    }

    async function uploadImagesToFolder() {
        if (photos.length < 5) {
            callToast("warning", "Vui lòng chọn ít nhất 5 hình ảnh.");
            return;
        }

        const formData = new FormData();
        formData.set("host", user!.email);
        photos.forEach(photo => formData.append("photos", photo));

        const data = await axios.post(`/become-a-host/upload-room-photos`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        if ((data.status as any) === "success") {
            isUploaded = true;
            callToast("success", "Tải ảnh lên thành công");
            const username2 = (data as any).username;
            let room = {};
            if (!localStorage.getItem("room")) {
                room = {
                    roomImages: photos.map(({ name }) => name),
                    username: username2,
                };
            } else {
                room = JSON.parse(localStorage.getItem("room")!);
                room = {
                    ...room,
                    roomImages: photos.map(({ name }) => name),
                    username: username2,
                };
            }
            localStorage.setItem("room", JSON.stringify(room));
        }
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

    return (
        <>
            <div
                className='drag_n_drop_zone'
                onDragOverCapture={e => dragoverHandler(e)}
                onDrop={e => dropHandler(e)}
            >
                <div>
                    <Image src={getImage("/amentity_images/photos.svg")} size='64px' />
                </div>
                <div className='photos__drag-title'>Kéo ảnh của bạn vào đây</div>
                <div id=''>Thêm ít nhất 5 ảnh</div>
                <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button className='photos__btn__load-images' id='triggerUploadPhotosInput'>
                        Tải lên từ thiết bị của bạn
                    </button>
                    <input
                        type='file'
                        name='room_photos'
                        id='uploadPhotos'
                        accept='images/*'
                        hidden
                        multiple
                    />
                </div>
            </div>
            <div id='editor' className='photosContainer'>
                <div className='flex-space'>
                    <div>
                        <div
                            style={{
                                fontSize: "22px",
                                color: "#222",
                                fontWeight: "500",
                                lineHeight: "16px",
                            }}
                            id='addAtLeast5Images'
                        >
                            Thêm ít nhất 5 ảnh
                        </div>
                        <div
                            style={{
                                color: "rgb(113, 113, 113)",
                                paddingTop: "4px",
                                fontWeight: "400",
                            }}
                        >
                            Kéo để sắp xếp lại
                        </div>
                    </div>
                    <div>
                        <button className='upload__btn' onClick={uploadImagesToFolder}>
                            <Image src={getImage("/amentity_images/upload.svg")} size='22px' />
                            <span>Tải lên</span>
                        </button>
                    </div>
                </div>
                <div id='photosContainer__body'>
                    <div id='thumbnailPhotos'>
                        <div className='thumbnail-title'>Ảnh bìa</div>
                    </div>
                    <div id='subImages'></div>
                </div>
            </div>
            <ToastContainer
                position='top-right'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    );
};

export default PropertyRoomImagesMainContent;
