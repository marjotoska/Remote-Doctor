const picForm = document.getElementById("pic-form");
const divContainer = document.querySelector(".container");
const smallerContainer = document.querySelector(".smaller-container");
const h1 = document.querySelector(".complete-profile");

picForm.addEventListener("submit", (e) => {
  e.preventDefault();
  updateStatus();
  submitLater();
});

function updateStatus() {
  const div = document.createElement("div");
  const newH1 = document.createElement("h1");

  window.setTimeout(function () {
    div.classList.add("successfully-uploaded");
    // Assign the text of newly created h1
    newH1.innerHTML = "Your image was successfully uploaded!";
    // Append h1 to div class="successfully-uploaded"
    div.appendChild(newH1);
    // Append div class="successfully-uploaded" TO div class="smaller-container"
    smallerContainer.appendChild(div);
    // assign html of h1 to empty
    h1.innerHTML = "";

    // Create button
    // const button = document.createElement("button");
    // button.classList.add("btn", "btn-white", "btn-animate", "next-page");
    // Change button text
    // button.textContent = "Next Page";
    // document.body.appendChild(button);

    // Get names of form and element
    const submitImage = document.forms["pic-form"]["submitImage"];
    submitImage.disabled = true;
  }, 2000);

  window.setTimeout(function () {
    const redirect = document.createElement("h2");
    redirect.classList.add("redirect");

    div.appendChild(redirect);
    redirect.innerHTML =
      "You will be redirected in a bit. Please don't close this window!";
  }, 2400);
}

function submitLater() {
  window.setTimeout(function () {
    $("#pic-form").submit();
  }, 3500);
}
