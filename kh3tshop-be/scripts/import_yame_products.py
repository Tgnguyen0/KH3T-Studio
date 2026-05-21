import urllib.request
import urllib.parse
import json
import re
from datetime import datetime
import time
import pymysql

# Clean HTML helper for description
def clean_html(raw_html):
    if not raw_html:
        return ""
    # Strip HTML tags
    cleanr = re.compile('<.*?>')
    cleantext = re.sub(cleanr, ' ', raw_html)
    # Replace HTML entities
    cleantext = cleantext.replace('&nbsp;', ' ').replace('&amp;', '&').replace('&quot;', '"').replace('&apos;', "'")
    # Replace multiple whitespaces/newlines
    cleantext = re.sub(r'\s+', ' ', cleantext).strip()
    return cleantext

def get_category_id(title, product_type):
    name_to_check = (title + " " + (product_type or "")).lower()
    
    # Category mappings:
    # 1: Top (Áo thun, sơ mi, áo khoác, polo, hoodie, sweater, jacket...)
    # 2: Bottom (Quần, jeans, short, jogger, pants...)
    # 4: Shoes (Giày, dép, sandal, boots, sneakers...)
    # 3: Accessories (Phụ kiện, ví, nón, nịt, balo...)
    
    if any(keyword in name_to_check for keyword in ["áo", "polo", "sơ mi", "hoodie", "sweater", "jacket", "khoác", "cardigan", "thun", "tanktop"]):
        return 1
    elif any(keyword in name_to_check for keyword in ["quần", "jean", "short", "jogger", "trousers", "lót"]):
        return 2
    elif any(keyword in name_to_check for keyword in ["giày", "dép", "sandal", "boots", "sneaker", "guốc"]):
        return 4
    else:
        return 3

def get_form_and_material(title, body_html):
    combined = (title + " " + (body_html or "")).lower()
    
    # Extract form
    form = "Regular"
    if "boxy" in combined:
        form = "Boxy Fit"
    elif "loose" in combined or "rộng" in combined:
        form = "Loose Fit"
    elif "slim" in combined or "ôm" in combined:
        form = "Slim Fit"
    elif "oversize" in combined:
        form = "Oversized"
        
    # Extract material
    material = "Mixed"
    if "cotton" in combined:
        material = "Cotton"
    elif "oxford" in combined:
        material = "Oxford"
    elif "kaki" in combined or "khaki" in combined:
        material = "Kaki"
    elif "denim" in combined or "jean" in combined:
        material = "Denim"
    elif "nỉ" in combined:
        material = "Fleece"
    elif "lụa" in combined or "silk" in combined:
        material = "Silk"
        
    return form, material

