import { FC } from 'react';
import './css/filter_footer.css';

interface IFilterFooterProps {
    footerOf: string;
}

const FilterFooter: FC<IFilterFooterProps> = ({ footerOf }) => {
    return (
        <div className='filter--footer__container'>
            <div className='flex'>
                <div>
                    <button
                        className={'filter--footer__transparentBtn deleteBtn' + footerOf}
                        data-modify={footerOf}
                        disabled
                    >
                        Xóa
                    </button>
                </div>
                <div>
                    <button
                        className={'filter--footer__applyBtn applyBtn' + footerOf}
                        data-modify={footerOf}
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterFooter;
