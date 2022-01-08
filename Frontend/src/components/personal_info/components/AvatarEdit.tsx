import { FC } from 'react';
import { FieldValues, UseFormRegister } from 'react-hook-form';

interface IAvatarEditProps {
    register: UseFormRegister<FieldValues>;
}

export const AvatarEdit: FC<IAvatarEditProps> = ({ register }) => {
    return (
        <div>
            <label>Cập nhật ảnh đại diện</label>
            <div className='input-group mb-3'>
                <input type='file' className='form-control' name='userAvatar' id='userAvatar' />
            </div>
        </div>
    );
};
