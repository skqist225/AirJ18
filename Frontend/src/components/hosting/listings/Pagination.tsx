import { FC, useEffect } from 'react';
import $ from 'jquery';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';

interface IPaginationProps {}

export const Pagination: FC<IPaginationProps> = () => {
    const { pathname } = useLocation();

    const {
        hosting: { totalPages },
    } = useSelector((state: RootState) => state.room);

    function paginate() {
        $('.listings__link').first().addClass('active');

        highlightCurrentPageNumber(pathname.split('/').pop() as string);
        function highlightCurrentPageNumber(pageNumber: string) {
            $('.pagination').children().filter('.active').removeClass('active');
            $('.listings__link').each(function () {
                if ($(this).data('page').toString() === pageNumber) {
                    $(this).addClass('active');
                    return false;
                }
            });
        }
    }

    useEffect(() => {
        paginate();
    }, [pathname]);

    return (
        <div className='pagination'>
            <a data-page='prev'>&laquo;</a>
            {new Array(totalPages).fill(null).map((_, index) => (
                <Link
                    to={`/hosting/listings/${index + 1}${window.location.search}`}
                    className='listings__link'
                    data-page={index + 1}
                    key={index}
                >
                    {index + 1}
                </Link>
            ))}
            <a data-page='next'>&raquo;</a>
        </div>
    );
};
