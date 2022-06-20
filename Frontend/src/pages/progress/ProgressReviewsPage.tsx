import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, reviewState } from "../../features/review/reviewSlice";
import { Div, Image } from "../../globalStyle";
import { getImage } from "../../helpers";

import $ from "jquery";
import "../css/progress_reviews.css";
interface IProgressReviewsPageProps {}

function Star({ dataStar }: { dataStar: number }) {
    const dispatch = useDispatch();

    useEffect(() => {
        $(".reviews__select-rating").each(function () {
            $(this)
                .off("click")
                .on("click", function () {
                    if ($(this).data("star") === "all") {
                        dispatch(fetchReviews({ numberOfStars: 0 }));
                    } else dispatch(fetchReviews({ numberOfStars: $(this).data("star") }));
                });
        });
    }, []);

    return (
        <div className='reviews__select-rating flex-center fs-14' data-star={dataStar}>
            <span style={{ fontSize: "14px", marginRight: "4px" }}>{dataStar}</span>
            <span>
                <Image src={getImage("/svg/yellowstar.svg")} size='14px' />
            </span>
        </div>
    );
}

function ReviewLine({ title, subRating }: { title: string; subRating: number }) {
    return (
        <div className='rdt__review-line'>
            <div className='fs-14'>{title}</div>
            <div className='normal-flex'>
                <div className='rdt__empty-rating'>
                    <div id='cleanlinessRating' className={"rdt__rating w-" + subRating}></div>
                </div>
                <span id='averageCleanlinessRating' className='fs-14 fw-500'>
                    {subRating}
                </span>
            </div>
        </div>
    );
}

const ProgressReviewsPage: FC<IProgressReviewsPageProps> = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(fetchReviews({ numberOfStars: 0 }));
    }, []);

    const { reviews, finalRatings } = useSelector(reviewState);

    return (
        <>
            {reviews && (
                <>
                    <div className='d-flex align-items-center justify-content-center'>
                        <div className='mr-10'>
                            <div
                                className='card text-white mb-3 bg-primary'
                                style={{ minWidth: "20rem" }}
                            >
                                <div className='card-header text-center'>Xếp hạng tổng thể</div>
                                <div className='card-body'>
                                    <h5
                                        className='
                                    card-title
                                    text-center
                                    d-flex
                                    align-items-center
                                    justify-content-center
                                '
                                        style={{ color: "white" }}
                                    >
                                        <span
                                            id='avgFinalRatings'
                                            className='mr-10 fs-20 inline-block'
                                        >
                                            {finalRatings}
                                        </span>
                                        <span>
                                            <Image
                                                src={getImage("/svg/yellowstar.svg")}
                                                size='20px'
                                            />
                                        </span>
                                    </h5>
                                </div>
                            </div>
                        </div>
                        <div className='mr-5'>
                            <div
                                className='card text-white mb-3 bg-success'
                                style={{ minWidth: "20rem" }}
                            >
                                <div className='card-header text-center'>Toàn bộ đánh giá</div>
                                <div className='card-body'>
                                    <h5
                                        className='card-title text-center'
                                        style={{ color: "white" }}
                                    >
                                        {reviews.length}
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <section id='reviews__reviews-container'>
                        <div id='reviews__reviews-header' className='normal-flex'>
                            <div
                                className='
                            reviews__select-rating
                          flex-center
                            fs-14
                        '
                                data-star='all'
                            >
                                Tất cả
                            </div>
                            {[5, 4, 3, 2, 1].map(value => (
                                <Star dataStar={value} key={value} />
                            ))}
                        </div>
                        <div style={{ marginTop: "20px" }} className='grid-2'>
                            {reviews.map(review => (
                                <div className='reviews__review-box' key={review.id}>
                                    <div className='normal-flex'>
                                        <Div
                                            style={{ alignSelf: "flex-start" }}
                                            height='calc(153px - 24px)'
                                            className='col-flex f1'
                                        >
                                            <div className='normal-flex'>
                                                <Div
                                                    height='56px'
                                                    width='56px'
                                                    className='overflow-hidden rounded-border'
                                                >
                                                    <img
                                                        src={getImage(review.customerAvatar)}
                                                        alt=''
                                                        className='w-100 h-100 of-c'
                                                    />
                                                </Div>
                                                <div
                                                    style={{ marginLeft: "12px" }}
                                                    className='fs-16'
                                                >
                                                    <div className='fw-600'>
                                                        {review.customerName}
                                                    </div>
                                                    <div className='fs-14 717171'>
                                                        {review.createdAt}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='progress--reviews__comment'>
                                                {review.comment}
                                            </div>
                                        </Div>

                                        <div className='normal-flex'>
                                            <div className='flex-1'>
                                                <ReviewLine
                                                    title='Mức độ sạch sẽ'
                                                    subRating={review.rating.cleanliness}
                                                />
                                                <ReviewLine
                                                    title='Liên lạc'
                                                    subRating={review.rating.contact}
                                                />
                                                <ReviewLine
                                                    title='Nhận phòng'
                                                    subRating={review.rating.checkin}
                                                />
                                            </div>
                                            <div className='flex-1'>
                                                <ReviewLine
                                                    title='Độ chính xác'
                                                    subRating={review.rating.accuracy}
                                                />
                                                <ReviewLine
                                                    title='Vị trí'
                                                    subRating={review.rating.location}
                                                />
                                                <ReviewLine
                                                    title='Giá trị'
                                                    subRating={review.rating.value}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </>
            )}
        </>
    );
};

export default ProgressReviewsPage;
