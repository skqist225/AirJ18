var buttonLoadRules;
var dropDownRules;
var buttonAddRule;
var buttonUpdateRule;
var buttonDeleteRule;
var labelRuleName;
var fieldRuleName;
var fieldRuleImage;
var fieldRuleStatus;

$(document).ready(function () {
  buttonLoadRules = $("#btnLoadRules");
  dropDownRules = $("#dropDownRules");
  buttonAddRule = $("#buttonAddRule");
  buttonUpdateRule = $("#buttonUpdateRule");
  buttonDeleteRule = $("#buttonDeleteRule");
  labelRuleName = $("#labelRuleName");
  fieldRuleName = $("#fieldRuleName");
  fieldRuleImage = $("#ruleThumbnail");
  fieldRuleStatus = $("#fieldRuleStatus");

  buttonLoadRules.click(function () {
    loadRules();
  });

  dropDownRules.on("change", function () {
    $("#ruleImage").prop("required", false);
    changeFormRuleToSelectedRule();
  });

  buttonAddRule.click(function () {
    if (buttonAddRule.val() == "Add") {
      addRule();
      return;
    }
    changeFormRuleToNew();
  });

  buttonUpdateRule.click(function () {
    updateRule();
  });

  buttonDeleteRule.click(function () {
    showDeleteConfirmModal("deleteRule");
  });

  $("#yesButton").click(function (e) {
    e.preventDefault();
    if (this.name == "deleteRule") {
      deleteRule();
    }
    $("#confirmModal").modal("toggle");
  });

  $("#ruleImage").change(function () {
    if (!checkFileSize(this)) {
      return;
    }
    showRuleThumbnail(this);
  });
});

function showRuleThumbnail(fileInput) {
  var file = fileInput.files[0];
  var reader = new FileReader();
  reader.onload = function (e) {
    $("#ruleThumbnail").attr("src", e.target.result);
  };

  reader.readAsDataURL(file);
}

function deleteRule() {
  RuleId = dropDownRules.val();
  url = contextPath + "rules/delete/" + RuleId;

  $.ajax({
    type: "DELETE",
    url: url,
  })
    .done(function () {
      $("#dropDownRules option[value='" + RuleId + "']").remove();
      changeFormRuleToNew();
      showToastMessage("The Rule has been deleted");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

async function updateRule() {
  try {
    if (!validateFormRule()) return;
    var RuleId = dropDownRules.val();
    var RuleName = fieldRuleName.val();
    if (!(await checkNameRuleUnique(RuleId, RuleName))) return;
    url = contextPath + "rules/save";

    var formData = new FormData();

    formData.append("id", RuleId);
    formData.append("name", RuleName);
    formData.append("ruleImage", $("#ruleImage")[0].files[0]);
    formData.append("status", fieldRuleStatus.val());

    await $.ajax({
      type: "POST",
      url: url,
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function () {
        $("#dropDownRules option:selected").val(RuleId);
        $("#dropDownRules option:selected").text(RuleName);
        showToastMessage("The Rule has been updated");

        changeFormRuleToSelectedRule();
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

function validateFormRule() {
  formRule = document.getElementById("formRule");
  if (!formRule.checkValidity()) {
    formRule.reportValidity();
    return false;
  }
  return true;
}
async function addRule() {
  try {
    if (!validateFormRule()) return;
    RuleName = fieldRuleName.val();
    if (!(await checkNameRuleUnique(null, RuleName))) return;

    url = contextPath + "rules/save";

    var formData = new FormData();
    formData.append("name", RuleName);
    formData.append("ruleImage", $("#ruleImage")[0].files[0]);
    formData.append("status", fieldRuleStatus.val());

    await $.ajax({
      type: "POST",
      url: url,
      data: formData,
      processData: false,
      contentType: false,
    })
      .done(function (RuleId) {
        selectNewlyAddedRule(RuleId, RuleName);
        showToastMessage("The new Rule has been added");
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

function selectNewlyAddedRule(RuleId, RuleName) {
  $("<option>").val(RuleId).text(RuleName).appendTo(dropDownRules);

  $("#dropDownRules option[value='" + RuleId + "']").prop("selected", true);

  dropDownRules.val(RuleId).change();
  $("#ruleImage").prop("required", false);
}

function changeFormRuleToNew() {
  buttonAddRule.val("Add");
  labelRuleName.text("Rule Name:");
  buttonUpdateRule.prop("disabled", true);
  buttonDeleteRule.prop("disabled", true);

  fieldRuleName.val("").focus();
  fieldRuleImage.attr("src", "");
  fieldRuleStatus.prop("checked", true);
  $("#ruleImage").val("");
  $("#ruleImage").prop("required", true);
}

function changeFormRuleToSelectedRule() {
  buttonAddRule.prop("value", "New");
  buttonUpdateRule.prop("disabled", false);
  buttonDeleteRule.prop("disabled", false);

  RuleId = dropDownRules.val();
  labelRuleName.text("Selected Rule:");
  selectedRuleName = $("#dropDownRules option:selected").text();

  url = contextPath + "rules/" + RuleId;
  $.get(url, function (Rule) {
    fieldRuleName.val(Rule.title);
    fieldRuleImage.attr("src", Rule.iconPath1);
    fieldRuleStatus.prop("checked", Rule.status);
  })
    .done(function () {})
    .fail(function () {});
}

function loadRules() {
  url = contextPath + "rules/list";
  $.get(url, function (responseJSON) {
    dropDownRules.empty();
    $.each(responseJSON, function (index, Rule) {
      $("<option>").val(Rule.id).text(Rule.title).appendTo(dropDownRules);
    });
  })
    .done(function () {
      buttonLoadRules.val("Refresh Rules List");
      showToastMessage("All Rules have havebeen loaded");
    })
    .fail(function () {
      showToastMessage(
        "ERROR: Could not connect to server or server encountered an error"
      );
    });
}

async function checkNameRuleUnique(id, name) {
  url = contextPath + "rules/check_name";

  params = { id: id, name: name };

  let value = false;
  await $.post(url, params, function (response) {
    if (response == "OK") {
      value = true;
    } else if (response == "Duplicated") {
      showWarningModal("There is another rule having the name " + name);
    } else {
      showErrorModal("Unknown response from server");
    }
  }).fail(function () {
    showErrorModal("Could not connect to the server");
  });

  return value;
}
