import { FC } from 'react';
import { Link } from 'react-router-dom';
import { DivWithBackGround } from '../../globalStyle';
import { getImage } from '../../helpers';

import './css/left_content.css';

interface ILeftPageContentProps {
    background: string;
    title: string;
    gradientBackground?: string;
}

const LeftPageContent: FC<ILeftPageContentProps> = ({ background, title, gradientBackground }) => {
    return (
        <DivWithBackGround
            className='p-relative h-100 w-50'
            src={getImage(background)}
            gradientBg={gradientBackground}
        >
            <div className='flex-center h-100'>
                <h1 id='left-content__title'>{title}</h1>
            </div>
            <div className='logoWrapper'>
                <Link to={'/'}>
                    <img
                        src={getImage('/images/airtntlogo.png')}
                        alt='airTntLogo'
                        id='airTntLogo'
                    />
                </Link>
            </div>
        </DivWithBackGround>
    );
};

export default LeftPageContent;
