import $ from "jquery";
import { Dispatch } from "react";
import { fetchUserOwnedRoom } from "../../../../features/room/roomSlice";
import { getPageNumber } from "../../../../helpers";

export default function hostingListings(
    setCommonnameCb: React.Dispatch<React.SetStateAction<boolean>>,
    setBedCb: React.Dispatch<React.SetStateAction<boolean>>,
    setBedroomCb: React.Dispatch<React.SetStateAction<boolean>>,
    setBathroomCb: React.Dispatch<React.SetStateAction<boolean>>,
    setLastModifiedCb: React.Dispatch<React.SetStateAction<boolean>>,
    dispatch: Dispatch<any>,
    pathname: string
) {
    const displayColumnCheckboxClassname = "ant-checkbox-input";
    const displayColumnCheckbox = $("." + displayColumnCheckboxClassname);
    const initialDisplayedColumns = $(
        'input[class="' + displayColumnCheckboxClassname + '"]:checked'
    );
    const allColumns = $("th");
    const allCells = $("td");
    let displayedColumns: string[] = [];

    $(".listings__minus-btn").attr("disabled", "true");

    initialDisplayedColumns.each(function () {
        displayedColumns.push($(this).val() as string);
    });

    allColumns.each(function () {
        if ($(this).data("column"))
            if (!displayedColumns.includes($(this).data("column"))) $(this).addClass("remove");
            else $(this).removeClass("remove");
    });

    allCells.each(function () {
        if ($(this).data("column"))
            if (!displayedColumns.includes($(this).data("column"))) $(this).addClass("remove");
            else $(this).removeClass("remove");
    });

    function manageCbState(val: string, state: boolean) {
        switch (val) {
            case "COMMONNAME": {
                setCommonnameCb(state);
                break;
            }
            case "BEDROOM": {
                setBedroomCb(state);
                break;
            }
            case "BED": {
                setBedCb(state);
                break;
            }
            case "BATHROOM": {
                setBathroomCb(state);
                break;
            }
            case "LASTMODIFIED": {
                setLastModifiedCb(state);
                break;
            }
        }
    }

    displayColumnCheckbox.each(function () {
        $(this)
            .off("change")
            .on("change", function () {
                console.log($(this).prop("checked"));

                if (!$(this).prop("checked")) {
                    manageCbState($(this).val() as string, true);
                    displayedColumns.push($(this).val() as string);
                } else {
                    manageCbState($(this).val() as string, false);
                    displayedColumns = displayedColumns.filter(v => v.toString() !== $(this).val());
                }
                allColumns.each(function () {
                    if ($(this).data("column"))
                        !displayedColumns.includes($(this).data("column"))
                            ? $(this).addClass("remove")
                            : $(this).removeClass("remove");
                });
                allCells.each(function () {
                    if ($(this).data("column"))
                        !displayedColumns.includes($(this).data("column"))
                            ? $(this).addClass("remove")
                            : $(this).removeClass("remove");
                });
            });
    });

    //show filter box
    $(".listings__filter--option").each(function () {
        $(this)
            .off("click")
            .on("click", function () {
                const self = $(this);
                $(".listings__filter--option").each(function () {
                    if (!$(this).is(self))
                        $(this).siblings().filter(".active").removeClass("active");
                });

                const filterBox = $(`#${$(this).data("dropdown")}`);

                filterBox.hasClass("active")
                    ? filterBox.removeClass("active")
                    : filterBox.addClass("active");

                if ($(this).data("dropdown") === "clearFilter") {
                    dispatch(fetchUserOwnedRoom({ page: getPageNumber(pathname) }));
                }
            });
    });

    $(".deleteBtn").each(function () {
        $(this)
            .off("click")
            .on("click", function () {
                const dataModify = $(this).data("modify");

                switch (dataModify) {
                    case "roomAndBedRoom": {
                        $(".listings__minus-btn").each(function () {
                            $(this).attr("disabled", "true");
                            const spanInfoTag = $(this).siblings(`#${$(this).data("edit")}`);
                            spanInfoTag.text(0);
                        });
                        $(this).attr("disabled", "true");
                        break;
                    }
                }
            });
    });

    // let url = `${baseURL}hosting/listings/${pageNumber}`;

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

    //         // let sortDir = map.get('sort_dir') === 'asc' ? 'desc' : 'asc';
    //         // url += `?sort_field=${$(this).data('sort-field')}&sort_dir=${sortDir}`;
    //         // window.location.href = url;
    //     });
    // });

    // const allRows = $('tbody tr');
    // allRows.each(function () {
    //     $(this).click(function () {
    //         const roomId = $(this).data('room-id');
    //         window.location.href = `${baseURL}manage-your-space/${roomId}/details`;
    //     });
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
