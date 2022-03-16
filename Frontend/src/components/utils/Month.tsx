import { FC } from 'react';
import { Div, Image } from '../../globalStyle';
import './css/month.css';

interface IMonthProps {
    buttonClassName: string;
    imageSrc: string;
    titleClassName: string;
    tableClassName: string;
}

const Month: FC<IMonthProps> = ({ buttonClassName, imageSrc, titleClassName, tableClassName }) => {
    return (
        <div className='flex-1 month__container'>
            <div className='normal-flex'>
                {buttonClassName === 'getThePreviousTwoMonths' && (
                    <div>
                        <button type='button' className={buttonClassName + ' month__getMonthBtn'}>
                            <span>
                                <Image src={imageSrc} size='12px' />
                            </span>
                        </button>
                    </div>
                )}

                <div className={'month__title ' + titleClassName}>Tháng MM năm YYY</div>
                {buttonClassName === 'getTheNextTwoMonths' && (
                    <div>
                        <button
                            type='button'
                            className={buttonClassName + ' month__getMonthBtn secondMonthButton'}
                        >
                            <span>
                                <Image src={imageSrc} size='12px' />
                            </span>
                        </button>
                    </div>
                )}
            </div>
            <div className='rdt_calender__body'>
                <Div className='flex-space' width='calc(44px * 7)'>
                    <div className='date'>CN</div>
                    <div className='date'>T2</div>
                    <div className='date'>T3</div>
                    <div className='date'>T4</div>
                    <div className='date'>T5</div>
                    <div className='date'>T6</div>
                    <div className='date'>T7</div>
                </Div>
                <table id={tableClassName}></table>
            </div>
        </div>
    );
};

export default Month;
