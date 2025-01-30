from flask import Flask, render_template, request, jsonify, send_file
import datetime
import json
import matplotlib.pyplot as plt
import io

app = Flask(__name__)

# Sales data storage (in-memory)
sales_data = []

# Function to add sales
@app.route('/add_sale', methods=['POST'])
def add_sale():
    data = request.json
    product = data.get("product")
    price = float(data.get("price"))
    quantity = int(data.get("quantity"))
    date = datetime.date.today().strftime("%Y-%m-%d")

    sale_record = {
        "product": product,
        "price": price,
        "quantity": quantity,
        "date": date
    }
    sales_data.append(sale_record)
    return jsonify({"message": "Sale added successfully!", "sale": sale_record})

# Function to retrieve all sales
@app.route('/get_sales', methods=['GET'])
def get_sales():
    return jsonify(sales_data)

# Function to calculate total revenue
@app.route('/get_revenue', methods=['GET'])
def get_revenue():
    total_revenue = sum(sale["price"] * sale["quantity"] for sale in sales_data)
    return jsonify({"total_revenue": total_revenue})

# Function to get best-selling product
@app.route('/best_seller', methods=['GET'])
def best_selling_product():
    if not sales_data:
        return jsonify({"message": "No sales data available"})

    product_sales = {}
    for sale in sales_data:
        product_sales[sale["product"]] = product_sales.get(sale["product"], 0) + sale["quantity"]

    best_product = max(product_sales, key=lambda k: product_sales[k])
    return jsonify({"best_seller": best_product, "units_sold": product_sales[best_product]})

# Function to generate a revenue chart
@app.route('/revenue_chart')
def revenue_chart():
    if not sales_data:
        return jsonify({"message": "No sales data available"})

    # Aggregate revenue by product
    product_revenue = {}
    for sale in sales_data:
        revenue = sale["price"] * sale["quantity"]
        product_revenue[sale["product"]] = product_revenue.get(sale["product"], 0) + revenue

    # Generate bar chart
    products = list(product_revenue.keys())
    revenues = list(product_revenue.values())

    plt.figure(figsize=(8, 5))
    plt.bar(products, revenues, color='skyblue')
    plt.xlabel("Products")
    plt.ylabel("Total Revenue ($)")
    plt.title("Revenue by Product")
    plt.xticks(rotation=45)
    plt.tight_layout()

    # Save plot to a byte buffer
    img = io.BytesIO()
    plt.savefig(img, format='png')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')

# Homepage
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
