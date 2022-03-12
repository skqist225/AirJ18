import axios from '../../../axios';
import $ from 'jquery';

const config = { headers: { 'Content-Type': 'application/json' } };

export async function checkFirstNameAndLastNameConstraint(
    firstName: string,
    lastName: string
): Promise<string | void> {
    const firstNameError = $('#firstNameError');
    const lastNameError = $('#lastNameError');
    const displayError = $('.c-validation', $('.formEdit_firstNameAndLastName').first());

    const { data } = await axios.post(
        `/user/check-first-name-and-last-name-constraint`,
        {
            firstName,
            lastName,
        },
        config
    );

    displayError.each(function () {
        $(this).addClass('hidden');
    });

    if (data.firstNameError && data.lastNameError) {
        displayError.each(function () {
            $(this).removeClass('hidden');
        });
        firstNameError.text(data.firstNameError);
        lastNameError.text(data.lastNameError);
        return;
    }

    if (data.firstNameError) {
        displayError.first().removeClass('hidden');
        firstNameError.text(data.firstNameError);
        return;
    }

    if (data.lastNameError) {
        displayError.last().removeClass('hidden');
        lastNameError.text(data.lastNameError);
        return;
    }

    return data.status;
}

export function checkBirthdayIsGreaterThenPresent(
    yearOfBirth: string,
    monthOfBirth: string,
    dayOfBirth: string
): string | void {
    const userYearOfBirthError = $('#userYearOfBirthError');
    const userMonthOfBirthError = $('#userMonthOfBirthError');
    const userDayOfBirthError = $('#userDayOfBirthError');

    const displayBirthdayError = $('.c-validation', $('.formEdit_birthday').first());
    displayBirthdayError.each(function () {
        ($(this) as JQuery<HTMLElement>).addClass('hidden');
    });

    const date = new Date();

    if (date.getFullYear() < parseInt(yearOfBirth)) {
        displayBirthdayError.last().removeClass('hidden');
        userYearOfBirthError.text('Năm không thể lớn hơn năm hiện tại');
        return;
    }
    if (
        date.getFullYear() === parseInt(yearOfBirth) &&
        date.getMonth() + 1 < parseInt(monthOfBirth)
    ) {
        displayBirthdayError.first().removeClass('hidden');
        userMonthOfBirthError.html('Tháng không thể lớn hơn tháng hiện tại');
        return;
    }

    return 'OK';
}

export async function checkPasswordConstraint(
    oldPassword: string,
    newPassword: string,
    userId: number
): Promise<string | void> {
    const oldPasswordError = $('#oldPasswordError');
    const newPasswordError = $('#newPasswordError');
    const displayError = $('.c-validation', $('.formEdit_password').first());

    const { data } = await axios.post(
        `/user/check-password-constraint`,
        {
            oldPassword,
            newPassword,
            userId,
        },
        config
    );

    console.log(data.oldPasswordError);
    console.log(data.newPasswordError);

    displayError.each(function () {
        $(this).addClass('hidden');
    });

    if (data.oldPasswordError && data.newPasswordError) {
        displayError.each(function () {
            $(this).removeClass('hidden');
        });
        oldPasswordError.text(data.oldPasswordError);
        newPasswordError.html(data.newPasswordError);
        return;
    }

    if (data.oldPasswordError) {
        displayError.first().removeClass('hidden');
        oldPasswordError.html(data.oldPasswordError);
        return;
    }

    if (data.newPasswordError) {
        displayError.last().removeClass('hidden');
        newPasswordError.html(data.newPasswordError);
        return;
    }

    if (data.newPasswordError === 'Mật khẩu mới phải ít nhất 8 kí tự.') {
        displayError.last().removeClass('hidden');
        newPasswordError.html(data.newPasswordError);
        return;
    }

    return data.status;
}

export async function checkEmailDuplicated(email: string, userId: number): Promise<string | void> {
    const emailError = $('#emailError');
    const displayError = $('.c-validation', $('.formEdit_email').first());

    const { data } = await axios.post(
        `/user/check-email-constraint`,
        {
            email,
            userId,
        },
        config
    );

    displayError.each(function () {
        $(this).addClass('hidden');
    });

    if (data === 'Duplicated') {
        displayError.first().removeClass('hidden');
        emailError.html('Email bị trùng!!!');
        return;
    }

    return data;
}

export function checkPhoneNumberConstraint(phoneNumber: string): string | void {
    const phoneNumberError = $('#phoneNumberError');

    const displayError = $('.c-validation', $('.formEdit_phoneNumber').first());
    displayError.first().addClass('hidden');

    if (phoneNumber.length < 10 || phoneNumber.length > 11) {
        displayError.first().removeClass('hidden');
        phoneNumberError.html('Số điện thoại phải từ 10 đến 11 số');
        return;
    }

    if (Number.isNaN(parseInt(phoneNumber))) {
        displayError.first().removeClass('hidden');
        phoneNumberError.html('Số điện thoại không được chứa ký tự chữ');
        return;
    }

    return 'OK';
}
