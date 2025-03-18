document.addEventListener("DOMContentLoaded", function () {
    const categoriesEndpoint = "http://localhost:8081/api/categories";
    const plansEndpoint = "http://localhost:8081/api/plans";
    const tabsContainer = document.getElementById("scrollableTabs");
    const tabContentContainer = document.querySelector(".tab-content");

    async function fetchCategories() {
        try {
            const response = await fetch(categoriesEndpoint);
            const categories = await response.json();
            return categories.filter(category => category.categoryStatus === "STATUS_ACTIVE"); // Only active categories
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    }

    async function fetchPlans() {
        try {
            const response = await fetch(plansEndpoint);
            const plans = await response.json();
            return plans.filter(plan => plan.planStatus === "STATUS_ACTIVE"); // Only active plans
        } catch (error) {
            console.error("Error fetching plans:", error);
            return [];
        }
    }

    async function populateCategories() {
        const categories = await fetchCategories();
        const plans = await fetchPlans();
        tabsContainer.innerHTML = "";
        tabContentContainer.innerHTML = "";

        categories.forEach((category, index) => {
            const isActive = index === 0;

            // Create tab
            const tabItem = document.createElement("li");
            tabItem.classList.add("nav-item");
            tabItem.innerHTML = `
                <button class="nav-link ${isActive ? "active" : ""}" id="tab-${category.categoryId}" data-bs-toggle="tab" data-bs-target="#content-${category.categoryId}" role="tab">
                    ${category.categoryName}
                </button>`;
            tabsContainer.appendChild(tabItem);

            // Filter plans by category & only active ones
            const categoryPlans = plans.filter(plan => plan.category.categoryId === category.categoryId);

            // Create tab content
            const tabContent = document.createElement("div");
            tabContent.classList.add("tab-pane", "fade");
            if (isActive) {
                tabContent.classList.add("show", "active");
            }
            tabContent.id = `content-${category.categoryId}`;
            tabContent.role = "tabpanel";
            tabContent.innerHTML = `<div class="row">${categoryPlans.map(generatePlanCard).join('')}</div>`;
            tabContentContainer.appendChild(tabContent);
        });
    }

    function generatePlanCard(plan) {
        let ottDetails = plan.planBenefits.length > 0 
        ? plan.planBenefits.map(benefit => `<span class="badge text-dark"><i class="fa ${benefit.icon}"></i> ${benefit.benefitName}</span>`).join(' ') 
        : "<p>No OTT benefits</p>";

        return `
            <div class="col-lg-4 col-md-12 col-sm-12 mb-4">
                <div class="card h-100 border-success">
                    <div class="card-body">
                        <h3>
                            <strong>₹${plan.price.toFixed(2)}</strong>
                            <span class="badge rounded-pill float-end" style="background-color: ${plan.badgeColor};">${plan.badge}</span>
                            </h3>
                            <p class="plan-name">${plan.planName}</p>
                        <hr>
                        <p><i class="bi bi-wifi"></i> ${plan.data}</p>
                        <p><i class="fa-solid fa-clock-rotate-left"></i> ${plan.validity} Days</p>
                        <p class="card-text"><i class="fa-solid fa-phone-volume"></i> ${plan.voice}</p>
                        <p><i class="fa-solid fa-comment"></i> ${plan.sms} SMS</p>
                        <div class="ott-sec">
                            <p class="h6">OTT's Included:</p>
                            ${ottDetails}
                        </div>
                    </div>
                    <div class="p-3 mx-5 ">
                        <button type="button" class="recharge-button p-3  w-100" onclick="openRechargeModal(${JSON.stringify(plan).replace(/"/g, '&quot;')})">Recharge Now</button>
                    </div>
                </div>
            </div>`;
    }

    populateCategories();
});


function openRechargeModal(plan) {
    let modal = new bootstrap.Modal(document.getElementById("getplanModal"));
    sessionStorage.setItem("selectedPlan", JSON.stringify(plan));
    modal.show();
}

document.getElementById("mobile-number").addEventListener("input", function () {
    validateMobileNumberModal();
});





//fetchPlans();

function validateMobile() {
    var mobileNumber = document.getElementById("mobileNumber-login").value;
    let mobileRegex = /^[6-9]\d{9}$/;


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






