var dropdownCountries;
var dropdownStates;
var dropdownCities;

$(document).ready(async function () {
  dropdownCountries = $("#countries");
  dropdownStates = $("#states");
  dropdownCities = $("#cities");
  if (countryIdLoad) dropdownCountries.val(countryIdLoad).change();
  await getStatesByCountry();
  if (stateIdLoad) dropdownStates.val(stateIdLoad).change();
  await getCitiesByStates();
  if (cityIdLoad) dropdownCities.val(cityIdLoad).change();

  dropdownCountries.on("change", async function () {
    dropdownStates.empty();
    dropdownCities.empty();
    await getStatesByCountry();
    await getCitiesByStates();
  });
  dropdownStates.on("change", async function () {
    dropdownCities.empty();
    await getCitiesByStates();
  });
});

async function getStatesByCountry() {
  selectedCountry = $("#countries option:selected");
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

async function getCitiesByStates() {
  selectedState = $("#states option:selected");
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

function checkEmailUnique(form) {
  url = contextPath + "users/check_email";
  userEmail = $("#email").val();
  userId = $("#id").val();
  csrfValue = $("input[name='_csrf']").val();
  params = { id: userId, email: userEmail, _csrf: csrfValue };

  $.post(url, params, function (response) {
    if (response == "OK") {
      form.submit();
    } else if (response == "Duplicated") {
      showWarningModal("There is another user having the email " + userEmail);
    } else {
      showErrorModal("Unknown response from server");
    }
  }).fail(function () {
    showErrorModal("Could not connect to the server");
  });

  return false;
}
