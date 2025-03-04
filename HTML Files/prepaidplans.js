document.addEventListener("DOMContentLoaded", function () {
    fetch("http://localhost:3000/categories") // Corrected URL
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Data:", data); // Debugging
            data.forEach(category => {
                const containerId = getContainerId(category.id);
                const container = document.getElementById(containerId);
                if (container) {
                    container.innerHTML = ""; // Clear old content
                    category.plans.forEach(plan => {
                        const ottDetails = plan.ottDetails.length > 0
                            ? plan.ottDetails.map(ott => `<i class="${ott.icon}"></i> ${ott.platform} (${ott.validity})`).join("<br>")
                            : "None";

                        const card = `
                            <div class="col-lg-4 col-md-12 col-sm-12 mb-4">
                                <div class="card h-100 border-success">
                                    <div class="card-body">
                                        <h3>
                                            <strong>₹${plan.price}</strong>
                                            <span class="badge rounded-pill text-bg-warning float-end">${plan.title}</span>
                                        </h3>
                                        <hr>
                                        <p><i class="bi bi-wifi"></i> ${plan.data}</p>
                                        <p><i class="fa-solid fa-clock-rotate-left"></i> ${plan.validity} Days</p>
                                        <p class="card-text"><i class="fa-solid fa-phone-volume"></i> ${plan.voice}</p>
                                        <div class="ott-section">
                                            <p class="h6">OTT's Included:</p>
                                            ${ottDetails}
                                        </div>
                                    </div>
                                    <div class="p-3">
                                        <button type="button" class="recharge-button p-3 w-100" onclick="openRechargeModal(${JSON.stringify(plan).replace(/"/g, '&quot;')})">Recharge Now</button>
                                    </div>
                                </div>
                            </div>
                        `;
                        container.innerHTML += card;
                    });
                } else {
                    console.warn(`No container found for category: ${category.id}`);
                }
            });
        })
        .catch(error => console.error("Error fetching data:", error));

    function getContainerId(categoryId) {
        const categoryMap = {
            "recommendedPlans": "tab1-container",
            "SaverPlans": "tab2-container",
            "EntertainmentPlans": "tab3-container",
            "gamingPlans": "tab4-container",
            "xlr8DataPlans": "tab5-container",
            "DataBooster": "tab6-container",
            "absoluteUnlimited": "tab7-container"
        };
        return categoryMap[categoryId] || "";
    }
});

function openRechargeModal(plan) {
    selectedPlan = plan;
    let modal = new bootstrap.Modal(document.getElementById("getplanModal"));
    modal.show();
}

function validateMobileNumberModal() {
    let mobileInput = document.getElementById("mobile-number");
    let errorText = document.getElementById("modal-error-text");

    if (/^[6-9]\d{9}$/.test(mobileInput.value)) {
        errorText.innerText = "";
        sessionStorage.setItem("selectedPlan", JSON.stringify(selectedPlan));
        sessionStorage.setItem("mobileNumber", mobileInput.value);
        window.location.href = "payments.html";
    } else {
        errorText.innerText = "Please enter a valid 10-digit mobile number.";
    }
}

fetchPlans();

function validateMobile() {
    var mobileNumber = document.getElementById("mobileNumber-login").value;
    let mobileRegex = /^[9]\d{9}$/;


    if (mobileRegex.test(mobileNumber)) {
        document.getElementById("login-button").style.display = "none";
        document.getElementById("otpSection").style.display = "block";
    } else {
        alert("Please enter a valid 10-digit mobile number.");
    }
}
function login() {
    window.location.href = "UserDashBoard.html";
}