import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

import $ from 'jquery';

interface IAvatarEditProps {
    saveNewAvatar: Function;
}

const AvatarEdit: FC<IAvatarEditProps> = ({ saveNewAvatar }) => {
    function saveNewAvatarTemp(event: any) {
        saveNewAvatar(event.currentTarget.files[0]);
    }

    return (
        <div>
            <label>Cập nhật ảnh đại diện</label>
            <div className='input-group mb-3'>
                <input
                    type='file'
                    className='form-control'
                    name='userAvatar'
                    id='userAvatar'
                    onChange={saveNewAvatarTemp}
                />
            </div>
        </div>
    );
};

export default AvatarEdit;
