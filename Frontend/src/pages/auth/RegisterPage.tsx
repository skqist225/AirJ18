import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FormGroup, DropDown } from "../../components/utils";
import { yupResolver } from "@hookform/resolvers/yup";
import $ from "jquery";

import * as yup from "yup";
import { FloatingLabel, Form } from "react-bootstrap";
import { Divider, MainButton } from "../../globalStyle";
import { FacebookLogo, GoogleLogo } from "../../icon/icon";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../features/country/countrySlice";
import { RootState } from "../../store";
import FormError from "../../components/register/FormError";
import { getImage } from "../../helpers";
import {
    checkPhoneNumber,
    clearErrorMessage,
    clearSuccessMessage,
    registerUser,
} from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import "../css/register.css";

const phoneNumberSchema = yup
    .object({
        phoneNumber: yup
            .string()
            .matches(
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                "Số điện thoại không hợp lệ!"
            ),
    })
    .required();

const schema = yup
    .object({
        firstName: yup.string().required("Vui lòng nhập tên."),
        lastName: yup.string().required("Vui lòng nhập họ."),
        password: yup.string().length(8, "Mật khẩu ít nhất 8 kí tự."),
        birthday: yup.string().required("Vui lòng chọn ngày sinh."),
        email: yup
            .string()
            .email("Địa chỉ email chưa đúng định dạng.")
            .required("Vui lòng nhập địa chỉ email."),
    })
    .required();

type HomeProps = {};

const RegisterPage: FC<HomeProps> = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { countries } = useSelector((state: RootState) => state.country);
    const { user, successMessage, errorMessage } = useSelector((state: RootState) => state.auth);
    const {
        register,
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(phoneNumberSchema),
    });

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        formState: { errors: errors2 },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [phoneNumber, setPhoneNumber] = useState("");
    const [country, setCountry] = useState("");

    useEffect(() => {
        dispatch(fetchCountries());
    }, []);

    useEffect(() => {
        const bg = getImage("/images/register_background.jpg");

        $("#register").css({
            "background-image": `url(${bg})`,
            "background-repeat": "no-repeat",
            "background-position": "center center",
            "background-size": "cover",
        });
    }, []);

    function hide(id: string) {
        $(id).css("display", "none");
    }

    function display(id: string) {
        $(id).css("display", "block");
    }

    const onSubmit = (data: any) => {
        setPhoneNumber(data.phoneNumber);
        setCountry(data.country);
        dispatch(
            checkPhoneNumber({
                phoneNumber: data.phoneNumber,
            })
        );
    };

    const backToPreviousPage = () => {
        display("#register__first--form");
        display("#register__login--section");
        hide("#register__second--form");
        hide("#register__header--back");
    };

    const onSubmitFinalStep = (data: any) => {
        dispatch(
            registerUser({
                ...data,
                phoneNumber,
            })
        );
    };

    useEffect(() => {
        if (user != null) navigate("/auth/login");
    }, [user]);

    useEffect(() => {
        if (successMessage === "Phone number has not been used by anyone yet") {
            dispatch(clearErrorMessage({}));
            hide("#register__first--form");
            hide("#register__login--section");
            display("#register__second--form");
            display("#register__header--back");
            dispatch(clearSuccessMessage({}));
        }
    }, [successMessage]);

    return (
        <div id='register'>
            <div id='register__container' className='flex-center'>
                <div className='register__content col-flex'>
                    <header className='flex-center'>
                        <div id='register__header--back' onClick={backToPreviousPage}>
                            <img src={getImage("/svg/back.svg")} width={"18px"} height={"18px"} />
                        </div>
                        <div id='register__header--title'>Đăng ký</div>
                    </header>
                    <Divider />
                    <article id='register__body'>
                        <div>Chào mừng bạn đến với AirJ18</div>
                        <form onSubmit={handleSubmit(onSubmit)} id='register__first--form'>
                            <FloatingLabel controlId='floatingSelect' label='Quốc gia/Khu vực'>
                                <Controller
                                    name='country'
                                    defaultValue={"216"}
                                    control={control}
                                    render={({ field }) => (
                                        <Form.Select {...field}>
                                            {countries.map(country => (
                                                <option key={country.id} value={country.id}>
                                                    {country.name} ({country.dialCode})
                                                </option>
                                            ))}
                                        </Form.Select>
                                    )}
                                />{" "}
                            </FloatingLabel>
                            <div style={{ width: "100%", height: "10px" }}></div>
                            <FormGroup
                                label='Số điện thoại'
                                register={register}
                                fieldName='phoneNumber'
                                type='text'
                            />
                            {errors?.phoneNumber && (
                                <FormError message={errors.phoneNumber.message} />
                            )}
                            {errorMessage === "Phone number has already been taken" && (
                                <FormError message='Số điện thoại đã được sử dụng' />
                            )}
                            <div style={{ textAlign: "center" }}>
                                <MainButton type='submit' style={{ width: "100%" }}>
                                    <span>Tiếp tục</span>
                                </MainButton>
                            </div>
                        </form>
                        <form
                            onSubmit={handleSubmit2(onSubmitFinalStep)}
                            id='register__second--form'
                        >
                            <FormGroup
                                label='Tên'
                                placeholder='Tên'
                                fieldName='firstName'
                                type='text'
                                register={register2}
                            />
                            {errors2?.firstName && (
                                <FormError message={errors2.firstName.message} />
                            )}
                            <FormGroup
                                label='Họ'
                                placeholder='Họ'
                                fieldName='lastName'
                                type='text'
                                register={register2}
                            />
                            {errors2?.lastName && <FormError message={errors2.lastName.message} />}
                            <FormGroup
                                label='Ngày sinh'
                                fieldName='birthday'
                                type='date'
                                register={register2}
                            />
                            {errors2?.birthday && <FormError message={errors2.birthday.message} />}
                            {errorMessage === "Không chọn ngày lớn hơn hiện tại." && (
                                <FormError message={errorMessage} />
                            )}
                            <DropDown
                                label='Giới tính'
                                fieldName='sex'
                                register={register2}
                                options={[
                                    {
                                        value: "MALE",
                                        displayText: "Nam",
                                    },
                                    {
                                        value: "FEMALE",
                                        displayText: "Nữ",
                                    },
                                    {
                                        value: "OTHER",
                                        displayText: "Khác",
                                    },
                                ]}
                            />
                            {errors2?.sex && <FormError message={errors2.sex.message} />}
                            <FormGroup
                                label='Địa chỉ Email'
                                fieldName='email'
                                type='text'
                                register={register2}
                            />
                            {errors2?.email && <FormError message={errors2.email.message} />}
                            {errorMessage === "Email has already been taken" && (
                                <FormError message='Địa chỉ email đã tồn tại' />
                            )}
                            <FormGroup
                                label='Mật khẩu'
                                fieldName='password'
                                type='password'
                                register={register2}
                            />
                            {errors2?.password && <FormError message={errors2.password.message} />}

                            <MainButton type='submit' className='customBtn'>
                                <span>Đăng ký</span>
                            </MainButton>
                        </form>

                        {/* <div id='register__login--section'>
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
                        </div> */}
                    </article>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
