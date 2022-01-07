import { FC, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormGroup, DropDown } from '../components/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import $ from 'jquery';
import './register.css';
import * as yup from 'yup';
import { FloatingLabel, Form } from 'react-bootstrap';
import { Divider, MainButton } from '../globalStyle';
import { FacebookLogo, GoogleLogo } from '../icon/icon';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries } from '../features/country/countrySlice';
import { RootState } from '../store';

const schema = yup
    .object({
        // firstName: yup.string().required('Vui lòng nhập tên!'),
        // lastName: yup.string().required('Vui lòng nhập họ'),
        // password: yup.string().length(8, 'Mật khẩu ít nhất 8 kí tự!'),
        phoneNumber: yup
            .string()
            .matches(
                /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                'Số điện thoại không hợp lệ'
            ),
        // birthday: yup.string().required(),
        // email: yup.string().email().required('Vui lòng nhập địa chỉ email!'),
    })
    .required();

type HomeProps = {};

const RegisterPage: FC<HomeProps> = () => {
    const dispatch = useDispatch();
    const { countries } = useSelector((state: RootState) => state.country);
    const {
        register,
        control,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });
    const [phoneNumber, setPhoneNumber] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
        dispatch(fetchCountries());
    }, []);

    console.log(errors);

    useEffect(() => {
        const bg = `${process.env.REACT_APP_SERVER_URL}/images/register_background.jpg`;

        $('#register').css({
            'background-image': `url(${bg})`,
            'background-repeat': 'no-repeat',
            'background-position': 'center center',
            'background-size': 'cover',
        });
    }, []);

    const onSubmit = (data: any) => {
        setPhoneNumber(data.phoneNumber);
        setCountry(data.country);

        $('#register__first--form').css('display', 'none');
        $('#register__second--form').css('display', 'block');
    };

    const onSubmitFinalStep = (data: any) => {
        console.log(data);
    };

    return (
        <div id='register'>
            <div id='register__container' className='flex-center'>
                <div className='register__content col-flex'>
                    <header className='flex-center'>
                        <div></div>
                        <div id='register__header--title'>Đăng nhập hoặc đăng ký</div>
                    </header>
                    <Divider />
                    <article id='register__body'>
                        <div>Chào mừng bạn đến với AirJ18</div>
                        <form onSubmit={handleSubmit(onSubmit)} id='register__first--form'>
                            <FloatingLabel controlId='floatingSelect' label='Quốc gia/Khu vực'>
                                <Controller
                                    name='country'
                                    defaultValue={'216'}
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
                                />{' '}
                            </FloatingLabel>
                            <FormGroup
                                label='Số điện thoại'
                                register={register}
                                errors={errors}
                                fieldName='phoneNumber'
                                type='text'
                            />

                            <MainButton type='submit' className='customBtn'>
                                <span>Tiếp tục</span>
                            </MainButton>
                        </form>
                        <form
                            onSubmit={handleSubmit(onSubmitFinalStep)}
                            id='register__second--form'
                        >
                            <FormGroup
                                label='Tên'
                                placeholder='Tên'
                                fieldName='firstName'
                                type='text'
                                register={register}
                                errors={errors}
                            />
                            <FormGroup
                                label='Họ'
                                placeholder='Họ'
                                fieldName='lastName'
                                type='text'
                                register={register}
                                errors={errors}
                            />
                            <FormGroup
                                label='Ngày sinh'
                                fieldName='birthday'
                                type='date'
                                register={register}
                                errors={errors}
                            />
                            <DropDown
                                label='Giới tính'
                                register={register}
                                errors={errors}
                                fieldName='sex'
                            />
                            <FormGroup
                                label='Mật khẩu'
                                register={register}
                                errors={errors}
                                fieldName='password'
                                type='password'
                            />

                            <MainButton type='submit' className='customBtn'>
                                <span>Đăng ký</span>
                            </MainButton>
                        </form>

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
                    </article>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
