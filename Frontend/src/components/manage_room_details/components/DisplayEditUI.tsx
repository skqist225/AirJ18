import { FC } from 'react';

interface IDisplayEditUIProps {
    sectionKey: string;
}

const DisplayEditUI: FC<IDisplayEditUIProps> = ({ sectionKey }) => {
    return (
        <button
            className='manage--ys__transparentBtn'
            data-section-key={sectionKey}
            // onclick="displayEditBox($(this).data('section-key'))"
        >
            Chỉnh sửa
        </button>
    );
};

export default DisplayEditUI;
