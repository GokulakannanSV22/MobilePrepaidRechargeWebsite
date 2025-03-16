const API_BASE_URL = "http://localhost:8081/api";

document.addEventListener("DOMContentLoaded", function () {
    fetchCategories();
    fetchPlans();
    fetchOTTBENEFITS();
    document.getElementById("addPlanForm").addEventListener("submit", addPlan);

    // Reset form when modal is closed
    document.getElementById('addPlanModal').addEventListener('hidden.bs.modal', function () {
        const form = document.getElementById('addPlanForm');
        form.reset();
        document.getElementById('addPlanModalLabel').textContent = 'Add New Plan';
        form.querySelector('.btn-primary').textContent = 'Add Plan';
    });
});

// Fetch and populate category dropdown
async function fetchCategories(selectedCategoryId = null) {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);

        const categories = await response.json();

        // Get dropdown elements
        const categoryFilter = document.getElementById("categoryFilter"); // For filtering plans
        const categorySelect = document.getElementById("categoryId"); // For Add Plan modal
        const editCategorySelect = document.getElementById("editCategoryId");

        // Reset dropdowns
        categoryFilter.innerHTML = '<option value="all">All Categories</option>';
        categorySelect.innerHTML = ''; // No default option for modal
        if (editCategorySelect) editCategorySelect.innerHTML = '';

        // Populate both dropdowns
        categories.forEach(category => {
            const option1 = document.createElement("option");
            const option2 = document.createElement("option");
            const option3 = document.createElement("option");

            option1.value = category.categoryId;
            option1.textContent = category.categoryName;
            categoryFilter.appendChild(option1);

            option2.value = category.categoryId;
            option2.textContent = category.categoryName;
            categorySelect.appendChild(option2);
            if (editCategorySelect) {
                option3.value = category.categoryId;
                option3.textContent = category.categoryName;
                editCategorySelect.appendChild(option3);
            }
        });

    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Fetch plans and populate tables
async function fetchPlans() {
    try {
        const response = await fetch(`${API_BASE_URL}/plans`);
        if (!response.ok) throw new Error(`Failed to fetch plans: ${response.status}`);

        const plans = await response.json();
        populateTables(plans); // Populate tables initially with all plans

    } catch (error) {
        console.error("Error fetching plans:", error);
    }
}

// Filter plans based on selected category
function filterPlans() {
    const selectedCategory = document.getElementById("categoryFilter").value;

    fetch(`${API_BASE_URL}/plans`)
        .then(response => response.json())
        .then(plans => {
            let filteredPlans = plans;
            if (selectedCategory !== "all") {
                filteredPlans = plans.filter(plan => plan.category.categoryId === selectedCategory);
            }
            populateTables(filteredPlans); // Update the table with filtered plans
        })
        .catch(error => console.error("Error filtering plans:", error));
}

// Active & Inactive Plans Tables
function populateTables(plans) {
    const activePlansTableBody = document.querySelector("#activePlansTable tbody");
    const inactivePlansTableBody = document.querySelector("#inactivePlansTable tbody");

    // Clear existing rows
    activePlansTableBody.innerHTML = "";
    inactivePlansTableBody.innerHTML = "";

    plans.forEach(plan => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${plan.category.categoryName}</td>
            <td>${plan.planId}</td>
            <td>${plan.planName}</td>
            <td>${plan.validity} days</td>
            <td>${plan.data}</td>
            <td>${plan.voice}</td>
            <td>₹${plan.price}</td>
            <td>${plan.badge || "N/A"}</td>
            <td style="background-color: ${plan.badgeColor || "transparent"}">${plan.badgeColor || "N/A"}</td>
            <td>${plan.planStatus}</td>
            <td>${plan.planBenefits.map(benefit => benefit.benefitName || "N/A").join(", ")}</td>
            <td>
                ${plan.planStatus === "STATUS_ACTIVE"
                ? `<button class="btn btn-sm btn-warning" onclick="deactivatePlan('${plan.planId}')">Deactivate</button>`
                : `<button class="btn btn-sm btn-success" onclick="activatePlan('${plan.planId}')">Activate</button>`
            }
            </td>
            <td>
                <button class="btn btn-primary btn-sm edit-plan-btn" 
                        data-id="${plan.planId}"
                        onclick="showEditPlanModal('${plan.planId}')">
                    Edit
                </button>
            </td>
        `;

        if (plan.planStatus === "STATUS_ACTIVE") {
            activePlansTableBody.appendChild(row);
        } else {
            inactivePlansTableBody.appendChild(row);
        }
    });
}

// Activate
function activatePlan(planId) {
    fetch(`${API_BASE_URL}/plans/${planId}/activate`, { method: "PUT" })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to activate plan: ${response.status}`);
            return response.json();
        })
        .then(() => {
            fetchPlans(); // Refresh the table
        })
        .catch(error => console.error("Error activating plan:", error));
}

