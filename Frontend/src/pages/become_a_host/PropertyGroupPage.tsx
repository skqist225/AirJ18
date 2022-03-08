import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    LeftPageContent,
    PropertyGroupMainContent,
    RightPageContent,
} from '../../components/become_a_host';
import { fetchRoomGroups } from '../../features/room/roomSlice';
import { Div } from '../../globalStyle';
import $ from 'jquery';

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
                        nextPage='property-category'
                        prevPage='intro'
                        MainContent={<PropertyGroupMainContent />}
                        stepNumber={1}
                    />
                </Div>
            </Div>
        </>
    );
};

export default PropertyGroupPage;
