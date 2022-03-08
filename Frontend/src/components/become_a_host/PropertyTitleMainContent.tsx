import { FC } from 'react';
import './css/title_main_content.css';

interface IPropertyTitleMainContentProps {}

const PropertyTitleMainContent: FC<IPropertyTitleMainContentProps> = () => {
    return (
        <div>
            <label className='title__label'>Tạo tiêu đề</label>
            <div>
                <textarea
                    name=''
                    id='room-name'
                    cols={30}
                    rows={10}
                    maxLength={50}
                    // onKeyDown='onKeyDown(event);'
                ></textarea>
            </div>
            <div id='numberOfTextPerMaxLength'>
                <span id='currentLength'>0</span>/50
            </div>
        </div>
    );
};

export default PropertyTitleMainContent;
