
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



async function fetchAllCustomers() {
    try {
        const response = await fetch('http://localhost:3000/customers');
        const customers = await response.json();
        renderTable(customers);
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
}

function renderTable(customers) {
    const tableBody = document.getElementById("table-body");
    tableBody.innerHTML = "";
    customers.forEach(customer => {
        tableBody.innerHTML += `
            <tr>
                <td>${customer.customerId}</td>
                <td>${customer.name}</td>
                <td>${customer.mobile}</td>
                <td>${customer.email}</td>
                <td>${customer.currentPlan.title}</td>
                <td>${customer.currentPlan.data}</td>
                <td>${customer.currentPlan.validity} days</td>
                <td>₹${customer.currentPlan.price}</td>
                <td>${customer.currentPlan.voice}</td>
                <td><span class="badge">${customer.currentPlan.expiryDate}</span></td>
                <td><button class="btn btn-primary" onclick="showHistory(${JSON.stringify(customer.rechargeHistory).replace(/"/g, '&quot;')})" data-bs-toggle="modal" data-bs-target="#historyModal">History</button></td>
            </tr>
        `;
    });
}

document.addEventListener("DOMContentLoaded", fetchAllCustomers);