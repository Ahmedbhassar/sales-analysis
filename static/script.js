async function addSale() {
    let product = document.getElementById("product").value.trim();
    let price = parseFloat(document.getElementById("price").value);
    let quantity = parseInt(document.getElementById("quantity").value);
    let date = document.getElementById("date").value;

    if (!product || isNaN(price) || isNaN(quantity) || !date) return;

    await fetch('/add_sale', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, price, quantity, date })
    });

    ["product", "price", "quantity", "date"].forEach(id => document.getElementById(id).value = "");
    loadSalesData();
}

async function loadSalesData() {
    let data = await (await fetch('/sales_data')).json();
    updateTable(await (await fetch('/get_sales')).json());
    renderChart('revenueChart', 'Revenue (SAR)', data.product_revenue);
    renderChart('salesProgressChart', 'Total Revenue (SAR)', data.daily_sales);
    suggestDiscount();
}

function updateTable(sales) {
    let salesTable = document.getElementById("sales-table");
    salesTable.innerHTML = sales.map(sale => `
        <tr>
            <td>${sale.product}</td>
            <td>${sale.price.toFixed(2)} SAR</td>
            <td id="quantity-${sale.product}">${sale.quantity}</td>
            <td>${(sale.price * sale.quantity).toFixed(2)} SAR</td>
            <td>${sale.date}</td>
            <td><button onclick="enableEdit('${sale.product}')"style="font-size: 15px; width: 60px; padding: 2px 5px;">Update</button></td>
        </tr>
    `).join('');
}

function enableEdit(product) {
    let field = document.getElementById(`quantity-${product}`);
    field.innerHTML = `<input type="number" value="${field.innerText}" min="1" id="edit-${product}" style="width: 60px;">
                       <button onclick="updateQuantity('${product}')" style="font-size: 15px; width: 60px; padding: 2px 5px;">Save</button>`;
}

async function updateQuantity(product) {
    let newQuantity = parseInt(document.getElementById(`edit-${product}`).value);
    if (isNaN(newQuantity) || newQuantity < 1) return alert("Please enter a valid quantity!");


    await fetch('/update_quantity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, quantity: newQuantity })
    });

    loadSalesData();
}

async function suggestDiscount() {
    let data = await (await fetch('/suggest_discount')).json();
    document.getElementById("discount-list").innerHTML = data.discounted_products.length
        ? data.discounted_products.map(p => `<li> 10% discount on product: ${p}</li>`).join('')
        : "<li>No products qualify for a discount at the moment.</li>";
}


function renderChart(elementId, label, data) {
    new Chart(document.getElementById(elementId).getContext("2d"), {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{ label, data: Object.values(data), backgroundColor: 'rgba(0, 123, 255, 0.5)', borderColor: 'rgba(0, 123, 255, 1)', borderWidth: 1 }]
        }
    });
}

window.onload = loadSalesData;
