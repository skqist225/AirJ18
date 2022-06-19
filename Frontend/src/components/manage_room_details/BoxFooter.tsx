import React, { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "../../axios";
import { resetUpdateStatus, roomState, updateRoom } from "../../features/room/roomSlice";
import { callToast } from "../../helpers";

import $ from "jquery";
import "./css/box_footer.css";
import Toast from "../notify/Toast";

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
        if (sectionKey === "name") obj = { name };
        if (sectionKey === "description") obj = { description };
        if (sectionKey === "groupAndTypeAndPrivacy") obj = { roomGroup, category, roomPrivacy };
        if (sectionKey === "location")
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
            callToast("success", "Cập nhật thông tin phòng thành công!");
        }
    }

    async function updateField() {
        switch (sectionKey) {
            case "name": {
                const roomName = $(idInput).val();
                sendRequest({ name: roomName });
                closeEditBox();
                break;
            }
            case "roomInfo": {
                const bedroom = $("#manage-ys__bedRoom").text().trim();
                const bed = $("#manage-ys__bed").text().trim();
                const bathroom = $("#manage-ys__bathRoom").text().trim();

                sendRequest({
                    bedroom,
                    bed,
                    bathroom,
                });
                break;
            }
            case "groupAndTypeAndPrivacy": {
                const groupId = $('select[id="manage-ys__group-input"]').val();
                const categoryId = $('select[id="manage-ys__type-input"]').val();
                const privacyId = $('select[id="manage-ys__privacy-input"]').val();

                console.log(groupId, categoryId);

                sendRequest({
                    roomGroup: groupId,
                    category: categoryId,
                    roomPrivacy: privacyId,
                });

                break;
            }
            case "location": {
                const country = $("#manage-ys__location-country").val();
                const state = $("#manage-ys__location-state").val();
                const city = $("#manage-ys__location-city").val();
                const street = $("#manage-ys__location-street").val();

                sendRequest({
                    country,
                    state,
                    city,
                    street,
                });

                break;
            }
            case "status": {
                const checked = $('input[type="radio"]:checked').attr("id")!;
                let request: number = 0;
                if (checked.startsWith("roomStatus")) {
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

                    // if (data === "OK") {
                    //     const status = request === 1 ? true : false;
                    //     callToast("success", "Cập nhật thông tin phòng thành công!");
                    // }
                }

                break;
            }
            case "description": {
                const description2 = $("#descriptionInput").val();
                sendRequest({
                    description: description2,
                });
                break;
            }
            case "amentities": {
                let checkedArray: string[] = [];
                let uncheckedArray: string[] = [];

                $(".manage-ys__check-btn").each(function () {
                    if ($(this).hasClass("checked")) {
                        checkedArray.push($(this).data("edit"));
                    }
                });

                $(".manage-ys__uncheck-btn").each(function () {
                    if ($(this).hasClass("checked")) {
                        uncheckedArray.push($(this).data("edit"));
                    }
                });

                sendRequest({
                    checked: checkedArray.join(",").trim(),
                    unchecked: uncheckedArray.join(",").trim(),
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
