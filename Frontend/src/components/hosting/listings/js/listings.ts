import $ from 'jquery';

export default function hostingListings() {
    $('.listings__minus-btn').attr('disabled', 'true');

    const allInputColumn = $('.columnDisplay');
    const selectedColumns = $('input[class="columnDisplay"]:checked');
    const allColumns = $('th');
    const allCells = $('td');
    let columnDisplays: string[] = [];

    selectedColumns.each(function () {
        columnDisplays.push($(this).val() as string);
    });

    allColumns.each(function () {
        if ($(this).data('column'))
            if (!columnDisplays.includes($(this).data('column'))) $(this).addClass('remove');
            else $(this).removeClass('remove');
    });

    allCells.each(function () {
        if ($(this).data('column'))
            if (!columnDisplays.includes($(this).data('column'))) $(this).addClass('remove');
            else $(this).removeClass('remove');
    });

    allInputColumn.each(function () {
        $(this).on('change', function () {
            if (!$(this).prop('checked'))
                //remove unchecked checkbox from display array
                columnDisplays = columnDisplays.filter(v => v.toString() !== $(this).val());
            else {
                // add checked checkbox to display array
                const isHavingElement = columnDisplays.some(v => v.toString() === $(this).val());

                if (isHavingElement) columnDisplays.push($(this).val() as string);
            }
            allColumns.each(function () {
                if ($(this).data('column'))
                    if (!columnDisplays.includes($(this).data('column')))
                        $(this).addClass('remove');
                    else $(this).removeClass('remove');
            });
            allCells.each(function () {
                if ($(this).data('column'))
                    if (!columnDisplays.includes($(this).data('column')))
                        $(this).addClass('remove');
                    else $(this).removeClass('remove');
            });
        });
    });

    $('.listings__filter-option').each(function () {
        $(this).on('click', function () {
            const self = $(this);
            $('.listings__filter-option').each(function () {
                if (!$(this).is(self)) $(this).siblings().filter('.active').removeClass('active');
            });

            const id = $(this).data('dropdown');
            const filterBox = $('#' + id);
            if (filterBox.hasClass('active')) filterBox.removeClass('active');
            else filterBox.addClass('active');
        });
    });

    $('.incAndDecBtn').each(function () {
        $(this).on('click', function () {
            const spanInfoTag = $(this).siblings(`#${$(this).data('edit')}`);
            let spanValue = +spanInfoTag.text();
            const dataFunction = $(this).data('function');
            const deleteButton = $('.deleteBtn.' + $(this).data('trigger'));
            const applyButton = $('.applyBtn.' + $(this).data('trigger'));
            const self = $(this);

            if (dataFunction === 'dec') {
                if (spanValue > 0) {
                    if (spanValue === 1) $(this).attr('disabled', 'true');
                    spanInfoTag.text(--spanValue);
                }
                let countZero = 0;
                if (spanValue === 0)
                    $('.listings__minus-btn').each(function () {
                        if (!$(this).is(self)) {
                            const spanValue = parseInt(
                                $(this)
                                    .siblings(`#${$(this).data('edit')}`)
                                    .text()
                            );
                            if (spanValue === 0) countZero++;
                        }
                    });

                if (countZero === $('.listings__minus-btn').length - 1)
                    deleteButton.attr('disabled', 'true');
            }

            if (dataFunction === 'inc') {
                if (spanValue === 0)
                    $(this).siblings(`.listings__minus-btn.incAndDecBtn`).removeAttr('disabled');
                spanInfoTag.text(++spanValue);

                if (spanValue > 0) deleteButton.removeAttr('disabled');
            }

            // if()
        });
    });

    $('.deleteBtn').each(function () {
        $(this).click(function () {
            const dataModify = $(this).data('modify');

            switch (dataModify) {
                case 'roomAndBedRoom': {
                    $('.listings__minus-btn').each(function () {
                        $(this).attr('disabled', 'true');
                        const spanInfoTag = $(this).siblings(`#${$(this).data('edit')}`);
                        spanInfoTag.text(0);
                    });
                    $(this).attr('disabled', 'true');
                    break;
                }
            }
        });
    });

    // let url = `${baseURL}hosting/listings/${pageNumber}`;

    // $('.applyBtn').each(function () {
    //     $(this).on('click', function () {
    //         const dataModify = $(this).data('modify');

    //         switch (dataModify) {
    //             case 'roomAndBedRoom': {
    //                 let bathRooms = 0;
    //                 let bedRooms = 0;
    //                 let beds = 0;
    //                 const query = $('#listings__search-input').val().toString().trim();

    //                 $('.listings__minus-btn').each(function () {
    //                     const dataEdit = $(this).data('edit');
    //                     const spanValue = $(this).siblings(`#${dataEdit}`).text();

    //                     if (dataEdit === 'listings__bath-room-count') bathRooms = spanValue;
    //                     else if (dataEdit === 'listings__bed-room-count') bedRooms = spanValue;
    //                     else beds = spanValue;
    //                 });

    //                 url += `?BATHROOMS=${bathRooms}&BEDROOMS=${bedRooms}&BEDS=${beds}&query=${query}`;
    //                 break;
    //             }
    //             case 'amentities': {
    //                 const selectedAmentities = $('input[class="amentitySelected"]:checked');
    //                 let amentitiesID = [];
    //                 selectedAmentities.each(function () {
    //                     amentitiesID.push($(this).val());
    //                 });
    //                 url += `?AMENITY_IDS=${amentitiesID.join(' ')}`;
    //                 break;
    //             }
    //             case 'status': {
    //                 const selectedStatus = $('input[class="statusSelected"]:checked');
    //                 let statuses = [];
    //                 selectedStatus.each(function () {
    //                     statuses.push($(this).val());
    //                 });
    //                 url += `?STATUSES=${statuses.join(' ')}`;

    //                 break;
    //             }
    //         }

    //         window.location.href = url;
    //     });
    // });

    // $('.listings__table-header').each(function () {
    //     $(this).click(function () {
    //         const searchInfo = window.location.search;
    //         const map = new Map();
    //         if (searchInfo) {
    //             let removeQuestionMark = searchInfo.toString().slice(1, searchInfo.length);
    //             const params = removeQuestionMark.split('&');
    //             params.forEach(param => {
    //                 const key = param.split('=')[0];
    //                 const value = param.split('=')[1];
    //                 map.set(key, value);
    //             });
    //         }

    //         let sortDir = map.get('sort_dir') === 'asc' ? 'desc' : 'asc';
    //         url += `?sort_field=${$(this).data('sort-field')}&sort_dir=${sortDir}`;
    //         window.location.href = url;
    //     });
    // });

    // const allRows = $('tbody tr');
    // allRows.each(function () {
    //     $(this).click(function () {
    //         const roomId = $(this).data('room-id');
    //         window.location.href = `${baseURL}manage-your-space/${roomId}/details`;
    //     });
    // });

    // $('.deleteAllFilterOption').click(function () {
    //     window.location.href = `${baseURL}hosting/listings/1`;
    // });
}

// function filterRoomByName() {
//     const query = $('#listings__search-input').val().toString().trim();
//     let url = `${baseURL}hosting/listings/${1}?query=${query}`;
//     window.location.href = url;
// }

// function createNewRoom() {
//     window.location.href = `${baseURL}become-a-host/`;
// }
