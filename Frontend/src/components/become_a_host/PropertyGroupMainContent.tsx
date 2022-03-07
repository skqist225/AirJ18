import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';
import { RootState } from '../../store';
import './css/group_main_content.css';

interface IPropertyGroupMainContentProps {}

const PropertyGroupMainContent: FC<IPropertyGroupMainContentProps> = () => {
    const { roomGroups } = useSelector((state: RootState) => state.room);

    return (
        <>
            <Div className='col-flex' style={{ alignItems: 'center', justifyContent: 'center' }}>
                {roomGroups.map(group => (
                    <div className='content__box flex-space' key={group.id}>
                        <input type='hidden' value={group.id} />
                        <div className='content__box--name'>{group.name}</div>
                        <div>
                            <Image src={getImage(`/room_types/${group.image}`)} size='56px' />
                        </div>
                    </div>
                ))}
            </Div>
        </>
    );
};

export default PropertyGroupMainContent;
