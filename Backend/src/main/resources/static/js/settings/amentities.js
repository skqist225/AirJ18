var buttonLoadAmentities;
var dropDownAmentities;
var buttonAddAmentity;
var buttonUpdateAmentity;
var buttonDeleteAmentity;
var labelAmentityName;
var fieldAmentityName;
var fieldAmentityImage;
var fieldAmentityStatus;
var fieldAmentityDescription;
var fieldAmentityCategory;

$(document).ready(function () {
  buttonLoadAmentities = $("#btnLoadAmentities");
  dropDownAmentities = $("#dropDownAmentities");
  buttonAddAmentity = $("#buttonAddAmentity");
  buttonUpdateAmentity = $("#buttonUpdateAmentity");
  buttonDeleteAmentity = $("#buttonDeleteAmentity");
  labelAmentityName = $("#labelAmentityName");
  fieldAmentityName = $("#fieldAmentityName");
  fieldAmentityImage = $("#amentityThumbnail");
  fieldAmentityStatus = $("#fieldAmentityStatus");
  fieldAmentityDescription = $("#fieldAmentityDescription");
  fieldAmentityCategory = $("#fieldAmentityCategory");

  buttonLoadAmentities.click(function () {
    loadAmentities();
  });

  dropDownAmentities.on("change", function () {
    changeFormAmentityToSelectedAmentity();
    $("#amentityImage").prop("required", false);
  });

  buttonAddAmentity.click(function () {
    if (buttonAddAmentity.val() == "Add") {
      addAmentity();
      return;
    }
    changeFormAmentityToNew();
    $("#amentityImage").prop("required", true);
  });

  buttonUpdateAmentity.click(function () {
    updateAmentity();
  });

  buttonDeleteAmentity.click(function () {
    showDeleteConfirmModal("deleteAmentity");
  });

  $("#yesButton").click(function (e) {
    e.preventDefault();
    if (this.name == "deleteAmentity") {
      deleteAmentity();
    }
    $("#confirmModal").modal("toggle");
  });

  $("#amentityImage").change(function () {
    if (!checkFileSize(this)) {
      return;
    }
    showAmentityThumbnail(this);
  });
});

function showAmentityThumbnail(fileInput) {
  var file = fileInput.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    $("#amentityThumbnail").attr("src", e.target.result);
  };

  reader.readAsDataURL(file);
}

function deleteAmentity() {
  amentityId = dropDownAmentities.val();
  url = contextPath + "amentities/delete/" + amentityId;

  $.ajax({
    type: "DELETE",
    url: url,
  })
    .done(function () {
      $("#dropDownAmentities option[value='" + amentityId + "']").remove();
      changeFormAmentityToNew();
      showToastMessage("The Amentity has been deleted");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

async function updateAmentity() {
  try {
    if (!validateFormAmentity()) return;

    var amentityId = dropDownAmentities.val();
    var amentityName = fieldAmentityName.val();

    if (!(await checkNameUnique(amentityId, amentityName))) return;

    url = contextPath + "amentities/save";

    var formData = new FormData();
    formData.append("id", amentityId);
    formData.append("name", amentityName);
    formData.append("amentityImage", $("#amentityImage")[0].files[0]);
    formData.append("status", fieldAmentityStatus.val());
    formData.append("description", fieldAmentityDescription.val());
    formData.append("amentityCategory", fieldAmentityCategory.val());

    await $.ajax({
      type: "POST",
      url: url,
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function () {
        $("#dropDownAmentities option:selected").val(amentityId);
        $("#dropDownAmentities option:selected").text(amentityName);
        showToastMessage("The Amentity has been updated");

        changeFormAmentityToSelectedAmentity();
      })
      .fail(function () {
        showToastMessage(
          "ERROR: Could not connect to server or server encountered an error"
        );
      });
  } catch (e) {}
}

function validateFormAmentity() {
  formAmentity = document.getElementById("formAmentity");
  if (!formAmentity.checkValidity()) {
    formAmentity.reportValidity();
    return false;
  }
  return true;
}
async function addAmentity() {
  try {
    if (!validateFormAmentity()) return;
    amentityName = fieldAmentityName.val();
    if (!(await checkNameUnique(null, amentityName))) return;
    url = contextPath + "amentities/save";

    var formData = new FormData();

    formData.append("name", amentityName);
    formData.append("amentityImage", $("#amentityImage")[0].files[0]);
    formData.append("status", fieldAmentityStatus.val());
    formData.append("description", fieldAmentityDescription.val());
    formData.append("amentityCategory", fieldAmentityCategory.val());

    await $.ajax({
      type: "POST",
      url: url,
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (amentityId) {
        selectNewlyAddedAmentity(amentityId, amentityName);
        showToastMessage("The new Amentity has been added");
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

function selectNewlyAddedAmentity(amentityId, amentityName) {
  $("<option>").val(amentityId).text(amentityName).appendTo(dropDownAmentities);

  $("#dropDownAmentities option[value='" + amentityId + "']").prop(
    "selected",
    true
  );

  dropDownAmentities.val(amentityId).change();
}

function changeFormAmentityToNew() {
  buttonAddAmentity.val("Add");
  labelAmentityName.text("Amentity Name:");
  buttonUpdateAmentity.prop("disabled", true);
  buttonDeleteAmentity.prop("disabled", true);

  fieldAmentityName.val("").focus();
  fieldAmentityImage.attr("src", "");
  fieldAmentityStatus.prop("checked", true);
  fieldAmentityDescription.val("");
  fieldAmentityCategory.val("").change();
  $("#amentityImage").val("");
}

function changeFormAmentityToSelectedAmentity() {
  buttonAddAmentity.prop("value", "New");
  buttonUpdateAmentity.prop("disabled", false);
  buttonDeleteAmentity.prop("disabled", false);

  amentityId = dropDownAmentities.val();
  labelAmentityName.text("Selected Amentity:");

  url = contextPath + "amentities/" + amentityId;
  $.get(url, function (amentity) {
    fieldAmentityName.val(amentity.name);
    fieldAmentityImage.attr("src", amentity.iconImagePath1);
    fieldAmentityStatus.prop("checked", amentity.status);
    fieldAmentityDescription.val(amentity.description);
    fieldAmentityCategory.val(amentity.amentityCategory.id).change();
  })
    .done(function () {})
    .fail(function () {});

  $("#amentityImage").val("");
}

function loadAmentities() {
  url = contextPath + "amentities/list";
  $.get(url, function (responseJSON) {
    dropDownAmentities.empty();
    $.each(responseJSON, function (index, amentity) {
      $("<option>")
        .val(amentity.id)
        .text(amentity.name)
        .appendTo(dropDownAmentities);
    });
  })
    .done(function () {
      buttonLoadAmentities.val("Refresh Amentities List");
      showToastMessage("All amentities have havebeen loaded");
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

async function checkNameUnique(id, name) {
  url = contextPath + "amentities/check_name";

  params = { id: id, name: name };

  let value = false;
  await $.post(url, params, function (response) {
    if (response == "OK") {
      value = true;
    } else if (response == "Duplicated") {
      showWarningModal("There is another amentity having the name " + name);
    } else {
      showErrorModal("Unknown response from server");
    }
  }).fail(function () {
    showErrorModal("Could not connect to the server");
  });
  return value;
}
