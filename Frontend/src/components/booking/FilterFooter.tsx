import { FC } from 'react';
import './filter_footer.css';

interface IFilterFooterProps {
    footerOf: string;
}

const FilterFooter: FC<IFilterFooterProps> = ({ footerOf }) => {
    return (
        <>
            {' '}
            <div className='filter-footer__container'>
                <div className='flex'>
                    <button
                        className={'listings__transparent-btn deleteBtn inline-block' + footerOf}
                        data-modify={footerOf}
                        disabled
                    >
                        Xóa
                    </button>
                    <button
                        className={'listings__black-btn applyBtn inline-block' + footerOf}
                        data-modify={footerOf}
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </>
    );
};

export default FilterFooter;
