import { FC, useEffect } from "react";
import { Div, Image } from "../../globalStyle";
import { getImage } from "../../helpers";
import { IRoomDetails } from "../../types/room/type_RoomDetails";
import { leftReviewLines, rightReviewLines } from "../room/script/room_details";
import { ReviewLine, ReviewValue } from "./components";

import $ from "jquery";

interface IClientReviewProps {
    room: IRoomDetails;
}

const ClientReview: FC<IClientReviewProps> = ({ room }) => {
    useEffect(() => {
        if (room?.likedByCurrentUser) {
            $(".heartSvg").addClass("like");
        }
    }, []);

    return (
        <div id='rdt__review'>
            <div>
                <div className='normal-flex'>
                    <Image src={getImage("/svg/star.svg")} size='16px' />
                    <span
                        style={{
                            fontWeight: "600",
                            fontSize: "22px",
                            display: "inline-block",
                            marginLeft: "12px",
                        }}
                    >
                        {room!.reviews.length > 0 && <span>{room!.averageRating}</span>}
                        <span> · </span>
                        <span>{room!.reviews.length || 0} đánh giá</span>
                    </span>
                </div>
                <div className='normal-flex' style={{ marginBottom: "42px" }}>
                    <div className='flex-1'>
                        {leftReviewLines.map(({ title, id }) => (
                            <ReviewLine title={title} id={id} key={title} />
                        ))}
                    </div>
                    <div className='avgRatingWrapper'>
                        {rightReviewLines.map(({ title, id }) => (
                            <ReviewLine title={title} id={id} key={title} />
                        ))}
                    </div>
                </div>
                <div id='ratingDetailsContainer'>
                    {room!.reviews.map(review => (
                        <div className='rdt__review-box' key={review.createdAt}>
                            {Object.keys(review.rating).map(k => {
                                return (
                                    <ReviewValue
                                        value={(review.rating as any)[k]}
                                        className={`${k}-rating`}
                                        key={k}
                                    />
                                );
                            })}
                            <Div className='normal-flex' margin='0 0 20px 0'>
                                <div className='customerAvatarWrapper'>
                                    <img
                                        src={getImage(review.customerAvatar)}
                                        className='normal-img'
                                        alt={review.customerAvatar}
                                    />
                                </div>
                                <div style={{ marginLeft: "10px" }}>
                                    <div className='fs-16 fw-600'>{review.customerName}</div>
                                    <div
                                        style={{
                                            color: "#717171",
                                        }}
                                        className='fs-14'
                                    >
                                        {review.createdAt}
                                    </div>
                                </div>
                            </Div>
                            <div
                                style={{
                                    maxWidth: "457px",
                                }}
                                className='fs-16'
                            >
                                {review.comment}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ClientReview;
