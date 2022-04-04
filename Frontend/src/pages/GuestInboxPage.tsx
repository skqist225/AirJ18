import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import { fetchInbox } from '../features/inbox/inboxSlice';

import './css/guest_inbox_page.css';
import $ from 'jquery';
import { userState } from '../features/user/userSlice';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface IGuestInboxPageProps {}

const GuestInboxPage: FC<IGuestInboxPageProps> = () => {
    const { hostid } = useParams();
    const dispatch = useDispatch();

    const { user } = useSelector(userState);

    var global = window;
    Object.assign(global, { WebSocket: require('websocket').w3cwebsocket });
    useEffect(() => {
        dispatch(fetchInbox({ hostid: hostid! }));
    }, []);

    let client: any = null;

    function connect() {
        console.log('called');
        const websocketUrl = 'ws://localhost:8080/websocket';
        const sockjs = new SockJS('http://localhost:8080/websocket');
        // client = new Client();
        client = new Client();
        client.webSocketFactory = function () {
            // Note that the URL is different from the WebSocket URL
            return sockjs;
        };
        // client.brokerURL = websocketUrl;
        client.connectHeaders = {};

        client.onConnect = function (frame: any) {
            console.log('Connected:' + frame);
            client.subscribe('/topic/private-messages', function (message: any) {
                if (message.body) console.log(JSON.parse(message.body).content);
            });
        };

        client.onStompError = function (frame: any) {
            // Will be invoked in case of error encountered at Broker
            // Bad login/passcode typically will cause an error
            // Complaint brokers will set `message` header with a brief message. Body may contain details.
            // Compliant brokers will terminate the connection after any error
            console.log('Broker reported error: ' + frame.headers['message']);
            console.log('Additional details: ' + frame.body);
        };

        client.activate();
    }
    useEffect(() => {
        connect();
    }, []);

    function sendMessge() {
        console.log('Sending message');
        client.publish({
            destination: '/app/private-message',
            body: JSON.stringify({
                sender: user?.id,
                receiver: 29,
                message: $('#guest--inbox__input').val(),
            }),
            headers: {},
        });
    }

    return (
        <>
            <Header includeMiddle={false} excludeBecomeHostAndNavigationHeader={true} />
            <div id='main'>
                <div className='col-flex h-100'>
                    <div className='normal-flex'>
                        <div className='normal-flex guest--inbox__left guest--inbox__header--info'>
                            <h1 className='guest--inbox__title fs-16 fw-600'>Tin nhắn</h1>
                        </div>
                        <div className='f1 guest--inbox__right flex-space w-100'>
                            <div>
                                <div className='fs-16 fw-600'>Tên chủ nhà</div>
                                <div className='fs-12 fw-500'>Thời gian phản hồi: 1 ngày</div>
                            </div>
                            <div>Lưu trữ cuộc trò chuyện</div>
                        </div>
                    </div>
                    <article className='normal-flex f1'>
                        <div className='guest--inbox__left h-100'>
                            <div>
                                <div>
                                    <img src='' alt='' />
                                </div>
                                <div>
                                    <div>Tên chủ nhà</div>
                                    <div>Loại:</div>
                                    <div>Message:</div>
                                </div>
                            </div>
                        </div>
                        <div className='guest--inbox__right f1 h-100 col-flex'>
                            <div>
                                <div>
                                    <div>
                                        <img src='' alt='' />
                                    </div>
                                    <div>
                                        <div>
                                            Tên khách hàng <span>Thời gian nhắn</span>
                                        </div>
                                        <div>Nội dung nhắn</div>
                                    </div>
                                </div>
                            </div>
                            <div className='guest--inbox__inputWrapper'>
                                <input type='text' id='guest--inbox__input' />
                            </div>
                            <div>
                                <button onClick={sendMessge}>Gửi tin nhắn</button>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
};

export default GuestInboxPage;
