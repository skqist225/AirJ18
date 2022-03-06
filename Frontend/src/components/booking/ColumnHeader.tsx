import { FC } from 'react';

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
    return (
        <>
            {' '}
            <div>
                <button className='listings__table-header' data-sort-field={sortField}>
                    <div>{columnName.toUpperCase()}</div>
                    {isSortableHeader && (
                        <div className='listings__fiter-icon-container'>
                            {' '}
                            <span className='upper'></span>
                            <span className='downer'></span>
                        </div>
                    )}
                </button>
            </div>
        </>
    );
};

export default ColumnHeader;
