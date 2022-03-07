import { FC } from 'react';
import { useSelector } from 'react-redux';
import { Div } from '../../globalStyle';
import { RootState } from '../../store';
import './css/privacy_main_content.css';

interface IPropertyPrivacyMainContentProps {}

const PropertyPrivacyMainContent: FC<IPropertyPrivacyMainContentProps> = () => {
    const { roomPrivacies } = useSelector((state: RootState) => state.room);

    return (
        <Div className='col-flex-center'>
            {roomPrivacies.map(privacy => (
                <div className='privacy-type__box'>
                    <div className='content__box--name' data-privacy-id={privacy.id}>
                        {privacy.name}
                    </div>
                </div>
            ))}
        </Div>
    );
};

export default PropertyPrivacyMainContent;
