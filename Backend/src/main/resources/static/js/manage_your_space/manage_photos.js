function getOffsetTop(id) {
    return $(id).offset().top - 80;
}

function animate(self) {
    const currentActive = self.parent().siblings().filter('.active');
    const currentDataIndex = currentActive.data('index') * 1;
    currentActive.removeClass('active');
    const selfIndex = self.parent().data('index') * 1;

    let distance = 0;
    if (selfIndex < currentDataIndex) {
        distance = currentDataIndex - selfIndex;

        self.siblings('div').css('transform', `translateY(${distance * 50}%)`);

        $.keyframe.define([
            {
                name: 'reverseTranslateY',
                '0%': { top: `50%` },
                '100%': {
                    top: `-${distance * 50}%`,
                },
            },
        ]);

        self.parent().addClass('active');

        self.siblings('div').playKeyframe({
            name: 'reverseTranslateY',
            duration: '1s',
            timingFunction: 'linear',
            delay: '0s',
        });
    } else {
        distance = selfIndex - currentDataIndex;
        self.siblings('div').css('transform', 'translateY(-50%)');
        $.keyframe.define([
            {
                name: 'translateY',
                '0%': { top: `-${distance * 50}%` },
                '100%': { top: `50%` },
            },
        ]);

        self.parent().addClass('active');

        self.siblings('div').playKeyframe({
            name: 'translateY',
            duration: '1s',
            timingFunction: 'linear',
            delay: '0s',
        });
    }

    $('.manage-ys__left-scrolling-menu').first().addClass('active');
}

async function test(uploadPhotos) {
    isUploaded = true;

    const formData = new FormData();
    formData.set('username', userName);
    formData.set('folderno', roomId);
    roomImages.forEach(image => formData.append('roomImages', image));

    const { data } = await axios.post(`${baseURL}become-a-host/get-upload-photos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    if (data) {
        const filesArr = data.roomImages.map(e => {
            var array = new Uint8Array(e.bytes);
            const blob = new Blob([array], { type: 'image/jpeg' });
            return new File([blob], e.name, {
                type: `image/jpeg`,
            });
        });
        //swap index of thumbnail and file arrays
        const indexOfThumbnail = filesArr.findIndex(({ name }) => name === thumbnail);
        const temp = filesArr[indexOfThumbnail];
        filesArr[indexOfThumbnail] = filesArr[0];
        filesArr[0] = temp;

        readURL(filesArr, uploadPhotos);
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
                    <button class="photo-action__btn" onclick="displayAction(this);" >
                        <span>
                            <img src="${baseURL}amentity_images/threedot.svg" width="16px" height="16px"/>
                        </span>
                    </button>
                    <div class="photo-action__div-hidden">
                        <ul>
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
                            <img class="photo" src="${e.target.result}" data-image-name="${file.name}"/>
                        </div>
                    `);

            div.append(photoAction);
            parent.append(div);
        } else {
            const image = $(
                ` <img class="photo" src="${e.target.result}" data-index="${modifier}" data-image-name="${file.name}"/>`
            );
            parent.append(image);
        }

        fileReaderResult.set(file.name, e.target.result);
    };

    fileReader.onloadend = function () {
        defer.resolve();
    };

    fileReader.readAsDataURL(file);
    return defer.promise();
}

const fakePhotos = new Map();
function doPreviewImage(files, subImagesContainer) {
    //first image for thumbnail
    const defer = $.Deferred();

    var promise = previewImage(files[0], $('#thumbnailPhotos'), true, 0);
    promise.done(function () {
        fakePhotos.set(files[0].name, files[0]);

        if (fakePhotos.size === files.length) {
            defer.resolve();
        }

        for (let i = 1; i < files.length; i++) {
            const promise = previewImage(files[i], subImagesContainer, false, i);
            promise.done(function () {
                fakePhotos.set(files[i].name, files[i]);

                if (fakePhotos.size === files.length) {
                    defer.resolve();
                }
            });
        }
    });

    //the rest of images

    return defer.promise();
}

const fakePhotos2 = new Map();
function doPreviewImageSecondTime(files, subImagesContainer) {
    const defer = $.Deferred();
    let count = 0;

    var promise = previewImage(files[0], subImagesContainer, false, photos.length);

    promise.done(function () {
        fakePhotos2.set(files[0].name, files[0]);
        count++;

        if (count === files.length) {
            defer.resolve();
        } else {
            let lastIndex = photos.length;

            for (let i = 1; i < files.length; i++) {
                const promise = previewImage(files[i], subImagesContainer, false, lastIndex++);

                promise.done(function () {
                    fakePhotos2.set(files[i].name, files[i]);
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
    if (photos.length === 0) {
        if (files.length > 0) {
            var promise = doPreviewImage(files, subImagesContainer);

            promise.done(function () {
                let doneArray = [];
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

                        doneArray.push(fakePhotos.get(imageName));
                    } else {
                        photos.push(fakePhotos.get(imageName));
                    }

                    $(this).removeAttr('data-image-name');
                });

                photos = [...photos, ...doneArray];
                console.log(photos);
                addEmptyImage(files, uploadPhotos, subImagesContainer);
            });
        }
    } else {
        const singleImageContainer = $('.singleImageContainer');
        singleImageContainer.remove();

        var promise = doPreviewImageSecondTime(files, subImagesContainer);

        promise.done(function () {
            let doneArray = [];
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

                    doneArray.push(fakePhotos2.get(imageName));
                } else {
                    if (!photos.some(photo => photo.name === imageName)) {
                        photos.push(fakePhotos2.get(imageName));
                    }
                }
                $(this).removeAttr('data-image-name');
            });
            photos = [...photos, ...doneArray];
            console.log(photos);
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

function changePreviewImage(firstEl, firstIndex, secondEl, secondIndex) {
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

function closeAction(index) {
    const _self = $(`button[data-index="${index}"]`);

    const sibling = _self.siblings('.photo-action__div-hidden');
    if (sibling.hasClass('active')) sibling.removeClass('active');
}

function makeMainImage(index) {
    swapPosition(0, index);

    const firstElName = photos[0].name;
    const secondElName = photos[index].name;

    changePreviewImage(firstElName, 0, secondElName, index);
    closeAction(index);
}

function moveImageBack(index) {
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

function moveImageForward(index) {
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

async function uploadImagesToFolder() {
    if (photos.length < 5) {
        alert('Vui lòng chọn ít nhất 5 hình ảnh.');
        return;
    }

    const formData = new FormData();
    formData.set('username', userName);
    formData.set('folderno', roomId);
    photos.forEach(photo => formData.append('photos', photo));

    const {
        data: { status },
    } = await axios.post(`${baseURL}become-a-host/update/upload-room-photos`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    console.log(status);
    if (status === 'success') {
        window.location.href = `${baseURL}manage-your-space/${roomId}/details/photos`;
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

function backToEditPage() {
    window.location.href = `${baseURL}manage-your-space/${roomId}/details`;
}

function previewRoom() {
    window.location.href = `${baseURL}rooms/${roomId}`;
}
