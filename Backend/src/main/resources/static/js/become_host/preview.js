jQuery(document).ready(function () {
    if (localStorage.getItem('room')) {
        const room = JSON.parse(localStorage.getItem('room'));
        const privacyType = room.privacyType.toString();

        $('#roomThumbnail').attr(
            'src',
            `${baseURL}room_images/${room.userName2}/${room.roomImages[0]}`
        );
        $('#room-preview__room-title').text(room.roomTitle);

        $('#room-preview__room-type').text(
            `${privacyType.substring(0, privacyType.lastIndexOf(' '))} ${
                room.roomGroupText
            } cho thuê. Chủ nhà ${room.username}`
        );
        $('#room-preview__room-info').text(
            `${room.guestNumber} khách · ${room.bedRoomNumber} phòng ngủ  · ${room.bedNumber} giường · ${room.bathRoomNumber} phòng tắm`
        );
        $('#room-preview__room-description').text(
            `Thư giãn tại địa điểm nghỉ dưỡng ${room.descriptions[0]
                .toString()
                .toLowerCase()} và ${room.descriptions[1].toString().toLowerCase()} này.`
        );

        $('#room-preview__room-price').text(seperateNumber(room.roomPricePerNight) + 'đ / đêm');

        /*-------------------------------AMENTITIES-----------------------------------------*/
        $('#prominentAmentity').attr(
            'src',
            `${baseURL}amentity_images/${room.prominentAmentityImageName}`
        );
        $('#favoriteAmentity').attr(
            'src',
            `${baseURL}amentity_images/${room.favoriteAmentityImageName}`
        );
        $('#safeAmentity').attr('src', `${baseURL}amentity_images/${room.safeAmentityImageName}`);
        $('#prominentAmentityName').text(room.prominentAmentityName);
        $('#favoriteAmentityName').text(room.favoriteAmentityName);
        $('#safeAmentityName').text(room.safeAmentityName);
        /*-------------------------------AMENTITIES-----------------------------------------*/

        /*-------------------------------LOCATION-----------------------------------------*/
        $('#room-preview__room-location-txt').text(room.place_name);
        /*-------------------------------LOCATION-----------------------------------------*/
    } else {
        window.location.href = baseURL;
    }
});

function backtoHomePage() {
    window.location.href = baseURL;
}

async function nextPage() {
    //store room into db
    if (localStorage.getItem('room')) {
        const room = JSON.parse(localStorage.getItem('room'));
        const placeNameLength = room.place_name.toString().split(',').length;
        let country = room.place_name.toString().split(',')[placeNameLength - 1] || 'no-country';
        const state = room.place_name.toString().split(',')[placeNameLength - 2] || 'no-state';
        const city = room.place_name.toString().split(',')[placeNameLength - 3] || 'no-city';
        const street = room.place_name.toString().split(',')[placeNameLength - 4] || 'no-street';

        const fd = new FormData();

        let amentities = [];
        amentities.push(room.prominentAmentity);
        amentities.push(room.favoriteAmentity);
        amentities.push(room.safeAmentity);

        const roomEntity = {
            name: room.roomTitle,
            amentities,
            images: room.roomImages,
            country: 216,
            state,
            city,
            street,
            bedroomCount: room.bedRoomNumber,
            bathroomCount: room.bathRoomNumber,
            accomodatesCount: room.guestNumber,
            bedCount: room.bedNumber,
            currency: 2, // chose currency
            category: room.category,
            roomGroup: room.roomGroup,
            description: room.descriptions[0] + ',' + room.descriptions[1],
            latitude: room.latitude * 1,
            longitude: room.longitude * 1,
            price: room.roomPricePerNight,
            priceType: 'PER_NIGHT',
            host: room.username,
            privacyType: room.privacyType,
        };

        for (let key in roomEntity) {
            fd.append(key, roomEntity[key]);
        }

        const { data } = await axios.post(`${baseURL}api/room/save`, fd, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(data);
        if (data) window.location.href = `${baseURL}room/${data}/publish-celebration`;
    }
}
