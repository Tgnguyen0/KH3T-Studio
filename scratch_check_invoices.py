import pymysql

connection = pymysql.connect(
    host='localhost',
    user='root',
    password='123456',
    database='kredo_studio',
    charset='utf8mb4',
    cursorclass=pymysql.cursors.DictCursor
)

try:
    with connection.cursor() as cursor:
        print("=== RECENT INVOICES ===")
        cursor.execute("SELECT * FROM invoice")
        invoices = cursor.fetchall()
        for inv in invoices[-5:]:
            print(inv)
            
        print("\n=== RECENT ORDERS ===")
        cursor.execute("SELECT * FROM orders")
        orders = cursor.fetchall()
        for o in orders[-5:]:
            print(o)
finally:
    connection.close()
