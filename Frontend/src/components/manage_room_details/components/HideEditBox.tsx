import { FC, MouseEventHandler } from 'react';
import { Image } from '../../../globalStyle';
import { getImage } from '../../../helpers';

interface IHideEditBoxProps {
    hideEditBox: Function;
    sectionKey: string;
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

const HideEditBox: FC<IHideEditBoxProps> = ({
    hideEditBox,
    sectionKey,
    name,
    description,
    roomGroup,
    category,
    roomPrivacy,
    country,
    street,
    city,
    state,
}) => {
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

    return (
        <button className='manage--ys__transparentBtn' onClick={closeEditBox}>
            <Image src={getImage('/svg/close2.svg')} size='14px' />
        </button>
    );
};

export default HideEditBox;
