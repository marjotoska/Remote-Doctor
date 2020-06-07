const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container1 = document.getElementById("container1");

signUpButton.addEventListener("click", () => {
  container1.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container1.classList.remove("right-panel-active");
});

function validateSignIn() {
  var email = document.forms["signIn"]["email"].value;
  var emailValidator = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}\.*([a-zA-Z]{2,})*$/;
  var password = document.forms["signIn"]["password"].value;
  var passwordValidator = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;

  // Sign In part
  if (email === "" || email == null) {
    alert("Please fill out your E-mail!");
    document.signUp.email.focus();
    return false;
  }
  if (!email.match(emailValidator)) {
    alert(
      "This is not a valid E-Mail Address! E-mail must contain a word, followed by dash(-) or dot(.) , @ sign and any email providers ",
    );
    return false;
  }
  if (password === "" || password == null) {
    alert("Please fill out your password!");
    document.signUp.password.focus();
    return false;
  }
  if (!password.match(passwordValidator)) {
    alert(
      "This is not a valid password! Password must contain at least eight characters, at least one number, both lower and uppercase letters and special characters",
    );
    return false;
  }
  return true;
  // Sign In part End
}
function validateSignUp() {
  // Sign Up part
  var email = document.forms["signUp"]["email"].value;
  var firstName = document.forms["signUp"]["firstName"].value;
  var lastName = document.forms["signUp"]["lastName"].value;
  var password = document.forms["signUp"]["password"].value;
  var emailValidator = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}\.*([a-zA-Z]{2,})*$/;
  var passwordValidator = /^(?=.*? [A - Z])(?=.*? [a - z])(?=.*? [0 - 9])(?=.*? [# ? !@$%^&* -]).{ 8,} $/;
  var nameValidator = /^[a-zA-Z]{2,}(\ \')*([a-zA-Z]{3,})*$/;

  if (firstName === "" || firstName == null) {
    alert("Please fill out your First Name!");
    document.signUp.firstName.focus();
    return false;
  }
  if (!firstName.match(nameValidator)) {
    alert(
      "This is not a valid First Name! It must contain 2 or more letters, followed by a space, 'symbol or more letters(optional) ",
    );
    return false;
  }
  if (lastName === "" || lastName == null) {
    alert("Please fill out your Last Name!");
    document.signUp.lastName.focus();
    return false;
  }
  if (!lastName.match(nameValidator)) {
    alert(
      "This is not a valid Last Name! It must contain 2 or more letters, followed by a space, 'symbol or more letters(optional) ",
    );
    return false;
  }
  if (email === "" || email == null) {
    alert("Please fill out your E-mail!");
    document.signUp.email.focus();
    return false;
  }
  if (!email.match(emailValidator)) {
    alert(
      "This is not a valid E-Mail Address! E-mail must contain a word, followed by dash(-) or dot(.) , @ sign and any email providers ",
    );
    return false;
  }
  if (password === "" || password == null) {
    alert("Please fill out your password!");
    document.signUp.password.focus();
    return false;
  }
  if (!password.match(passwordValidator)) {
    alert(
      "This is not a valid Password! Password must contain at least eight characters, at least one number, both lower and uppercase letters and special characters",
    );
    return false;
  }
  return true;
  // Sign Up part End
}
