import { FC } from 'react';
import { Link } from 'react-router-dom';
import { RightPageContent } from '../../components/become_a_host';
import { Div } from '../../globalStyle';
import { getImage } from '../../helpers';

import './css/index.css';

interface IBecomeAHostIndexPageProps {}

const BecomeAHostIndexPage: FC<IBecomeAHostIndexPageProps> = () => {
    return (
        <Div height='100vh'>
            <Div className='flex'>
                <Div className='p-relative flex-1'>
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
                            <img src={getImage('/images/airtntlogo.png')} alt='' id='airTntLogo' />
                        </Link>
                    </div>
                </Div>

                <RightPageContent
                    nextPage='property-type-group'
                    prevPage=''
                    MainContent={
                        <Div
                            className='col-flex'
                            style={{ justifyContent: 'center', alignItems: 'center' }}
                        >
                            <h1 className='become-a-host__main--text'>
                                Trở thành Chủ nhà sau 11 bước dễ dàng
                            </h1>
                            <h4 className='become-a-host__sub-text'>
                                Hãy tham gia cùng chúng tôi. Chúng tôi sẽ trợ giúp bạn qua từng bước
                                của quy trình.
                            </h4>
                        </Div>
                    }
                    stepNumber={0}
                    backgroundColor='#000000'
                />
            </Div>
        </Div>
    );
};

export default BecomeAHostIndexPage;
