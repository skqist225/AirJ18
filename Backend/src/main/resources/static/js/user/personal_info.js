const prefixUrl = `${baseURL}api`;

$(document).ready(function () {
    const passwordForm = $('.formEdit_password').first();
    const firstNameAndLastNameForm = $('.formEdit_firstNameAndLastName').first();
    const sexForm = $('.formEdit_sex').first();
    const birthdayForm = $('.formEdit_birthday').first();
    const emailForm = $('.formEdit_email').first();
    const phoneNumberForm = $('.formEdit_phoneNumber').first();
    const addressForm = $('.formEdit_address').first();

    const saveEditBtn = $('.saveEditBtn');
    const displayPasswordError = $('.c-validation', passwordForm);
    const displayFirstNameAndLastNameError = $('.c-validation', firstNameAndLastNameForm);
    const displayBirthdayError = $('.c-validation', birthdayForm);
    const displayEmailError = $('.c-validation', emailForm);
    const displayPhoneNumberError = $('.c-validation', phoneNumberForm);

    saveEditBtn.each(function () {
        $(this).click(function () {
            if ($(this).data('edit') === 'password') {
                const oldPassword = $('#oldPassword', passwordForm).val() || '';
                const newPassword = $('#newPassword', passwordForm).val() || '';
                const userId = $("input[name='id']", passwordForm).val();
                const oldPasswordError = $('#oldPasswordError');
                const newPasswordError = $('#newPasswordError');

                checkPasswordConstraint(
                    oldPassword,
                    newPassword,
                    userId,
                    oldPasswordError,
                    newPasswordError,
                    displayPasswordError,
                    passwordForm
                );
            }
            if ($(this).data('edit') === 'firstNameAndLastName') {
                const firstName = $('#firstName', firstNameAndLastNameForm).val() || '';
                const lastName = $('#lastName', firstNameAndLastNameForm).val() || '';

                const firstNameError = $('#firstNameError');
                const lastNameError = $('#lastNameError');

                console.log(firstName);
                console.log(lastName);

                checkFirstNameAndLastNameConstraint(
                    firstName,
                    lastName,
                    firstNameError,
                    lastNameError,
                    displayFirstNameAndLastNameError,
                    firstNameAndLastNameForm
                );
            }
            if ($(this).data('edit') === 'sex') {
                sexForm.submit();
            }
            if ($(this).data('edit') === 'birthday') {
                const userYearOfBirth = $('#userYearOfBirth').first().val();
                const userMonthOfBirth = $('#userMonthOfBirth').first().val();
                const userDayOfBirth = $('#userDayOfBirth').first().val();

                const userYearOfBirthError = $('#userYearOfBirthError');
                const userMonthOfBirthError = $('#userMonthOfBirthError');
                const userDayOfBirthError = $('#userDayOfBirthError');

                console.log(displayBirthdayError);

                checkBirthdayIsGreaterThenPresent(
                    userYearOfBirth,
                    userMonthOfBirth,
                    userDayOfBirth,
                    userYearOfBirthError,
                    userMonthOfBirthError,
                    userDayOfBirthError,
                    displayBirthdayError,
                    birthdayForm
                );
            }
            if ($(this).data('edit') === 'email') {
                const email = $('#email').val();
                const userId = $("input[name='id']", emailForm).val();
                const emailError = $('#emailError');
                checkEmailDuplicated(email, userId, displayEmailError, emailError, emailForm);
            }
            if ($(this).data('edit') === 'phoneNumber') {
                const phoneNumber = $('#phoneNumber').val();
                const phoneNumberError = $('#phoneNumberError');

                displayPhoneNumberError.first().addClass('hidden');

                if (phoneNumber.length < 10 || phoneNumber.length > 11) {
                    displayPhoneNumberError.first().removeClass('hidden');
                    phoneNumberError.html('Số điện thoại phải từ 10 đến 11 số');
                    return;
                }

                if (Number.isNaN(phoneNumber * 1)) {
                    displayPhoneNumberError.first().removeClass('hidden');
                    phoneNumberError.html('Số điện thoại không được chứa ký tự chữ');
                    return;
                }

                phoneNumberForm.submit();
            }
            if ($(this).data('edit') === 'address') {
                addressForm.submit();
            }
            if ($(this).data('edit') === 'avatar') {
                $('.formEdit_avatar').submit();
            }
        });
    });

    $('.editBtn').each(function () {
        $(this).click(function () {
            $(this).addClass('editMode'); // ok
            $(this).parent().addClass('editMode'); // ok

            const formNeedToBeShow = $(this).data('edit');

            const frmOn = $('.formEdit_' + formNeedToBeShow).first();
            frmOn.addClass('editMode');

            if (formNeedToBeShow === 'address') {
                $(this).parent().addClass('needMoreSpace');
            }

            if (formNeedToBeShow === 'password') {
                $(this).parent().addClass('passwordArea');
            }

            frmOn.siblings('.displayWhenNormalMode').first().addClass('editMode');
            $('.closeBtn', $(this).parent()).addClass('editMode');

            const _self = $(this);

            $('.editBtn').each(function () {
                if ($(this).data('edit') !== _self.data('edit')) {
                    $(this).attr('disabled', 'true');
                    $(this).attr('style', 'color: rgb(118, 118, 118) !important');
                }
            });
        });
    });

    const countryNameSelect = $('#countryNameSelect');

    countryNameSelect.on('change', function () {
        getStateName($(this).children('option:selected').text());
    });
});

