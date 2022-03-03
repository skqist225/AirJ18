var buttonLoadCountries;
var dropDownCountries;
var buttonAddCountry;
var buttonUpdateCountry;
var buttonDeleteCountry;
var labelCountryName;
var fieldCountryName;
var fieldCountryCode;

$(document).ready(function () {
  buttonLoadCountries = $("#btnLoadCountries");
  dropDownCountries = $("#dropDownCountries");
  buttonAddCountry = $("#buttonAddCountry");
  buttonUpdateCountry = $("#buttonUpdateCountry");
  buttonDeleteCountry = $("#buttonDeleteCountry");
  labelCountryName = $("#labelCountryName");
  fieldCountryName = $("#fieldCountryName");
  fieldCountryCode = $("#fieldCountryCode");

  buttonLoadCountries.click(function () {
    loadCountries();
  });

  dropDownCountries.on("change", function () {
    changeFormCountryToSelectedCountry();
  });

  buttonAddCountry.click(function () {
    if (buttonAddCountry.val() == "Add") {
      addCountry();
      return;
    }
    changeFormCountryToNew();
  });

  buttonUpdateCountry.click(function () {
    updateCountry();
  });

  buttonDeleteCountry.click(function () {
    showDeleteConfirmModal("deleteCountry");
  });

  $("#yesButton").click(function (e) {
    e.preventDefault();
    if (this.name == "deleteCountry") {
      deleteCountry();
    }
    $("#confirmModal").modal("toggle");
  });
});

function deleteCountry() {
  countryId = dropDownCountries.val();
  url = contextPath + "countries/delete/" + countryId;

  $.ajax({
    type: "DELETE",
    url: url,
  })
    .done(function () {
      $("#dropDownCountries option[value='" + countryId + "']").remove();
      changeFormCountryToNew();
      showToastMessage("The Country has been deleted");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

async function updateCountry() {
  try {
    if (!validateFormCountry()) return;
    var countryId = dropDownCountries.val();
    var countryName = fieldCountryName.val();
    if (!(await checkNameCountryUnique(countryId, countryName))) return;
    url = contextPath + "countries/save";

    var formData = new FormData();

    formData.append("id", countryId);
    formData.append("name", countryName);
    formData.append("code", fieldCountryCode.val());

    await $.ajax({
      type: "POST",
      url: url,
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function () {
        $("#dropDownCountries option:selected").val(countryId);
        $("#dropDownCountries option:selected").text(countryName);
        showToastMessage("The Country has been updated");

        changeFormCountryToSelectedCountry();
      })
      .fail(function () {
        showToastMessage(
          "ERROR: Could not connect to server or server encountered an error"
        );
      });
  } catch (e) {
    console.log(e);
  }
}

function validateFormCountry() {
  formCountry = document.getElementById("formCountry");
  if (!formCountry.checkValidity()) {
    formCountry.reportValidity();
    return false;
  }
  return true;
}
async function addCountry() {
  try {
    if (!validateFormCountry()) return;
    countryName = fieldCountryName.val();
    if (!(await checkNameCountryUnique(null, countryName))) return;

    url = contextPath + "countries/save";

    var formData = new FormData();
    formData.append("name", countryName);
    formData.append("code", fieldCountryCode.val());

    await $.ajax({
      type: "POST",
      url: url,
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (countryId) {
        selectNewlyAddedCountry(countryId, countryName);
        showToastMessage("The new Country has been added");
      })
      .fail(function () {
        showToastMessage(
          "ERROR: Could not connect to server or server encountered an error"
        );
      });
  } catch (e) {
    console.log(e);
  }
}

function selectNewlyAddedCountry(countryId, countryName) {
  $("<option>").val(countryId).text(countryName).appendTo(dropDownCountries);

  $("#dropDownCountries option[value='" + countryId + "']").prop(
    "selected",
    true
  );

  dropDownCountries.val(countryId).change();
}

function changeFormCountryToNew() {
  buttonAddCountry.val("Add");
  labelCountryName.text("Country Name:");
  buttonUpdateCountry.prop("disabled", true);
  buttonDeleteCountry.prop("disabled", true);

  fieldCountryName.val("").focus();
  fieldCountryCode.val("");
}

function changeFormCountryToSelectedCountry() {
  buttonAddCountry.prop("value", "New");
  buttonUpdateCountry.prop("disabled", false);
  buttonDeleteCountry.prop("disabled", false);

  countryId = dropDownCountries.val();
  labelCountryName.text("Selected Country:");
  selectedcountryName = $("#dropDownCountries option:selected").text();

  url = contextPath + "countries/" + countryId;
  $.get(url, function (Country) {
    fieldCountryName.val(Country.name);
    fieldCountryCode.val(Country.code);
  })
    .done(function () {})
    .fail(function () {});
}

function loadCountries() {
  url = contextPath + "countries/list";
  $.get(url, function (responseJSON) {
    dropDownCountries.empty();
    $.each(responseJSON, function (index, Country) {
      $("<option>")
        .val(Country.id)
        .text(Country.name)
        .appendTo(dropDownCountries);
    });
  })
    .done(function () {
      buttonLoadCountries.val("Refresh Countries List");
      showToastMessage("All Countries have havebeen loaded");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

async function checkNameCountryUnique(id, name) {
  url = contextPath + "countries/check_name";

  params = { id: id, name: name };

  let value = false;
  await $.post(url, params, function (response) {
    if (response == "OK") {
      value = true;
    } else if (response == "Duplicated") {
      showWarningModal("There is another Country having the name " + name);
    } else {
      showErrorModal("Unknown response from server");
    }
  }).fail(function () {
    showErrorModal("Could not connect to the server");
  });

  return value;
}
