var buttonLoadCurrencies;
var dropDownCurrencies;
var buttonAddCurrency;
var buttonUpdateCurrency;
var buttonDeleteCurrency;
var labelCurrencyUnit;
var fieldCurrencyUnit;
var fieldCurrencySymbol;

$(document).ready(function () {
  buttonLoadCurrencies = $("#btnLoadCurrencies");
  dropDownCurrencies = $("#dropDownCurrencies");
  buttonAddCurrency = $("#buttonAddCurrency");
  buttonUpdateCurrency = $("#buttonUpdateCurrency");
  buttonDeleteCurrency = $("#buttonDeleteCurrency");
  labelCurrencyUnit = $("#labelCurrencyUnit");
  fieldCurrencyUnit = $("#fieldCurrencyUnit");
  fieldCurrencySymbol = $("#fieldCurrencySymbol");

  buttonLoadCurrencies.click(function () {
    loadCurrencies();
  });

  dropDownCurrencies.on("change", async function () {
    try {
      await changeFormCurrencyToSelectedCurrency();
    } catch (e) {
      console.log(e);
    }
  });

  buttonAddCurrency.click(async function () {
    try {
      if (buttonAddCurrency.val() == "Add") {
        await addCurrency();
      } else changeFormCurrencyToNew();
    } catch (e) {
      console.log(e);
    }
  });

  buttonUpdateCurrency.click(async function () {
    try {
      await updateCurrency();
    } catch (e) {
      console.log(e);
    }
  });

  buttonDeleteCurrency.click(async function () {
    try {
      showDeleteConfirmModal("deleteCurrency");
    } catch (e) {
      console.log(e);
    }
  });

  $("#yesButton").click(async function (e) {
    e.preventDefault();
    try {
      if (this.name == "deleteCurrency") {
        await deleteCurrency();
      }
      $("#confirmModal").modal("toggle");
    } catch (e) {
      console.log(e);
    }
  });
});

async function deleteCurrency() {
  try {
    currencyId = dropDownCurrencies.val();
    url = contextPath + "currencies/delete/" + currencyId;

    await $.ajax({
      type: "DELETE",
      url: url,
    })
      .done(function () {
        $("#dropDownCurrencies option[value='" + currencyId + "']").remove();
        changeFormCurrencyToNew();
        showToastMessage("The Currency has been deleted");
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

async function updateCurrency() {
  try {
    if (!validateFormCurrency()) return;
    var currencyId = dropDownCurrencies.val();
    var currencyUnit = fieldCurrencyUnit.val();
    var currencySymbol = fieldCurrencySymbol.val();
    if (!(await checkUnitCurrencyUnique(currencyId, currencyUnit))) return;

    data = { id: currencyId, symbol: currencySymbol, unit: currencyUnit };

    url = contextPath + "currencies/save";

    await $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(data),
      contentType: "application/json",
    })
      .done(function () {
        $("#dropDownCurrencies option:selected").text(currencyUnit);
        changeFormCurrencyToSelectedCurrency();

        showToastMessage("The Currency has been updated");
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

function validateFormCurrency() {
  formCurrency = document.getElementById("formCurrency");
  if (!formCurrency.checkValidity()) {
    formCurrency.reportValidity();
    return false;
  }
  return true;
}
async function addCurrency() {
  try {
    if (!validateFormCurrency()) return;
    currencyUnit = fieldCurrencyUnit.val();
    currencySymbol = fieldCurrencySymbol.val();
    if (!(await checkUnitCurrencyUnique(null, currencyUnit))) return;

    data = { symbol: currencySymbol, unit: currencyUnit };
    url = contextPath + "currencies/save";

    await $.ajax({
      type: "POST",
      url: url,
      data: JSON.stringify(data),
      contentType: "application/json",
    })
      .done(function (currencyId) {
        selectNewlyAddedCurrency(currencyId, currencyUnit);
        showToastMessage("The new Currency has been added");
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

function selectNewlyAddedCurrency(currencyId, currencyUnit) {
  $("<option>").val(currencyId).text(currencyUnit).appendTo(dropDownCurrencies);

  dropDownCurrencies.val(currencyId).change();
}

function changeFormCurrencyToNew() {
  buttonAddCurrency.val("Add");
  labelCurrencyUnit.text("Currency Unit:");
  buttonUpdateCurrency.prop("disabled", true);
  buttonDeleteCurrency.prop("disabled", true);

  fieldCurrencyUnit.val("").focus();
  fieldCurrencySymbol.val("");
}

async function changeFormCurrencyToSelectedCurrency() {
  try {
    buttonAddCurrency.prop("value", "New");
    buttonUpdateCurrency.prop("disabled", false);
    buttonDeleteCurrency.prop("disabled", false);

    currencyId = dropDownCurrencies.val();
    labelCurrencyUnit.text("Selected Currency:");
    selectedcurrencySymbol = $("#dropDownCurrencies option:selected").text();

    url = contextPath + "currencies/" + currencyId;
    await $.get(url, function (Currency) {
      fieldCurrencyUnit.val(Currency.unit);
      fieldCurrencySymbol.val(Currency.symbol);
    })
      .done(function () {})
      .fail(function () {});
  } catch (e) {
    console.log(e);
  }
}

async function loadCurrencies() {
  try {
    url = contextPath + "currencies/list";
    await $.get(url, function (responseJSON) {
      dropDownCurrencies.empty();
      $.each(responseJSON, function (index, Currency) {
        $("<option>")
          .val(Currency.id)
          .text(Currency.unit)
          .appendTo(dropDownCurrencies);
      });
    })
      .done(function () {
        buttonLoadCurrencies.val("Refresh Currencies List");
        showToastMessage("All Currencies have havebeen loaded");
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

async function checkUnitCurrencyUnique(id, unit) {
  url = contextPath + "currencies/check_unit";

  params = { id: id, unit: unit };

  let value = false;
  await $.post(url, params, function (response) {
    if (response == "OK") {
      value = true;
    } else if (response == "Duplicated") {
      showWarningModal("There is another Currency having the unit " + unit);
    } else {
      showErrorModal("Unknown response from server");
    }
  }).fail(function () {
    showErrorModal("Could not connect to the server");
  });

  return value;
}
