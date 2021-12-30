import React, { FC, ReactElement, ReactNode, useEffect } from 'react';
import Header from '../Header';


export interface IRoom {
    id: number;
    thumbnail: string;
    images: string[];
    likedByUsers: number[];
    price: number;
    name: string;
    currency: string;
    stay_type: string;
}

interface IRoomsProps {
    room: Array<IRoom>;
}

const RoomDetails: FC<IRoomsProps> = ({ room }) => {
    return (
        <>
            <Header excludeBecomeHostAndNavigationHeader={true} includeMiddle={false} />
            <main>
                 <div class="rdt_header" style="position: relative">
                <h1 class="rdt_name">{room.name}</h1>
                <input type="hidden" id="roomId" th:value="${room.id}" />
                <div class="rdt_below__header flex">
                    <div class="rdt_location__info text">
                        <span th:if="${room.city.name != null}">{room.city.name}, </span>
                        <span th:if="${room.state.name != null}">{room.state.name}, </span>
                        <span th:if="${room.country.name != null}">{room.country.name}</span>
                    </div>
                    <div class="rdt_header__action">
                        <div th:replace="room/_room_details_partial :: saveAndShare"></div>
                    </div>
                </div>

                <section class="rdt_images grid">
                    <div style="height: 480px">
                        <img th:src="@{${thumbnail}}" width="100%" height="100%" class="image" />
                    </div>
                    <div style="position: relative">
                        <div class="rdt_images__left" style="height: 470px">
                            <th:block th:each="image,iter : ${roomImages}">
                                <div style="width: 100%; height: calc(470px / 2)">
                                    <img
                                        th:src="@{${image.getImagePath(room.host.email, room.id)}}"
                                        class="image"
                                        style="width: 100%; height: 100%"
                                        th:class="${iter.even}? 'roundedBorder'"
                                    />
                                </div>
                            </th:block>
                        </div>
                        <!-- <a
                            style="text-decoration: none; cursor: pointer"
                            href="javascript:toggleHiddenImages();"
                        > -->
                        <a th:href="@{${room.id + '/images'}}">
                            <div class="rdt_showMoreImage">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 17 17"
                                    role="presentation"
                                    aria-hidden="true"
                                    focusable="false"
                                    style="
                                        height: 12px;
                                        width: 12px;
                                        display: block;
                                        fill: currentcolor;
                                    "
                                >
                                    <circle cx="1.5" cy="1.5" r="1.5"></circle>
                                    <circle cx="1.5" cy="8.5" r="1.5"></circle>
                                    <circle cx="8.5" cy="1.5" r="1.5"></circle>
                                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                                    <circle cx="15.5" cy="1.5" r="1.5"></circle>
                                    <circle cx="15.5" cy="8.5" r="1.5"></circle>
                                    <circle cx="1.5" cy="15.5" r="1.5"></circle>
                                    <circle cx="8.5" cy="15.5" r="1.5"></circle>
                                    <circle cx="15.5" cy="15.5" r="1.5"></circle>
                                </svg>
                                <div style="padding-left: 12px">Hiển thị tất cả ảnh</div>
                            </div>
                        </a>
                        <!-- </a> -->
                    </div>
                </section>

                <main class="rdt_body">
                    <div class="grid__2_1">
                        <article>
                            <div class="rdt_room__count flex">
                                <div>
                                    <h2 style="font-size: 22px; line-height: 40px">
                                        Phòng riêng tại room.category.name. Chủ nhà
                                        room.host.firstName room.host.lastName
                                    </h2>
                                    <p style="font-size: 16px; font-weight: 500">
                                        room.accomodatesCount khách ·
                                        room.bathroomCount phòng ngủ · room.bedCount
                                        giường · room.bedroomCount phòng tắm riêng
                                    </p>
                                </div>
                                <div>
                                    <img
                                        th:src="@{${room.host.avatarPath}}"
                                        alt=""
                                        class="image"
                                        width="64px"
                                        height="64px"
                                        style="border-radius: 50%"
                                    />
                                </div>
                            </div>
                            <div class="rdt_description rdt_body__common">
                                <p>room.description</p>
                            </div>
                            <div class="rdt_bedroom_info rdt_body__common">
                                <div class="rdt_amentity__header">Nơi bạn sẽ ngủ nghỉ</div>
                                <div class="rdt_room__decor">
                                    <div
                                        style="
                                            display: flex;
                                            align-items: center;
                                            margin-bottom: 16px;
                                        "
                                    >
                                        <th:block th:each="bed : ${numberOfBed}">
                                            <span>
                                                <svg
                                                    viewBox="0 0 32 32"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    aria-hidden="true"
                                                    role="presentation"
                                                    focusable="false"
                                                    style="
                                                        display: block;
                                                        height: 24px;
                                                        width: 24px;
                                                        fill: currentcolor;
                                                    "
                                                >
                                                    <path
                                                        d="M24 4a2 2 0 0 1 1.995 1.85L26 6v7.839l1.846 5.537a3 3 0 0 1 .115.468l.03.24.009.24V30h-2v-2H6v2H4v-9.675a3 3 0 0 1 .087-.717l.067-.232L6 13.836V6a2 2 0 0 1 1.697-1.977l.154-.018L8 4zm2 18H6v4h20zm-1.388-6H7.387l-1.333 4h19.891zM24 6H8v8h3v-4a2 2 0 0 1 1.85-1.995L13 8h6a2 2 0 0 1 1.995 1.85L21 10v4h3zm-5 4h-6v4h6z"
                                                    ></path>
                                                </svg> </span
                                        ></th:block>
                                    </div>
                                    <div style="margin-bottom: 8px; font-size: 16px">Phòng ngủ</div>
                                    <div style="font-size: 14px">
                                        <span th:text="${#arrays.length(numberOfBed)}"></span>
                                        giường đơn
                                    </div>
                                </div>
                            </div>
                            <div class="rdt_amentity rdt_body__common">
                                <h4 class="rdt_amentity__header">Nơi này có những gì cho bạn</h4>
                                <div style="display: grid; grid-template-columns: repeat(2, 1fr)">
                                    <th:block th:each="amt : ${room.amentities}">
                                        <div
                                            style="
                                                display: flex;
                                                align-items: center;
                                                padding-bottom: 16px;
                                                height: 40px;
                                            "
                                        >
                                            <span th:remove="tag">
                                                <img
                                                    th:src="@{${amt.iconImagePath}}"
                                                    alt=""
                                                    width="36px"
                                                    height="36px"
                                                />
                                            </span>
                                            <span style="padding-left: 16px">amt.name</span>
                                        </div>
                                    </th:block>
                                </div>
                            </div>
                            <div id="rdt_calender">
                                <div>
                                    <div
                                        style="
                                            font-size: 20px;
                                            font-weight: 500;
                                            margin-bottom: 5px;
                                        "
                                    >
                                        Chọn ngày nhận phòng
                                    </div>
                                    <div
                                        style="
                                            display: none;
                                            font-size: 20px;
                                            font-weight: 500;
                                            margin-bottom: 5px;
                                        "
                                        id="numberOfDaysContainer"
                                    >
                                        <span id="daysAtHere">1</span> đêm tại room.city.name
                                    </div>
                                </div>
                                <div style="color: #717171">
                                    <div id="beforeEndDateContainer">
                                        <span id="beforeChooseDay" style="font-size: 14px"
                                            >Thêm ngày đi để biết giá chính xác</span
                                        >
                                    </div>
                                    <div style="display: none" id="fromDayToDayContainer">
                                        <span id="fromDay">Từ ngày</span> -
                                        <span id="toDay">đến ngày</span>
                                    </div>
                                </div>
                                <div class="rdt_calender__header">
                                    <div class="flex3">
                                        <div class="firstMonth">
                                            <div style="display: flex; align-items: center">
                                                <div
                                                    th:replace="room/_room_details_partial :: nextCoupleOfMonth('close3', 'getThePrevTwoMonth')"
                                                ></div>
                                                <div class="monthTitle firstMonthAndYear">
                                                    Tháng MM năm YYY
                                                </div>
                                            </div>
                                            <div class="rdt_calender__body">
                                                <div class="flex3" style="width: calc(44px * 7)">
                                                    <div class="date">CN</div>
                                                    <div class="date">T2</div>
                                                    <div class="date">T3</div>
                                                    <div class="date">T4</div>
                                                    <div class="date">T5</div>
                                                    <div class="date">T6</div>
                                                    <div class="date">T7</div>
                                                </div>
                                                <table class="rdt_calender__days"></table>
                                            </div>
                                        </div>
                                        <div class="secondMonth">
                                            <div style="display: flex; align-items: center">
                                                <div class="pseudoContainer">
                                                    <div class="secondMonthAndYear monthTitle">
                                                        Tháng MM + 1 năm YYYY
                                                    </div>
                                                </div>
                                                <div
                                                    th:replace="room/_room_details_partial :: nextCoupleOfMonth('nextMonth', 'getTheNextTwoMonth')"
                                                ></div>
                                            </div>
                                            <div class="rdt_calender__body">
                                                <div class="flex3" style="width: calc(44px * 7)">
                                                    <div class="date">CN</div>
                                                    <div class="date">T2</div>
                                                    <div class="date">T3</div>
                                                    <div class="date">T4</div>
                                                    <div class="date">T5</div>
                                                    <div class="date">T6</div>
                                                    <div class="date">T7</div>
                                                </div>
                                                <table class="rdt_calender__days_plus-1"></table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </article>

                        <article class="rdt_booking">
                            <div
                                style="
                                    border: 1px solid rgb(221, 221, 221);
                                    border-radius: 12px;
                                    padding: 24px;
                                    box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
                                    width: 373px;
                                    float: right;
                                "
                            >
                                <div style="margin-bottom: 24px">
                                    <span class="rdt__price"
                                        >room.currency.symbol#numbers.formatDecimal(room.price,3,
                                        'POINT',0, 'COMMA')</span
                                    >
                                    <span
                                        style="font-size: 16px"
                                        th:if="${room.priceType.equals(T(com.airtnt.entity.PriceType).PER_NIGHT)}"
                                    >
                                        / đêm</span
                                    ><span
                                        style="font-size: 16px"
                                        th:if="${room.priceType.equals(T(com.airtnt.entity.PriceType).PER_WEEK)}"
                                    >
                                        / tuần</span
                                    >
                                </div>
                                <div
                                    style="
                                        border: 1px solid #b0b0b0;
                                        border-radius: 10px;
                                        font-size: 14px;
                                        overflow: hidden;
                                        margin-bottom: 20px;
                                    "
                                >
                                    <div class="flex">
                                        <div style="padding: 10px 12px 10px; width: 50%">
                                            <div style="font-weight: 600">Nhận phòng</div>
                                            <div id="checkinDate">Thêm ngày</div>
                                        </div>
                                        <div
                                            style="
                                                padding: 10px 12px 10px;
                                                width: 50%;
                                                border-left: 0.5px solid rgb(211, 211, 211);
                                            "
                                        >
                                            <div style="font-weight: 600">Trả phòng</div>
                                            <div id="checkoutDate">Thêm ngày</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        class="rdt_booking_button"
                                        onclick="processBooking();"
                                    >
                                        <span
                                            ><span
                                                style="
                                                    background-position: calc(
                                                            (100 - var(--mouse-x, 0)) * 1%
                                                        )
                                                        calc((100 - var(--mouse-y, 0)) * 1%);
                                                    --mouse-x: 96.4371;
                                                    --mouse-y: 50;
                                                "
                                            ></span></span
                                        ><span>Đặt phòng</span>
                                    </button>
                                </div>
                                <div class="previewPrice-line" style="margin-top: 20px">
                                    <div class="flex-space">
                                        <div>
                                            <button class="rdt_transparent__btn">
                                                <div
                                                    style="color: rgb(32, 32, 32); font-size: 14px"
                                                >
                                                    room.currency.symbol#numbers.formatDecimal(room.price,3,
                                                    'POINT',0, 'COMMA') x
                                                    <span id="numberOfNight">7</span>&nbsp;đêm&nbsp;
                                                </div>
                                            </button>
                                        </div>
                                        <div style="font-size: 14px">
                                            room.currency.symbol<span id="totalPrice"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="previewPrice-line">
                                    <div class="flex-space">
                                        <div>
                                            <button class="rdt_transparent__btn">
                                                <div
                                                    style="
                                                        color: rgb(32, 32, 32);
                                                        font-size: 14px;
                                                        text-decoration: underline;
                                                    "
                                                >
                                                    Phí dịch vụ
                                                </div>
                                            </button>
                                        </div>
                                        <div style="font-size: 14px">
                                            room.currency.symbol<span id="siteFee"></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex" style="padding-top: 16px">
                                    <div class="totalPriceTitle">Tổng</div>
                                    <div class="totalPriceTitle">
                                        room.currency.symbol<span
                                            id="finalTotalPrice"
                                        ></span>
                                    </div>
                                </div>
                            </div>
                        </article>
                    </div>
                    <div id="rdt__review">
                        <div>
                            <div class="normal-flex">
                                <img th:src="@{/svg/star.svg}" width="16px" height="16px" />
                                <span
                                    style="
                                        font-weight: 600;
                                        font-size: 22px;
                                        display: inline-block;
                                        margin-left: 12px;
                                    "
                                >
                                    <span
                                        th:text="${#numbers.formatDecimal(avgRatings, 0, 'POINT', 2,
                                    'COMMA')}"
                                        th:if="${numberOfReviews > 0}"
                                    ></span>
                                    <span th:if="${numberOfReviews == 0}">0</span>
                                    · numberOfReviews đánh giá
                                </span>
                            </div>
                            <div class="normal-flex" style="margin-bottom: 42px">
                                <div style="flex: 1; max-width: 50%">
                                    <div class="rdt__review-line">
                                        <div>Mức độ sạch sẽ</div>
                                        <div class="normal-flex">
                                            <div class="rdt__empty-rating">
                                                <div
                                                    id="cleanlinessRating"
                                                    class="rdt__rating"
                                                ></div>
                                            </div>
                                            <span id="averageCleanlinessRating"></span>
                                        </div>
                                    </div>
                                    <div class="rdt__review-line">
                                        <div>Liên lạc</div>
                                        <div class="normal-flex">
                                            <div class="rdt__empty-rating">
                                                <div id="contactRating" class="rdt__rating"></div>
                                            </div>
                                            <span id="averageContactRating"></span>
                                        </div>
                                    </div>
                                    <div class="rdt__review-line">
                                        <div>Nhận phòng</div>
                                        <div class="normal-flex">
                                            <div class="rdt__empty-rating">
                                                <div id="checkinRating" class="rdt__rating"></div>
                                            </div>
                                            <span id="averageCheckinRating"></span>
                                        </div>
                                    </div>
                                </div>
                                <div style="flex: 1; max-width: 50%">
                                    <div class="rdt__review-line">
                                        <div>Độ chính xác</div>
                                        <div class="normal-flex">
                                            <div class="rdt__empty-rating">
                                                <div id="accuracyRating" class="rdt__rating"></div>
                                            </div>
                                            <span id="averageAccuracyRating"></span>
                                        </div>
                                    </div>
                                    <div class="rdt__review-line">
                                        <div>Vị trí</div>
                                        <div class="normal-flex">
                                            <div class="rdt__empty-rating">
                                                <div id="locationRating" class="rdt__rating"></div>
                                            </div>
                                            <span id="averageLocationRating"></span>
                                        </div>
                                    </div>
                                    <div class="rdt__review-line">
                                        <div>Giá trị</div>
                                        <div class="normal-flex">
                                            <div class="rdt__empty-rating">
                                                <div id="valueRating" class="rdt__rating"></div>
                                            </div>
                                            <span id="averageValueRating"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div style="display: grid; grid-template-columns: repeat(2, 1fr)">
                                <th:block th:each="review : ${reviews}">
                                    <div class="rdt__review-box">
                                        <input
                                            type="hidden"
                                            th:value="${review.subRating.cleanliness}"
                                            class="cleanliness-rating"
                                        />
                                        <input
                                            type="hidden"
                                            th:value="${review.subRating.contact}"
                                            class="contact-rating"
                                        />
                                        <input
                                            type="hidden"
                                            th:value="${review.subRating.checkin}"
                                            class="checkin-rating"
                                        />
                                        <input
                                            type="hidden"
                                            th:value="${review.subRating.accuracy}"
                                            class="accuracy-rating"
                                        />
                                        <input
                                            type="hidden"
                                            th:value="${review.subRating.location}"
                                            class="location-rating"
                                        />
                                        <input
                                            type="hidden"
                                            th:value="${review.subRating.value}"
                                            class="value-rating"
                                        />
                                        <div class="normal-flex" style="margin-bottom: 20px">
                                            <div
                                                style="
                                                    width: 56px;
                                                    height: 56px;
                                                    border-radius: 50%;
                                                    overflow: hidden;
                                                "
                                            >
                                                <img
                                                    th:src="@{${review.booking.customer.avatarPath}}"
                                                    alt=""
                                                    style="
                                                        width: 100%;
                                                        height: 100%;
                                                        object-fit: cover;
                                                    "
                                                />
                                            </div>
                                            <div style="margin-left: 12px; font-size: 16px">
                                                <div style="font-weight: 600">
                                                    review.booking.customer.fullName
                                                </div>
                                                <div
                                                    th:text="${#dates.format(review.createdDate,
                                                    'dd-MM-yyyy')}"
                                                    style="color: #717171; font-size: 14px"
                                                ></div>
                                            </div>
                                        </div>
                                        <div style="max-width: 457px">review.comment</div>
                                    </div>
                                </th:block>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div id="rdt__location">
                            <div class="rdt_amentity__header">Nơi bạn sẽ đến</div>
                            <div id="map"></div>
                        </div>
                        <div class="rdt_host rdt_body__common">
                            <div class="host_info">
                                <div>
                                    <img
                                        th:src="@{${room.host.avatarPath}}"
                                        alt=""
                                        class="image"
                                        width="64px"
                                        height="64px"
                                        style="border-radius: 50%"
                                    />
                                </div>
                                <div style="margin-left: 20px">
                                    <h2 style="font-size: 22px; line-height: 26px">
                                        Chủ nhà room.host.firstName room.host.lastName
                                    </h2>
                                    <div
                                        style="
                                            padding-top: 8px;
                                            color: #717171;
                                            font-size: 14px;
                                            line-height: 18px;
                                        "
                                    >
                                        room.host.createdDate
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="rdt_rules rdt_body__common">
                            <h4 class="rdt_amentity__header">Những điều cần biết</h4>
                            <th:block th:each="rule : ${room.rules}">
                                <div style="display: flex; align-items: center; margin-bottom: 8px">
                                    <span th:remove="tag" th:utext="${rule.icon}"></span>
                                    <span style="padding-left: 16px">rule.title</span>
                                </div>
                            </th:block>
                        </div>
                    </div>
                </main>
            </div>
            </main>
        </>
    );
};

export default RoomDetails;