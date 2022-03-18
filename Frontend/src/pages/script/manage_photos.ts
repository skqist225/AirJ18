import { IRoomDetails } from '../../types/room/type_RoomDetails';
import { IUser } from '../../types/user/type_User';
import { animate, getOffsetTop } from './manage_your_space';
import axios from '../../axios';
import { callToast, getImage } from '../../helpers';

import $ from 'jquery';

let photos: File[] = [];
let fileReaderResult = new Map();
let isUploaded = false;

export default function initComp(user: IUser, room: IRoomDetails) {
    const thumbnail = room?.thumbnail;
    const uploadPhotos: JQuery<HTMLInputElement> = $('#uploadPhotos');

    $('#triggerUploadPhotosInput').on('click', function (e) {
        e.preventDefault();
        uploadPhotos.trigger('click');
    });

    uploadPhotos.on('change', function () {
        readURL(this.files as any, uploadPhotos);
    });

    restoreRoomImages(uploadPhotos, user, room);

    $('.manage-ys__changeView').each(function () {
        $(this)
            .off('click')
            .on('click', function () {
                const dataScroll = $(this).data('scroll');
                const offsetTop = $(dataScroll).offset()!.top - 80;
                $(document).off('scroll');
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth',
                });

                animate($(this) as JQuery<HTMLElement>);
            });
    });

    const roomThumbnailTopValue = getOffsetTop('#roomThumbnail');
    const roomAllImagesTopValue = getOffsetTop('#roomAllImages');

    let anchorRoomThumbnail = $('a[data-scroll="#roomThumbnail"]');
    let anchorRoomAllImages = $('a[data-scroll="#roomAllImages"]');

    $(document)
        .off('scroll')
        .on('scroll', function (e) {
            const topValue: number = $(document).scrollTop()!;

            if (topValue <= roomThumbnailTopValue) {
                if ($('.manage--ys__scrolling--menu').first().hasClass('active'))
                    $('.manage--ys__scrolling--menu').first().removeClass('active');
            } else if (topValue > roomThumbnailTopValue && topValue < roomAllImagesTopValue) {
                animate(anchorRoomThumbnail);
            } else animate(anchorRoomAllImages);
        });

    const nameThumbnail = thumbnail!.split('/').pop();
    $('.radioThumbnail').each(function () {
        if ($(this).val() === nameThumbnail) {
            $(this).prop('checked', true);
        }

        $(this).on('change', function () {
            const self = $(this);
            $('.radioThumbnail').each(function () {
                if (!$(this).is(self)) $(this).prop('checked', false);
            });
        });
    });
}

