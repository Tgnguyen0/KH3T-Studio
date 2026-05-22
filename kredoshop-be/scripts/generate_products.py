import urllib.request
import urllib.parse
import json
from datetime import datetime
import time

def translate_text(text):
    if not text:
        return ""
    try:
        # Use free Google Translate API
        url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=vi&dt=t&q=" + urllib.parse.quote(text)
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as r:
            res = json.loads(r.read().decode('utf-8'))
            translated = "".join([item[0] for item in res[0] if item and len(item) > 0 and item[0]])
            return translated
    except Exception as e:
        return text

def main():
    # Fetch 100 products from DummyJSON
    url = "https://dummyjson.com/products?limit=100"
    try:
        print("Downloading 100 products from DummyJSON API...")
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            products = data.get('products', [])
    except Exception as e:
        print(f"Error fetching DummyJSON API: {e}")
        return

    sql_statements = []
    
    # Reset size details and products to clean up
    sql_statements.append("-- Reset old data to prevent foreign key errors")
    sql_statements.append("DELETE FROM size_detail;")
    sql_statements.append("DELETE FROM product;")
    sql_statements.append("ALTER TABLE product AUTO_INCREMENT = 1;")
    sql_statements.append("ALTER TABLE size_detail AUTO_INCREMENT = 1;")
    sql_statements.append("")
    
    sql_statements.append("-- Insert products from DummyJSON (Translated to Vietnamese)")
    
    current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    
    product_id = 1
    total_products = len(products)
    
    for i, p in enumerate(products):
        print(f"Translating product {i+1}/{total_products}...")
        
        # Combine title and description to reduce API calls by half
        combined_text = f"{p['title']} | {p['description']}"
        vi_combined = translate_text(combined_text)
        
        # Split translation
        parts = vi_combined.split("|")
        vi_name = parts[0].strip()
        vi_description = parts[1].strip() if len(parts) > 1 else ""
        
        # Fallback if split failed
        if not vi_description:
            vi_name = p['title']
            vi_description = p['description']
            
        # Clean quotes for SQL
        name = vi_name.replace("'", "''")
        description = vi_description.replace("'", "''")
        
        # Price: convert to VND (roughly price * 25000)
        price = p['price'] * 25000
        cost_price = price
        
        # Images
        image_url = p.get('thumbnail', '')
        if not image_url and p.get('images'):
            image_url = p['images'][0]
            
        rating = p.get('rating', 4.5)
        brand = p.get('brand', 'Generic').replace("'", "''")
        
        # Categorize
        # 1: Top (tops, mens-shirts, womens-dresses)
        # 2: Bottom (womens-shoes, mens-shoes, pants, jeans, shorts)
        # 3: Accessories (everything else)
        cat = p.get('category', '').lower()
        if cat in ['tops', 'mens-shirts', 'womens-dresses']:
            category_id = 1  # Top
        elif cat in ['womens-shoes', 'mens-shoes', 'pants', 'jeans', 'shorts']:
            category_id = 2  # Bottom
        else:
            category_id = 3  # Accessories
            
        sql = (
            f"INSERT INTO product "
            f"(product_id, product_name, description, price, cost_price, unit, quantity, "
            f"image_url_front, image_url_back, created_at, updated_at, brand, rating, category, "
            f"discount_amount, form, material, status) "
            f"VALUES "
            f"({product_id}, '{name}', '{description}', {price}, {cost_price}, 'Cai', 100, "
            f"'{image_url}', '{image_url}', '{current_date}', '{current_date}', '{brand}', {rating}, {category_id}, "
            f"0, 'Regular', 'Mixed', 'ACTIVE');"
        )
        sql_statements.append(sql)
        
        # Map sizes (S, M, L, XL)
        sql_statements.append(f"INSERT INTO size_detail (product_id, size_id, quantity) VALUES ({product_id}, 1, 25);")
        sql_statements.append(f"INSERT INTO size_detail (product_id, size_id, quantity) VALUES ({product_id}, 2, 25);")
        sql_statements.append(f"INSERT INTO size_detail (product_id, size_id, quantity) VALUES ({product_id}, 3, 25);")
        sql_statements.append(f"INSERT INTO size_detail (product_id, size_id, quantity) VALUES ({product_id}, 4, 25);")
        sql_statements.append("")
        
        product_id += 1
        time.sleep(0.15)  # Polite delay
        
    output_path = "scripts/new_products.sql"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(sql_statements))
        
    print(f"Success! 100 Vietnamese products generated at: {output_path}")

if __name__ == "__main__":
    main()
