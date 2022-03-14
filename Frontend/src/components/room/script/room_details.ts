import $ from 'jquery';
import { IUser } from '../../../types/user/type_User';
import { addClickEventForLoveButton } from '../../home/script/add_to_wishlists';

export const leftReviewLines = [
    {
        title: 'Mức độ sạch sẽ',
        id: 'cleanlinessRating',
    },
    {
        title: 'Liên lạc',
        id: 'contactRating',
    },
    {
        title: 'Nhận phòng',
        id: 'checkinRating',
    },
];

export const rightReviewLines = [
    {
        title: 'Độ chính xác',
        id: 'accuracyRating',
    },
    {
        title: 'Vị trí',
        id: 'locationRating',
    },
    {
        title: 'Giá trị',
        id: 'valueRating',
    },
];

export default async function roomDetails(wishlistsIDs: number[], user: IUser) {
    const closeShowImgBtn = $('#closeShowImgBtn');
    closeShowImgBtn.on('click', function () {
        toggleHiddenImages();
    });

    let isClicked = false;
    const navMenu = $('.loginAndLogoutHidden').first();
    $('.account__button')
        .first()
        .on('click', function () {
            if (!isClicked) {
                navMenu.addClass('active');
                isClicked = true;
            } else {
                navMenu.removeClass('active');
                isClicked = false;
            }
        });

    addClickEventForLoveButton(wishlistsIDs, user);
    updateRatingUI();

    function toggleHiddenImages() {
        const hiddenSlider = $('.rdt_hidden').first();
        const fullScreen = $('.rdt__fullScreen').first();
        if (hiddenSlider.hasClass('show')) {
            hiddenSlider.removeClass('show');
        } else {
            hiddenSlider.addClass('show');
        }
    }

    function updateRatingUI() {
        let cleanliness = 0;
        let contact = 0;
        let checkin = 0;
        let accuracy = 0;
        let location = 0;
        let value = 0;

        const cleanlinessRating = $('.cleanliness-rating');
        const contactRating = $('.contact-rating');
        const checkinRating = $('.checkin-rating');
        const accuracyRating = $('.accuracy-rating');
        const locationRating = $('.location-rating');
        const valueRating = $('.value-rating');

        cleanlinessRating.each(function () {
            const value = $(this).val();
            cleanliness += value as any;
        });
        contactRating.each(function () {
            contact += parseInt($(this).val() as string);
        });
        checkinRating.each(function () {
            checkin += parseInt($(this).val() as string);
        });
        accuracyRating.each(function () {
            accuracy += parseInt($(this).val() as string);
        });
        locationRating.each(function () {
            location += parseInt($(this).val() as string);
        });
        valueRating.each(function () {
            value += parseInt($(this).val() as string);
        });

        cleanliness /= cleanlinessRating.length || 1;
        contact /= contactRating.length || 1;
        checkin /= checkinRating.length || 1;
        accuracy /= accuracyRating.length || 1;
        location /= locationRating.length || 1;
        value /= valueRating.length || 1;

        $('#cleanlinessRating').css('width', `${(cleanliness / 5) * 100}%`);
        $('#contactRating').css('width', `${(contact / 5) * 100}%`);
        $('#checkinRating').css('width', `${(checkin / 5) * 100}%`);
        $('#accuracyRating').css('width', `${(accuracy / 5) * 100}%`);
        $('#locationRating').css('width', `${(location / 5) * 100}%`);
        $('#valueRating').css('width', `${(value / 5) * 100}%`);

        $('#averageCleanlinessRating').text(cleanliness);
        $('#averageContactRating').text(contact);
        $('#averageCheckinRating').text(checkin);
        $('#averageAccuracyRating').text(accuracy);
        $('#averageLocationRating').text(location);
        $('#averageValueRating').text(value);
    }
}