async function restoreRoomImages(
    inputUploadPhotos: JQuery<HTMLInputElement>,
    user: IUser,
    room: IRoomDetails
) {
    isUploaded = true;

    const formData = new FormData();
    formData.set('username', user.email);
    formData.set('folderno', room!.id + '');

    const allRoomImages = [room.thumbnail, ...room.images];
    allRoomImages
        .map(image => image.split('/').pop()!)
        .forEach((image: string) => formData.append('roomImages', image));

    const {
        data: { roomImages },
    } = await axios.post(`/become-a-host/get-upload-photos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (roomImages) {
        const filesArrPromise = roomImages.map((e: any) => {
            var array = new Uint8Array(e.bytes);
            const blob = new Blob([array], { type: 'image/jpeg' });
            return Promise.resolve(
                new File([blob], e.name, {
                    type: `image/jpeg`,
                })
            );
        });

        //swap index of thumbnail and file arrays
        const filesArr = await Promise.all(filesArrPromise);
        const indexOfThumbnail = filesArr.findIndex(
            ({ name }: { name: string }) => name === room.thumbnail.split('/').pop()!
        );

        if (indexOfThumbnail !== -1 && indexOfThumbnail !== 0) {
            const temp = filesArr[indexOfThumbnail];
            filesArr[indexOfThumbnail] = filesArr[0];
            filesArr[0] = temp;
        }

        readURL(filesArr, inputUploadPhotos);
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
                        '/amentity_images/threedot.svg'
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
        let appendedTag: JQuery<HTMLElement>;
        if (thumbnail)
            appendedTag = $(
                ` <img class="photo" src="${e.target.result}" data-index="${modifier}" data-image-name="${file.name}"/>`
            );
        else {
            appendedTag = $(`
                <div class="photo-cover">
                    <img class="photo" src="${e.target.result}" data-index="${modifier}" data-image-name="${file.name}"/>
                </div>
            `);

            appendedTag.append(photoAction);
        }

        parent.append(appendedTag);
        fileReaderResult.set(file.name, e.target.result);
    };

    fileReader.onloadend = function () {
        $('.photo-action__btn').each(function () {
            $(this)
                .off('click')
                .on('click', function () {
                    displayAction($(this));
                });
        });

        $('.moveImageBackward').each(function () {
            $(this)
                .off('click')
                .on('click', function () {
                    moveImageBackward(parseInt($(this).parent('ul').data('index')));
                });
        });

        $('.moveImageForward').each(function () {
            $(this)
                .off('click')
                .on('click', function () {
                    moveImageForward(parseInt($(this).parent('ul').data('index')));
                });
        });

        $('.makeMainImage').each(function () {
            $(this)
                .off('click')
                .on('click', function () {
                    makeMainImage(parseInt($(this).parent('ul').data('index')));
                });
        });

        $('.deleteImage').each(function () {
            $(this)
                .off('click')
                .on('click', function () {
                    deleteImage(parseInt($(this).parent('ul').data('index')));
                });
        });

        defer.resolve();
    };

    fileReader.readAsDataURL(file);
    return defer.promise();
}

const appendedPhotosMapFirstTime = new Map<string, File>();
function doPreviewImage(files: File[] | FileList, subPhotosContainer: JQuery<HTMLElement>) {
    //first image for thumbnail
    const defer = $.Deferred();

    var promise = previewImage(files[0], $('#thumbnailPhotos'), true, 0);
    promise.done(function () {
        appendedPhotosMapFirstTime.set(files[0].name, files[0]);

        //resolve until all files are appended
        if (appendedPhotosMapFirstTime.size === files.length) defer.resolve();

        for (let i = 1; i < files.length; i++) {
            const promise = previewImage(files[i], subPhotosContainer, false, i);
            promise.done(function () {
                appendedPhotosMapFirstTime.set(files[i].name, files[i]);
                //resolve until all files are appended
                if (appendedPhotosMapFirstTime.size === files.length) defer.resolve();
            });
        }
    });

    //the rest of images
    return defer.promise();
}

const appendedPhotosMapAfterFirstTime = new Map();
export function doPreviewImageSecondTime(
    files: File[] | FileList,
    subPhotosContainer: JQuery<HTMLElement>
) {
    const defer = $.Deferred();
    let count = 0;

    var promise = previewImage(files[0], subPhotosContainer, false, photos.length);

    promise.done(function () {
        appendedPhotosMapAfterFirstTime.set(files[0].name, files[0]);
        count++;

        if (count === files.length) defer.resolve();
        else {
            let lastIndex = photos.length;

            for (let i = 1; i < files.length; i++) {
                const promise = previewImage(files[i], subPhotosContainer, false, lastIndex++);

                promise.done(function () {
                    appendedPhotosMapAfterFirstTime.set(files[i].name, files[i]);
                    count++;

                    if (count === files.length) defer.resolve();
                });
            }
        }
    });

    return defer.promise();
}

function readURL(files: File[] | FileList, inputUploadPhotos: JQuery<HTMLInputElement>) {
    const subPhotosContainer = $('#subImages');

    //first time render
    if (photos.length === 0) {
        if (files.length > 0) {
            var promise = doPreviewImage(files, subPhotosContainer);

            promise.done(function () {
                let doneArray: File[] = [];
                let count = 1;

                $('.photo').each(function () {
                    const imageName = $(this).data('image-name');
                    if ($(this).data('index') === undefined) {
                        //asign index for siblings (photo action)
                        const siblings = $(this).siblings();
                        siblings.children('.photo-action__btn').attr('data-index', count);
                        siblings
                            .children('.photo-action__div-hidden')
                            .children('ul')
                            .attr('data-index', count);
                        $(this).attr('data-index', count++);

                        doneArray.push(appendedPhotosMapFirstTime.get(imageName)!);
                    } else photos.push(appendedPhotosMapFirstTime.get(imageName)!);

                    $(this).removeAttr('data-image-name');
                });

                photos = [...photos, ...doneArray];
                addEmptyImage(files, inputUploadPhotos, subPhotosContainer);
            });
        }
    } else {
        //second time render
        //remove empty images
        const singleImageContainer = $('.singleImageContainer');
        singleImageContainer.remove();

        var promise = doPreviewImageSecondTime(files, subPhotosContainer);

        promise.done(function () {
            let doneArray: File[] = [];
            let count = photos.length;
            $('.photo').each(function () {
                const imageName = $(this).data('image-name');
                if ($(this).data('index') === undefined) {
                    //asign index for siblings (photo action)
                    const siblings = $(this).siblings();
                    siblings.children('.photo-action__btn').attr('data-index', count);
                    siblings
                        .children('.photo-action__div-hidden')
                        .children('ul')
                        .attr('data-index', count);
                    $(this).attr('data-index', count++);

                    doneArray.push(appendedPhotosMapAfterFirstTime.get(imageName));
                } else {
                    if (!photos.some(photo => photo.name === imageName)) {
                        photos.push(appendedPhotosMapAfterFirstTime.get(imageName)!);
                    }
                }
                $(this).removeAttr('data-image-name');
            });

            photos = [...photos, ...doneArray];
            addEmptyImage(photos, inputUploadPhotos, subPhotosContainer);
        });
    }
}

export function addEmptyImage(
    files: File[] | FileList,
    uploadPhotos: JQuery<HTMLInputElement>,
    subImagesContainer: JQuery<HTMLElement>
) {
    if (files.length - 1 < 4) {
        for (let i = 0; i <= 4 - files.length; i++) {
            const div = $(
                `<div class="singleImageContainer containerOfImageIcon">
                    <img class="imageIcon" src="${getImage('/amentity_images/single_image.svg')}"/>
                </div>`
            );
            subImagesContainer.append(div);
        }
    } else {
        const div = $(
            `<div class="singleImageContainer containerOfImageIcon">
                <img class="imageIcon" src="${getImage('/amentity_images/single_image.svg')}"/>
            </div>`
        );

        subImagesContainer.append(div);
    }

    const singleImageContainer = $('.singleImageContainer');
    if (singleImageContainer.length > 0) {
        singleImageContainer.each(function (e) {
            if (!$(this).children(`img[src="${getImage('/amentity_images/single_image.svg')}"]`)) {
                $(this).removeClass('singleImageContainer');
                $(this).off('click');
            } else {
                $(this).on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    uploadPhotos.trigger('click');
                });
            }
        });
    }
}

function displayAction(self: JQuery<HTMLElement>) {
    const sibling = self.siblings('.photo-action__div-hidden');

    if (sibling.hasClass('active')) sibling.removeClass('active');
    else sibling.addClass('active');
}

function swapPosition(firstEl: any, secondEl: any) {
    const temp = photos[firstEl];
    photos[firstEl] = photos[secondEl];
    photos[secondEl] = temp;
}

function changePreviewImage(firstEl: any, firstIndex: any, secondEl: any, secondIndex: any) {
    const fr1 = fileReaderResult.get(firstEl);
    const fr2 = fileReaderResult.get(secondEl);

    if (firstIndex === 0) $('#thumbnailPhotos').children('img').attr('src', fr1);
    else
        $('#subImages')
            .children('.photo-cover')
            .children(`img[data-index="${firstIndex}"]`)
            .attr('src', fr1);

    if (secondIndex === 0) $('#thumbnailPhotos').children('img').attr('src', fr2);
    else
        $('#subImages')
            .children('.photo-cover')
            .children(`img[data-index="${secondIndex}"]`)
            .attr('src', fr2);

    fileReaderResult.set(firstEl, fr1);
    fileReaderResult.set(secondEl, fr2);
}

function closeAction(index: number) {
    const _self = $(`button[data-index="${index}"]`);

    const sibling = _self.siblings('.photo-action__div-hidden');
    if (sibling.hasClass('active')) sibling.removeClass('active');
}

function makeMainImage(index: number) {
    swapPosition(0, index);

    const firstElName = photos[0].name;
    const secondElName = photos[index].name;

    changePreviewImage(firstElName, 0, secondElName, index);
    closeAction(index);
}

function moveImageBackward(index: number) {
    if (index === 1) {
        makeMainImage(index);
    } else {
        swapPosition(index, index - 1);

        const firstElName = photos[index].name;
        const secondElName = photos[index - 1].name;

        changePreviewImage(firstElName, index, secondElName, index - 1);
        closeAction(index);
    }
}

function moveImageForward(index: number) {
    if (index === 0) {
        makeMainImage(index + 1);
    } else {
        swapPosition(index, index + 1);

        const firstElName = photos[index].name;
        const secondElName = photos[index + 1].name;

        changePreviewImage(firstElName, index, secondElName, index + 1);
        closeAction(index);
    }
}

function deleteImage(index: number) {
    if (photos.length === 1) {
        // if just one image left
        photos = [];
        $('#thumbnailPhotos').children('.photo').remove();
        $('.photosContainer').removeClass('active');
        $('.drag_n_drop_zone').removeClass('disabled');
        $('#subImages').empty();
    }

    for (let i = index + 1; i < photos.length; i++) {
        //shift left all remain image
        moveImageBackward(i);
    }

    //delete image from photos
    delete photos[photos.length - 1];
    photos.length--;
    if (photos.length < 5) {
        isUploaded = false;
    }
    // Remove preview image
    const lastElement = $('#subImages').children('.photo-cover').last();
    lastElement.remove();

    const subImagesContainer = $('#subImages');
    const uploadPhotos: JQuery<HTMLInputElement> = $('#uploadPhotos');
    let b = 0;
    if (photos.length < 4) {
        $('.singleImageContainer.containerOfImageIcon').length > 2
            ? (b = 1)
            : addEmptyImage(photos, uploadPhotos, subImagesContainer);
    }
}

export async function uploadImagesToFolder(user: IUser, room: IRoomDetails) {
    if (photos.length < 5) {
        callToast('warning', 'Vui lòng chọn ít nhất 5 hình ảnh.');
        return;
    }

    const formData = new FormData();
    formData.set('host', user.email);
    formData.set('roomId', room?.id + '');
    photos.filter(photo => photo !== undefined).forEach(photo => formData.append('photos', photo));

    const {
        data: { status },
    } = await axios.post(`/become-a-host/update/upload-room-photos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (status === 'success') {
        window.location.href = `${window.location.origin}manage-your-space/${
            room!.id
        }/details/photos`;
    }
}

// function dropHandler(evt) {
//     evt.stopPropagation();
//     evt.preventDefault();

//     // FileList object.
//     var files = evt.dataTransfer.files;
//     readURL(files);
// }

// function dragoverHandler(evt) {
//     evt.stopPropagation();
//     evt.preventDefault();
//     // Explicitly show this is a copy.
//     evt.dataTransfer.dropEffect = 'copy';
// }
