const getIndex = (array, index) => {
    array.each(function () {
        if ($(this).hasClass('active')) {
            index = $(this).attr('data-index') * 1;
            $(this).removeClass('active');
            return false;
        }
    });

    return index;
};
const addActiveClass = (array, index) => {
    array.each(function () {
        if ($(this).attr('data-index') * 1 === index) {
            $(this).addClass('active');
        }
    });
};
function changeImage(self, className) {
    self = $(self);
    let index;
    let roomImages;
    const functionName = self.attr('data-function-name');
    const roomId = self.attr('data-room-id');
    if (roomId !== undefined) {
        roomImages = $('.' + className + roomId);
    } else {
        console.log('asds');
        roomImages = $('.' + className);
    }

    index = getIndex(roomImages, index);

    if (functionName === 'nextImage') {
        if (++index > roomImages.length) {
            index = 1;
        }
    }

    if (functionName === 'prevImage') {
        if (--index === 0) {
            index = roomImages.length;
        }
    }
    addActiveClass(roomImages, index);
}
