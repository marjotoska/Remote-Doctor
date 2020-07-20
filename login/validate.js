function validateSignIn() {
  var email = document.forms["signIn"]["email"].value;
  var emailValidator = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}\.*([a-zA-Z]{2,})*$/;
  var password = document.forms["signIn"]["password"].value;
  var passwordValidator = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

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
      "This is not a valid Password! Password must contain at least eight characters, at least one number, both lower and uppercase letters and any of these '@$!%*#?&' special characters",
    );
    return false;
  }
  return true;
  // Sign In part End
}
function validateSignUp() {
  // Sign Up part
  var email = document.forms["signUp"]["email"].value;
  // var username = document.forms["signUp"]["username"].value;
  var password = document.forms["signUp"]["password"].value;
  var passwordConf = document.forms["signUp"]["passwordConf"].value;
  var emailValidator = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}\.*([a-zA-Z]{2,})*$/;
  // var usernameValidator = /(?=.{6,15}$)[A-Za-z0-9]+(?:[._-][A-Za-z0-9]+)*$/;
  var passwordValidator = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  // if (username === "" || username == null) {
  //   alert("Please fill out your username!");
  //   document.signUp.username.focus();
  //   return false;
  // }
  // if (!username.match(usernameValidator)) {
  //   alert(
  //     "This is not a valid Username! It must contain 6 to 15 letters and digits, and have only dash(-), dot(.) and undescore(_) characters!",
  //   );
  //   return false;
  // }

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
      "This is not a valid Password! Password must contain at least eight characters, at least one number, both lower and uppercase letters and any of these '@$!%*#?&' special characters",
    );
    return false;
  }
  if (passwordConf === "" || passwordConf == null) {
    alert("Please fill out your password confirmation field!");
    document.signUp.passwordConf.focus();
    return false;
  }
  if (!passwordConf.match(passwordValidator)) {
    alert(
      "This is not a valid Password! Password must contain at least eight characters, at least one number, both lower and uppercase letters and any of these '@$!%*#?&' special characters",
    );
    return false;
  }
  if (password != passwordConf) {
    alert("Passwords do not match. Please try again.");
    return false;
  }
  return true;
  // Sign Up part End
}
