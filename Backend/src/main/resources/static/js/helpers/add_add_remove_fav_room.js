function addClickEventForLoveButton(wishlistsArr = [], user = null) {
    $('.room__likeBtn').each(function () {
        const roomId = $(this).data('room-id');
        const children = $(this).children('svg');

        if (wishlistsArr.length && wishlistsArr.includes(roomId)) children.addClass('like');

        $(this).click(async function (event) {
            event.preventDefault();
            let getURL = '';
            let successMessage = '';
            let errorMessage = '';

            if (user === null) alertify.error('Vui lòng đăng nhập để thêm yêu thích');

            if (children.hasClass('like')) {
                getURL = `${baseURL}api/user/remove-from-wishlists/${roomId}`;
                successMessage = 'Gỡ bỏ danh sách yêu thích thành công';
                errorMessage = 'Gỡ bỏ danh sách yêu thích thất bại';

                const { data } = await axios.get(getURL);
                if (data === 'success') {
                    $('.room__likeBtn').each(function () {
                        if ($(this).data('room-id') * 1 === roomId * 1)
                            $(this).children('.heartSvg').removeClass('like');
                    });
                    alertify.success(successMessage);
                } else alertify.error(errorMessage);
            } else {
                getURL = `${baseURL}api/user/add-to-wishlists/${roomId}`;
                successMessage = 'Thêm vào danh sách yêu thích thành công';
                errorMessage = 'Thêm vào danh sách yêu thích thất bại';

                const { data } = await axios.get(getURL);
                if (data === 'success') {
                    $('.room__likeBtn').each(function () {
                        if ($(this).data('room-id') * 1 === roomId * 1)
                            $(this).children('.heartSvg').addClass('like');
                    });
                    alertify.success(successMessage);
                } else alertify.error(errorMessage);
            }
        });
    });
}
