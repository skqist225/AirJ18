import { FC } from 'react';
import { Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';
import './css/price_main_content.css';

interface IPropertyPriceMainContentProps {}

const PropertyPriceMainContent: FC<IPropertyPriceMainContentProps> = () => {
    return (
        <div className='col-flex'>
            <div className='normal-flex'>
                <div>
                    {/*onclick='decreasePrice(this);'*/}
                    <button className='room-price__btn'>
                        <span>
                            <Image src={getImage('/svg/minus.svg')} size='12px' />
                        </span>
                    </button>
                </div>
                <div id='priceInputContainer'>
                    <input
                        type='text'
                        id='room-price'
                        pattern='[0-9]*'
                        placeholder='₫00'
                        // autocomplete='off'
                        maxLength={11}
                        minLength={7}
                    />
                </div>
                <div>
                    {/*onclick='increasePrice(this);'*/}
                    <button className='room-price__btn'>
                        <span>
                            <Image src={getImage('/svg/plus.svg')} size='12px' />
                        </span>
                    </button>
                </div>
            </div>
            <div style={{ textAlign: 'center' }} className='per-night'>
                mỗi đêm
            </div>
        </div>
    );
};

export default PropertyPriceMainContent;
