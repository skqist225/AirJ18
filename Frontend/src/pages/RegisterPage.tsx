import { FC, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormGroup, DropDown } from '../components/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import $ from 'jquery';
import './register.css';
import * as yup from 'yup';

const schema = yup
    .object({
        firstName: yup.string().required('Vui lòng nhập tên!'),
        lastName: yup.string().required('Vui lòng nhập họ'),
        password: yup.string().length(8, 'Mật khẩu ít nhất 8 kí tự!'),
        birthday: yup.string().required(),
        email: yup.string().email().required('Vui lòng nhập địa chỉ email!'),
    })
    .required();

type HomeProps = {};

const RegisterPage: FC<HomeProps> = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    useEffect(() => {
        const bg = `${process.env.REACT_APP_SERVER_URL}/images/register_background.jpg`;

        $('#register').css({
            'background-image': `url(${bg})`,
            'background-repeat': 'no-repeat',
            'background-position': 'center center',
            'background-size': 'cover',
        });
    }, []);

    const onSubmit = (data: any) => console.log(data);

    return (
        <div id='register'>
            <div className='main'>
                <div className='register__container'>
                    <h3 className='register__header'>Đăng ký</h3>
                    <h4 className='register__title'>Chào mừng bạn đến với AirJ18</h4>
                    <form onSubmit={handleSubmit(onSubmit)}>
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
                        <FormGroup
                            label='Số điện thoại'
                            register={register}
                            errors={errors}
                            fieldName='phoneNumber'
                            type='text'
                        />
                        <button type='submit' className='btn customBtn'>
                            Đồng ý và tiếp tục
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
