import { FC } from 'react';

import './css/box_footer.css';

interface IBoxFooterProps {
    dataEdit: string;
    idInput: string;
}

const BoxFooter: FC<IBoxFooterProps> = ({ dataEdit, idInput }) => {
    return (
        <div className='flex-space' id='box--footer__container'>
            <div>
                <button
                    className='manage-ys__transparent-btn'
                    data-section-key={dataEdit}
                    // onclick="hideEditBox($(this).data('section-key'))"
                >
                    Hủy
                </button>
            </div>
            <div>
                <button
                    className='manage-ys__save-edit-btn'
                    data-edit={dataEdit}
                    data-input={idInput}
                    // onclick="updateField($(this).data('edit'), $(this).data('input'));"
                >
                    Lưu
                </button>
            </div>
        </div>
    );
};

export default BoxFooter;
