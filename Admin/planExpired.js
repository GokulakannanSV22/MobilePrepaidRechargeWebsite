const apiUrl = 'http://localhost:3000/customers';
const loadingElement = document.getElementById('loading');
const errorElement = document.getElementById('error');
const tableContainer = document.querySelector('.table-container');
const expiredCountElement = document.getElementById('expiredCount');
const customersTableBody = document.querySelector('#customersTable tbody');

// Function to show loading state
function showLoading() {
    loadingElement.style.display = 'block';
    tableContainer.style.display = 'none';
    errorElement.style.display = 'none';
    expiredCountElement.style.display = 'none';
}

// Function to show error message
function showError(message) {
    errorElement.textContent = `Error: ${message}`;
    errorElement.style.display = 'block';
    tableContainer.style.display = 'none';
    expiredCountElement.style.display = 'none';
    loadingElement.style.display = 'none';
}

// Function to update and show table and count
function showTableAndCount() {
    tableContainer.style.display = 'block';
    expiredCountElement.style.display = 'block';
    loadingElement.style.display = 'none';
}

async function loadCustomers() {
    showLoading();
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch customers: ${response.status} - ${response.statusText}`);
        }

        const customers = await response.json();
        if (!Array.isArray(customers)) {
            throw new Error('Customers data is not an array');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison
        const expiredCustomers = customers.filter(customer => {
            if (!customer.currentPlan || !customer.currentPlan.expiryDate || !customer.accountStatus) {
                console.warn(`Invalid customer data for ${customer.customerId}:`, customer);
                return false;
            }
            const expiryDate = new Date(customer.currentPlan.expiryDate);
            return expiryDate < today && customer.accountStatus === 'Active';
        });

        displayCustomers(expiredCustomers);
        updateExpiredCount(expiredCustomers.length);
        showTableAndCount();
    } catch (error) {
        showError(error.message);
        console.error('Fetch error:', error);
    }
}

function displayCustomers(customers) {
    customersTableBody.innerHTML = '';

    if (customers.length === 0) {
        customersTableBody.innerHTML = '<tr><td colspan="7" class="text-center">No expired plans found.</td></tr>';
    } else {
        customers.forEach(customer => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${customer.customerId}</td>
                <td>${customer.name}</td>
                <td>${customer.mobile}</td>
                <td>${customer.email}</td>
                <td>${customer.currentPlan.title} (${customer.currentPlan.data}, ₹${customer.currentPlan.price})</td>
                <td>${customer.currentPlan.expiryDate}</td>
                
                    <td><button class="btn btn-primary" onclick="showHistory(${JSON.stringify(customer.rechargeHistory).replace(/"/g, '&quot;')})" data-bs-toggle="modal" data-bs-target="#historyModal">History</button></td>
                
            `;
            customersTableBody.appendChild(row);
        });

        // Add event listeners for History buttons
        document.querySelectorAll('.history-btn').forEach(button => {
            button.addEventListener('click', showHistoryModal);
        });
    }
}

function updateExpiredCount(count) {
    document.getElementById('count').textContent = count;
}

function showHistory(history) {
    const historyContent = document.getElementById("historyContent");
    historyContent.innerHTML = history.map(h => `
        <tr>
            <td>${h.title}</td>
            <td>${h.rechargeDate}</td>
            <td>${h.expiryDate}</td>
            <td>₹${h.price}</td>
        </tr>
    `).join("");
}

// Load customers on page load
document.addEventListener('DOMContentLoaded', loadCustomers);