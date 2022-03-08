let photos = [];
let fileReaderResult = new Map();
let isUploaded = false;
$(document).ready(function () {
    const uploadPhotos = $('#uploadPhotos');

    $('#triggerUploadPhotosInput').click(function (e) {
        e.preventDefault();
        uploadPhotos.click();
    });

    uploadPhotos.on('change', function () {
        readURL(this.files, uploadPhotos);
    });

    restoreRoomImages(uploadPhotos);
});

async function restoreRoomImages(uploadPhotos) {
    if (localStorage.getItem('room')) {
        const { roomImages, username } = JSON.parse(localStorage.getItem('room'));
        if (roomImages && roomImages.length >= 5) {
            isUploaded = true;
            const formData = new FormData();
            formData.set('username', username);
            roomImages.forEach(image => formData.append('roomImages', image));

            const { data } = await axios.post(
                `${baseURL}api/become-a-host/get-upload-photos`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                }
            );

            const filesArr = data.roomImages.map(e => {
                var array = new Uint8Array(e.bytes);
                const blob = new Blob([array], { type: 'image/jpeg' });
                return new File([blob], e.name, {
                    type: `image/jpeg`,
                });
            });

            readURL(filesArr, uploadPhotos);
        }
    }
}

function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function previewImage(file, parent, thumbnail = false, modifier) {
    const defer = $.Deferred();
    const fileReader = new FileReader();
    const photoAction = $(`
        <div class="photoAction">
            <button class="photo-action__btn" onclick="displayAction(this);" data-index="${modifier}">
                <span>
                    <img src="${baseURL}amentity_images/threedot.svg" width="16px" height="16px"/>
                </span>
            </button>
            <div class="photo-action__div-hidden">
                <ul data-index="${modifier}">
                    <li onclick="moveImageBack($(this).parent('ul').data('index') *
                        1);">Di chuyển về phía sau</li>
                    <li onclick="moveImageForward($(this).parent('ul').data('index') *
                        1);">Di chuyển về phía trước</li>
                    <li onclick="makeMainImage($(this).parent('ul').data('index') *
                        1);">Chọn làm ảnh chính</li>
                    <li onclick="deleteImage($(this).parent('ul').data('index') *
                        1);">Xóa ảnh</li>
                </ul>
            </div>
        </div>
    `);

    fileReader.onload = function (e) {
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
        defer.resolve();
    };

    fileReader.readAsDataURL(file);
    return defer.promise();
}

function doPreviewImage(files, subImagesContainer) {
    //first image for thumbnail
    const defer = $.Deferred();

    var promise = previewImage(files[0], $('#thumbnailPhotos'), true, 0);
    promise.done(function () {
        photos.push(files[0]);

        if (photos.length === files.length) {
            defer.resolve();
        }

        for (let i = 1; i < files.length; i++) {
            const promise = previewImage(files[i], subImagesContainer, false, i);
            promise.done(function () {
                photos.push(files[i]);

                if (photos.length === files.length) {
                    defer.resolve();
                }
            });
        }
    });

    //the rest of images

    return defer.promise();
}

function doPreviewImageSecondTime(files, subImagesContainer) {
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

function readURL(files, uploadPhotos) {
    const subImagesContainer = $('#subImages');
    console.log(files);
    if (photos.length === 0) {
        if (files.length > 0) {
            $('.photosContainer').addClass('active');
            $('.drag_n_drop_zone').addClass('disabled');

            if (photos.length === 5) $('#addAtLeast5Images').text('Hoàn tất!');

            var promise = doPreviewImage(files, subImagesContainer);

            promise.done(function () {
                addEmptyImage(files, uploadPhotos, subImagesContainer);
            });
        }
    } else {
        const singleImageContainer = $('.singleImageContainer');
        singleImageContainer.remove();

        if (photos.length === 5) $('#addAtLeast5Images').text('Hoàn tất!');

        var promise = doPreviewImageSecondTime(files, subImagesContainer);

        promise.done(function () {
            addEmptyImage(photos, uploadPhotos, subImagesContainer);
        });
    }
}

function addEmptyImage(files, uploadPhotos, subImagesContainer) {
    if (files.length - 1 < 4) {
        for (let i = 0; i <= 4 - files.length; i++) {
            const div = $(
                `<div class="singleImageContainer containerOfImageIcon">
                    <img class="imageIcon" src="${baseURL}amentity_images/single_image.svg"/>
                </div>`
            );
            subImagesContainer.append(div);
        }
    } else {
        const div = $(
            `<div class="singleImageContainer containerOfImageIcon">
                <img class="imageIcon" src="${baseURL}amentity_images/single_image.svg"/>
            </div>`
        );

        subImagesContainer.append(div);
    }

    const singleImageContainer = $('.singleImageContainer');
    if (singleImageContainer.length > 0) {
        singleImageContainer.each(function (e) {
            if (!$(this).children(`img[src="${baseURL}amentity_images/single_image.svg"]`)) {
                $(this).removeClass('singleImageContainer');
                $(this).unbind('click');
            } else {
                $(this).click(function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    uploadPhotos.click();
                });
            }
        });
    }
}

