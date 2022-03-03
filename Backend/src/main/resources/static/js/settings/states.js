var buttonLoad4States;
var dropDownCountry4States;
var dropDownStates;
var buttonAddState;
var buttonUpdateState;
var buttonDeleteState;
var labelStateName;
var fieldStateName;
var fieldStateCode;

$(document).ready(function () {
  buttonLoad4States = $("#buttonLoadCountriesForStates");
  dropDownCountry4States = $("#dropDownCountriesForStates");
  dropDownStates = $("#dropDownStates");
  buttonAddState = $("#buttonAddState");
  buttonUpdateState = $("#buttonUpdateState");
  buttonDeleteState = $("#buttonDeleteState");
  labelStateName = $("#labelStateName");
  fieldStateName = $("#fieldStateName");
  fieldStateCode = $("#fieldStateCode");

  buttonLoad4States.click(function () {
    loadCountries4States();
  });

  dropDownCountry4States.on("change", function () {
    loadStates4Country();
  });

  dropDownStates.on("change", function () {
    changeFormStateToSelectedState();
  });

  buttonAddState.click(function () {
    if (buttonAddState.val() == "Add") {
      addState();
    } else {
      changeFormStateToNewState();
    }
  });

  buttonUpdateState.click(function () {
    updateState();
  });

  buttonDeleteState.click(function () {
    deleteState();
  });
});

function addState() {
  if (!validateFormState()) return;
  url = contextPath + "states/save";
  stateName = fieldStateName.val();
  stateCode = fieldStateCode.val();

  selectedCountry = $("#dropDownCountriesForStates option:selected");
  countryId = selectedCountry.val();
  countryName = selectedCountry.text();

  jsonData = {
    name: stateName,
    code: stateCode,
    country: { id: countryId, name: countryName },
  };

  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify(jsonData),
    contentType: "application/json",
  }).done(function (stateId) {
    selectNewlyAddedState(stateId, stateName);
    showToastMessage("The new state has been added");
  });
}

function loadStates4Country() {
  selectedCountry = $("#dropDownCountriesForStates option:selected");
  countryId = selectedCountry.val();
  url = contextPath + "states/list_state_by_country/" + countryId;

  $.get(url, function (responseJSON) {
    dropDownStates.empty();
    $.each(responseJSON, function (index, state) {
      $("<option>").val(state.id).text(state.name).appendTo(dropDownStates);
    });
  })
    .done(function () {
      changeFormStateToNewState();
      showToastMessage(
        "All states have been loaded for country " + selectedCountry.text()
      );
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Counld not connect to server or server encountered an error"
      );
    });
}

function deleteState() {
  stateId = dropDownStates.val();
  url = contextPath + "states/delete/" + stateId;

  $.ajax({
    type: "DELETE",
    url: url,
  })
    .done(function () {
      $("#dropDownStates option[value='" + stateId + "']").remove();
      changeFormStateToNewState();
      showToastMessage("The country has been deleted");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

function validateFormState() {
  formState = document.getElementById("formState");
  if (!formState.checkValidity()) {
    formState.reportValidity();
    return false;
  }
  return true;
}

function updateState() {
  if (!validateFormState()) return;
  url = contextPath + "states/save";
  stateName = fieldStateName.val();
  stateId = dropDownStates.val();
  stateCode = fieldStateCode.val();
  selectedCountry = $("#dropDownCountriesForStates option:selected");
  countryId = selectedCountry.val();
  countryName = selectedCountry.text();

  jsonData = {
    id: stateId,
    name: stateName,
    code: stateCode,
    country: { id: countryId, name: countryName },
  };

  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify(jsonData),
    contentType: "application/json",
  })
    .done(function (countryId) {
      $("#dropDownStates option:selected").val(stateId);
      $("#dropDownStates option:selected").text(stateName);
      showToastMessage("The country has been updated");

      changeFormStateToNewState();
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

function loadCountries4States() {
  url = contextPath + "countries/list";
  $.get(url, function (responseJSON) {
    dropDownCountry4States.empty();
    $.each(responseJSON, function (index, country) {
      $("<option>")
        .val(country.id)
        .text(country.name)
        .appendTo(dropDownCountry4States);
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

function showToastMessage(message) {
  $("#toastMessage").text(message);
  $(".toast").toast("show");
}

function changeFormStateToNewState() {
  buttonAddState.val("Add");
  labelStateName.text("State Name:");
  buttonUpdateState.prop("disabled", true);
  buttonDeleteState.prop("disabled", true);

  fieldStateName.val("").focus();
  fieldStateCode.val("");
}

function changeFormStateToSelectedState() {
  buttonAddState.prop("value", "New");
  buttonUpdateState.prop("disabled", false);
  buttonDeleteState.prop("disabled", false);

  stateId = dropDownStates.val();
  labelStateName.text("Selected State/Province:");
  selectedStateName = $("#dropDownStates option:selected").text();
  fieldStateName.val(selectedStateName);

  $.get(contextPath + "states/" + stateId, function (state) {
    fieldStateCode.val(state.code);
  });
}

function selectNewlyAddedState(stateId, stateName) {
  $("<option>").val(stateId).text(stateName).appendTo(dropDownStates);
  dropDownStates.val(stateId).change();
}
