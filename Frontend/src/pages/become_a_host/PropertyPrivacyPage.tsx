import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
    LeftPageContent,
    PropertyPrivacyMainContent,
    RightPageContent,
} from '../../components/become_a_host';
import { fetchRoomPrivacies } from '../../features/room/roomSlice';
import { Div } from '../../globalStyle';

interface IPropertyPrivacyPageProps {}

const PropertyPrivacyPage: FC<IPropertyPrivacyPageProps> = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchRoomPrivacies());
    }, []);

    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background='/images/property_type_group.jpg'
                    title='Khách sẽ được sử dụng loại chỗ ở nào?'
                />
                <RightPageContent
                    nextPage='location'
                    prevPage='property-category'
                    MainContent={<PropertyPrivacyMainContent />}
                    stepNumber={3}
                />
            </Div>
        </Div>
    );
};

export default PropertyPrivacyPage;