function displayAction(self) {
    const _self = $(self);

    const sibling = _self.siblings('.photo-action__div-hidden');

    if (sibling.hasClass('active')) sibling.removeClass('active');
    else sibling.addClass('active');
}

function swapPosition(firstEl, secondEl) {
    const temp = photos[firstEl];
    photos[firstEl] = photos[secondEl];
    photos[secondEl] = temp;
}

function changePreviewImage(firstEl, secondEl) {
    const fr1 = fileReaderResult.get(firstEl);
    const fr2 = fileReaderResult.get(secondEl);

    if (firstEl === 0) {
        console.log('first ele = ', firstEl);
        $('#thumbnailPhotos').children('img').attr('src', fr2);
    } else {
        console.log('first ele = ', firstEl);
        $('#subImages')
            .children('.photo-cover')
            .children(`img[data-index="${firstEl}"]`)
            .attr('src', fr2);
    }

    if (secondEl === 0) {
        console.log('second ele = ', secondEl);
        $('#thumbnailPhotos').children('img').attr('src', fr1);
    } else {
        console.log('second ele = ', secondEl);
        $('#subImages')
            .children('.photo-cover')
            .children(`img[data-index="${secondEl}"]`)
            .attr('src', fr1);
    }

    fileReaderResult.set(firstEl, fr2);
    fileReaderResult.set(secondEl, fr1);
}

function closeAction(index) {
    const _self = $(`button[data-index="${index}"]`);

    const sibling = _self.siblings('.photo-action__div-hidden');
    if (sibling.hasClass('active')) sibling.removeClass('active');
}

function makeMainImage(index) {
    swapPosition(0, index);
    changePreviewImage(0, index);
    closeAction(index);
}

function moveImageBack(index) {
    if (index === 1) {
        makeMainImage(index);
    } else {
        swapPosition(index, index - 1);
        changePreviewImage(index, index - 1);
        closeAction(index);
    }
}

function moveImageForward(index) {
    if (index === 0) {
        makeMainImage(index + 1);
    } else {
        swapPosition(index, index + 1);
        changePreviewImage(index, index + 1);
        closeAction(index);
    }
}

function deleteImage(index) {
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
        moveImageBack(i);
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
    const uploadPhotos = $('#uploadPhotos');
    if (photos.length < 4) {
        addEmptyImage(photos, uploadPhotos, subImagesContainer);
    }
}

let _currentFolderIndex = 0;
async function uploadImagesToFolder() {
    if (photos.length < 5) {
        alertify.warning('Vui lòng chọn ít nhất 5 hình ảnh.');
        return;
    }

    const formData = new FormData();
    formData.set('host', userName);
    photos.forEach(photo => formData.append('photos', photo));

    const {
        data: { status, username },
    } = await axios.post(`${baseURL}api/become-a-host/upload-room-photos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (status === 'success') {
        isUploaded = true;
        alertify.success('Tải ảnh lên thành công!');

        let room = {};
        if (!localStorage.getItem('room')) {
            room = {
                roomImages: photos.map(({ name }) => name),
                username,
            };
        } else {
            room = JSON.parse(localStorage.getItem('room'));
            room = {
                ...room,
                roomImages: photos.map(({ name }) => name),
                username,
            };
        }
        localStorage.setItem('room', JSON.stringify(room));
    }
}

function dropHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    // FileList object.
    var files = evt.dataTransfer.files;
    readURL(files);
}

function dragoverHandler(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    // Explicitly show this is a copy.
    evt.dataTransfer.dropEffect = 'copy';
}

function backtoHomePage() {
    window.location.href = baseURL;
}

function nextPage() {
    if (photos.length >= 5 && isUploaded) {
        photos = [];
        fileReaderResult = new Map();
        isUploaded = false;

        window.location.href = `${baseURL}become-a-host/title`;
    } else {
        alertify.error('Vui lòng chọn đủ  5 ảnh hoặc tải ảnh lên!');
    }
}
