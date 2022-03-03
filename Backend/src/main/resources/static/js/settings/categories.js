var buttonLoad;
var dropDownCategories;
var buttonAddCategory;
var buttonUpdateCategory;
var buttonDeleteCategory;
var labelCategoriesName;
var fieldCategoriesName;
var fieldCategoriesImage;
var fieldCategoriesStatus;

$(document).ready(function () {
  buttonLoad = $("#btnloadCategories");
  dropDownCategories = $("#dropDownCategories");
  buttonAddCategory = $("#buttonAddCategory");
  buttonUpdateCategory = $("#buttonUpdateCategory");
  buttonDeleteCategory = $("#buttonDeleteCategory");
  labelCategoriesName = $("#labelCategoriesName");
  fieldCategoriesName = $("#fieldCategoriesName");
  fieldCategoriesImage = $("#thumbnail");
  fieldCategoriesStatus = $("#fieldCategoriesStatus");

  buttonLoad.click(function () {
    loadCategories();
  });

  dropDownCategories.on("change", function () {
    $("#fileImage").prop("required", false);
    changeFormCategoryToSelectedCategory();
  });

  buttonAddCategory.click(function () {
    if (buttonAddCategory.val() == "Add") {
      addCategory();
      return;
    }
    changeFormCategoryToNew();
  });

  buttonUpdateCategory.click(function () {
    updateCategory();
  });

  buttonDeleteCategory.click(function () {
    showDeleteConfirmModal("deleteCategory");
  });

  $("#yesButton").click(function (e) {
    e.preventDefault();
    if (this.name == "deleteCategory") {
      deleteCategory();
    }
    $("#confirmModal").modal("toggle");
  });
});

function deleteCategory() {
  categoryId = dropDownCategories.val();
  url = contextPath + "categories/delete/" + categoryId;

  $.ajax({
    type: "DELETE",
    url: url,
  })
    .done(function () {
      $("#dropDownCategories option[value='" + categoryId + "']").remove();
      changeFormCategoryToNew();
      showToastMessage("The Category has been deleted");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

function updateCategory() {
  if (!validateFormCategory()) return;
  url = contextPath + "categories/save";

  var categoryId = dropDownCategories.val();
  var categoryName = fieldCategoriesName.val();
  var formData = new FormData();

  formData.append("id", categoryId);
  formData.append("name", categoryName);
  formData.append("fileImage", $("#fileImage")[0].files[0]);
  formData.append("status", fieldCategoriesStatus.val());

  $.ajax({
    type: "POST",
    url: url,
    data: formData,
    processData: false,
    contentType: false,
  })
    .done(function () {
      $("#dropDownCategories option:selected").val(categoryId);
      $("#dropDownCategories option:selected").text(categoryName);
      showToastMessage("The Category has been updated");

      changeFormCategoryToSelectedCategory();
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

function validateFormCategory() {
  formCategory = document.getElementById("formCategory");
  if (!formCategory.checkValidity()) {
    formCategory.reportValidity();
    return false;
  }
  return true;
}
function addCategory() {
  if (!validateFormCategory()) return;
  url = contextPath + "categories/save";

  categoryName = fieldCategoriesName.val();

  var formData = new FormData();

  formData.append("name", categoryName);
  formData.append("fileImage", $("#fileImage")[0].files[0]);
  formData.append("status", fieldCategoriesStatus.val());

  $.ajax({
    type: "POST",
    url: url,
    data: formData,
    processData: false,
    contentType: false,
  })
    .done(function (categoryId) {
      selectNewlyAddedCategory(categoryId, categoryName);
      showToastMessage("The new Category has been added");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

function selectNewlyAddedCategory(categoryId, categoryName) {
  $("<option>").val(categoryId).text(categoryName).appendTo(dropDownCategories);

  $("#dropDownCategories option[value='" + categoryId + "']").prop(
    "selected",
    true
  );

  dropDownCategories.val(categoryId).change();
  $("#fileImage").prop("required", false);
}

function changeFormCategoryToNew() {
  buttonAddCategory.val("Add");
  labelCategoriesName.text("Category Name:");
  buttonUpdateCategory.prop("disabled", true);
  buttonDeleteCategory.prop("disabled", true);

  fieldCategoriesName.val("").focus();
  fieldCategoriesImage.attr("src", "");
  fieldCategoriesStatus.prop("checked", true);
  $("#fileImage").val("");
  $("#fileImage").prop("required", true);
}

function changeFormCategoryToSelectedCategory() {
  buttonAddCategory.prop("value", "New");
  buttonUpdateCategory.prop("disabled", false);
  buttonDeleteCategory.prop("disabled", false);

  categoryId = dropDownCategories.val();
  labelCategoriesName.text("Selected Category:");
  selectedCategoryName = $("#dropDownCategories option:selected").text();

  url = contextPath + "categories/" + categoryId;
  $.get(url, function (category) {
    fieldCategoriesName.val(category.name);
    fieldCategoriesImage.attr("src", category.iconPath);
    fieldCategoriesStatus.prop("checked", category.status);
  })
    .done(function () {})
    .fail(function () {});
}

function loadCategories() {
  url = contextPath + "categories/list";
  $.get(url, function (responseJSON) {
    console.log(responseJSON);
    dropDownCategories.empty();
    $.each(responseJSON, function (index, category) {
      $("<option>")
        .val(category.id)
        .text(category.name)
        .appendTo(dropDownCategories);
    });
  })
    .done(function () {
      buttonLoad.val("Refresh Category List");
      showToastMessage("All categories have havebeen loaded");
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
