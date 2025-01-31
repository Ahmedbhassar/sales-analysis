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
        revenue = sale["price"] * sale["quantity"]
        product_revenue[sale["product"]] = product_revenue.get(sale["product"], 0) + revenue
        daily_sales[sale["date"]] = daily_sales.get(sale["date"], 0) + revenue

    return jsonify({
        "product_revenue": product_revenue,
        "daily_sales": daily_sales
    })


@app.route('/suggest_discount', methods=['GET'])
def suggest_discount():
    today = datetime.date.today()
    last_month = (today - datetime.timedelta(days=30)).strftime("%Y-%m-%d")
    next_month = (today.replace(day=1) + datetime.timedelta(days=31)).replace(day=1).strftime("%Y-%m-%d")

    if not any(sale["date"] >= next_month for sale in sales_data):
        return jsonify({"discounted_products": []})

    product_sales = {sale["product"]: 0 for sale in sales_data if last_month <= sale["date"] < next_month}

    for sale in sales_data:
        if sale["product"] in product_sales:
            product_sales[sale["product"]] += sale["quantity"]

    return jsonify({"discounted_products": sorted(product_sales, key=lambda x: product_sales[x])[:2]})



@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
