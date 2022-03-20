import { FC, useEffect, useState } from 'react';

import $ from 'jquery';
import { useDispatch } from 'react-redux';
import { fetchUserOwnedRoom } from '../../features/room/roomSlice';
import { useParams } from 'react-router-dom';

import './css/column_header.css';

interface IColumnHeaderProps {
    columnName: string;
    sortField: string;
    isSortableHeader?: boolean;
}

const ColumnHeader: FC<IColumnHeaderProps> = ({
    columnName,
    sortField,
    isSortableHeader = true,
}) => {
    const dispatch = useDispatch();
    const { page } = useParams();
    const [sortDir, setSortDir] = useState('ASC');

    const searchParams = new URLSearchParams().get('SORTDIR');
    if (searchParams) searchParams === 'ASC' ? setSortDir('DESC') : setSortDir('ASC');

    console.log('component reload!');

    function sortData(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
        const sortField: string = $(event.currentTarget).data('sort-field');
        dispatch(fetchUserOwnedRoom({ pageNumber: parseInt(page!), sortField, sortDir }));

        if (sortDir === 'ASC') {
            const upperSelft = $('.upper.' + sortField);
            $('.sort').filter('.active').removeClass('active');
            upperSelft.addClass('active');
            setSortDir('DESC');
        } else {
            const downerSelf = $('.downer.' + sortField);
            $('.sort').filter('.active').removeClass('active');
            downerSelf.addClass('active');
            setSortDir('ASC');
        }
    }

    return (
        <div>
            <button
                className='listings__table-header'
                data-sort-field={sortField}
                onClick={sortData}
            >
                <div className='mr-10'>{columnName}</div>
                {isSortableHeader && (
                    <div className='col-flex-center'>
                        {' '}
                        <span className={'upper sort ' + sortField}></span>
                        <span className={'downer sort ' + sortField}></span>
                    </div>
                )}
            </button>
        </div>
    );
};

export default ColumnHeader;
