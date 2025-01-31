function addSale() {
    let productInput = document.getElementById("product");
    let priceInput = document.getElementById("price");
    let quantityInput = document.getElementById("quantity");

    let product = productInput.value;
    let price = priceInput.value;
    let quantity = quantityInput.value;

    fetch("/add_sale", {
        method: "POST",
        body: JSON.stringify({ product, price, quantity }),
        headers: { "Content-Type": "application/json" }
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);

        // ✅ Clear input fields after successful submission
        productInput.value = "";
        priceInput.value = "";
        quantityInput.value = "";
    });
}

function fetchSales() {
    fetch("/get_sales")
    .then(response => response.json())
    .then(data => {
        let salesList = document.getElementById("sales-list");
        salesList.innerHTML = "";
        salesList.style.display = "block";
        data.forEach(sale => {
            let li = document.createElement("li");
            li.textContent = `${sale.date}: ${sale.quantity} x ${sale.product} at ${sale.price} SAR`;
            salesList.appendChild(li);
        });
    });
}

function getRevenue() {
    fetch("/get_revenue")
    .then(response => response.json())
    .then(data => {
        document.getElementById("total-revenue").textContent = `Total Revenue: ${data.total_revenue.toFixed(2)} SAR`;
    });
}

function loadRevenueChart() {
    let chartImage = document.getElementById("chart-image");
    chartImage.src = "/revenue_chart?" + new Date().getTime();
    chartImage.style.display = "block";
}
function loadProductRevenueChart() {
    let chartImage = document.getElementById("product-revenue-chart");

    // Force reload to prevent caching issues
    chartImage.src = "/product_revenue_distribution?" + new Date().getTime();
    chartImage.style.display = "block";  // Show the image
}


