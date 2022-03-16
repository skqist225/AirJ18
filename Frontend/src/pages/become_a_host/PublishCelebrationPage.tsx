import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { LeftPageContent, RightPageContent } from '../../components/become_a_host';
import { userState } from '../../features/user/userSlice';
import { Div } from '../../globalStyle';

import './css/publish_celebration.css';

interface IPublishCelebrationPageProps {}

const PublishCelebrationPage: FC<IPublishCelebrationPageProps> = () => {
    const { user } = useSelector(userState);
    const { pathname } = useLocation();
    const roomid = pathname.split('/').pop();

    return (
        <Div height='100vh'>
            <Div className='flex'>
                <LeftPageContent
                    background='/images/preview.jpg'
                    title='Hãy xem mục cho thuê của bạn!'
                />
                <RightPageContent
                    nextPage={`verify-listing/${roomid}`}
                    prevPage=''
                    MainContent={
                        <div className='publish--celebration__mainContent'>
                            <div>Hân hạnh chào đón {user!.firstName + user!.lastName}</div>
                            <div>
                                Chủ nhà là trung tâm trong mọi hoạt động của chúng tôi và chúng tôi
                                rất mong bạn sẽ được trải nghiệm sự kỳ diệu của việc đón tiếp khách.
                            </div>
                        </div>
                    }
                    stepNumber={12}
                />
            </Div>
        </Div>
    );
};

export default PublishCelebrationPage;
