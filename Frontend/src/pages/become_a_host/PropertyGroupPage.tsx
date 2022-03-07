import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    LeftPageContent,
    PropertyGroupMainContent,
    RightPageContent,
} from '../../components/become_a_host';
import { fetchRoomGroups } from '../../features/room/roomSlice';
import { Div } from '../../globalStyle';
import './css/room_group.css';

interface IPropertyGroupPageProps {}

const PropertyGroupPage: FC<IPropertyGroupPageProps> = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchRoomGroups());
    }, []);

    return (
        <>
            <Div height='100vh'>
                <Div className='flex'>
                    <LeftPageContent
                        background='/images/property_type_group.jpg'
                        title='Bạn sẽ cho thuê loại chỗ ở nào?'
                    />
                    <RightPageContent
                        nextPageURL='/become-a-host/property-type'
                        MainContent={<PropertyGroupMainContent />}
                    />
                </Div>
            </Div>
        </>
    );
};

export default PropertyGroupPage;
