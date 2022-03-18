import { FC, useEffect } from 'react';

import $ from 'jquery';
import './css/topbar.css';
import { Link } from 'react-router-dom';

interface ITopBarProps {}

const TopBar: FC<ITopBarProps> = () => {
    const topBarTitles = [
        { title: 'Cơ hội', path: 'opportunity-hub' },
        { title: 'Đánh giá', path: 'opportunity-hub' },
        { title: 'Thu nhập', path: `earnings?year=${new Date().getFullYear()}` },
        { title: 'Lượt xem', path: 'opportunity-hub' },
        { title: 'Chủ nhà siêu cấp', path: 'opportunity-hub' },
        { title: 'Vệ sinh', path: 'opportunity-hub' },
    ];

    useEffect(() => {
        $('.topBar__titleContainer').first().addClass('active');
    }, []);

    return (
        <div>
            <div className='normal-flex' id='topBar__contentWrapper'>
                {topBarTitles.map(({ title, path }) => (
                    <div key={title} className='topBar__titleContainer'>
                        <Link to={`/progress/${path}`}>{title}</Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopBar;
