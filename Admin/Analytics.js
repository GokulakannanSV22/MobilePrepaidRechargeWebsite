document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'http://localhost:3000';
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');

    // Check if DOM elements exist
    if (!loadingElement || !errorElement) {
        console.error('Loading or error elements not found');
        return;
    }

    // Function to show loading state
    function showLoading() {
        loadingElement.style.display = 'block';
        errorElement.style.display = 'none';
        document.querySelectorAll('.chart-container').forEach(container => container.style.display = 'none');
    }

    // Function to show error message
    function showError(message) {
        errorElement.textContent = `Error: ${message}`;
        errorElement.style.display = 'block';
        loadingElement.style.display = 'none';
        document.querySelectorAll('.chart-container').forEach(container => container.style.display = 'none');
    }

    // Function to show charts
    function showCharts() {
        document.querySelectorAll('.chart-container').forEach(container => container.style.display = 'block');
        loadingElement.style.display = 'none';
        errorElement.style.display = 'none';
    }

    try {
        showLoading();

        // Load plans
        const plansResponse = await fetch(`${apiUrl}/categories`);
        if (!plansResponse.ok) throw new Error(`Failed to fetch plans: ${plansResponse.status} - ${plansResponse.statusText}`);
        const categories = await plansResponse.json();
        const allPlans = categories.flatMap(category =>
            category.plans.map(plan => ({
                ...plan,
                categoryName: category.name,
                categoryId: category.id
            }))
        );

        // Load customers
        const customersResponse = await fetch(`${apiUrl}/customers`);
        if (!customersResponse.ok) throw new Error(`Failed to fetch customers: ${customersResponse.status} - ${customersResponse.statusText}`);
        const customers = await customersResponse.json();
        if (!Array.isArray(customers)) throw new Error('Customers data is not an array');
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight for accurate comparison
        const expiredCustomers = customers.filter(customer => {
            if (!customer || !customer.currentPlan || !customer.currentPlan.expiryDate || !customer.accountStatus) {
                console.warn(`Invalid customer data for ${customer?.customerId || 'unknown'}:`, customer);
                return false;
            }
            const expiryDate = new Date(customer.currentPlan.expiryDate);
            return !isNaN(expiryDate) && expiryDate < today && customer.accountStatus === 'Active';
        });

        // Render Plan Charts
        renderPlanCharts(allPlans, categories);

        // Render Customer Charts
        renderCustomerCharts(expiredCustomers, customers);

        showCharts();
    } catch (error) {
        showError(error.message);
        console.error('Error fetching or rendering charts:', error);
    }

    function renderPlanCharts(plans, categories) {
        // Check if canvas elements exist before creating charts
        const chartIds = ['planDistributionChart', 'priceDistributionChart', 'ottBenefitsChart'];
        chartIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (!canvas) {
                console.warn(`Canvas with ID '${id}' not found`);
                return;
            }
        });

        // Plan Distribution by Category (Bar Chart)
        const planDistributionData = categories.map(category => ({
            label: category.name,
            value: category.plans.length
        }));
        new Chart(document.getElementById('planDistributionChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: planDistributionData.map(d => d.label),
                datasets: [{
                    label: 'Number of Plans',
                    data: planDistributionData.map(d => d.value),
                    backgroundColor: '#2ecc71',
                    borderColor: '#27ae60',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true, // Keep responsive but limit resizing
                maintainAspectRatio: true, // Ensure fixed aspect ratio to prevent resizing issues
                aspectRatio: 1.5, // Default aspect ratio (width/height) for stability
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Number of Plans' },
                        ticks: { color: '#333' }
                    },
                    x: { ticks: { color: '#333' } }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#ffffff', titleColor: '#333', bodyColor: '#333', borderColor: '#a5d6a7', borderWidth: 1 }
                }
            }
        });

        // Price Distribution of Plans (Pie Chart)
        const priceRanges = { '<500': 0, '500-1000': 0, '>1000': 0 };
        plans.forEach(plan => {
            if (plan.price < 500) priceRanges['<500']++;
            else if (plan.price <= 1000) priceRanges['500-1000']++;
            else priceRanges['>1000']++;
        });
        new Chart(document.getElementById('priceDistributionChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: Object.keys(priceRanges),
                datasets: [{
                    data: Object.values(priceRanges),
                    backgroundColor: ['#2ecc71', '#27ae60', '#a5d6a7']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Fixed aspect ratio for stability
                aspectRatio: 1, // Square aspect ratio for pie charts
                plugins: {
                    legend: { position: 'right', labels: { color: '#333' } },
                    tooltip: { backgroundColor: '#ffffff', titleColor: '#333', bodyColor: '#333', borderColor: '#a5d6a7', borderWidth: 1 }
                }
            }
        });

        // OTT Benefits by Category (Doughnut Chart)
        const ottCounts = {};
        plans.forEach(plan => plan.ottDetails.forEach(ott => {
            ottCounts[ott.platform] = (ottCounts[ott.platform] || 0) + 1;
        }));
        new Chart(document.getElementById('ottBenefitsChart').getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(ottCounts),
                datasets: [{
                    data: Object.values(ottCounts),
                    backgroundColor: ['#2ecc71', '#27ae60', '#a5d6a7', '#f1c40f', '#f44336', '#e91e63']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Fixed aspect ratio for stability
                aspectRatio: 1, // Square aspect ratio for doughnut charts
                plugins: {
                    legend: { position: 'right', labels: { color: '#333' } },
                    tooltip: { backgroundColor: '#ffffff', titleColor: '#333', bodyColor: '#333', borderColor: '#a5d6a7', borderWidth: 1 }
                }
            }
        });
    }

    function renderCustomerCharts(expiredCustomers, allCustomers) {
        // Check if canvas elements exist before creating charts
        const chartIds = ['expiredPlansChart', 'planUsageChart', 'customerPriceChart', 'expirationTrendsChart'];
        chartIds.forEach(id => {
            const canvas = document.getElementById(id);
            if (!canvas) {
                console.warn(`Canvas with ID '${id}' not found`);
                return;
            }
        });

        // Expired Plans by Customer (Bar Chart)
        const expiredData = expiredCustomers.map(customer => ({
            label: customer.name,
            value: 1 // One expired plan per customer
        }));
        new Chart(document.getElementById('expiredPlansChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: expiredData.map(d => d.label),
                datasets: [{
                    label: 'Expired Plans',
                    data: expiredData.map(d => d.value),
                    backgroundColor: '#f44336',
                    borderColor: '#d32f2f',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Fixed aspect ratio for stability
                aspectRatio: 1.5, // Default aspect ratio for bar charts
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Number of Expired Plans' },
                        ticks: { color: '#333' }
                    },
                    x: { ticks: { color: '#333' } }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#ffffff', titleColor: '#333', bodyColor: '#333', borderColor: '#a5d6a7', borderWidth: 1 }
                }
            }
        });

        // Plan Usage by Title (Pie Chart)
        const planUsage = {};
        allCustomers.forEach(customer => {
            const title = customer.currentPlan.title;
            planUsage[title] = (planUsage[title] || 0) + 1;
        });
        new Chart(document.getElementById('planUsageChart').getContext('2d'), {
            type: 'pie',
            data: {
                labels: Object.keys(planUsage),
                datasets: [{
                    data: Object.values(planUsage),
                    backgroundColor: ['#2ecc71', '#27ae60', '#a5d6a7', '#f1c40f']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Fixed aspect ratio for stability
                aspectRatio: 1, // Square aspect ratio for pie charts
                plugins: {
                    legend: { position: 'right', labels: { color: '#333' } },
                    tooltip: { backgroundColor: '#ffffff', titleColor: '#333', bodyColor: '#333', borderColor: '#a5d6a7', borderWidth: 1 }
                }
            }
        });

        // Customer Distribution by Price Range (Bar Chart)
        const priceRanges = { '<500': 0, '500-1000': 0, '>1000': 0 };
        allCustomers.forEach(customer => {
            const price = customer.currentPlan.price;
            if (price < 500) priceRanges['<500']++;
            else if (price <= 1000) priceRanges['500-1000']++;
            else priceRanges['>1000']++;
        });
        new Chart(document.getElementById('customerPriceChart').getContext('2d'), {
            type: 'bar',
            data: {
                labels: Object.keys(priceRanges),
                datasets: [{
                    label: 'Customers',
                    data: Object.values(priceRanges),
                    backgroundColor: '#2ecc71',
                    borderColor: '#27ae60',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Fixed aspect ratio for stability
                aspectRatio: 1.5, // Default aspect ratio for bar charts
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Number of Customers' },
                        ticks: { color: '#333' }
                    },
                    x: { ticks: { color: '#333' } }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#ffffff', titleColor: '#333', bodyColor: '#333', borderColor: '#a5d6a7', borderWidth: 1 }
                }
            }
        });

        // Customer Plan Expirations Over Time (Line Chart)
        const expirationsByMonth = {};
        allCustomers.forEach(customer => {
            const expiryDate = new Date(customer.currentPlan.expiryDate);
            const month = expiryDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            expirationsByMonth[month] = (expirationsByMonth[month] || 0) + 1;
        });
        new Chart(document.getElementById('expirationTrendsChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: Object.keys(expirationsByMonth),
                datasets: [{
                    label: 'Plan Expirations',
                    data: Object.values(expirationsByMonth),
                    borderColor: '#2ecc71',
                    backgroundColor: 'rgba(46, 204, 113, 0.2)',
                    fill: true,
                    tension: 0.4 // Smooth curve for line chart
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, // Fixed aspect ratio for stability
                aspectRatio: 1.5, // Default aspect ratio for line charts
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Number of Expirations' },
                        ticks: { color: '#333' }
                    },
                    x: {
                        ticks: { color: '#333', autoSkip: true, maxTicksLimit: 10 } // Limit labels for readability
                    }
                },
                plugins: {
                    legend: { display: false },
                    tooltip: { backgroundColor: '#ffffff', titleColor: '#333', bodyColor: '#333', borderColor: '#a5d6a7', borderWidth: 1 }
                }
            }
        });
    }
});