function changePar() {
  document.getElementById("redirect").innerHTML =
    "You will be redirected in a bit. Please don't leave this window.";

  window.setTimeout(function () {
    document.getElementById("redirect").innerHTML = "";
  }, 3000);

  window.setTimeout(function () {
    window.open("https://meet.jit.si/MarjoToska-PellumbPipero", "_blank"); //open window in new tab
  }, 1700);
}

// function createTimedLink(element, callback, timeout) { //advanced code idk of
//   setTimeout(function () {
//     callback(element);
//   }, timeout);
//   return false;
// }
// function myFunction(element) {
//   /* Block of code, with no 'return false'. */
//   window.location = element.href;
// }
