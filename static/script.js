/*****************************************
 * script.js
 *****************************************/

// Add Sale
async function addSale() {
    const product = document.getElementById("product").value.trim();
    const price = parseFloat(document.getElementById("price").value);
    const quantity = parseInt(document.getElementById("quantity").value);
    const date = document.getElementById("date").value;

    const alertSection = document.getElementById("add-alert");
    alertSection.innerHTML = ""; // Clear any old message

    try {
        const response = await fetch('/add_sale', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product, price, quantity, date })
        });
        const data = await response.json();

        if (data.message) {
            // Success message
            alertSection.innerHTML = `<span style="color: green;">${data.message}</span>`;
            // Clear input fields
            ["product", "price", "quantity", "date"].forEach(id => {
                document.getElementById(id).value = "";
            });

            // Refresh data and best seller
            await loadSalesData();
            await fetchBestSellingItem();
        } else if (data.error) {
            // Error message
            alertSection.innerHTML = `<span style="color: red;">${data.error}</span>`;
        }
    } catch (error) {
        console.error("Error adding sale:", error);
        alertSection.innerHTML = `<span style="color: red;">Error adding sale.</span>`;
    }
}

// Load Sales Data
async function loadSalesData() {
    try {
        // Fetch summary data (for charts)
        const summaryRes = await fetch('/sales_data');
        const summaryData = await summaryRes.json();

        // Fetch the raw sales list for table display
        const salesRes = await fetch('/get_sales');
        const sales = await salesRes.json();

        // Update table
        updateTable(sales);

        // Update charts
        renderChart("revenueChart", "Revenue (SAR)", summaryData.product_revenue);
        renderChart("salesProgressChart", "Total Revenue (SAR)", summaryData.daily_sales);

        // Discount suggestions
        await suggestDiscount();
    } catch (error) {
        console.error("Error loading sales data:", error);
    }
}

// Update Table
function updateTable(sales) {
    const salesTable = document.getElementById("sales-table");
    salesTable.innerHTML = sales.map(sale => {
        const total = (sale.price * sale.quantity).toFixed(2);
        return `
            <tr>
                <td>${sale.product}</td>
                <td>${sale.price.toFixed(2)}</td>
                <td id="quantity-${sale.product}">${sale.quantity}</td>
                <td>${total}</td>
                <td>${sale.date}</td>
                <td>
                    <button class="edit-button" onclick="enableEdit('${sale.product}')"
                            style="font-size: 15px; width: 60px; padding: 2px 5px;">
                        Update
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Enable Edit
function enableEdit(product) {
    const field = document.getElementById(`quantity-${product}`);
    field.innerHTML = `
        <input type="number" value="${field.innerText}" min="1" id="edit-${product}" style="width: 60px;">
        <button onclick="updateQuantity('${product}')" style="font-size: 15px; width: 60px; padding: 2px 5px;">
            Save
        </button>
    `;
}

// Update Quantity
async function updateQuantity(product) {
    const newQuantity = parseInt(document.getElementById(`edit-${product}`).value);
    if (isNaN(newQuantity) || newQuantity < 1) {
        return alert("Please enter a valid quantity!");
    }

    try {
        await fetch('/update_quantity', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ product, quantity: newQuantity })
        });
        await loadSalesData();
    } catch (error) {
        console.error("Error updating quantity:", error);
    }
}

// Suggest Discount
async function suggestDiscount() {
    try {
        const response = await fetch('/suggest_discount');
        const data = await response.json();

        const discountList = document.getElementById("discount-list");
        if (data.discounted_products && data.discounted_products.length > 0) {
            discountList.innerHTML = data.discounted_products
                .map(p => `<li>10% discount on product: ${p}</li>`)
                .join('');
        } else {
            discountList.innerHTML = "<li>No products qualify for a discount at the moment.</li>";
        }
    } catch (error) {
        console.error("Error fetching discount suggestions:", error);
    }
}

// Fetch Best Selling Item
async function fetchBestSellingItem() {
    try {
        // Add timestamp to prevent caching
        const response = await fetch('/best_selling_item?' + new Date().getTime());
        const data = await response.json();

        let bestSellerText;
        if (data.best_selling_item) {
            bestSellerText = `Best Seller: ${data.best_selling_item} (Sold: ${data.quantity_sold})`;
        } else {
            bestSellerText = "No sales data available.";
        }

        document.getElementById("best-selling-item").innerText = bestSellerText;
    } catch (error) {
        console.error("Error fetching best-selling item:", error);
    }
}

// Chart handling
let charts = {}; // to store chart instances

function renderChart(elementId, label, data) {
    // Recreate canvas to clear the old chart
    const canvas = document.getElementById(elementId);
    canvas.parentNode.innerHTML = `<canvas id="${elementId}"></canvas>`;
    const ctx = document.getElementById(elementId).getContext("2d");

    // Destroy old chart instance if exists
    if (charts[elementId]) {
        charts[elementId].destroy();
    }

    // Determine chart type: "line" for salesProgressChart, else "bar"
    const chartType = (elementId === "salesProgressChart") ? "line" : "bar";

    charts[elementId] = new Chart(ctx, {
        type: chartType,
        data: {
            labels: Object.keys(data),
            datasets: [{
                label,
                data: Object.values(data),
                backgroundColor: chartType === "line"
                    ? 'rgba(54, 162, 235, 0.2)'
                    : 'rgba(0, 123, 255, 0.5)',
                borderColor: chartType === "line"
                    ? 'rgba(54, 162, 235, 1)'
                    : 'rgba(0, 123, 255, 1)',
                borderWidth: 2,
                fill: chartType === "line"
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// On page load
window.onload = async () => {
    await loadSalesData();
    await fetchBestSellingItem();
};
