function validate() {
  var allergy = document.forms["questionare"]["allergy"].value;
  var fullName = document.forms["questionare"]["fullName"].value;
  var email = document.forms["questionare"]["email"].value;
  var stringValidator = /^[a-zA-Z]{2,}\ *([a-zA-Z]{3,})*$/;
  var emailValidator = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}\.*([a-zA-Z]{2,})*$/;
  if (allergy === "" || allergy == null) {
    alert(
      "Please fill out the allergy field, or type 'none' if you don't have any!",
    );
    document.questionare.allergy.focus();
    return false;
  }
  if (!allergy.match(stringValidator)) {
    alert("Please don't include numbers!");
    return false;
  }
  if (fullName === "" || fullName == null) {
    alert("Please fill out your Full Name!");
    document.questionare.fullName.focus();
    return false;
  }
  if (!fullName.match(stringValidator)) {
    alert("Please don't include numbers in your name!");
    return false;
  }
  if (email === "" || email == null) {
    alert("Please fill out your E-mail!");
    document.questionare.email.focus();
    return false;
  }
  if (!email.match(emailValidator)) {
    alert(
      "This is not a valid E-Mail Address! E-mail must contain a word, followed by dash(-) or dot(.) , @ sign and any email providers ",
    );
    return false;
  }
  return true;
}
