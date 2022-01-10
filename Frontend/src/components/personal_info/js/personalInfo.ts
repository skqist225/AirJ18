import $ from 'jquery';

export const jqueryCode = () => {
    $('.editBtn').each(function () {
        $(this).on('click', function () {
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

            //get current instance
            const _self = $(this);

            //disable other edit button
            $('.editBtn').each(function () {
                if ($(this).data('edit') !== _self.data('edit')) {
                    $(this).attr('disabled', 'true');
                    $(this).attr('style', 'color: rgb(118, 118, 118) !important');
                }
            });
        });
    });

    // function getCityName(stateName, stateMap) {
    //     const cityNameSelect = $('#cityNameSelect');
    //     const cityNameDivCode = $('#cityNameDivCode');
    //     const cities = stateMap.get(stateName) || [];
    //     console.log(cities);

    //     cityNameSelect.empty();

    //     if (cities.length > 0) {
    //         cities.forEach(city => {
    //             cityNameSelect.append(
    //                 $('<option>', {
    //                     value: city.name,
    //                     text: city.name,
    //                 })
    //             );
    //             cityNameDivCode.append(
    //                 $('<input>', {
    //                     type: 'hidden',
    //                     value: city.code,
    //                     name: city.name,
    //                 })
    //             );
    //         });
    //     }
    // }
};
