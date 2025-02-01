from flask import Flask, render_template, request, jsonify
import datetime

app = Flask(__name__)


sales_data = []


@app.route('/add_sale', methods=['POST'])
def add_sale():

    try:
        data = request.get_json() # Get data into dict
        print(data)
        
        # validate all the values and if one of them is None return an error message 
        if not all(data[key] for key in data):
            return jsonify({"error": "Some fields have empty or invalid values!"}), 400
       
        data['price'] = float(data['price']) # Make sure that data type is float
        data['quantity'] = int(data['quantity']) # Make sure that data type is int
        
        
        
        sales_data.append(data)
        print(sales_data)
        return jsonify({"message": "Sale added successfully! ✅", "sale": data}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/update_quantity', methods=['POST'])
def update_quantity():
    data = request.json
    product = data.get("product")
    new_quantity = int(data.get("quantity"))

    for sale in sales_data:
        if sale["product"] == product:
            sale["quantity"] = new_quantity
            return jsonify({"message": "Quantity updated successfully!"})

    return jsonify({"error": "Product not found"}), 404


@app.route('/get_sales', methods=['GET'])
def get_sales():
    return jsonify(sales_data)

@app.route('/sales_data', methods=['GET'])
def sales_data_chart():
    product_revenue = {}
    daily_sales = {}

    for sale in sales_data:


        product = sale["product"]
        date = sale["date"]
        price = sale["price"]
        quantity = sale["quantity"]



        revenue = price * quantity
        product_revenue[product] = product_revenue.get(product, 0) + revenue
        daily_sales[date] = daily_sales.get(date, 0) + revenue

    return jsonify({
        "product_revenue": product_revenue,
        "daily_sales": daily_sales
    })


@app.route('/suggest_discount', methods=['GET'])
def suggest_discount():
    if not sales_data:
        return jsonify({"discounted_products": []})  
    
    product_sales = {}
    for sale in sales_data:
        product_sales[sale["product"]] = product_sales.get(sale["product"], 0) + (sale["quantity"] * sale["price"])
    
    discounted_products = sorted(product_sales, key=product_sales.get)[:1]
    
    return jsonify({"discounted_products": discounted_products})

@app.route('/best_selling_item', methods=['GET'])
def best_selling_item():
    if not sales_data:
        return jsonify({"best_selling_item": None})  # No sales data available

    # Calculate total quantity sold per product
    product_sales = {}
    for sale in sales_data:
        product = sale["product"]
        product_sales[product] = product_sales.get(product, 0) + sale["quantity"]

    # Use a lambda to get the item (key, value) with the highest quantity sold
    
    best_selling_product, best_quantity_sold = max(product_sales.items(), key=lambda item: item[1])

    return jsonify({
        "best_selling_item": best_selling_product,
        "quantity_sold": best_quantity_sold
    })


@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
