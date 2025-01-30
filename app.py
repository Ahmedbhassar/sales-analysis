from flask import Flask, render_template, request, jsonify, send_file
import datetime
import matplotlib
matplotlib.use('Agg') 
import matplotlib.pyplot as plt
import io

app = Flask(__name__)

# Dictionary to store sales data
sales_data = []

# Function to add sales
@app.route('/add_sale', methods=['POST'])
def add_sale():
    """
    Adds a new sale record.
    Expected JSON format: {"product": str, "price": float, "quantity": int}
    Should append the sale to 'sales_data' with today's date.
    """
    pass  # To be implemented

# Function to retrieve sales
@app.route('/get_sales', methods=['GET'])
def get_sales():
    return jsonify(sales_data)

# Function to calculate total revenue
@app.route('/get_revenue', methods=['GET'])
def get_revenue():
    """
    Calculates total revenue by summing (price * quantity) for all sales.
    Returns the total revenue as a JSON response.
    """
    pass  # To be implemented


# Ahmed function 1
# Function to generate revenue bar chart
@app.route('/revenue_chart')
def revenue_chart():
    if not sales_data:
        return jsonify({"message": "No sales data available"}), 404
    # Aggregate revenue by product
    product_revenue = {}
    for sale in sales_data:
        revenue = sale["price"] * sale["quantity"]
        product_revenue[sale["product"]] = product_revenue.get(sale["product"], 0) + revenue

    # Sort products by revenue (descending order)
    sorted_products = sorted(product_revenue.items(), key=lambda x: x[1], reverse=True)
    products, revenues = zip(*sorted_products)  # Separate keys and values

    plt.figure(figsize=(8, 5))
    plt.bar(products, revenues, color='royalblue')
    plt.xlabel("Products")
    plt.ylabel("Total Revenue ($)")
    plt.title("Revenue by Product (Sorted)")
    plt.xticks(rotation=45)
    plt.grid(axis="y", linestyle="--", alpha=0.7)
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')
    
# Ahmed function 2
# Function to generate revenue pir chart
@app.route('/product_revenue_distribution')
def product_revenue_distribution():
    if not sales_data:
        return jsonify({"message": "No sales data available"}), 404

    # Aggregate revenue by product
    product_revenue = {}
    for sale in sales_data:
        revenue = sale["price"] * sale["quantity"]
        product_revenue[sale["product"]] = product_revenue.get(sale["product"], 0) + revenue

    # Prepare data for pie chart
    products = list(product_revenue.keys())
    revenues = list(product_revenue.values())

    plt.figure(figsize=(8, 5))
    plt.pie(revenues, labels=products, autopct='%1.1f%%', colors=['#ff9999','#66b3ff','#99ff99','#ffcc99'])
    plt.title("Best-Selling Product Contribution")
    plt.tight_layout()

    img = io.BytesIO()
    plt.savefig(img, format='png', bbox_inches='tight')
    img.seek(0)
    plt.close()

    return send_file(img, mimetype='image/png')





# Homepage
@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
