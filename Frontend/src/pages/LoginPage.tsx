import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormGroup } from "../components/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";

import * as yup from "yup";
import { Divider, MainButton } from "../globalStyle";
import { FacebookLogo, GoogleLogo } from "../icon/icon";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../features/country/countrySlice";
import { RootState } from "../store";
import FormError from "../components/register/FormError";
import { addUser, forgotPassword, login } from "../features/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import "./css/register.css";
import { callToast, getImage } from "../helpers";
import Toast from "../components/notify/Toast";

const loginSchema = yup
    .object({
        email: yup.string().email().required("Vui lòng nhập địa chỉ email!"),
        password: yup.string().min(8, "Mật khẩu ít nhất 8 kí tự!"),
    })
    .required();

const forgotPasswordSchema = yup
    .object({
        email: yup.string().email().required("Vui lòng nhập địa chỉ email!"),
    })
    .required();

type HomeProps = {};

const LoginPage: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [state, setState] = useState("login");
    const { user, successMessage, errorMessage } = useSelector((state: RootState) => state.user);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(state === "login" ? loginSchema : forgotPasswordSchema),
    });

    useEffect(() => {
        dispatch(fetchCountries());
    }, []);

    console.log(errors);

    useEffect(() => {
        const bg = getImage("/images/register_background.jpg");

        $("#register").css({
            "background-image": `url(${bg})`,
            "background-repeat": "no-repeat",
            "background-position": "center center",
            "background-size": "cover",
        });
    }, []);

    useEffect(() => {
        if (successMessage) {
            callToast("success", successMessage);
        }
    }, [successMessage]);

    const onSubmit = (data: any) => {
        console.log(data);
        console.log(state);
        if (state === "login") dispatch(login({ ...data }));
        else if (state === "forgot-password") dispatch(forgotPassword({ ...data }));
    };

    useEffect(() => {
        if (user != null) navigate("/");
    }, [user]);

    function handleForgotPassword() {
        $("#register__header--title").text("Quên mật khẩu");
        $("#register__back--button").css("display", "block");
        $("#login__main__button").text("Gửi email");
        $("#login__password--container").css("display", "none");
        setState("forgot-password");
    }

    function resetState() {
        $("#register__header--title").text("Đăng nhập");
        $("#register__back--button").css("display", "none");
        $("#login__main__button").text("Đăng nhập");
        $("#login__password--container").css("display", "block");
        setState("login");
    }

    return (
        <div id='register'>
            <div id='register__container' className='flex-center'>
                <div className='register__content col-flex'>
                    <header className='flex-center'>
                        <div>
                            <button className='transparent-button' onClick={resetState}>
                                <img
                                    src={getImage("/svg/back.svg")}
                                    alt=''
                                    width={"20px"}
                                    height={"20px"}
                                />
                            </button>
                        </div>
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
                            {errorMessage === "Duplicate entry email" && (
                                <FormError message='Địa chỉ email đã tồn tại' />
                            )}
                            <div id='login__password--container'>
                                <FormGroup
                                    label='Mật khẩu'
                                    fieldName='password'
                                    type='password'
                                    register={register}
                                />
                                {errors?.password && (
                                    <FormError message={errors.password.message} />
                                )}
                            </div>
                            <div className='flex-space' id='authOptions'>
                                <button
                                    className='transparent-button'
                                    type='button'
                                    onClick={handleForgotPassword}
                                >
                                    Quên mật khẩu
                                </button>
                                <a href=''>Đăng nhập với SMS</a>
                            </div>
                            <MainButton
                                type='submit'
                                className='customBtn'
                                width='100%'
                                height='auto'
                                id='login__main__button'
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
                            <div className='register__login flex-space'>
                                <button className='register__login--button mr-10'>
                                    <span>
                                        <FacebookLogo width='20px' height='20px' />
                                    </span>
                                    <span>Tiếp tục với Facebook</span>
                                </button>
                                <button className='register__login--button'>
                                    <span>
                                        <GoogleLogo width='20px' height='20px' />
                                    </span>
                                    <span>Tiếp tục với Google</span>
                                </button>
                            </div>
                            <div className='flex-center'>
                                Bạn mới biết đến AirJ18?{" "}
                                <Link
                                    to={"/register"}
                                    style={{
                                        color: "rgb(93, 93, 207)",
                                        textDecoration: "underline",
                                    }}
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
            <Toast />
        </div>
    );
};

export default LoginPage;
