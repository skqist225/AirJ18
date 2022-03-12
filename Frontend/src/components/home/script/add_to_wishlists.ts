import axios from '../../../axios';
import $ from 'jquery';
import { IUser } from '../../../type/user/type_User';
import { toast } from 'react-toastify';
import { callToast } from '../../../helpers';

export function addClickEventForLoveButton(wishlistsArr: number[], user: IUser | null) {
    $('.room__likeBtn').each(function () {
        const roomId = $(this).data('room-id') as string;
        const children = $(this).children('svg');

        if (wishlistsArr.length && wishlistsArr.includes(parseInt(roomId)))
            children.addClass('like');

        $(this)
            .off('click')
            .on('click', async function (event) {
                event.preventDefault();
                let successMessage = '';
                let errorMessage = '';

                if (user === null)
                    toast.error(`🦄 Vui lòng đăng nhập để thêm yêu thích`, {
                        position: 'bottom-right',
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });

                if (children.hasClass('like')) {
                    successMessage = 'Gỡ bỏ khỏi danh sách yêu thích thành công';
                    errorMessage = 'Gỡ bỏ khỏi danh sách yêu thích thất bại';

                    const { data } = await axios.get(`/user/remove-from-wishlists/${roomId}`);
                    if (data === 'success') {
                        $('.room__likeBtn').each(function () {
                            if (parseInt($(this).data('room-id')) === parseInt(roomId))
                                $(this).children('.heartSvg').removeClass('like');
                        });
                        callToast('success', successMessage);
                    } else callToast('error', errorMessage);
                } else {
                    successMessage = 'Thêm vào danh sách yêu thích thành công';
                    errorMessage = 'Thêm vào danh sách yêu thích thất bại';

                    const { data } = await axios.get(`/user/add-to-wishlists/${roomId}`);
                    if (data === 'success') {
                        $('.room__likeBtn').each(function () {
                            if ($(this).data('room-id') * 1 === parseInt(roomId))
                                $(this).children('.heartSvg').addClass('like');
                        });
                        callToast('success', successMessage);
                    } else callToast('error', errorMessage);
                }
            });
    });
}
