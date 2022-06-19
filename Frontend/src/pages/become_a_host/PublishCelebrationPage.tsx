import { FC, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { LeftPageContent, RightPageContent } from "../../components/become_a_host";
import { userState } from "../../features/user/userSlice";
import { Div } from "../../globalStyle";
import { getImage } from "../../helpers";

import "./css/publish_celebration.css";

interface IPublishCelebrationPageProps {}

const PublishCelebrationPage: FC<IPublishCelebrationPageProps> = () => {
    const { user } = useSelector(userState);
    const { pathname } = useLocation();
    const roomid = pathname.split("/").pop();

    return (
        <Div height='100vh'>
            <Div className='flex-center'>
                {/* <LeftPageContent
                    background='/images/preview.jpg'
                    title='Hãy xem mục cho thuê của bạn!'
                />
                <RightPageContent
                    nextPage={`verify-listing/${roomid}`}
                    prevPage=''
                    MainContent={
                        <div classNameName='publish--celebration__mainContent'>
                            <div>Hân hạnh chào đón {user!.firstName + user!.lastName}</div>
                            <div>
                                Chủ nhà là trung tâm trong mọi hoạt động của chúng tôi và chúng tôi
                                rất mong bạn sẽ được trải nghiệm sự kỳ diệu của việc đón tiếp khách.
                            </div>
                        </div>
                    }
                    stepNumber={12}
                /> */}
                {/* style={{width: '1200px'; maxWidth: 90%; margin: 0 auto; width: 100%; height: 100vh}} */}
                <section>
                    <div
                        className='col-flex'
                        style={{
                            alignItems: "center",
                            justifyContent: "center",
                            height: "80%",
                        }}
                    >
                        <div
                            style={{
                                borderRadius: "16px",
                                boxShadow:
                                    "rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                padding: "24px",
                                width: "1000px",
                            }}
                        >
                            <div>
                                <img
                                    src={getImage("/images/confirmation.png")}
                                    alt=''
                                    width='50px'
                                    height='50px'
                                    style={{ objectFit: "cover" }}
                                />
                            </div>
                            <div style={{ fontSize: "32px", fontWeight: "600", color: "#28a745" }}>
                                Tạo phòng thành công
                            </div>
                            <div
                                style={{
                                    fontSize: "16px",
                                    marginTop: "20px",
                                    width: "70%",
                                    textAlign: "center",
                                }}
                            >
                                {/* Cảm ơn [[${username}]] đã sử dụng dịch vụ đặt phòng của{" "} */}
                                {/* <span>Airtnt.</span> */}
                            </div>
                            <div
                                style={{
                                    marginTop: "30px",
                                    display: "flex",
                                    alignItems: "center",
                                    width: "50%",
                                }}
                            >
                                <button
                                    className='rdt_booking_button'
                                    style={{ marginRight: "20px" }}
                                    onClick={() => (window.location.href = "/")}
                                >
                                    <span>
                                        <img src='' alt='' />
                                    </span>
                                    <span>Trở về trang chủ</span>
                                </button>
                                {/* <a
                                    // th:href='@{/user/bookings}
                                    style={{ textDecoration: "none" }}
                                >
                                    <button className='success-booking__preview-order-btn'>
                                        <span>
                                            <img src='' alt='' />
                                        </span>
                                        <span>Xem phòng đã đặt</span>
                                    </button>
                                </a> */}
                            </div>
                        </div>
                    </div>
                </section>
            </Div>
        </Div>
    );
};

export default PublishCelebrationPage;
