document.querySelector("form").addEventListener("submit", function (event) {
    event.preventDefault(); 
    let name = document.getElementById("name").value.trim();
    let email = document.getElementById("email").value.trim();
    let query = document.getElementById("query").value.trim();

    let nameError = document.getElementById("error-name");
    let emailError = document.getElementById("error-email");
    let queryError = document.getElementById("error-query");

    let isValid = true;

  
    if (name === "") {
        nameError.textContent = "Full Name should not be empty.";
        isValid = false;
    } else if (!/^[a-zA-Z\s]+$/.test(name)) {
        nameError.textContent = "Full Name should contain only letters.";
        isValid = false;
    } else {
        nameError.textContent = "";
    }

    if (email === "") {
        emailError.textContent = "Email Address should not be empty.";
        isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
        emailError.textContent = "Enter a valid email address.";
        isValid = false;
    } else {
        emailError.textContent = "";
    }

  
    if (query === "") {
        queryError.textContent = "Query should not be empty.";
        isValid = false;
    } else if (query.length < 10) {
        queryError.textContent = "Query should be at least 10 characters long.";
        isValid = false;
    } else {
        queryError.textContent = "";
    }

    if (isValid) {
        event.target.submit(); // Submit the form if everything is valid
    }
});