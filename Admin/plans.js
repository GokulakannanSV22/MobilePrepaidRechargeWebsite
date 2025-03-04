const apiUrl = 'http://localhost:3000/categories';
let allPlans = [];
let filteredPlans = [];

async function loadCategories() {
    const response = await fetch(apiUrl);
    const categories = await response.json();
    return categories;
}

async function loadPlans() {
    const categories = await loadCategories();
    allPlans = categories.flatMap(category =>
        category.plans.map(plan => ({
            ...plan,
            categoryName: category.name,
            categoryId: category.id
        }))
    );
    filteredPlans = [...allPlans]; // Initialize with all plans
    displayPlans();
    populateCategoryDropdown(categories);
    populateCategoryDropdownForModal(categories); // Populate category dropdown in add modal
    populateOttOptions('ottDetails');
}

function displayPlans() {
    const tbody = document.querySelector('#plansTable tbody');
    tbody.innerHTML = '';

    filteredPlans.forEach(plan => {
        const row = document.createElement('tr');
        row.innerHTML = `
                    <td>${plan.categoryName}</td>
                    <td>${plan.id}</td>
                    <td>${plan.title}</td>
                    <td>${plan.data}</td>
                    <td>${plan.validity}</td>
                    <td>${plan.price}</td>
                    <td>${plan.voice}</td>
                    <td>${plan.ottDetails.map(ott => `${ott.platform} (${ott.validity})`).join(', ') || 'None'}</td>
                    <td>
                        <button class="btn btn-sm btn-warning edit-btn action-btn"><i class="fa-solid fa-pen-to-square"></i></button>
                    </td>
                `;
        tbody.appendChild(row);
    });
}

function populateCategoryDropdown(categories) {
    const select = document.getElementById('categoryFilter');
    select.innerHTML = '<option value="all">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function populateCategoryDropdownForModal(categories) {
    const select = document.getElementById('categoryId');
    select.innerHTML = ''; // Clear existing options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        select.appendChild(option);
    });
}

function filterPlans() {
    const categoryId = document.getElementById('categoryFilter').value;
    if (categoryId === 'all') {
        filteredPlans = [...allPlans];
    } else {
        filteredPlans = allPlans.filter(plan => plan.categoryId === categoryId);
    }
    displayPlans();
}

function populateOttOptions(containerId, selectedOtts = []) {
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear existing options
    const ottOptions = [
        { platform: "Netflix"},
        { platform: "Disney+ Hotstar"},
        { platform: "Amazon Prime"},
        { platform: "SonyLIV" },
        { platform: "Spotify Premium"},
        { platform: "YouTube Premium"}
    ];

    ottOptions.forEach(ott => {
        const div = document.createElement('div');
        div.className = 'ott-option';
        div.innerHTML = `
                    <input type="checkbox" name="ottPlatform" value="${ott.platform}" ${selectedOtts.some(s => s.platform === ott.platform) ? 'checked' : ''}>
                    <span class="ott-icon" style="background-image: url('${ott.iconUrl}');"></span>
                    ${ott.platform}
                    <input type="text" class="ott-validity-input" name="ottValidity" value="${selectedOtts.find(s => s.platform === ott.platform)?.validity || '30 Days'}" placeholder="e.g., 30 Days">
                `;
        container.appendChild(div);
    });
}

document.getElementById('addPlanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPlan = {
        id: formData.get('planId'),
        title: formData.get('title'),
        data: formData.get('data'),
        validity: parseInt(formData.get('validity')),
        price: parseInt(formData.get('price')),
        voice: formData.get('voice'),
        ottDetails: Array.from(document.querySelectorAll('#ottDetails input[name="ottPlatform"]:checked'))
            .map(checkbox => {
                const validityInput = checkbox.parentElement.querySelector('input[name="ottValidity"]');
                return {
                    platform: checkbox.value,
                    validity: validityInput.value || '30 Days', // Default to 30 Days if empty
                    icon: getIconForPlatform(checkbox.value) // Function to map platform to icon
                };
            })
    };

    const categoryId = formData.get('categoryId');
    const response = await fetch(`${apiUrl}/${categoryId}`);
    const category = await response.json();
    category.plans.push(newPlan);

    await fetch(`${apiUrl}/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    });

    alert('Plan added successfully!');
    e.target.reset();
    loadPlans();
    bootstrap.Modal.getInstance(document.getElementById('addPlanModal')).hide();
});

function openEditModal(categoryId, planIndex) {
    fetch(`${apiUrl}/${categoryId}`).then(response => response.json()).then(category => {
        const plan = category.plans[planIndex];
        document.getElementById('editCategoryId').value = categoryId;
        document.getElementById('editPlanIndex').value = planIndex;
        document.getElementById('editPlanId').value = plan.id;
        document.getElementById('editTitle').value = plan.title;
        document.getElementById('editData').value = plan.data;
        document.getElementById('editValidity').value = plan.validity;
        document.getElementById('editPrice').value = plan.price;
        document.getElementById('editVoice').value = plan.voice;

        // Populate OTT options with existing values
        populateOttOptions('editOttDetails', plan.ottDetails);

        const modal = new bootstrap.Modal(document.getElementById('editPlanModal'));
        modal.show();
    });
}

document.getElementById('editPlanForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedPlan = {
        id: formData.get('planId'),
        title: formData.get('title'),
        data: formData.get('data'),
        validity: parseInt(formData.get('validity')),
        price: parseInt(formData.get('price')),
        voice: formData.get('voice'),
        ottDetails: Array.from(document.querySelectorAll('#editOttDetails input[name="ottPlatform"]:checked'))
            .map(checkbox => {
                const validityInput = checkbox.parentElement.querySelector('input[name="ottValidity"]');
                return {
                    platform: checkbox.value,
                    validity: validityInput.value || '30 Days', // Default to 30 Days if empty
                    icon: getIconForPlatform(checkbox.value) // Function to map platform to icon
                };
            })
    };

    const categoryId = formData.get('categoryId');
    const planIndex = parseInt(formData.get('planIndex'));
    const response = await fetch(`${apiUrl}/${categoryId}`);
    const category = await response.json();
    category.plans[planIndex] = updatedPlan;

    await fetch(`${apiUrl}/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(category)
    });

    alert('Plan updated successfully!');
    bootstrap.Modal.getInstance(document.getElementById('editPlanModal')).hide();
    loadPlans();
});

document.getElementById('plansTable').addEventListener('click', function (e) {
    const editBtn = e.target.closest('.edit-btn');
    if (!editBtn) return;

    const row = editBtn.closest('tr');
    const cells = row.querySelectorAll('td:not(:last-child)'); // Exclude action column

    // Open edit modal with current plan data
    const categoryName = cells[0].textContent;
    const planId = cells[1].textContent;
    const categories = allPlans.filter(p => p.categoryName === categoryName);
    const plan = categories.find(p => p.id === planId);

    if (plan) {
        openEditModal(plan.categoryId, categories.findIndex(p => p.id === planId));
    }
});

function getIconForPlatform(platform) {
    const icons = {
        "Netflix": "bi bi-film",
        "Disney+ Hotstar": "fa-regular fa-star",
        "Amazon Prime": "fab fa-amazon",
        "SonyLIV": "fas fa-tv",
        "Spotify Premium": "fab fa-spotify",
        "YouTube Premium": "fa-brands fa-youtube"
    };
    return icons[platform] || "fas fa-question"; // Default icon if not found
}

// Load plans on page load and populate OTT options in add modal
loadPlans();