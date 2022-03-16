import { FC } from 'react';

export interface IReviewProps {
    value: number;
    className: string;
}

const ReviewValue: FC<IReviewProps> = ({ value, className }) => {
    return <input type='hidden' value={value} className={className} />;
};

export default ReviewValue;
