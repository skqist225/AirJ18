import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../axios';
import { resetUpdateStatus, roomState, updateRoom } from '../../features/room/roomSlice';
import { callToast } from '../../helpers';

import $ from 'jquery';
import './css/box_footer.css';

interface IBoxFooterProps {
    sectionKey: string;
    idInput: string;
    hideEditBox: Function;
    name?: string;
    description?: string;
    roomGroup?: string;
    category?: string;
    roomPrivacy?: string;
    country?: string;
    street?: string;
    city?: string;
    state?: string;
}

const BoxFooter: FC<IBoxFooterProps> = ({
    sectionKey,
    idInput,
    name,
    description,
    roomGroup,
    category,
    roomPrivacy,
    country,
    street,
    city,
    state,
    hideEditBox,
}) => {
    const dispatch = useDispatch();
    const { updateSuccess } = useSelector(roomState);

    function closeEditBox() {
        let obj = {};
        if (sectionKey === 'name') obj = { name };
        if (sectionKey === 'description') obj = { description };
        if (sectionKey === 'groupAndTypeAndPrivacy') obj = { roomGroup, category, roomPrivacy };
        if (sectionKey === 'location')
            obj = {
                country,
                street,
                city,
                state,
            };
        hideEditBox(sectionKey, obj);
    }
    const { room } = useSelector(roomState);

    function sendRequest(data: any) {
        dispatch(
            updateRoom({
                roomid: room!.id,
                fieldName: sectionKey,
                postObj: data,
            })
        );
        if (updateSuccess) {
            callToast('success', 'Cập nhật thông tin phòng thành công!');
            dispatch(resetUpdateStatus());
        }
    }

    async function updateField() {
        switch (sectionKey) {
            case 'name': {
                const roomName = $(idInput).val();
                sendRequest({ name: roomName });
                break;
            }
            case 'roomInfo': {
                const bedroom2 = $('#manage-ys__bedRoom').text().trim();
                const bed2 = $('#manage-ys__bed').text().trim();
                const bathroom2 = $('#manage-ys__bathRoom').text().trim();

                sendRequest({
                    bedroom: bedroom2,
                    bed: bed2,
                    bathroom: bathroom2,
                });
                break;
            }
            case 'groupAndTypeAndPrivacy': {
                const groupId = $('select[id="manage-ys__group-input"]').val();
                const categoryId = $('select[id="manage-ys__type-input"]').val();
                const privacyId = $('select[id="manage-ys__privacy-input"]').val();

                sendRequest({
                    roomGroup: groupId,
                    category: categoryId,
                    roomPrivacy: privacyId,
                });

                break;
            }
            case 'location': {
                const country2 = $('#manage-ys__location-country').val();
                const state2 = $('#manage-ys__location-state').val();
                const city2 = $('#manage-ys__location-city').val();
                const street2 = $('#manage-ys__location-street').val();

                sendRequest({
                    country: country2,
                    state: state2,
                    city: city2,
                    street: street2,
                });

                break;
            }
            case 'status': {
                const checked = $('input[type="radio"]:checked').attr('id')!;
                let request: number = 0;
                if (checked.startsWith('roomStatus')) {
                    request = parseInt(checked.substr(-1));
                } else {
                    request = 2;
                }

                if (request === 2) {
                    // window.location.href = `${baseURL}room/${roomId}/delete`;
                } else {
                    sendRequest({
                        status: request,
                    });

                    // if (data === 'OK') {
                    //     const status = request === 1 ? true : false;
                    //     callToast('success', 'Cập nhật thông tin phòng thành công!');
                    // }
                }

                break;
            }
            case 'description': {
                const description2 = $('#descriptionInput').val();
                sendRequest({
                    description: description2,
                });
                break;
            }
            case 'amentities': {
                let checkedArray: string[] = [];
                let uncheckedArray: string[] = [];

                $('.manage-ys__check-btn').each(function () {
                    if ($(this).hasClass('checked')) {
                        checkedArray.push($(this).data('edit'));
                    }
                });

                $('.manage-ys__uncheck-btn').each(function () {
                    if ($(this).hasClass('checked')) {
                        uncheckedArray.push($(this).data('edit'));
                    }
                });

                sendRequest({
                    checkedArray: checkedArray.join(',').trim(),
                    uncheckedArray: uncheckedArray.join(',').trim(),
                });

                break;
            }
        }
    }

    return (
        <div className='flex-space' id='box--footer__container'>
            <div>
                <button className='manage--ys__transparentBtn' onClick={closeEditBox}>
                    Hủy
                </button>
            </div>
            <div>
                <button className='manage-ys__save-edit-btn' onClick={updateField}>
                    Lưu
                </button>
            </div>
        </div>
    );
};

export default BoxFooter;
