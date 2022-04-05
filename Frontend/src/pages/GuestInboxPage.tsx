import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import {
    fetchInboxBetweenSenderAndReceiver,
    fetchReceivers,
    inboxState,
} from '../features/inbox/inboxSlice';

import './css/guest_inbox_page.css';
import $ from 'jquery';
import { userState } from '../features/user/userSlice';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Image } from '../globalStyle';
import { getImage } from '../helpers';

interface IGuestInboxPageProps {}

const GuestInboxPage: FC<IGuestInboxPageProps> = () => {
    const { receiverid } = useParams();
    const dispatch = useDispatch();

    const { user } = useSelector(userState);
    const { chats, receivers } = useSelector(inboxState);

    var global = window;
    Object.assign(global, { WebSocket: require('websocket').w3cwebsocket });
    useEffect(() => {
        // dispatch(fetchInboxBetweenSenderAndReceiver({ receiver: parseInt(receiverid!) }));
        // dispatch(fetchReceivers);
    }, []);

    console.log(chats);

    let client: any = null;

    function connect() {
        const sockjs = new SockJS('http://localhost:8080/websocket');
        client = new Client();
        client.webSocketFactory = function () {
            return sockjs;
        };
        client.connectHeaders = {};

        client.onConnect = function (frame: any) {
            client.subscribe('/user/' + user?.id + '/private', function (message: any) {
                if (message.headers['content-type'] === 'application/octet-stream') {
                    const msg = message._binaryBody
                        .reduce((acc: string[], curr: number) => {
                            acc.push(String.fromCharCode(parseInt(curr.toString(), 2)));

                            return acc;
                        }, [])
                        .join('');
                    console.log(msg);
                } else {
                    console.log(message);
                    console.log(message.body);
                }
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
    }, [receiverid]);

    function sendMessge() {
        console.log('Sending message');
        console.log(client);
        if (client === null) connect();

        client.publish({
            destination: '/app/private-message',
            body: JSON.stringify({
                sender: user?.id,
                receiver: receiverid!,
                message: $('#guest--inbox__input').val(),
            }),
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
                            {receivers &&
                                receivers.length &&
                                receivers.map(receiver => (
                                    <div className='normal-flex guest--inbox__receiverinfo'>
                                        <div className='mr-10'>
                                            <Image
                                                src={getImage(receiver.avatar)}
                                                alt=''
                                                width={'50px'}
                                                height='50px'
                                                className='rounded-border'
                                            />
                                        </div>
                                        <div>
                                            <div>{receiver.fullName}</div>
                                            <div>Loại:</div>
                                            <div>Message:</div>
                                        </div>
                                    </div>
                                ))}
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
