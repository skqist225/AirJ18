import React, { FC } from "react";

import $ from "jquery";
import { IRoomDetails } from "../../../types/room/type_RoomDetails";

interface IDisplayEditUIProps {
    sectionKey: string;
    setRoomName?: React.Dispatch<React.SetStateAction<string | undefined>>;
    setRoomDescription?: React.Dispatch<React.SetStateAction<string | undefined>>;
    room?: IRoomDetails;
}

const DisplayEditUI: FC<IDisplayEditUIProps> = ({
    sectionKey,
    setRoomName,
    setRoomDescription,
    room,
}) => {
    function displayEditBox() {
        $(`#manage-ys__${sectionKey}-control-container`).addClass("unhideEditBox");
        $(`#manage-ys__${sectionKey}-control-view`).addClass("hideViewBox");

        console.log($(`#manage-ys__${sectionKey}-control-view`));

        switch (sectionKey) {
            case "name": {
                setRoomName && setRoomName(room?.name);
                break;
            }
            case "description": {
                setRoomDescription && setRoomDescription(room?.description);
                break;
            }
        }
    }

    return (
        <button className='manage--ys__transparentBtn' onClick={displayEditBox}>
            Chỉnh sửa
        </button>
    );
};

export default DisplayEditUI;
