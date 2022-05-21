import $ from "jquery";

export default function initComp(
    setCleanlinessRating: React.Dispatch<React.SetStateAction<number>>,
    setAccuracyRating: React.Dispatch<React.SetStateAction<number>>,
    setContactRating: React.Dispatch<React.SetStateAction<number>>,
    setLocationRating: React.Dispatch<React.SetStateAction<number>>,
    setCheckinRating: React.Dispatch<React.SetStateAction<number>>,
    setValueRating: React.Dispatch<React.SetStateAction<number>>,
    setRatingComment: React.Dispatch<React.SetStateAction<string>>,
    ratingComment: string
) {
    $(".bookingDate").each(function () {
        //customer can cancel booking if
        //1. less than 24h
        const bookingDate = new Date($(this).val()! as number).getTime();
        const nextDateOfBookingDate = bookingDate + 86400000;
        const currentTime = new Date().getTime();

        //2. is-cancel = false
        const isCancel = $(this).data("is-cancel");

        //3.if complete refund totalfee - sitefee else refund 100%
        const isComplete = $(this).data("is-complete");

        if (currentTime <= nextDateOfBookingDate && currentTime >= bookingDate && !isCancel)
            $(this).siblings(".cancelBookingBtn").css("display", "block");
        else $(this).siblings(".cancelBookingBtn").css("display", "none");
    });

    $(document).on("keypress", function (event) {
        if (event.key === "Enter") {
            filterBookings();
        }
    });

    $('input[name="ratingComment"]').on("change", function () {
        console.log($(this).val());
        setRatingComment($(this).val()! as string);
    });

    (function () {
        $(".ratingStar").each(function () {
            if (ratingComment !== null) {
                $(".ratingStar").off("click");
            } else
                $(this).on("click", function () {
                    const starValue = parseInt($(this).data("star-value"));
                    const ratingName = $(this).parent().parent().parent().data("rating-name");
                    let isHavingGreaterRating = false;

                    if ($(this).hasClass("selected")) {
                        $(this)
                            .parent()
                            .siblings()
                            .each(function () {
                                if (
                                    $(this).children(".ratingStar").data("star-value") * 1 >
                                        starValue &&
                                    $(this).children(".ratingStar").hasClass("selected")
                                ) {
                                    $(this).children(".ratingStar").removeClass("selected");
                                    isHavingGreaterRating = true;
                                }
                            });

                        if (!isHavingGreaterRating) {
                            $(this)
                                .parent()
                                .siblings()
                                .each(function () {
                                    if (
                                        $(this).children(".ratingStar").data("star-value") * 1 <
                                        starValue
                                    ) {
                                        $(this).children(".ratingStar").removeClass("selected");
                                    }
                                });

                            $(this).removeClass("selected");
                        } else {
                            switch (ratingName) {
                                case "Mức độ sạch sẽ": {
                                    setCleanlinessRating(starValue);
                                    break;
                                }
                                case "Độ chính xác": {
                                    setAccuracyRating(starValue);
                                    break;
                                }
                                case "Liên lạc": {
                                    setContactRating(starValue);
                                    break;
                                }
                                case "Vị trí": {
                                    setLocationRating(starValue);
                                    break;
                                }
                                case "Nhận phòng": {
                                    setCheckinRating(starValue);
                                    break;
                                }
                                case "Giá trị": {
                                    setValueRating(starValue);
                                    break;
                                }
                            }
                        }
                    } else {
                        $(this)
                            .parent()
                            .siblings()
                            .each(function () {
                                if (
                                    $(this).children(".ratingStar").data("star-value") * 1 <=
                                    starValue
                                )
                                    $(this).children(".ratingStar").addClass("selected");
                            });
                        $(this).addClass("selected");

                        switch (ratingName) {
                            case "Mức độ sạch sẽ": {
                                setCleanlinessRating(starValue);
                                break;
                            }
                            case "Độ chính xác": {
                                setAccuracyRating(starValue);
                                break;
                            }
                            case "Liên lạc": {
                                setContactRating(starValue);
                                break;
                            }
                            case "Vị trí": {
                                setLocationRating(starValue);
                                break;
                            }
                            case "Nhận phòng": {
                                setCheckinRating(starValue);
                                break;
                            }
                            case "Giá trị": {
                                setValueRating(starValue);
                                break;
                            }
                        }
                    }
                });
        });
    })();

    function filterBookings() {
        const searchValue = $("#user-bookings__search-input").val();

        // const filterOption =
        //     (window.location.href = `${baseURL}user/bookings?query=${searchValue}`);
    }
}
