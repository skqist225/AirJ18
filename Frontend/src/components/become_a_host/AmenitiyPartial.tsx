import { FC } from 'react';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers';
import IAmenity from '../../types/type_Amenity';

interface IAmenitiyPartialProps {
    amenities: IAmenity[];
    className: string;
}

const AmenitiyPartial: FC<IAmenitiyPartialProps> = ({ amenities, className }) => {
    return (
        <>
            {' '}
            <div className='amentities__card-container'>
                {amenities.map(a => (
                    <div className={'amentity__card ' + className} key={a.id}>
                        <input type='hidden' value={a.id} />
                        <input type='hidden' value={a.name} className='amentityName' />
                        <input type='hidden' value={a.iconImage} />
                        <div>
                            <Image
                                src={getImage(a.iconImagePath)}
                                size='52px'
                                className={className + 'Img'}
                            />
                        </div>
                        <div className='amentity__name'>{a.name}</div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default AmenitiyPartial;
