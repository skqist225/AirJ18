import { FC } from 'react';

interface ISexEditProps {}

export const SexEdit: FC<ISexEditProps> = () => {
    return (
        <div>
            <select className='custom-select' name='userSex'>
                <option disabled value=''>
                    Chọn
                </option>
                <option selected={user.sex === 'MALE'} value='MALE'>
                    Nam
                </option>
                <option selected={user.sex === 'FEMALE'} value='FEMALE'>
                    Nữ
                </option>
                <option selected={user.sex === 'OTHER'} value='OTHER'>
                    Khác
                </option>
            </select>
        </div>
    );
};
