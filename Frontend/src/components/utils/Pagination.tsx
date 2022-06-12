import { FC, useEffect } from "react";
import $ from "jquery";
import { Link, useLocation } from "react-router-dom";

interface IPaginationProps {
    totalPages: number;
    to: string;
}

const Pagination: FC<IPaginationProps> = ({ totalPages, to }) => {
    const { pathname } = useLocation();

    function highlightCurrentPageNumber(pageNumber: string) {
        $(".listings__link").filter(".active").removeClass("active");
        $(".listings__link").each(function () {
            if ($(this).data("page").toString() === pageNumber) {
                $(this).addClass("active");
                return false;
            }
        });
    }

    function paginate() {
        highlightCurrentPageNumber(pathname.split("/").pop() as string);
    }

    useEffect(() => {
        paginate();
    }, [totalPages, pathname]);

    return (
        <div className='pagination'>
            <a data-page='prev'>&laquo;</a>
            {new Array(totalPages).fill(null).map((_, index) => (
                <Link
                    to={`/${to}/listings/${index + 1}${window.location.search}`}
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

export default Pagination;