// Deactivate
function deactivatePlan(planId) {
    fetch(`${API_BASE_URL}/plans/${planId}/deactivate`, { method: "PUT" })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to deactivate plan: ${response.status}`);
            return response.json();
        })
        .then(() => {
            fetchPlans(); // Refresh the table
        })
        .catch(error => console.error("Error deactivating plan:", error));
}

// Fetch OTT Benefits
function fetchOTTBENEFITS() {
    fetch(`${API_BASE_URL}/plan-benefits`)
        .then(response => response.json())
        .then(benefits => {
            let ottDropdown = document.getElementById("ottDetails");
            ottDropdown.innerHTML = ""; // Clear existing options
            benefits.forEach(benefit => {
                let option = document.createElement("option");
                option.value = benefit.benefitId;
                option.textContent = benefit.benefitName || "Unnamed Benefit";
                ottDropdown.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching OTT benefits:", error));
}

// Handle form submission to add a plan
function addPlan(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const planData = {
        planName: formData.get("planName"),
        validity: parseInt(formData.get("validity")),
        data: formData.get("data"),
        voice: formData.get("voice"),
        price: parseFloat(formData.get("price")),
        badge: formData.get("badge") || null,
        badgeColor: formData.get("badgeColor") || "#FFFFFF",
        planStatus: "STATUS_ACTIVE",
        category: {
            categoryId: formData.get("categoryId")
        },
        planBenefits: Array.from(document.getElementById("ottDetails").selectedOptions).map(option => ({
            benefitId: option.value
        }))
    };

    // Send POST request to backend
    fetch(`${API_BASE_URL}/plans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(planData)
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to add plan");
            return response.json();
        })
        .then(newPlan => {
            alert("Plan added successfully!");
            document.getElementById("addPlanForm").reset();
            const modalElement = document.getElementById('addPlanModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
            fetchPlans(); // Refresh plans table
        })
        .catch(error => console.error("Error adding plan:", error));
}

// Function to show edit modal with plan data
function showEditPlanModal(planId) {
    // Fetch plan details
    fetch(`${API_BASE_URL}/plans/${planId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Plan not found');
            }
            return response.json();
        })
        .then(plan => {
            // Update modal title
            document.getElementById('addPlanModalLabel').textContent = 'Edit Plan';

            // Get form elements
            const form = document.getElementById('addPlanForm');
            const submitButton = form.querySelector('.btn-primary');

            // Populate form fields with plan data
            document.getElementById('categoryId').value = plan.category.categoryId;
            document.getElementById('planName').value = plan.planName;
            document.getElementById('data').value = plan.data;
            document.getElementById('validity').value = plan.validity;
            document.getElementById('price').value = plan.price;
            document.getElementById('voice').value = plan.voice;
            document.getElementById('badge').value = plan.badge || '';
            document.getElementById('badgeColor').value = plan.badgeColor || '#000000';
            document.getElementById('planStatus').value = plan.planStatus;

            // Handle OTT benefits
            const ottSelect = document.getElementById('ottDetails');
            Array.from(ottSelect.options).forEach(option => {
                option.selected = plan.planBenefits.some(benefit => benefit.benefitId === option.value);
            });

            // Change submit button text
            submitButton.textContent = 'Update Plan';

            // Remove existing submit handler and add new one
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);

            // Add submit handler for update
            newForm.addEventListener('submit', function (e) {
                e.preventDefault();
                updatePlan(planId, newForm);
            });

            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('addPlanModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error fetching plan:', error);
            alert('Error loading plan details');
        });
}

// Function to handle plan update
function updatePlan(planId, form) {
    // Collect form data
    const formData = new FormData(form);
    const planData = {
        planName: formData.get('planName'),
        data: formData.get('data'),
        validity: parseInt(formData.get('validity')),
        price: parseFloat(formData.get('price')),
        voice: formData.get('voice'),
        badge: formData.get('badge'),
        badgeColor: formData.get('badgeColor'),
        planStatus: formData.get('planStatus'),
        category: {
            categoryId: formData.get('categoryId')
        },
        planBenefits: Array.from(form.querySelector('#ottDetails').selectedOptions)
            .map(option => ({ benefitId: option.value }))
    };

    // Send update request
    fetch(`${API_BASE_URL}/plans/${planId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update plan');
            }
            return response.json();
        })
        .then(updatedPlan => {
            // Hide modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPlanModal'));
            modal.hide();

            // Reset modal title and button for future use
            document.getElementById('addPlanModalLabel').textContent = 'Add New Plan';
            document.querySelector('#addPlanForm .btn-primary').textContent = 'Add Plan';

            alert('Plan updated successfully');
            fetchPlans(); // Refresh plans table
        })
        .catch(error => {
            console.error('Error updating plan:', error);
            alert('Error updating plan');
        });
}