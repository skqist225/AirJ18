import { FC } from "react";
import { Image } from "../../globalStyle";
import { getImage } from "../../helpers";
import $ from "jquery";
import "./css/price_main_content.css";

interface IPropertyPriceMainContentProps {}

const PropertyPriceMainContent: FC<IPropertyPriceMainContentProps> = () => {
    function decreasePrice() {
        const input = $("#room-price");
        const prevStep = parseInt((input.val()! as string).replace("₫", "")) || 0;

        if (prevStep >= 129000) {
            input.val("₫" + (prevStep - 129000));
        }
    }

    function increasePrice() {
        const input = $("#room-price");
        const prevStep = parseInt((input.val()! as string).replace("₫", "")) || 0;
        const step = prevStep + 129000;

        input.val("₫" + step);
    }

    return (
        <div className='col-flex'>
            <div className='normal-flex'>
                <div>
                    <button className='room-price__btn' onClick={decreasePrice}>
                        <span>
                            <Image src={getImage("/svg/minus.svg")} size='12px' />
                        </span>
                    </button>
                </div>
                <div id='priceInputContainer'>
                    <input
                        type='text'
                        id='room-price'
                        pattern='[0-9]*'
                        placeholder='₫00'
                        maxLength={11}
                        minLength={7}
                    />
                </div>
                <div>
                    <button className='room-price__btn' onClick={increasePrice}>
                        <span>
                            <Image src={getImage("/svg/plus.svg")} size='12px' />
                        </span>
                    </button>
                </div>
            </div>
            <div style={{ textAlign: "center" }} className='per-night'>
                mỗi đêm
            </div>
        </div>
    );
};

export default PropertyPriceMainContent;
