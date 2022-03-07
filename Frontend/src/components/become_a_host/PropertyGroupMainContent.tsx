import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';
import { RootState } from '../../store';

interface IPropertyGroupMainContentProps {}

const PropertyGroupMainContent: FC<IPropertyGroupMainContentProps> = () => {
    const { roomGroups } = useSelector((state: RootState) => state.room);

    return (
        <>
            <div className='roomGroupsContainer'>
                {roomGroups.map(group => (
                    <div className='room-group__box flex-space' key={group.id}>
                        <input type='hidden' value={group.id} />
                        <div className='room-type__name'>{group.name}</div>
                        <div>
                            <Image src={getImage(`/room_types/${group.image}`)} size='56px' />
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default PropertyGroupMainContent;
