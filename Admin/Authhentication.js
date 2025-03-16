document.addEventListener("DOMContentLoaded", function () {
    const token = localStorage.getItem("jwtToken");

    // Check if the user has a valid JWT token
    if (!token) {
        window.location.href = "AdminLogin.html"; // Redirect to login page
    }
});

// Logout functionality
document.addEventListener("DOMContentLoaded", function () {
    const logoutLink = document.getElementById("offcanvasLogoutLink");

    if (logoutLink) {
        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            localStorage.removeItem("jwtToken"); // Remove token from local storage
            window.location.href = "AdminLogin.html"; // Redirect to login page
        });
    }
});
