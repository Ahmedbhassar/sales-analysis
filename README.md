# Sales Data Analysis — Bootcamp Project 1

This project is a simple sales data analysis system in Python. It satisfies the following Bootcamp Project 1 requirements:

- **At least 3 different data types** (strings, integers, floats)
- **Lists or dictionaries** (`sales_data` is a list of dictionaries; other dictionaries store revenue, etc.)
- **Loops** (e.g., iterating over `sales_data`)
- **Functions returning an output** (e.g., `best_selling_item()`, `suggest_discount()`)
- **Conditions** (e.g., `if not sales_data:` checks for empty lists)
- **A Lambda function** (in `best_selling_item()`, used with `max()` to find the product with the highest quantity sold)

## Core Functions

- **`add_sale()`**  
  Appends new sale data to the `sales_data` list after validating and converting types.
- **`update_quantity()`**  
  Loops over `sales_data` to find a product and update its quantity.
- **`get_sales()`**  
  Returns all current sales data as JSON.
- **`sales_data_chart()`**  
  Computes total revenue per product/day for chart visualization.
- **`suggest_discount()`**  
  Identifies the product with the lowest total revenue (via sorting) for discount purposes.
- **`best_selling_item()`**  
  Uses a **lambda** in `max()` to find which product has the highest total quantity sold.


## Project Structure
- **`app.py`**  
  Main Flask application that handles routes and server logic.
- **`templates/`**  
  Contains HTML templates for the frontend.
- **`static/`**  
  Stores CSS, JavaScript, and any images.
- **`README.md`**  
  Project documentation.

## Installation & Setup
Install the required dependencies:
```bash
pip install flask 
```
##  How to Run
1. Clone the repository:
   
```sh
   git clone https://github.com/Ahmedbhassar/sales-analysis.git
   cd sales-analysis
```
2. Run the Flask app:
   
```sh
   python app.py
```
3. Open http://127.0.0.1:5000/ in your browser.

## Contributors
- https://github.com/Ahmedbhassar
- https://github.com/Emtnan06
- https://github.com/N4seR7
- https://github.com/Hamad-32
