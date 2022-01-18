import { FC } from 'react';

interface IIncAndDecBtnProps {
    dataEdit: string;
    dataTrigger: string;
}

export const IncAndDecBtn: FC<IIncAndDecBtnProps> = ({ dataEdit, dataTrigger }) => {
    return (
        <>
            <div>
                <button
                    className='listings__minus-btn incAndDecBtn'
                    data-function='dec'
                    data-edit={dataEdit}
                    data-trigger={dataTrigger}
                >
                    <span>
                        <img
                            src='@{/svg/minus.svg}'
                            alt='minus icon'
                            width='12px'
                            height='12px'
                            style={{ objectFit: 'contain' }}
                        />
                    </span>
                </button>
                <span id='${dataEdit}' className='filter-count'>
                    0
                </span>
                <button
                    className='listings__plus-btn incAndDecBtn'
                    data-function='inc'
                    data-edit={dataEdit}
                    data-trigger={dataTrigger}
                >
                    <span>
                        <img
                            src='@{/svg/plus.svg}'
                            alt='plus icon'
                            width='12px'
                            height='12px'
                            style={{ objectFit: 'contain' }}
                        />
                    </span>
                </button>
            </div>
        </>
    );
};
