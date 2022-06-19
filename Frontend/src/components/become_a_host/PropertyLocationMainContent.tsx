import { FC, useEffect } from "react";
import { Div, Image } from "../../globalStyle";
import { getImage } from "../../helpers";
import $ from "jquery";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { fetchCountries } from "../../features/country/countrySlice";
import { FloatingLabel, Form } from "react-bootstrap";

interface IPropertyLocationMainContentProps {
    isAprtNoAndStreetFilledUp: boolean;
    isCityFilledUp: boolean;
}

const PropertyLocationMainContent: FC<IPropertyLocationMainContentProps> = ({
    isAprtNoAndStreetFilledUp,
    isCityFilledUp,
}) => {
    function backToSearchLocation() {
        $("#location__enter-address-option").removeClass("active");
        $(".location__search-location").first().addClass("active");
    }

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchCountries());
    }, []);

    const { countries } = useSelector((state: RootState) => state.country);
    return (
        <>
            <div id='location__map'></div>
            <div id='location__enter-address-option'>
                <Div padding='28px' className='col-flex'>
                    <div style={{ paddingBottom: "40px" }} className='normal-flex'>
                        <div onClick={backToSearchLocation} style={{ cursor: "pointer" }}>
                            <Image src={getImage("/svg/back.svg")} size='24px' />
                        </div>
                        <div className='location__confirm-address'>Xác nhận địa chỉ của bạn</div>
                    </div>
                    <div id='location__enter-address-option__body'>
                        <FloatingLabel label='Đường/Phố' className='mb-3'>
                            <Form.Control
                                type='text'
                                id='aprtNoAndStreet'
                                placeholder='placeholder'
                            />
                        </FloatingLabel>

                        <FloatingLabel
                            label='Căn hộ, phòng, v.v. (Không bắt buộc)'
                            className='mb-3'
                        >
                            <Form.Control type='text' id='' placeholder='placeholder' />
                        </FloatingLabel>

                        <FloatingLabel label='Thành phố' className='mb-3'>
                            <Form.Control type='text' id='city' placeholder='placeholder' />
                        </FloatingLabel>

                        <FloatingLabel label='Tỉnh(Không bắt buộc)' className='mb-3'>
                            <Form.Control type='text' id='' placeholder='placeholder' />
                        </FloatingLabel>

                        <FloatingLabel label='Mã bưu chính(Không bắt buộc)' className='mb-3'>
                            <Form.Control type='text' id='' placeholder='placeholder' />
                        </FloatingLabel>

                        <div className='form-floating'>
                            <select className='form-select' id='country' value={"Việt Nam"}>
                                {countries.map(c => (
                                    <option value={c.name} key={c.id}>
                                        {c.name} {c.code}
                                    </option>
                                ))}
                            </select>
                            <label>Quốc gia/Khu vực</label>
                        </div>
                    </div>

                    <div style={{ paddingTop: "40px" }}>
                        <button
                            className='location__btn-complete-address'
                            disabled={isAprtNoAndStreetFilledUp && isCityFilledUp ? false : true}
                            id='location__btn-complete-address-id'
                        >
                            Trông ổn rồi
                        </button>
                    </div>
                </Div>
            </div>
        </>
    );
};

export default PropertyLocationMainContent;
