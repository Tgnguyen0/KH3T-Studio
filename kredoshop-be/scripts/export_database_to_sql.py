import pymysql
import os

def format_value(val):
    if val is None:
        return "NULL"
    elif isinstance(val, (int, float)):
        return str(val)
    elif isinstance(val, (bytes, bytearray)):
        return f"0x{val.hex()}"
    else:
        # Escape string for MySQL
        escaped = str(val).replace('\\', '\\\\').replace("'", "''").replace('\n', '\\n').replace('\r', '\\r')
        return f"'{escaped}'"

def dump_db():
    # Database connection details from application.properties
    config = {
        'host': 'localhost',
        'port': 3306,
        'user': 'root',
        'password': '123456',
        'database': 'kredo_studio',
        'charset': 'utf8mb4'
    }
    
    try:
        conn = pymysql.connect(**config)
        cursor = conn.cursor()
        print("Connected to database successfully. Exporting tables...")
    except Exception as e:
        print(f"Error connecting to database: {e}")
        return
    
    # Tables in correct order to avoid constraint issues during insert
    tables = [
        "customer",
        "account",
        "address",
        "category",
        "product",
        "size",
        "size_detail",
        "wishlist",
        "wishlist_detail",
        "orders",
        "order_detail",
        "invoice",
        "cart",
        "cart_detail",
        "customer_trading"
    ]
    
    # We will write the output to kh3tshop-be/scripts/yame_data.sql
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_path = os.path.join(script_dir, 'yame_data.sql')
    
    try:
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write("CREATE DATABASE IF NOT EXISTS `kredo_studio`;\n")
            f.write("USE `kredo_studio`;\n\n")
            f.write("SET FOREIGN_KEY_CHECKS = 0;\n")
            
            # Truncate tables first (in reverse order of dependencies)
            for table in reversed(tables):
                f.write(f"TRUNCATE TABLE `{table}`;\n")
            f.write("\n")
            
            # Dump data
            for table in tables:
                # Check if table exists
                cursor.execute(f"SHOW TABLES LIKE '{table}'")
                if not cursor.fetchone():
                    continue
                    
                cursor.execute(f"DESCRIBE `{table}`")
                columns = [row[0] for row in cursor.fetchall()]
                
                cursor.execute(f"SELECT * FROM `{table}`")
                rows = cursor.fetchall()
                
                if rows:
                    f.write(f"-- Dumping data for table `{table}`\n")
                    col_names = ", ".join([f"`{col}`" for col in columns])
                    
                    for row in rows:
                        values = ", ".join([format_value(val) for val in row])
                        f.write(f"INSERT INTO `{table}` ({col_names}) VALUES ({values});\n")
                    f.write("\n")
                    
            f.write("SET FOREIGN_KEY_CHECKS = 1;\n")
            
        print(f"SUCCESS: Database successfully exported to: {output_path}")
    except Exception as e:
        print(f"Error during export: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    dump_db()
