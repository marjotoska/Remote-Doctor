function readURL(input) {
  window.setTimeout(function () {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        $("#imagePreview").css(
          "background-image",
          "url(" + e.target.result + ")",
        );
        $("#imagePreview").hide();
        $("#imagePreview").fadeIn(650);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }, 2000);
}
// For big pic
function readURL1(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#imagePreview1").css(
        "background-image",
        "url(" + e.target.result + ")",
      );
      $("#imagePreview1").hide();
      $("#imagePreview1").fadeIn(650);
    };
    reader.readAsDataURL(input.files[0]);
  }
}
$("#imageUpload").change(function () {
  readURL(this);
  readURL1(this);
});

// const submitImage = document.forms["pic-form"]["submitImage"];

// submitImage.addEventListener("submit", (e) => {
//   e.preventDefault();
//   readURL(this);
// });
