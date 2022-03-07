import { FC } from 'react';
import { Div, Image } from '../../globalStyle';
import { getImage } from '../../helpers/getImage';

interface IPropertyLocationMainContentProps {}

const PropertyLocationMainContent: FC<IPropertyLocationMainContentProps> = () => {
    return (
        <>
            <div id='location__map'></div>
            <Div style={{ position: 'absolute', top: '0', right: '0' }} id='map_loading'>
                <img
                    src={getImage('/images/map_loading.gif')}
                    alt='/images/map_loading.gif'
                    className='w-100 h-100 of-c'
                />
            </Div>
            <div id='location__enter-address-option'>
                <Div style={{ backgroundColor: '#fff' }} padding='28px' className='col-flex'>
                    <div style={{ paddingBottom: '40px' }} className='normal-flex'>
                        <div
                            // onclick="backToSearchLocation()"
                            style={{ cursor: 'pointer' }}
                        >
                            <Image src={getImage('/svg/back.svg')} size='24px' />
                        </div>
                        <div className='location__confirm-address'>Xác nhận địa chỉ của bạn</div>
                    </div>
                    <div id='location__enter-address-option__body'>
                        <div className='location__input-container'>
                            <div className='location__label-input'>Đường/Phố</div>
                            <Div height='40%'></Div>
                            <div>
                                <input type='text' id='aprtNoAndStreet' />
                            </div>
                        </div>
                        <div className='location__input-container'>
                            <div className='location__label-input'>
                                Căn hộ, phòng, v.v.(Không bắt buộc)
                            </div>
                            <Div height='40%'></Div>
                            <div>
                                <input type='text' />
                            </div>
                        </div>
                        <div className='location__input-container'>
                            <div className='location__label-input'>Thành phố</div>
                            <Div height='40%'></Div>
                            <div>
                                <input type='text' id='city' />
                            </div>
                        </div>
                        <div className='location__input-container'>
                            <div className='location__label-input'>Tỉnh(Không bắt buộc)</div>
                            <Div height='40%'></Div>
                            <div>
                                <input type='text' id='state' />
                            </div>
                        </div>
                        <div className='location__input-container'>
                            <div className='location__label-input'>
                                Mã bưu chính(Không bắt buộc)
                            </div>
                            <Div height='40%'></Div>
                            <div>
                                <input type='text' />
                            </div>
                        </div>
                        <div className='location__input-container'>
                            <div>Quốc gia/Khu vực</div>
                            <select name='' id='country'>
                                {/* <th:block
                                                th:each="c : ${countries}"
                                            >
                                                <option
                                                    th:value="${c.id}"
                                                    th:selected="${c.name == 'Vietnam'}"
                                                >
                                                    [[${c.name}]] [[${c.code}]]
                                                </option>
                                            </th:block> */}
                            </select>
                        </div>
                    </div>
                    <div>//red warning Đường/Phố Thành phố</div>
                    {/* <div style="padding-top: 40px">
                                    <button
                                        className="location__btn-complete-address"
                                        disabled={true}
                                        id="location__btn-complete-address-id"
                                    >
                                        Trông ổn rồi
                                    </button>
                                </div> */}
                </Div>
            </div>
        </>
    );
};

export default PropertyLocationMainContent;
