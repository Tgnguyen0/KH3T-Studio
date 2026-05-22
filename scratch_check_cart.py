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
        cursor.execute("DESCRIBE cart_detail")
        columns = cursor.fetchall()
        print("Columns in cart_detail:")
        for col in columns:
            print(col['Field'], col['Type'])
            
        cursor.execute("SELECT * FROM cart_detail LIMIT 5")
        rows = cursor.fetchall()
        print("\nRows in cart_detail:")
        for row in rows:
            print(row)
finally:
    connection.close()