function turnOffEditMode(self) {
    const currentFieldOnEdit = $(self).siblings('#turnOffEditModeArgs1').val();

    $('.editBtn').each(function () {
        $(this).removeAttr('disabled');
        $(this).removeAttr('style');
    });
    $(self).removeClass('editMode');
    $('.editBtn').each(function () {
        if ($(this).data('edit') == currentFieldOnEdit) {
            $(this).removeClass('editMode');
            $(this).parent().removeClass('editMode');
            const formEdit = $('.formEdit_' + currentFieldOnEdit, $(this).parent()).first();
            formEdit.removeClass('editMode');
            document.getElementsByClassName('formEdit_' + currentFieldOnEdit)[0].reset();

            const displayError = $('.c-validation', formEdit);

            displayError.each(function () {
                $(this).addClass('hidden');
            });

            if (currentFieldOnEdit === 'address') {
                $(this).parent().removeClass('needMoreSpace');
            }
            if (currentFieldOnEdit === 'password') {
                $(this).parent().removeClass('passwordArea');
                const displayError = $('.c-validation', formEdit);
                displayError.each(function () {
                    if (!$(this).hasClass('hidden')) $(this).addClass('hidden');
                });
            }

            formEdit.siblings('.displayWhenNormalMode').first().removeClass('editMode');

            return;
        }
    });
}

function getCityName(stateName, stateMap) {
    const cityNameSelect = $('#cityNameSelect');
    const cityNameDivCode = $('#cityNameDivCode');
    const cities = stateMap.get(stateName) || [];
    console.log(cities);

    cityNameSelect.empty();

    if (cities.length > 0) {
        cities.forEach(city => {
            cityNameSelect.append(
                $('<option>', {
                    value: city.name,
                    text: city.name,
                })
            );
            cityNameDivCode.append(
                $('<input>', {
                    type: 'hidden',
                    value: city.code,
                    name: city.name,
                })
            );
        });
    }
}

async function checkPasswordConstraint(
    oldPassword,
    newPassword,
    userId,
    oldPasswordError,
    newPasswordError,
    displayError,
    form
) {
    const { data } = await axios.post(`${prefixUrl}/user/check-password-constraint`, {
        oldPassword,
        newPassword,
        userId,
    });

    console.log(data.oldPasswordError);
    console.log(data.newPasswordError);

    displayError.each(function () {
        $(this).addClass('hidden');
    });

    if (data.oldPasswordError && data.newPasswordError) {
        displayError.each(function () {
            $(this).removeClass('hidden');
        });
        oldPasswordError.html(data.oldPasswordError);
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

    if (data.status === 'OK') {
        form.submit();
        return;
    }
}

async function checkFirstNameAndLastNameConstraint(
    firstName,
    lastName,
    firstNameError,
    lastNameError,
    displayError,
    form
) {
    const { data } = await axios.post(
        `${prefixUrl}/user/check-first-name-and-last-name-constraint`,
        {
            firstName,
            lastName,
        }
    );

    displayError.each(function () {
        $(this).addClass('hidden');
    });

    if (data.firstNameError && data.lastNameError) {
        displayError.each(function () {
            $(this).removeClass('hidden');
        });
        firstNameError.html(data.firstNameError);
        lastNameError.html(data.lastNameError);
        return;
    }

    if (data.firstNameError) {
        displayError.first().removeClass('hidden');
        firstNameError.html(data.firstNameError);
        return;
    }

    if (data.lastNameError) {
        displayError.last().removeClass('hidden');
        lastNameError.html(data.lastNameError);
        return;
    }

    if (data.status === 'OK') {
        form.submit();
        return;
    }
}

function checkBirthdayIsGreaterThenPresent(
    userYearOfBirth,
    userMonthOfBirth,
    userDayOfBirth,
    userYearOfBirthError,
    userMonthOfBirthError,
    userDayOfBirthError,
    displayError,
    form
) {
    console.log(userDayOfBirth);
    console.log(userMonthOfBirth);
    console.log(userYearOfBirth);

    displayError.each(function () {
        $(this).addClass('hidden');
    });

    const date = new Date();
    console.log(date.getFullYear());
    if (date.getFullYear() < userYearOfBirth * 1) {
        displayError.last().removeClass('hidden');
        userYearOfBirthError.html('Năm không thể lớn hơn năm hiện tại');
        return;
    }
    if (date.getFullYear() === userYearOfBirth * 1 && date.getMonth() + 1 < userMonthOfBirth * 1) {
        displayError.first().removeClass('hidden');
        userMonthOfBirthError.html('Tháng không thể lớn hơn tháng hiện tại');
        return;
    }

    form.submit();
}

async function checkEmailDuplicated(email, userId, displayError, emailError, form) {
    const { data } = await axios.post(`${prefixUrl}/user/check-email-constraint`, {
        email,
        userId,
    });

    displayError.each(function () {
        $(this).addClass('hidden');
    });

    if (data === 'Duplicated') {
        displayError.first().removeClass('hidden');
        emailError.html('Email bị trùng!!!');
        return;
    }

    form.submit();
}
