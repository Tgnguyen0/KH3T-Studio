import pymysql

connection = pymysql.connect(
    host='localhost',
    port=3306,
    user='root',
    password='123456',
    database='kredo_studio',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

try:
    with connection.cursor() as cursor:
        cursor.execute("SELECT COUNT(*) as count FROM product WHERE quantity = 0")
        out_of_stock_products = cursor.fetchone()
        print("Out of stock products count:", out_of_stock_products['count'])
        
        cursor.execute("SELECT COUNT(*) as count FROM size_detail WHERE quantity = 0")
        out_of_stock_sizes = cursor.fetchone()
        print("Out of stock size details count:", out_of_stock_sizes['count'])
        
        cursor.execute("""
            SELECT p.product_id, s.name_size, sd.quantity 
            FROM size_detail sd 
            JOIN product p ON sd.product_id = p.product_id 
            JOIN size s ON sd.size_id = s.id 
            WHERE sd.quantity = 0 LIMIT 15
        """)
        rows = cursor.fetchall()
        print("\nFirst 15 out of stock size details (Safe Print):")
        for r in rows:
            print(f"Product #{r['product_id']}: Size {r['name_size']} has Qty {r['quantity']}")
finally:
    connection.close()
