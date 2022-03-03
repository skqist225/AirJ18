var buttonLoadPromos;
var dropDownPromos;
var buttonAddPromo;
var buttonUpdatePromo;
var buttonDeletePromo;
var labelPromoTitle;
var fieldPromoTitle;
var fieldPromoCode;
var fieldPromoDiscountPercent;
var fieldPromoDescription;

$(document).ready(function () {
  buttonLoadPromos = $("#btnLoadPromos");
  dropDownPromos = $("#dropDownPromos");
  buttonAddPromo = $("#buttonAddPromo");
  buttonUpdatePromo = $("#buttonUpdatePromo");
  buttonDeletePromo = $("#buttonDeletePromo");
  labelPromoTitle = $("#labelPromoTitle");
  fieldPromoTitle = $("#fieldPromoTitle");
  fieldPromoCode = $("#fieldPromoCode");
  fieldPromoDiscountPercent = $("#fieldPrmomoDiscountPercent");
  fieldPromoDescription = $("#fieldPromoDescription");

  buttonLoadPromos.click(function () {
    loadPromos();
  });

  dropDownPromos.on("change", async function () {
    try {
      await changeFormPromoToSelectedPromo();
    } catch (e) {
      console.log(e);
    }
  });

  buttonAddPromo.click(async function () {
    try {
      if (buttonAddPromo.val() == "Add") {
        await addPromo();
      } else changeFormPromoToNew();
    } catch (e) {
      console.log(e);
    }
  });

  buttonUpdatePromo.click(async function () {
    try {
      await updatePromo();
    } catch (e) {
      console.log(e);
    }
  });

  buttonDeletePromo.click(async function () {
    try {
      showDeleteConfirmModal("deletePromo");
    } catch (e) {
      console.log(e);
    }
  });

  $("#yesButton").click(async function (e) {
    e.preventDefault();
    try {
      if (this.name == "deletePromo") {
        await deletePromo();
      }
      $("#confirmModal").modal("toggle");
    } catch (e) {
      console.log(e);
    }
  });
});

async function deletePromo() {
  try {
    promoId = dropDownPromos.val();
    url = contextPath + "promos/delete/" + promoId;

    await $.ajax({
      type: "DELETE",
      url: url,
      beforeSend: function (xhr) {
        xhr.setRequestHeader(csrfHeaderName, csrfValue);
      },
    })
      .done(function () {
        $("#dropDownPromos option[value='" + promoId + "']").remove();
        changeFormPromoToNew();
        showToastMessage("The Promo has been deleted");
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

async function updatePromo() {
  try {
    if (!validateFormPromo()) return;
    var promoId = dropDownPromos.val();
    var promoTitle = fieldPromoTitle.val();
    var promoCode = fieldPromoCode.val();
    var promoDiscountPercent = fieldPromoDiscountPercent.val();
    var promoDescription = fieldPromoDescription.val();
    if (!(await checkPromoCodeUnique(promoId, promoCode))) return;

    data = {
      id: promoId,
      promoCode: promoCode,
      title: promoTitle,
      discountPercent: promoDiscountPercent,
      promoDescription: promoDescription,
    };

    url = contextPath + "promos/save";

    await $.ajax({
      type: "POST",
      url: url,
      beforeSend: function (xhr) {
        xhr.setRequestHeader(csrfHeaderName, csrfValue);
      },
      data: JSON.stringify(data),
      contentType: "application/json",
    })
      .done(function () {
        $("#dropDownPromos option:selected").text(promoTitle);
        changeFormPromoToSelectedPromo();

        showToastMessage("The Promo has been updated");
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

function validateFormPromo() {
  formPromo = document.getElementById("formPromo");
  if (!formPromo.checkValidity()) {
    formPromo.reportValidity();
    return false;
  }
  return true;
}
async function addPromo() {
  try {
    if (!validateFormPromo()) return;
    promoTitle = fieldPromoTitle.val();
    promoCode = fieldPromoCode.val();
    promoDiscountPercent = fieldPromoDiscountPercent.val();
    promoDescription = fieldPromoDescription.val();
    if (!(await checkPromoCodeUnique(null, promoCode))) return;

    data = {
      promoCode: promoCode,
      title: promoTitle,
      discountPercent: promoDiscountPercent,
      description: promoDescription,
    };
    url = contextPath + "promos/save";

    await $.ajax({
      type: "POST",
      url: url,
      beforeSend: function (xhr) {
        xhr.setRequestHeader(csrfHeaderName, csrfValue);
      },
      data: JSON.stringify(data),
      contentType: "application/json",
    })
      .done(function (promoId) {
        selectNewlyAddedPromo(promoId, promoTitle);
        showToastMessage("The new Promo has been added");
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

function selectNewlyAddedPromo(promoId, promoTitle) {
  $("<option>").val(promoId).text(promoTitle).appendTo(dropDownPromos);

  dropDownPromos.val(promoId).change();
}

function changeFormPromoToNew() {
  buttonAddPromo.val("Add");
  labelPromoTitle.text("Promo Title:");
  buttonUpdatePromo.prop("disabled", true);
  buttonDeletePromo.prop("disabled", true);

  fieldPromoTitle.val("").focus();
  fieldPromoCode.val("");
  fieldPromoDiscountPercent.val("");
  fieldPromoDescription.val("");
}

async function changeFormPromoToSelectedPromo() {
  try {
    buttonAddPromo.prop("value", "New");
    buttonUpdatePromo.prop("disabled", false);
    buttonDeletePromo.prop("disabled", false);

    promoId = dropDownPromos.val();
    labelPromoTitle.text("Selected Promo:");

    url = contextPath + "promos/" + promoId;
    await $.get(url, function (Promo) {
      fieldPromoTitle.val(Promo.title);
      fieldPromoCode.val(Promo.promoCode);
      fieldPromoDiscountPercent.val(Promo.discountPercent);
      fieldPromoDescription.val(Promo.description);
    })
      .done(function () {})
      .fail(function () {});
  } catch (e) {
    console.log(e);
  }
}

async function loadPromos() {
  try {
    url = contextPath + "promos/list";
    await $.get(url, function (responseJSON) {
      dropDownPromos.empty();
      $.each(responseJSON, function (index, Promo) {
        $("<option>").val(Promo.id).text(Promo.title).appendTo(dropDownPromos);
      });
    })
      .done(function () {
        buttonLoadPromos.val("Refresh Promos List");
        showToastMessage("All Promos have havebeen loaded");
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

async function checkPromoCodeUnique(id, promoCode) {
  url = contextPath + "promos/check_promo_code";

  params = { id: id, promoCode: promoCode, _csrf: csrfValue };

  let value = false;
  await $.post(url, params, function (response) {
    if (response == "OK") {
      value = true;
    } else if (response == "Duplicated") {
      showWarningModal("There is another Promo having the code " + promoCode);
    } else {
      showErrorModal("Unknown response from server");
    }
  }).fail(function () {
    showErrorModal("Could not connect to the server");
  });

  return value;
}
