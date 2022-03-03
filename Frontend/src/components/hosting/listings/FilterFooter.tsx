import { FC } from 'react';

interface IFilterFooterProps {
    footerOf: string;
}

export const FilterFooter: FC<IFilterFooterProps> = ({ footerOf }) => {
    return (
        <>
            <div id='filter-footer__container'>
                <div className='flex p-24'>
                    <button
                        className={`listings__transparent-btn deleteBtn inline-block ${footerOf}`}
                        data-modify={footerOf}
                        disabled
                    >
                        Xóa
                    </button>
                    <button
                        className={`listings__black-btn applyBtn inline-block ${footerOf}`}
                        data-modify={footerOf}
                    >
                        Áp dụng
                    </button>
                </div>
            </div>
        </>
    );
};
