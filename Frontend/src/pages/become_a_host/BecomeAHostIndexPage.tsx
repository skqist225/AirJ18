import { FC } from 'react';
import { Link } from 'react-router-dom';
import { getImage } from '../../helpers/getImage';
import './css/become_a_host_index_page.css';

interface IBecomeAHostIndexPageProps {}

const BecomeAHostIndexPage: FC<IBecomeAHostIndexPageProps> = () => {
    function start() {
        window.location.href = window.location.origin + '/become-a-host/property-type-group';
    }

    return (
        <>
            <div className='become-a-host__main'>
                <div className='become-a-host__container'>
                    <div className='become-a-host__left'>
                        <video
                            src={getImage('/images/become_a_host.mp4')}
                            autoPlay
                            preload='auto'
                            className='w-100 h-100 of-c'
                            controls
                            loop
                        ></video>
                        <div className='logoWrapper'>
                            <Link to={'/'}>
                                <img
                                    src={getImage('/images/airtntlogo.png')}
                                    alt=''
                                    id='airTntLogo'
                                />
                            </Link>
                        </div>
                    </div>
                    <div className='become-a-host__right'>
                        <div className='become-a-host__right-first'>
                            <button
                                className='become-a-host__right-cancelBtn'
                                // onclick='backtoHomePage();'
                            >
                                <span>Thoát</span>
                            </button>
                        </div>
                        <div className='become-a-host__right-middle'>
                            <div className='become-a-host__right-middle__main-text'>
                                Trở thành Chủ nhà sau 10 bước dễ dàng
                            </div>
                            <div className='become-a-host__right-middle__sub-text'>
                                Hãy tham gia cùng chúng tôi. Chúng tôi sẽ trợ giúp bạn qua từng bước
                                của quy trình.
                            </div>
                        </div>
                        <div className='become-a-host__right-last'>
                            <button
                                className='become-a-host__right-startBtn'
                                onClick={() => start()}
                            >
                                <span>Bắt đầu thôi!</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BecomeAHostIndexPage;
