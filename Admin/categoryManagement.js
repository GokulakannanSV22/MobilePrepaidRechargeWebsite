const API_BASE_URL = "http://localhost:8081/api";

document.addEventListener("DOMContentLoaded", function () {
    fetchCategories();
    document.getElementById("addCategoryForm").addEventListener("submit", addCategory);

    // Reset form when modal is closed
    document.getElementById('addPlanModal').addEventListener('hidden.bs.modal', function () {
        const form = document.getElementById('addCategoryForm');
        form.reset();
        document.getElementById('addPlanModalLabel').textContent = 'Add New Category';
        form.querySelector('.btn-primary').textContent = 'Add Category';
    });
});

// Fetch and populate categories
async function fetchCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);

        const categories = await response.json();
        populateCategoryTables(categories); // Populate category tables

    } catch (error) {
        console.error("Error fetching categories:", error);
    }
}

// Active & Inactive Categories Tables
function populateCategoryTables(categories) {
    const activeCategoriesTableBody = document.querySelector("#activeCategoriesTable tbody");
    const inactiveCategoriesTableBody = document.querySelector("#inactiveCategoriesTable tbody");

    // Clear existing rows
    activeCategoriesTableBody.innerHTML = "";
    inactiveCategoriesTableBody.innerHTML = "";

    categories.forEach(category => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${category.categoryId}</td>
            <td>${category.categoryName}</td>
            <td>${category.categoryDescription || "N/A"}</td>
            <td>
                ${category.categoryStatus === "STATUS_ACTIVE"
                ? `<button class="btn btn-sm btn-warning" onclick="deactivateCategory('${category.categoryId}')">Deactivate</button>`
                : `<button class="btn btn-sm btn-success" onclick="activateCategory('${category.categoryId}')">Activate</button>`
            }
            </td>
            <td>
                <button class="btn btn-primary btn-sm edit-category-btn" 
                        data-id="${category.categoryId}"
                        onclick="showEditCategoryModal('${category.categoryId}')">
                    Edit
                </button>
            </td>
        `;

        if (category.categoryStatus === "STATUS_ACTIVE") {
            activeCategoriesTableBody.appendChild(row);
        } else {
            inactiveCategoriesTableBody.appendChild(row);
        }
    });
}

// Activate Category
function activateCategory(categoryId) {
    fetch(`${API_BASE_URL}/categories/${categoryId}/activate`, { method: "PUT" })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to activate category: ${response.status}`);
            return response.json();
        })
        .then(() => {
            fetchCategories(); // Refresh the table
        })
        .catch(error => console.error("Error activating category:", error));
}

// Deactivate Category
function deactivateCategory(categoryId) {
    fetch(`${API_BASE_URL}/categories/${categoryId}/deactivate`, { method: "PUT" })
        .then(response => {
            if (!response.ok) throw new Error(`Failed to deactivate category: ${response.status}`);
            return response.json();
        })
        .then(() => {
            fetchCategories(); // Refresh the table
        })
        .catch(error => console.error("Error deactivating category:", error));
}

// Handle form submission to add a category
function addCategory(event) {
    event.preventDefault();

    // Get form data
    const formData = new FormData(event.target);
    const categoryData = {
        categoryName: formData.get("categoryName"),
        categoryDescription: formData.get("categoryDescription"),
        categoryStatus: "STATUS_ACTIVE"
    };

    // Send POST request to backend
    fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData)
    })
        .then(response => {
            if (!response.ok) throw new Error("Failed to add category");
            return response.json();
        })
        .then(newCategory => {
            alert("Category added successfully!");
            document.getElementById("addCategoryForm").reset();
            const modalElement = document.getElementById('addPlanModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
            fetchCategories(); // Refresh categories table
        })
        .catch(error => console.error("Error adding category:", error));
}

// Show edit category modal
function showEditCategoryModal(categoryId) {
    fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Category not found');
            }
            return response.json();
        })
        .then(category => {
            document.getElementById('addPlanModalLabel').textContent = 'Edit Category';
            const form = document.getElementById('addCategoryForm');
            const submitButton = form.querySelector('.btn-primary');

            document.getElementById('categoryName').value = category.categoryName;
            document.getElementById('categoryDescription').value = category.categoryDescription || '';
            document.getElementById('categoryStatus').value = category.categoryStatus;

            submitButton.textContent = 'Update Category';
            const newForm = form.cloneNode(true);
            form.parentNode.replaceChild(newForm, form);

            newForm.addEventListener('submit', function (e) {
                e.preventDefault();
                updateCategory(categoryId, newForm);
            });

            const modal = new bootstrap.Modal(document.getElementById('addPlanModal'));
            modal.show();
        })
        .catch(error => {
            console.error('Error fetching category:', error);
            alert('Error loading category details');
        });
}

// Update category
function updateCategory(categoryId, form) {
    const formData = new FormData(form);
    const categoryData = {
        categoryName: formData.get('categoryName'),
        categoryDescription: formData.get('categoryDescription'),
        categoryStatus: formData.get('categoryStatus')
    };

    fetch(`${API_BASE_URL}/categories/${categoryId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(categoryData)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update category');
            }
            return response.json();
        })
        .then(updatedCategory => {
            const modal = bootstrap.Modal.getInstance(document.getElementById('addPlanModal'));
            modal.hide();
            document.getElementById('addPlanModalLabel').textContent = 'Add New Category';
            document.querySelector('#addCategoryForm .btn-primary').textContent = 'Add Category';
            alert('Category updated successfully');
            fetchCategories();
        })
        .catch(error => {
            console.error('Error updating category:', error);
            alert('Error updating category');
        });
}