import { FC } from 'react';
import { Image } from '../../../globalStyle';
import { getImage } from '../../../helpers';

interface IHideEditBoxProps {
    sectionKey: string;
}

const HideEditBox: FC<IHideEditBoxProps> = ({ sectionKey }) => {
    return (
        <div
            style={{ cursor: 'pointer' }}
            data-section-key={sectionKey}
            //  onclick="hideEditBox($(this).data('section-key'))"
        >
            <Image src={getImage('/svg/close2.svg')} size='14px' />
        </div>
    );
};

export default HideEditBox;
