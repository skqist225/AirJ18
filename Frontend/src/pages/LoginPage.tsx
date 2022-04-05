import { FC, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormGroup } from '../components/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import $ from 'jquery';

import * as yup from 'yup';
import { Divider, MainButton } from '../globalStyle';
import { FacebookLogo, GoogleLogo } from '../icon/icon';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../features/country/countrySlice';
import { RootState } from '../store';
import FormError from '../components/register/FormError';
import { addUser, login } from '../features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import './css/register.css';
import { getImage } from '../helpers';

const schema = yup
    .object({
        email: yup.string().email().required('Vui lòng nhập địa chỉ email!'),
        password: yup.string().min(8, 'Mật khẩu ít nhất 8 kí tự!'),
    })
    .required();

type HomeProps = {};

const LoginPage: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, successMessage, errorMessage } = useSelector((state: RootState) => state.user);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        dispatch(fetchCountries());
    }, []);

    console.log(errors);

    useEffect(() => {
        const bg = getImage('/images/register_background.jpg');

        $('#register').css({
            'background-image': `url(${bg})`,
            'background-repeat': 'no-repeat',
            'background-position': 'center center',
            'background-size': 'cover',
        });
    }, []);

    const onSubmit = (data: any) => {
        dispatch(login({ ...data }));
    };

    useEffect(() => {
        if (user != null) navigate('/');
    }, [user]);

    return (
        <div id='register'>
            <div id='register__container' className='flex-center'>
                <div className='register__content col-flex'>
                    <header className='flex-center'>
                        <div id='register__header--title'>Đăng nhập</div>
                    </header>
                    <Divider />
                    <article id='register__body'>
                        <div>Chào mừng bạn đến với AirJ18</div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup
                                label='Địa chỉ Email'
                                fieldName='email'
                                type='text'
                                register={register}
                            />
                            {errors?.email && <FormError message={errors.email.message} />}
                            {errorMessage === 'Duplicate entry email' && (
                                <FormError message='Địa chỉ email đã tồn tại' />
                            )}
                            <FormGroup
                                label='Mật khẩu'
                                fieldName='password'
                                type='password'
                                register={register}
                            />
                            {errors?.password && <FormError message={errors.password.message} />}

                            <MainButton
                                type='submit'
                                className='customBtn'
                                width='100%'
                                height='auto'
                            >
                                <span>Đăng nhập</span>
                            </MainButton>
                        </form>

                        <div id='register__login--section'>
                            <div className='normal-flex'>
                                <Divider className='flex-1'></Divider>
                                <span className='register__or--option'>hoặc</span>
                                <Divider className='flex-1'></Divider>
                            </div>
                            <div className='register__login'>
                                <button className='register__login--button'>
                                    <span>
                                        <FacebookLogo width='20px' height='20px' />
                                    </span>
                                    <span>Tiếp tục với Facebook</span>
                                </button>
                            </div>
                            <div>
                                <button className='register__login--button'>
                                    <span>
                                        <GoogleLogo width='20px' height='20px' />
                                    </span>
                                    <span>Tiếp tục với Google</span>
                                </button>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
