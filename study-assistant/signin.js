// retrieve form element from HTML
const form = document.getElementById("signin-form");

// event lister
form.addEventListener("submit", function (event) {
  event.preventDefault(); // prevents form from submit

  // get inputs (not using, but just a placeholder)
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  // perform additional validation or send the data to another groupmate here
  // (log the values to the console)
  console.log("Username:", username);
  console.log("Password:", password);

  // reset form
  form.reset();
});
