var buttonLoadCountriesForCities;
var dropDownCountriesForCities;
var dropDownStatesForCities;
var dropDownCities;
var buttonAddCity;
var buttonUpdateCity;
var buttonDeleteCity;
var labelCityName;
var fieldCityName;

$(document).ready(function () {
  buttonLoadCountriesForCities = $("#buttonLoadCountriesForCities");
  dropDownCountriesForCities = $("#dropDownCountriesForCities");
  dropDownStatesForCities = $("#dropDownStatesForCities");
  dropDownCities = $("#dropDownCities");
  buttonAddCity = $("#buttonAddCity");
  buttonUpdateCity = $("#buttonUpdateCity");
  buttonDeleteCity = $("#buttonDeleteCity");
  labelCityName = $("#labelCityName");
  fieldCityName = $("#fieldCityName");

  buttonLoadCountriesForCities.click(async function () {
    await loadCountriesForCities();
    dropDownCountriesForCities.change();
  });

  dropDownCountriesForCities.on("change", async function () {
    dropDownCities.empty();
    await loadStatesByCountry();
    if (dropDownStatesForCities.find("option").length > 0) {
      buttonAddCity.prop("disabled", false);
      dropDownStatesForCities.change();
    } else buttonAddCity.prop("disabled", true);
  });

  dropDownStatesForCities.on("change", function () {
    loadCitiesByState();
  });

  dropDownCities.on("change", function () {
    changeFormCityToSelectedCity();
  });

  buttonAddCity.click(function () {
    if (buttonAddCity.val() == "Add") {
      addCity();
      return;
    }
    changeFormCityToNew();
  });

  buttonUpdateCity.click(function () {
    updateCity();
  });

  buttonDeleteCity.click(function () {
    showDeleteConfirmModal("deleteCity");
  });

  $("#yesButton").click(async function (e) {
    try {
      e.preventDefault();
      if (this.name == "deleteCity") {
        await deleteCity();
      }
      $("#confirmModal").modal("toggle");
    } catch (e) {}
  });
});

async function loadCountriesForCities() {
  url = contextPath + "countries/list";
  await $.get(url, function (response) {
    dropDownCountriesForCities.empty();
    $.each(response, function (index, country) {
      $("<option>")
        .val(country.id)
        .text(country.name)
        .appendTo(dropDownCountriesForCities);
    });
  })
    .done(function () {
      buttonLoadCountriesForCities.val("Refresh Countries List");
      showToastMessage("All countries have havebeen loaded");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

async function loadStatesByCountry() {
  cityId = dropDownCountriesForCities.val();
  url = contextPath + "states/list_state_by_country/" + cityId;
  await $.get(url, function (response) {
    dropDownStatesForCities.empty();
    $.each(response, function (index, state) {
      $("<option>")
        .val(state.id)
        .text(state.name)
        .appendTo(dropDownStatesForCities);
    });
  })
    .done(function () {
      showToastMessage("All countries have havebeen loaded");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

function loadCitiesByState() {
  stateId = dropDownStatesForCities.val();
  url = contextPath + "cities/list_by_state/" + stateId;
  $.get(url, function (response) {
    dropDownCities.empty();
    $.each(response, function (index, city) {
      $("<option>").val(city.id).text(city.name).appendTo(dropDownCities);
    });
  })
    .done(function () {
      showToastMessage("All countries have havebeen loaded");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

async function deleteCity() {
  cityId = dropDownCities.val();
  url = contextPath + "cities/delete/" + cityId;

  await $.ajax({
    type: "DELETE",
    url: url,
  })
    .done(function () {
      $("#dropDownCities option[value='" + cityId + "']").remove();
      changeFormCityToNew();
      showToastMessage("The City has been deleted");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

async function updateCity() {
  try {
    if (!validateFormCity()) return;
    var cityId = dropDownCities.val();
    var cityName = fieldCityName.val();
    stateId = dropDownStatesForCities.val();
    if (!checkNameCityUnique(cityId, cityName)) return;
    url = contextPath + "cities/save";

    var data = { id: cityId, name: cityName, state: { id: stateId } };

    await $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(data),
      contentType: "application/json",
    })
      .done(function () {
        $("#dropDownCities option:selected").text(cityName);
        changeFormCityToSelectedCity();
        showToastMessage("The City has been updated");
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

function validateFormCity() {
  formCity = document.getElementById("formCity");
  if (!formCity.checkValidity()) {
    formCity.reportValidity();
    return false;
  }
  return true;
}
async function addCity() {
  try {
    if (!validateFormCity()) return;
    cityName = fieldCityName.val();
    stateId = dropDownStatesForCities.val();
    if (!(await checkNameCityUnique(null, cityName))) return;

    url = contextPath + "cities/save";

    data = { name: cityName, state: { id: stateId } };

    await $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(data),
      contentType: "application/json",
    })
      .done(function (cityId) {
        selectNewlyAddedCity(cityId, cityName);
        showToastMessage("The new City has been added");
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

function selectNewlyAddedCity(cityId, cityName) {
  $("<option>").val(cityId).text(cityName).appendTo(dropDownCities);

  dropDownCities.val(cityId).change();
}

function changeFormCityToNew() {
  buttonAddCity.val("Add");
  labelCityName.text("City Name:");
  buttonUpdateCity.prop("disabled", true);
  buttonDeleteCity.prop("disabled", true);

  fieldCityName.val("").focus();
}

function changeFormCityToSelectedCity() {
  buttonAddCity.prop("value", "New");
  buttonUpdateCity.prop("disabled", false);
  buttonDeleteCity.prop("disabled", false);

  labelCityName.text("Selected City:");
  selectedCityName = $("#dropDownCities option:selected").text();

  fieldCityName.val(selectedCityName);
}

async function checkNameCityUnique(id, name) {
  url = contextPath + "cities/check_name";

  params = { id: id, name: name };

  let value = false;
  await $.post(url, params, function (response) {
    if (response == "OK") {
      value = true;
    } else if (response == "Duplicated") {
      showWarningModal("There is another city having the name " + name);
    } else {
      showErrorModal("Unknown response from server");
    }
  }).fail(function () {
    showErrorModal("Could not connect to the server");
  });

  return value;
}
