import { FC } from 'react';
import $ from 'jquery';
import './css/title_main_content.css';

interface IPropertyTitleMainContentProps {}

const PropertyTitleMainContent: FC<IPropertyTitleMainContentProps> = () => {
    const roomName = $('#room-name');
    const currentLength = $('#currentLength');
    if (localStorage.getItem('room')) {
        const { roomTitle } = JSON.parse(localStorage.getItem('room')!);
        if (roomTitle) {
            roomName.val(roomTitle);
            currentLength.text(roomTitle.length);
        }
    }

    function onKeyDown(event: any) {
        const currentLength = $('#currentLength');
        const currentValue = parseInt(currentLength.text());
        if (event.key === 'Backspace') {
            if (currentValue > 0) currentLength.text(currentValue - 1);
        } else {
            if (currentValue < 50) currentLength.text(currentValue + 1);
        }
    }

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
                    onKeyDown={e => onKeyDown(e)}
                    placeholder=''
                    spellCheck='false'
                ></textarea>
            </div>
            <div id='numberOfTextPerMaxLength'>
                <span id='currentLength'>0</span>/50
            </div>
        </div>
    );
};

export default PropertyTitleMainContent;
