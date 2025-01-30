function addSale() {
    let product = document.getElementById("product").value;
    let price = document.getElementById("price").value;
    let quantity = document.getElementById("quantity").value;

    fetch("/add_sale", {
        method: "POST",
        body: JSON.stringify({ product, price, quantity }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
        fetchSales(); // Refresh sales records
    });
}

function fetchSales() {
    fetch("/get_sales")
    .then(response => response.json())
    .then(data => {
        let salesList = document.getElementById("sales-list");
        salesList.innerHTML = "";
        data.forEach(sale => {
            let li = document.createElement("li");
            li.textContent = `${sale.date}: ${sale.quantity} x ${sale.product} at $${sale.price}`;
            salesList.appendChild(li);
        });
    });
}

function getRevenue() {
    fetch("/get_revenue")
    .then(response => response.json())
    .then(data => {
        document.getElementById("total-revenue").textContent = `Total Revenue: $${data.total_revenue.toFixed(2)}`;
    });
}

function getBestSeller() {
    fetch("/best_seller")
    .then(response => response.json())
    .then(data => {
        document.getElementById("best-seller").textContent = `Best Seller: ${data.best_seller} (${data.units_sold} units)`;
    });
}

function loadRevenueChart() {
    let chartImage = document.getElementById("chart-image");
    chartImage.src = "/revenue_chart?" + new Date().getTime(); // Prevent caching
    chartImage.style.display = "block";
}
