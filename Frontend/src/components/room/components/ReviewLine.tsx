import { FC } from 'react';

export interface IReviewLineProps {
    title: string;
    id: string;
}

const ReviewLine: FC<IReviewLineProps> = ({ title, id }) => {
    return (
        <div className='rdt__review-line'>
            <div>{title}</div>
            <div className='normal-flex'>
                <div className='rdt__empty-rating'>
                    <div id={id} className='rdt__rating'></div>
                </div>
                <span id={`average${id.charAt(0).toUpperCase() + id.slice(1)}`}></span>
            </div>
        </div>
    );
};

export default ReviewLine;
