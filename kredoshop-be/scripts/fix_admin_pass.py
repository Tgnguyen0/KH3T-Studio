import bcrypt
import pymysql

# Tao hash BCrypt cho mat khau '123456'
password = b'123456'
hashed = bcrypt.hashpw(password, bcrypt.gensalt(rounds=10))
hash_str = hashed.decode('utf-8')

# Spring Security dung $2a$, Python bcrypt tao $2b$ - can chuyen doi
hash_spring = hash_str.replace('$2b$', '$2a$')
print('Hash cho Spring ($2a$):', hash_spring)

# Ket noi DB va cap nhat
conn = pymysql.connect(
    host='localhost', port=3306,
    user='root', password='123456',
    database='kredo_studio', charset='utf8mb4'
)
cur = conn.cursor()
cur.execute('UPDATE account SET password = %s WHERE username = %s', (hash_spring, 'admin'))
conn.commit()

cur.execute('SELECT login_id, username, role, status_login, password FROM account WHERE username = %s', ('admin',))
row = cur.fetchone()
print('=== Ket qua ===')
print(f'login_id : {row[0]}')
print(f'username : {row[1]}')
print(f'role     : {row[2]}')
print(f'status   : {row[3]}')
print(f'password : {row[4][:15]}...')
conn.close()
print('Xong! Dang nhap voi: admin / 123456')
