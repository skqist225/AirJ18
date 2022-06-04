import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FormGroup } from "../../components/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";

import * as yup from "yup";
import { Divider, MainButton } from "../../globalStyle";
import { FacebookLogo, GoogleLogo } from "../../icon/icon";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../features/country/countrySlice";
import { RootState } from "../../store";
import FormError from "../../components/register/FormError";
import { Link, useNavigate } from "react-router-dom";
import "../css/register.css";
import { callToast, getImage } from "../../helpers";
import Toast from "../../components/notify/Toast";
import { authState, forgotPassword, login } from "../../features/auth/authSlice";
import { userState } from "../../features/user/userSlice";
import { GoogleLogin, useGoogleLogin } from "@react-oauth/google";
import useScript from "../../hooks/use_script";

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
declare var gapi: any;
const LoginPage: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [state, setState] = useState("login");
    const { user, successMessage, errorMessage } = useSelector(userState);
    const { successMessage: forgotPasswordSuccessMessage, errorMessage: eMessage } =
        useSelector(authState);
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
        if (forgotPasswordSuccessMessage) {
            callToast("success", forgotPasswordSuccessMessage);
        }
    }, [forgotPasswordSuccessMessage]);

    useEffect(() => {
        if (eMessage === "User does not exist.") {
            callToast("error", "Người dùng không tồn tại");
        }
        if (eMessage === "Incorrect password") {
            callToast("error", "Người dùng hoặc mật khẩu không đúng");
        }
    }, [eMessage]);

    const onSubmit = (data: any) => {
        console.log(state);
        console.log(data);
        if (state === "login") dispatch(login({ ...data }));
        else if (state === "forgot-password") dispatch(forgotPassword({ ...data }));
    };

    useEffect(() => {
        if (user != null) navigate("/");
    }, [user]);

    const apiKey = "AIzaSyB965O06o1d70pCdE7VdsT6Bq3ZhwkqmAc";
    const clientId = "919947696132-31e7b23lq3ht2n81ap98kjf2k9t2k1rt.apps.googleusercontent.com";
    function handleClientLoad() {
        var authorizeButton = document.getElementById("authorize-button");
        console.log(authorizeButton);
        var signoutButton = document.getElementById("signout-button");
        // Load the API client and auth2 library
        (gapi as any).load("client:auth2", function () {
            (gapi as any).client
                .init({
                    apiKey: apiKey,
                    discoveryDocs: discoveryDocs,
                    clientId: clientId,
                    scope: scopes,
                })
                .then(function () {
                    // Listen for sign-in state changes.
                    function updateSigninStatus(isSignedIn: boolean) {
                        if (isSignedIn) {
                            authorizeButton!.style.display = "none";
                            signoutButton!.style.display = "block";
                            makeApiCall();
                        } else {
                            authorizeButton!.style.display = "block";
                            signoutButton!.style.display = "none";
                        }
                    }
                    gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

                    // Handle the initial sign-in state.
                    updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
                });
        });
    }
    var discoveryDocs = ["https://people.googleapis.com/$discovery/rest?version=v1"];
    var scopes = "profile";

    function makeApiCall() {
        gapi.client.people.people
            .get({
                resourceName: "people/me",
                "requestMask.includeField": "person.names",
            })
            .then(function (resp: any) {
                var p = document.createElement("p");
                var name = resp.result.names[0].givenName;
                p.appendChild(document.createTextNode("Hello, " + name + "!"));
                document.getElementById("content")!.appendChild(p);
            });
    }

    useScript("https://apis.google.com/js/api.js", () => {
        // (window as any).google.accounts.id.initialize({
        //     client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        //     callback: onGoogleSignIn,
        // });
        handleClientLoad();
        // window.google.accounts.id.renderButton(
        //     googleSignInButton.current,
        //     { theme: "outline", size: "large", text, width: "250" } // customization attributes
        // );
    });

    function onGoogleSignIn(googleUser: any) {
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log("Name: " + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
    }

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

    function handleAuthClick(event: any) {
        gapi.auth2.getAuthInstance().signIn();
    }

    function handleSignoutClick(event: any) {
        gapi.auth2.getAuthInstance().signOut();
    }

    const handleLoginWithGoogle = useGoogleLogin({
        onSuccess: ({ access_token }) => {
            console.log(access_token);
            var url = `https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses&key=AIzaSyB965O06o1d70pCdE7VdsT6Bq3ZhwkqmAc`;

            $.ajax({
                type: "GET",
                url: url,
                async: false,
                success: function (userInfo) {
                    //info about user
                    console.log(userInfo);
                    console.log("test");
                },
                error: function (e) {
                    console.log("error");
                },
            });
        },
    });

    const handleFailure = (googleData: any) => {
        // console.log(JSON.parse(googleData));
        console.log(googleData);
        // alert(JSON.parse(googleData));
    };

    return (
        <div id='register'>
            <div id='register__container' className='flex-center'>
                <div className='register__content col-flex'>
                    <header className='flex-center'>
                        {state === "forgot-password" && (
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
                        )}
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
                            {/* <div className='register__login flex-space'>
                                <button className='register__login--button mr-10'>
                                    <span>
                                        <FacebookLogo width='20px' height='20px' />
                                    </span>
                                    <span>Tiếp tục với Facebook</span>
                                </button> */}
                            {/* <button
                                    className='register__login--button g-signin2'
                                    onClick={() => handleLoginWithGoogle()}
                                    // data-onsuccess='onSignIn'
                                >
                                    <span>
                                        <GoogleLogo width='20px' height='20px' />
                                    </span>
                                    <span>Tiếp tục với Google</span>
                                </button> */}
                            {/* <div className='register__login--button'>
                                    <button
                                        id='authorize-button'
                                        style={{ display: "block" }}
                                        onClick={handleAuthClick}
                                    >
                                        Authorize
                                    </button>
                                    <button
                                        id='signout-button'
                                        style={{ display: "none" }}
                                        onClick={handleSignoutClick}
                                    >
                                        Sign Out
                                    </button>
                                </div> */}
                            {/* <div id='content'></div> */}
                            {/* <GoogleLogin
                                    onSuccess={credentialResponse => {
                                        console.log(credentialResponse);
                                    }}
                                    onError={() => {
                                        console.log("Login Failed");
                                    }}
                                    useOneTap
                                /> */}
                            {/* </div> */}
                            <div className='flex-center'>
                                Bạn mới biết đến AirJ18?&nbsp;
                                <Link
                                    to={"/auth/register"}
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
