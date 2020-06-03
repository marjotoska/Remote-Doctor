function Clear() {
  clearRadioGroup("enableOpt");
}

function clearRadioGroup(GroupName) {
  var ele = document.getElementsByClassName(GroupName);

  for (var i = 0; i < ele.length; i++) {
    ele[i].checked = false;
  }
}
