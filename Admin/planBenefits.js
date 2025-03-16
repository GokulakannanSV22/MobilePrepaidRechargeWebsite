// plan-benefits.js

// Base URL for API
const API_URL = "http://localhost:8081/api";

// Function to fetch and display all benefits
async function loadBenefits() {
    try {
        const response = await fetch(`${API_URL}/plan-benefits`);
        const benefits = await response.json();

        // Separate active and inactive benefits
        const activeBenefits = benefits.filter(b => b.planBenefitStatus === 'STATUS_ACTIVE');
        const inactiveBenefits = benefits.filter(b => b.planBenefitStatus !== 'STATUS_ACTIVE');

        populateTable('activeBenefitsTable', activeBenefits);
        populateTable('inactiveBenefitsTable', inactiveBenefits);
    } catch (error) {
        console.error('Error loading benefits:', error);
    }
}

// Function to populate table with benefits
function populateTable(tableId, benefits) {
    const tbody = document.querySelector(`#${tableId} tbody`);
    tbody.innerHTML = ''; // Clear existing content

    benefits.forEach(benefit => {
        const row = document.createElement('tr');
        const isActive = benefit.planBenefitStatus === 'STATUS_ACTIVE';
        row.innerHTML = `
            <td>${benefit.benefitId}</td>
            <td>${benefit.benefitName}</td>
            <td>${benefit.icon}</td>
            <td>${benefit.planBenefitStatus}</td>
            <td>
                <button class="btn btn-${isActive ? 'warning' : 'success'} btn-sm" 
                        onclick="toggleBenefitStatus('${benefit.benefitId}', '${isActive ? 'STATUS_INACTIVE' : 'STATUS_ACTIVE'}')">
                    ${isActive ? 'Deactivate' : 'Activate'}
                </button>
            </td>
            <td>
                <button class="btn btn-success btn-sm" onclick="openEditModal('${benefit.benefitId}')">
                    Edit
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Handle form submission for adding/editing benefits
document.getElementById('planBenefitForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const benefitId = document.getElementById('benefitId').value;
    const benefit = {
        benefitName: document.getElementById('benefitName').value,
        icon: document.getElementById('benefitIcon').value,
        planBenefitStatus: document.getElementById('benefitStatus').value
    };

    try {
        let response;
        if (benefitId) {
            // Update existing benefit
            response = await fetch(`${API_URL}/plan-benefits/${benefitId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(benefit)
            });
        } else {
            // Add new benefit
            response = await fetch(`${API_URL}/plan-benefits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(benefit)
            });
        }

        if (response.ok) {
            // Close modal safely
            const modalElement = document.getElementById('planBenefitModal');
            if (modalElement) {
                const modal = bootstrap.Modal.getOrCreateInstance(modalElement);
                modal.hide();
            } else {
                console.error('Modal element #planBenefitModal not found');
            }
            document.getElementById('planBenefitForm').reset();
            document.getElementById('benefitId').value = '';
            await loadBenefits();
        } else {
            console.error('Error saving benefit:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});

// Reset modal when adding new benefit


// Function to open edit modal with existing benefit data
async function openEditModal(benefitId) {
    try {
        const response = await fetch(`${API_URL}/plan-benefits/${benefitId}`);
        const benefit = await response.json();

        document.getElementById('benefitId').value = benefit.benefitId;
        document.getElementById('benefitName').value = benefit.benefitName;
        document.getElementById('benefitIcon').value = benefit.icon;
        document.getElementById('benefitStatus').value = benefit.planBenefitStatus;
        
        document.getElementById('planBenefitModalLabel').textContent = 'Edit Plan Benefit';
        const modal = new bootstrap.Modal(document.getElementById('planBenefitModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading benefit:', error);
    }
}

// Function to toggle benefit status (activate/deactivate)
async function toggleBenefitStatus(benefitId, newStatus) {
    try {
        const response = await fetch(`${API_URL}/plan-benefits/${benefitId}/toggle-status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newStatus) // Sends "STATUS_ACTIVE" or "STATUS_INACTIVE"
        });

        if (response.ok) {
            await loadBenefits();
        } else {
            console.error('Error toggling benefit status:', response.status);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Reset modal when adding new benefit
document.querySelector('[data-bs-target="#planBenefitModal"]').addEventListener('click', () => {
    document.getElementById('planBenefitForm').reset();
    document.getElementById('benefitId').value = '';
    document.getElementById('benefitStatus').value = 'STATUS_ACTIVE';
    document.getElementById('planBenefitModalLabel').textContent = 'Add Plan Benefit';
});

// Load benefits when page loads
document.addEventListener('DOMContentLoaded', loadBenefits);