import { FC } from 'react';
import { getImage } from '../../helpers';

import './css/description_main_content.css';

interface IPropertyDescriptionMainContentProps {}

const PropertyDescriptionMainContent: FC<IPropertyDescriptionMainContentProps> = () => {
    return (
        <>
            {' '}
            <div className='description-icon'>
                <div>Chọn tối đa 2 điểm nổi bật</div>
                <div>
                    <div className='normal-flex'>
                        <div className='description__title-container'>
                            <span>
                                <img
                                    src={getImage('/svg/peaceful.svg')}
                                    alt='peaceful.svg'
                                    className='img'
                                />{' '}
                            </span>
                            <span>Yên bình</span>
                        </div>
                        <div className='description__title-container'>
                            <span>
                                <img
                                    src={getImage('/svg/special.svg')}
                                    alt='special'
                                    className='img'
                                />
                            </span>
                            <span>Độc đáo</span>
                        </div>
                    </div>
                    <div className='description__title-container'>
                        <span>
                            <img
                                src={getImage('/svg/suitable_for_family.svg')}
                                alt='suitable_for_family'
                                className='img'
                            />
                        </span>
                        <span>Phù hợp cho gia đình</span>
                    </div>
                    <div className='normal-flex'>
                        <div className='description__title-container'>
                            <span>
                                <img src={getImage('/svg/style.svg')} alt='style' className='img' />
                            </span>
                            <span>Phong cách</span>
                        </div>
                        <div className='description__title-container' style={{ width: '222px' }}>
                            <span>
                                <img
                                    src={getImage('/svg/central_location.svg')}
                                    alt='central_location'
                                    className='img'
                                />
                            </span>
                            <span>Vị trí trung tâm</span>
                        </div>
                    </div>
                    <div className='description__title-container'>
                        <span style={{ marginRight: '5px' }}>
                            <img src={getImage('/svg/widely.svg')} alt='widely' className='img' />
                        </span>
                        <span>Rộng rãi</span>
                    </div>
                </div>
            </div>
            {/* <div className='description-text'>
                <label className='room-name-label'>Tạo phần mô tả</label>
                <div>
                    <textarea
                        name=''
                        id='room-name'
                        cols={30}
                        rows={10}
                        maxLength={50}
                        // onkeydown='onKeyPress(event);'
                        placeholder='Bạn sẽ có một khoảng thời gian tuyệt vời tại nơi ở thoải mái này.'
                        title='Bạn sẽ có một khoảng thời gian tuyệt vời tại nơi ở thoải mái này.'
                    ></textarea>
                </div>
                <div id='numberOfTextPerMaxLength'>
                    <span id='currentLength'>0</span>/500
                </div>
            </div> */}
        </>
    );
};

export default PropertyDescriptionMainContent;
