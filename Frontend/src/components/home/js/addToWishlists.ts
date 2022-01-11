import api from '../../../axios';
import $ from 'jquery';
import { IUser } from '../../../type/type_User';

export function addClickEventForLoveButton(wishlistsArr: number[], user: IUser | null) {
    $('.room__likeBtn').each(function () {
        const roomId = $(this).data('room-id') as string;
        const children = $(this).children('svg');

        if (wishlistsArr.length && wishlistsArr.includes(parseInt(roomId)))
            children.addClass('like');

        $(this).on('click', async function (event) {
            event.preventDefault();
            let successMessage = '';
            let errorMessage = '';

            // if (user === null) alertify.error('Vui lòng đăng nhập để thêm yêu thích');
            if (user === null) console.error('Vui lòng đăng nhập để thêm yêu thích');

            if (children.hasClass('like')) {
                successMessage = 'Gỡ bỏ danh sách yêu thích thành công';
                errorMessage = 'Gỡ bỏ danh sách yêu thích thất bại';

                const { data } = await api.get(`/user/remove-from-wishlists/${roomId}`);
                if (data === 'success') {
                    $('.room__likeBtn').each(function () {
                        if ($(this).data('room-id') * 1 === parseInt(roomId))
                            $(this).children('.heartSvg').removeClass('like');
                    });
                    // alertify.success(successMessage);
                    console.log(successMessage);
                } else console.error(errorMessage);
            } else {
                successMessage = 'Thêm vào danh sách yêu thích thành công';
                errorMessage = 'Thêm vào danh sách yêu thích thất bại';

                const { data } = await api.get(`/user/add-to-wishlists/${roomId}`);
                if (data === 'success') {
                    $('.room__likeBtn').each(function () {
                        if ($(this).data('room-id') * 1 === parseInt(roomId))
                            $(this).children('.heartSvg').addClass('like');
                    });
                    // alertify.success(successMessage);
                } else console.log(errorMessage);
            }
        });
    });
}
