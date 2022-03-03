var dropdownCountries;
var dropdownStates;
var dropdownCities;

$(document).ready(async function () {
  dropdownCountries = $("#country");
  dropdownStates = $("#state");
  dropdownCities = $("#city");
  await getStatesByCountry();
  dropdownStates.change();
  await getCitiesByState();

  dropdownCountries.on("change", async function () {
    dropdownStates.empty();
    dropdownCities.empty();
    await getStatesByCountry();
    await getCitiesByState();
  });
  dropdownStates.on("change", async function () {
    dropdownCities.empty();
    await getCitiesByState();
  });
});

async function getStatesByCountry() {
  selectedCountry = $("#country option:selected");
  countryId = selectedCountry.val();
  url = contextPath + "states/list_state_by_country/" + countryId;
  await $.get(url, function (responseJSON) {
    $.each(responseJSON, function (index, state) {
      $("<option>").val(state.id).text(state.name).appendTo(dropdownStates);
    });
  })
    .done(function () {})
    .fail(function () {});
}

async function getCitiesByState() {
  selectedState = $("#state option:selected");
  var stateId = selectedState.val();
  if (!stateId) return;
  url = contextPath + "cities/list_by_state/" + stateId;
  await $.get(url, function (responseJSON) {
    $.each(responseJSON, function (index, city) {
      $("<option>").val(city.id).text(city.name).appendTo(dropdownCities);
    });
  })
    .done(function () {})
    .fail(function () {});
}

function checkNameUnique(form) {
  url = contextPath + "rooms/checkName";
  roomName = $("#name").val();
  roomId = $("#id").val();
  csrfValue = $("input[name='_csrf']").val();
  params = { id: roomId, name: roomName, _csrf: csrfValue };

  $.post(url, params, function (response) {
    if (response == "OK") {
      form.submit();
    } else if (response == "Duplicated") {
      showWarningModal("There is another room having the name " + roomName);
    } else {
      showErrorModal("Unknown response from server");
    }
  }).fail(function () {
    showErrorModal("Could not connect to the server");
  });

  return false;
}