def main():
    # 1. Fetch products from YaMe Shopify API (limit 80 to have a rich database)
    url = "https://yame.vn/products.json?limit=80"
    try:
        print("Downloading product data from YaMe.vn API...")
        req = urllib.request.Request(
            url, 
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            products = data.get('products', [])
            print(f"Successfully retrieved {len(products)} products from YaMe.vn")
    except Exception as e:
        print(f"Error fetching YaMe API: {e}")
        return

    if not products:
        print("No products fetched. Exiting.")
        return

    # 2. Connect to MySQL database
    try:
        connection = pymysql.connect(
            host='localhost',
            port=3306,
            user='root',
            password='123456',
            database='kredo_studio',
            charset='utf8mb4',
            cursorclass=pymysql.cursors.DictCursor
        )
        print("Connected to MySQL database 'kredo_studio' successfully")
    except Exception as e:
        print(f"Error connecting to MySQL: {e}")
        return

    try:
        with connection.cursor() as cursor:
            # Modify description column to TEXT to handle long texts
            print("Modifying description column to TEXT...")
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
            cursor.execute("ALTER TABLE product MODIFY COLUMN description TEXT;")
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
            
            # 3. Clean up existing tables to prevent foreign key errors
            print("Cleaning up old database tables...")
            cursor.execute("SET FOREIGN_KEY_CHECKS = 0;")
            
            tables_to_clean = [
                "wishlist_detail", "wishlist", "invoice", "order_detail", 
                "orders", "customer_trading", "cart_detail", "cart", 
                "size_detail", "size", "product"
            ]
            for table in tables_to_clean:
                print(f"Truncating table: {table}")
                cursor.execute(f"TRUNCATE TABLE `{table}`;")
                
            cursor.execute("SET FOREIGN_KEY_CHECKS = 1;")
            connection.commit()
            print("Cleanup completed successfully.")

            # Cache to track sizes dynamically to avoid duplicates
            size_cache = {} # name_size -> size_id
            
            # Preset common sizes to keep IDs clean
            common_sizes = ["S", "M", "L", "XL", "XXL", "38", "39", "40", "41", "42", "ONESIZE"]
            for size_name in common_sizes:
                cursor.execute("INSERT INTO size (name_size) VALUES (%s)", (size_name,))
                size_cache[size_name] = cursor.lastrowid
            
            current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            imported_count = 0
            
            for i, p in enumerate(products):
                title = p.get('title', '')
                body_html = p.get('body_html', '')
                product_type = p.get('product_type', '')
                vendor = p.get('vendor', 'YaMe.vn')
                
                # Check variants
                variants = p.get('variants', [])
                if not variants:
                    continue
                    
                # Clean description
                desc = clean_html(body_html)
                if not desc:
                    desc = title
                
                # Price from first variant
                first_variant = variants[0]
                price = float(first_variant.get('price', 0))
                compare_price = first_variant.get('compare_at_price')
                
                discount_amount = 0.0
                original_price = price
                if compare_price:
                    compare_price_float = float(compare_price)
                    if compare_price_float > price:
                        original_price = compare_price_float
                        discount_amount = round(((compare_price_float - price) / compare_price_float) * 100, 0)
                
                # Images
                images = p.get('images', [])
                img_front = images[0].get('src', '') if len(images) > 0 else ""
                img_back = images[1].get('src', '') if len(images) > 1 else img_front
                
                # Dynamic metadata extraction
                category_id = get_category_id(title, product_type)
                form, material = get_form_and_material(title, body_html)
                
                # Shopify options: determine which option represents Size
                size_option_idx = None
                for idx, opt in enumerate(p.get('options', [])):
                    if opt.get('name', '').lower() in ['size', 'kích thước', 'kích cỡ']:
                        size_option_idx = idx
                        break
                
                is_product_out_of_stock = (imported_count % 8 == 0) # Every 8th product is completely out of stock
                
                size_details_to_insert = []
                added_sizes_for_product = set()
                
                for var in variants:
                    # Get size name
                    size_name = ""
                    if size_option_idx is not None:
                        size_name = var.get(f'option{size_option_idx + 1}', '')
                    else:
                        size_name = var.get('option1', '')
                        
                    size_name = str(size_name).strip().upper()
                    if not size_name or size_name == "DEFAULT TITLE" or size_name == "ONESIZE":
                        size_name = "ONESIZE"
                        
                    # Skip duplicate sizes for the same product
                    if size_name in added_sizes_for_product:
                        continue
                    
                    # Determine size quantity
                    if is_product_out_of_stock:
                        qty = 0
                    else:
                        # Make some specific clothes/shoes sizes out of stock for diversity
                        if size_name in ["S", "38", "39"] and (imported_count % 3 == 0):
                            qty = 0
                        elif size_name in ["XL", "41", "42"] and (imported_count % 4 == 0):
                            qty = 0
                        else:
                            qty = 25
                    
                    size_details_to_insert.append((size_name, qty))
                    added_sizes_for_product.add(size_name)
                
                # Sum size quantities to get total product quantity
                total_product_qty = sum(qty for _, qty in size_details_to_insert)
                
                # Insert Product
                sql_product = """
                    INSERT INTO product (
                        product_name, description, price, cost_price, unit, quantity, 
                        image_url_front, image_url_back, created_at, updated_at, brand, rating, 
                        category, discount_amount, form, material, status
                    ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                """
                
                cursor.execute(sql_product, (
                    title, desc, original_price, price, 'Cai', total_product_qty, 
                    img_front, img_back, current_date, current_date, vendor, 4.5,
                    category_id, discount_amount, form, material, 'ACTIVE'
                ))
                product_id = cursor.lastrowid
                
                # Insert size details
                for size_name, qty in size_details_to_insert:
                    # Ensure size exists in `size` table
                    if size_name not in size_cache:
                        cursor.execute("INSERT INTO size (name_size) VALUES (%s)", (size_name,))
                        size_cache[size_name] = cursor.lastrowid
                        
                    size_id = size_cache[size_name]
                    
                    # Insert size detail
                    sql_size_detail = "INSERT INTO size_detail (product_id, size_id, quantity) VALUES (%s, %s, %s)"
                    cursor.execute(sql_size_detail, (product_id, size_id, qty))
                
                imported_count += 1
                if imported_count % 10 == 0:
                    print(f"Imported {imported_count}/{len(products)} products...")
            
            connection.commit()
            print(f"\nSUCCESS: Imported {imported_count} real products from YaMe.vn into 'kredo_studio' database!")
            
    except Exception as e:
        print(f"Error during import execution: {e}")
        connection.rollback()
    finally:
        connection.close()

if __name__ == "__main__":
    main()
