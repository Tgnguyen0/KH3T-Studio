

INSERT INTO customer (customer_id, full_name, phone_number, email, gender, date_of_birth, create_at, update_at, status)
VALUES
    (2, 'Leesin', '0911111111', 'leesin@example.com', 'MALE', '1998-03-14', '2024-10-01', '2024-10-01', 'ACTIVE'),
    (3, 'Erling Halland', '0903333444', 'halland@example.com', 'MALE', '2000-07-21', '2024-10-02', '2024-10-02', 'ACTIVE'),
    (4, 'Jeremy Doku', '0905555666', 'doku@example.com', 'MALE', '1995-10-12', '2024-10-03', '2024-10-03', 'ACTIVE'),
    (5, 'Vinicius Junior', '0907777888', 'vinicious@example.com', 'FEMALE', '1999-01-01', '2024-10-04', '2024-10-04', 'ACTIVE'),
    (6, 'Donnarumma', '0911111333', 'donnarumma@example.com', 'MALE', '1997-08-09', '2024-10-05', '2024-10-05', 'ACTIVE'),
    (7, 'Cristiano Ronaldo', '0912222444', 'cr7@example.com', 'FEMALE', '2001-05-05', '2024-10-06', '2024-10-06', 'ACTIVE'),
    (8, 'Phil Foden', '0913333555', 'foden@example.com', 'MALE', '1996-11-25', '2024-10-07', '2024-10-07', 'ACTIVE'),
    (9, 'Sergio Aguero', '0914444666', 'aguero@example.com', 'MALE', '1988-02-07', '2024-10-08', '2024-10-08', 'INACTIVE'),
    (10, 'Messi', '0915555777', 'messi@example.com', 'MALE', '1994-02-02', '2024-10-09', '2024-10-09', 'ACTIVE');





INSERT INTO account (login_id, create_at, password, role, status_login, update_at, username, customer_id)
VALUES
    (2, '2024-10-01', '$2a$10$pdErrGmqR6k4c2cHmTVrCOoKtQmoR.frS.lAFbvU6e7/Cjbnt98Xi', 'USER', 'ACTIVE', '2024-10-01', 'Leesin', 2),
    (3, '2024-10-02', '$2a$10$UwU6c/qJC6Tg9/ySe5RYLOCtH3pTHzakrVAV0hjRfWzNVCe2kyJni','USER' , 'ACTIVE', '2024-10-02', 'Halland', 3),
    (4, '2024-10-03', '$2a$10$ezcfId8HGRycvLNNEQZdG.hLaSJ4xLvNoi0KRUkBU6tgu6vlKN2n2', 'USER', 'ACTIVE', '2024-10-03', 'Doku', 4),
    (5, '2024-10-04', '$2a$10$p1gJ9SJINENQKTZDp02jFOJVy3p3Aci2CNf1AOjR7.PylbyBtGzVm', 'USER', 'ACTIVE', '2024-10-04', 'Vinicious', 5),
    (6, '2024-10-05', '$2a$10$.7Rcw1esqB3LUK.bgVxmo.7jbWjsuckn4rPd4lGniJJdzyHOCh05i', 'USER', 'ACTIVE', '2024-10-05', 'Donnarumma', 6),
    (7, '2024-10-06', '$2a$10$asqFiSnfasSX4/g2fPID4ec9hxDWHbXDDTlN7FEwRpUjGz4itBlPm', 'USER', 'ACTIVE', '2024-10-06', 'CR7', 7),
    (8, '2024-10-07', '$2a$10$lzBHVSAD78l.eR/xM3IrEe2.iMhRwmuEXgSDrHSpJ0DoaojEMu3b2', 'USER', 'ACTIVE', '2024-10-07', 'Foden', 8),
    (9, '2024-10-08', '$2a$10$It2D4MaWB4Hq5PI9JyaUDu9.bscYWA7er6L3ZVv3B3FJl47ndvgH2', 'USER', 'LOCKED', '2024-10-08', 'Aguero', 9),
    (10, '2024-10-09', '$2a$10$rL7cPLbyOKSb7x/ebJM3CuXvv5wC3Ksa6i6L9D.BCLwq0fg9gxRb.', 'STAFF', 'PENDING', '2024-10-09', 'Lionel Messi', 10);



INSERT INTO address (province, delivery_address, delivery_note, account_id) VALUES
                                                                                ( 'Hà Nội', '123 Đường Giải Phóng, Quận Hai Bà Trưng', 'Giao giờ hành chính', 1),
                                                                                ( 'Hà Nội', '45 Trần Duy Hưng, Cầu Giấy', 'Gọi trước khi giao', 1),
                                                                                ( 'TP. Hồ Chí Minh', '25 Nguyễn Huệ, Quận 1', 'Giao buổi sáng', 2),
                                                                                ( 'TP. Hồ Chí Minh', '120 Lê Văn Sỹ, Quận 3', 'Không giao sau 20h', 2),
                                                                                ( 'Đà Nẵng', '89 Nguyễn Văn Linh, Hải Châu', 'Liên hệ bảo vệ tòa nhà', 3),
                                                                                ( 'Cần Thơ', '56 Nguyễn Trãi, Ninh Kiều', 'Giao nhanh trong ngày', 3),
                                                                                ( 'Hải Phòng', '12 Lạch Tray, Ngô Quyền', 'Để hàng trước cửa', 4),
                                                                                ( 'Thừa Thiên Huế', '77 Hùng Vương, Phường Phú Nhuận', 'Người nhận: Anh Minh', 4),
                                                                                ( 'Bắc Ninh', '09 Nguyễn Gia Thiều, TP. Bắc Ninh', 'Không giao cuối tuần', 5),
                                                                                ( 'Khánh Hòa', '50 Trần Phú, TP. Nha Trang', 'Liên hệ trước 30 phút', 5),
                                                                                ( 'Đồng Nai', '150 Võ Thị Sáu, P. Thống Nhất', 'Có thể giao buổi tối', 6),
                                                                                ( 'Đắk Lắk', '98 Lê Duẩn, TP. Buôn Ma Thuột', 'Giao cho lễ tân', 6),
                                                                                ( 'Bà Rịa - Vũng Tàu', '12 Hạ Long, Phường 2', 'Cần gọi trước khi đến', 7),
                                                                                ( 'Long An', '67 Nguyễn Huệ, Tân An', 'Giao buổi chiều', 7),
                                                                                ( 'Hà Tĩnh', '33 Phan Đình Phùng, TP. Hà Tĩnh', 'Nhà gần trường học', 8),
                                                                                ( 'Quảng Ninh', '88 Trần Quốc Nghiễn, Hạ Long', 'Không gọi cửa', 8),
                                                                                ( 'Thái Nguyên', '120 Cách Mạng Tháng 8, TP. Thái Nguyên', 'Người nhận là bố tôi', 9),
                                                                                ( 'Nam Định', '75 Hùng Vương, TP. Nam Định', 'Có chó dữ, gọi trước', 9),
                                                                                ( 'Hòa Bình', '5 Trần Hưng Đạo, TP. Hòa Bình', 'Nhà cuối ngõ nhỏ', 10),
                                                                                ( 'Bình Dương', '230 Đại lộ Bình Dương, TP. Thủ Dầu Một', 'Công ty ABC, tầng 3', 10);


-- xiu add hinh vao
INSERT INTO category
(category_name, description, image_url, display_order, is_active, created_at, updated_at)
VALUES
    ('Top', 'Các loại áo như áo thun, sơ mi, hoodie...', 'https://i.postimg.cc/LXQSc1jQ/Tops-Size-Chart.png', 1, true, '2025-11-10', '2025-11-10'),
    ('Bottom', 'Các loại quần như jeans, trousers, shorts...', 'https://i.postimg.cc/HsDMRc35/Bottoms-Size-Chart.png', 2, true, '2025-11-10', '2025-11-10'),
    ('Accessories', 'Các loại phụ kiện như ví, mũ, thắt lưng...', 'https://i.postimg.cc/T3QWKkx7/accessires-Sizechart.png', 3, true, '2025-11-10', '2025-11-10');




INSERT INTO product
(product_name, description, price, cost_price, unit, quantity, image_url_front, image_url_back, created_at, updated_at, brand, rating, category, discount_amount, form, material,status)
VALUES
-- 01/11/2025 - Out of stock + 15% off
('Triple Star Small Wallet', 'Compact leather wallet featuring the signature Triple Star logo, perfect for everyday essentials with multiple card slots and a sleek design.',
 350000, 297500, 'piece', 0,
 'https://content.pancake.vn/1/s2360x2950/35/d5/16/04/8a7e15b89251d0132ab9ba5025dbd2f35afaf47ccc47a1bd14541f02-w:2400-h:3000-l:871502-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/06/9c/80/1c/fbbe27ea27340bd2cb3467e91d49a6e0e37f33b6651c1a1422ecf38a-w:2400-h:3000-l:703943-t:image/jpeg.jpeg',
 '2025-11-01', '2025-11-01', 'KH3T', 4.5, 3, 15, NULL, 'Leather', 'ACTIVE'),

-- 02/11/2025 - không giảm giá
('Raw Denim Stitch Baggy Jeans', 'Baggy-fit jeans crafted from premium raw denim with bold contrast stitching along the seams, offering a rugged streetwear vibe and lasting durability.',
 850000, 850000, 'piece', 150,
 'https://content.pancake.vn/1/s2360x2950/88/d3/98/05/f32daa82a82f8cf47c9256f5303cc907852f6f2ad97b0d84cc1e7464-w:2400-h:3000-l:875966-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/21/08/9e/78/4ead1df425b3f0caa19594fc6fd40a9418d15d6aefbf95f7f5e85633-w:2400-h:3000-l:906251-t:image/jpeg.jpeg',
 '2025-11-02', '2025-11-02', 'KH3T', 4.2, 2, 0, 'Baggy Fit', 'Denim Fabric', 'ACTIVE'),

-- 08/11/2025 - không giảm giá
('Washed Jorts', 'Relaxed wide-leg denim shorts with a stonewashed finish, delivering a worn-in feel and laid-back style for summer adventures.',
 580000, 580000, 'piece', 130,
 'https://content.pancake.vn/1/s2360x2950/7d/cb/77/12/3658a18f95a81bbeae63064b0a133ec1055bc1ad173e84f5e9c984a1-w:2400-h:3000-l:942162-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/68/db/26/51/ffaeccd1e4548ea3f0f1f830d0f213d0e3c86bcd18aac3cc9cc347b4-w:2400-h:3000-l:949630-t:image/jpeg.jpeg',
 '2025-11-08', '2025-11-08', 'KH3T', 4.2, 2, 0, 'Wide Leg', 'Washed Denim Fabric', 'ACTIVE'),

-- 09/11/2025 - 30% off
('Hello Kitty | Monogram Laser Baggy Jeans/ Blue', 'Playful baggy jeans featuring laser-etched Hello Kitty monogram patterns on blue denim, blending cute nostalgia with modern street fashion.',
 890000, 623000, 'piece', 160,
 'https://content.pancake.vn/1/s2360x2950/2d/0d/4f/5b/b7f983e37623a32d63d7fe5cbd507f6d829dc81600d6915d71e80215-w:2400-h:3000-l:866495-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/96/a7/4f/07/f07f02a110fb8870cf5fda26b57eacb2be37f28895c25ba31ec28ebc-w:2400-h:3000-l:871816-t:image/jpeg.jpeg',
 '2025-11-09', '2025-11-09', 'KH3T', 4.6, 2, 30, 'Baggy Fit', 'Denim Fabric', 'ACTIVE'),

-- 09/11/2025 - không giảm giá
('Raw Denim Stitch Jorts', 'Raw denim shorts with prominent contrast stitching, offering a bold street-style edge and authentic indigo tones that age beautifully.',
 640000, 640000, 'piece', 120,
 'https://content.pancake.vn/1/s2360x2950/8e/98/0e/8f/d7ee022ef29029292c42392a46119e9d9237a16442183eeb5eb5a337-w:2400-h:3000-l:758044-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/02/c2/d1/77/9c3c25b59550067ac938d6f54d9eaa4ba32a2945d2bbc1d3e07f74c5-w:2400-h:3000-l:699977-t:image/jpeg.jpeg',
 '2025-11-09', '2025-11-09', 'KH3T', 4.3, 2, 0, 'Relaxed Fit', 'Raw Denim Fabric', 'ACTIVE'),

-- 10/11/2025 - không giảm giá
('Triple Star Classic Cap', 'Iconic baseball cap with embroidered Triple Star logo, crafted from durable cotton twill for adjustable fit and all-season wear.',
 350000, 350000, 'piece', 180,
 'https://content.pancake.vn/1/s2360x2950/eb/9d/05/86/c71db778c9fc68b01cfb5567e3aca8afa8cc2f33061aa3320cdfd068-w:3000-h:3750-l:906440-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/c8/95/bd/af/6aa65e15b346e85b3e163c75fe3eb934fb1988f2f4a5b761308666a6-w:3000-h:3750-l:772418-t:image/jpeg.jpeg',
 '2025-11-10', '2025-11-10', 'KH3T', 4.5, 3, 0, NULL, 'Cotton Twill', 'ACTIVE'),

-- 10/11/2025 - Out of stock, không giảm giá
('Drawstring Camo Denim Cargo Pants', 'Functional cargo pants in camo-printed denim with adjustable drawstring waist and multiple pockets for urban utility and style.',
 920000, 920000, 'piece', 0,
 'https://bizweb.dktcdn.net/100/369/010/products/1-78923368-337f-44b9-ac48-be320f783c1e.jpg?v=1759738837640',
 'https://bizweb.dktcdn.net/100/467/832/products/2-b470db82-e71a-4cf9-8e28-62c1c975f57b.jpg?v=1759739709173',
 '2025-11-10', '2025-11-10', 'KH3T', 4.4, 2, 0, 'Cargo Fit', 'Denim Fabric', 'ACTIVE'),




-- 11/11/2025 - 12% off
('Embroidery Relaxed Denim Pants', 'Relaxed-fit jeans adorned with intricate embroidery details, blending artisanal craftsmanship with comfortable wide-leg silhouette.',
 880000, 774400, 'piece', 110,
 'https://bizweb.dktcdn.net/100/369/010/products/1-ff052270-6218-448d-9e38-dcfbf32e70c5.jpg?v=1741776100473',
 'https://bizweb.dktcdn.net/100/369/010/products/2-f30db60a-39e0-44b3-be80-57747ec52a70.jpg?v=1741776104327',
 '2025-11-11', '2025-11-11', 'KH3T', 4.2, 2, 12, 'Relaxed Fit', 'Denim Fabric', 'ACTIVE'),

-- 11/11/2025 - không giảm
('Flame Wash Relaxed Denim Pants Black', 'Black denim pants with flame-washed patterns and relaxed fit, delivering a fiery graphic edge on premium soft fabric.',
 940000, 940000, 'piece', 140,
 'https://bizweb.dktcdn.net/100/369/010/products/1-b659b5cb-f76c-41d1-8dce-997a01600581.jpg?v=1741777532280',
 'https://bizweb.dktcdn.net/100/467/832/products/2-6bf4c748-941f-4ead-a7fb-c8da38116b46.jpg?v=1742283113913',
 '2025-11-11', '2025-11-11', 'KH3T', 4.5, 2, 0, 'Relaxed Fit', 'Washed Denim Fabric', 'ACTIVE'),

-- 11/11/2025 - 18% off
('Embroidery Logo Baggy Denim Shorts - Light Blue', 'Light blue baggy denim shorts featuring embroidered brand logo, perfect for casual summer looks with roomy comfort.',
 620000, 508400, 'piece', 160,
 'https://bizweb.dktcdn.net/100/369/010/products/1-61e699dd-5311-4a93-bf89-6977dae6d0bd.jpg?v=1725529114293',
 'https://bizweb.dktcdn.net/100/467/832/products/2-d999950b-7978-48d5-9840-3f9080110902.jpg?v=1725536248633',
 '2025-11-11', '2025-11-11', 'KH3T', 4.4, 2, 18, 'Baggy Fit', 'Denim Fabric', 'ACTIVE'),

-- 11/11/2025 - không giảm
('Comfy Essential Jeans - Black Wash', 'Essential black wash jeans designed for maximum comfort with stretch denim and a relaxed cut for everyday versatility.',
 820000, 820000, 'piece', 150,
 'https://bizweb.dktcdn.net/100/369/010/products/1-63b26a60-2caf-4f8c-965a-302f4dab30f9.jpg?v=1732678937617',
 'https://bizweb.dktcdn.net/100/369/010/products/2-0fba7023-d6c5-4857-8c90-7467f41b8c37.jpg?v=1732678939560',
 '2025-11-11', '2025-11-11', 'KH3T', 4.3, 2, 0, 'Relaxed Fit', 'Washed Denim Fabric', 'ACTIVE'),

-- 11/11/2025 - 22% off
('Casual Baggy Cargo Pants Black Wash', 'Black wash baggy cargo pants with multiple utility pockets and relaxed fit, ideal for functional yet stylish streetwear outfits.',
 890000, 694200, 'piece', 120,
 'https://bizweb.dktcdn.net/100/369/010/products/1-e5f30f90-2b28-4625-9f96-70d9fbb35806.jpg?v=1736327338300',
 'https://bizweb.dktcdn.net/100/369/010/products/2-eeb798d2-f14e-4433-8fb4-4c9aa6d6a112.jpg?v=1736327341583',
 '2025-11-11', '2025-11-11', 'KH3T', 4.5, 2, 22, 'Baggy Fit', 'Washed Denim Fabric', 'ACTIVE'),

-- 12/11/2025 - không giảm
('Denim Shorts Frayed Logo - Blue Wash', 'Relaxed-fit blue wash denim shorts featuring distressed frayed hem and subtle logo embroidery, perfect for casual summer streetwear.',
 680000, 680000, 'piece', 120,
 'https://bizweb.dktcdn.net/100/467/832/products/1-8103bcdf-a521-4b19-a75c-b18c99f11998.jpg?v=1720699476997',
 'https://bizweb.dktcdn.net/100/467/832/products/2-79ada7b5-89bb-4296-af47-423fb1352857.jpg?v=1720699479787',
 '2025-11-12', '2025-11-12', 'KH3T', 4.4, 2, 0, 'Relaxed Fit', 'Washed Denim Fabric', 'ACTIVE'),

-- 12/11/2025 - 18% off
('Metal Label Wide Trouser Pants – Black', 'Sophisticated wide-leg trousers with premium metal label detail at waistband, crafted from smooth cotton blend for elevated everyday style.',
 890000, 729800, 'piece', 95,
 'https://bizweb.dktcdn.net/100/369/010/products/1-7a91d995-223d-4591-a04b-8523157413be.jpg?v=1726398299700',
 'https://bizweb.dktcdn.net/100/369/010/products/2-5995df67-88ef-4636-a30f-265330c86307.jpg?v=1726398302483',
 '2025-11-12', '2025-11-12', 'KH3T', 4.6, 2, 18, 'Wide Leg', 'Cotton Blend', 'ACTIVE'),

-- 13/11/2025 - không giảm
('Metal Label Wide Trouser Pants - Brown', 'Rich brown wide-leg trousers featuring signature metal label hardware, offering a refined silhouette with premium drape and comfort.',
 890000, 890000, 'piece', 110,
 'https://bizweb.dktcdn.net/100/369/010/products/1-1ff98863-3e2e-45f6-9177-692e17f002e3.jpg?v=1726397680083',
 'https://bizweb.dktcdn.net/100/369/010/products/2-1379b03d-4fd4-4d5e-a30b-4cd641c9b631.jpg?v=1726397682967',
 '2025-11-13', '2025-11-13', 'KH3T', 4.5, 2, 0, 'Wide Leg', 'Cotton Blend', 'ACTIVE'),

-- 13/11/2025 - 22% off + Out of stock
('Metal Label Wide Trouser Pants - Cream', 'Cream wide-leg trousers with minimalist metal label accent, delivering clean lines and luxurious fabric feel for versatile styling.',
 890000, 694200, 'piece', 0,
 'https://bizweb.dktcdn.net/100/369/010/products/1-2ed36f1c-2507-4a3a-8acb-6ce2bfd771aa.jpg?v=1726398721743',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS9jLiIJIHii2xenDaBg78NAxrpNhikLpB1Kh14oE2C40EUrUgG2WkIKdNMvVe9xJlm0Pc&usqp=CAU',
 '2025-11-13', '2025-11-13', 'KH3T', 4.7, 2, 22, 'Wide Leg', 'Cotton Blend', 'ACTIVE'),






('Distressed Double Knee Denim Pants Brown', 'Heavy-duty brown denim pants with reinforced double-knee panels and heavy distressing, built for durability and rugged aesthetic.',
 950000, 950000, 'piece', 80,
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ_KFncXizxH15A3rEN3Z7VHmzjgfwzRO6nTw&s',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRE9nCGdkk14Hb4iiRe7dlAB6LINbgvrSbT0w&s',
 '2025-11-14', '2025-11-14', 'KH3T', 4.3, 2, 0, 'Relaxed Fit', 'Heavy Denim Fabric', 'ACTIVE'),

('Big Pounch Cargo Pants - Black', 'Functional black cargo pants with oversized flap pockets and adjustable drawstring hems, combining utility with modern street style.',
 980000, 833000, 'piece', 105,
 'https://bizweb.dktcdn.net/100/369/010/products/1-c4255c5d-cd9c-4edc-8df2-17f047355d56.jpg?v=1736418044923',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDVIOs1hKOM42HjRqfT1HxOPDDfsA_MUWc1Q&s',
 '2025-11-14', '2025-11-14', 'KH3T', 4.6, 2, 15, 'Cargo Fit', 'Cotton Canvas', 'ACTIVE'),

('Big Pounch Cargo Pants - Brown', 'Earth-tone brown cargo pants featuring massive pouch pockets and reinforced stitching, perfect for urban explorers.',
 980000, 784000, 'piece', 0,
 'https://bizweb.dktcdn.net/100/369/010/products/quan-baggy.jpg?v=1736490285537',
 'https://bizweb.dktcdn.net/100/369/010/products/2-94d0cee4-3780-442d-bdc0-66f35726b62d.jpg?v=1736490285537',
 '2025-11-15', '2025-11-15', 'KH3T', 4.5, 2, 20, 'Cargo Fit', 'Cotton Canvas', 'ACTIVE'),

('Hello Kitty | Bow Jorts/ Blue', 'Playful blue denim shorts adorned with Hello Kitty bow embroidery and pearl details, blending cute aesthetics with streetwear edge.',
 720000, 540000, 'piece', 130,
 'https://content.pancake.vn/1/s2360x2950/23/77/e2/f4/5fa6d0958119c7d9a0e7243849ae0c54876ee93d5339d1d6ed0b491d-w:2400-h:3000-l:897588-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/01/62/4b/81/bda4573fd2fff64c4e260cca1fe1cf987b47b025237de4635cd2097b-w:2400-h:3000-l:967700-t:image/jpeg.jpeg',
 '2025-11-15', '2025-11-15', 'KH3T', 4.8, 2, 25, 'Relaxed Fit', 'Denim Fabric', 'ACTIVE'),

('Triple Star Classic Sweatpants', 'Ultra-comfortable fleece-lined sweatpants with embroidered Triple Star logo, featuring tapered fit and ribbed cuffs for all-day lounge.',
 690000, 690000, 'piece', 160,
 'https://content.pancake.vn/1/s2360x2950/c6/3f/04/20/7a30518ecbc3b781e3db726af59cd1dfbac6e9a11de1f20fecfe876e-w:2400-h:3000-l:1119144-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/e7/e2/6e/51/45a422a26ade71454c176e31e57d6984e38d840b11490b4f1b1d4f45-w:2400-h:3000-l:621510-t:image/jpeg.jpeg',
 '2025-11-16', '2025-11-16', 'KH3T', 4.7, 2, 0, 'Tapered Fit', 'French Terry', 'ACTIVE'),

('Comfy Essential Jeans - Moss Blue', 'Everyday essential jeans in unique moss blue wash with added stretch for superior comfort and modern relaxed fit.',
 850000, 850000, 'piece', 140,
 'https://bizweb.dktcdn.net/100/369/010/products/177.jpg?v=1720499117420',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRyTDSDX6Y2deWIdL9umM7FzN1q5VdqZb6Rcg&s',
 '2025-11-16', '2025-11-16', 'KH3T', 4.4, 2, 0, 'Relaxed Fit', 'Stretch Denim', 'ACTIVE'),

-- 17/11/2025 - Áo (category = 1)
('Polo Cross / Light Grey Green', 'Premium cotton pique polo with embroidered cross motif and subtle two-tone collar, perfect for smart-casual looks.',
 580000, 580000, 'piece', 180,
 'https://product.hstatic.net/200000306799/product/apf7001_2_e1a1dc9984db4ff9a0c3fad5ee225e40_master.jpg',
 'https://product.hstatic.net/200000306799/product/apf7001_3_a4ae9ae0605a4e2dbfe846f619007434_master.jpg',
 '2025-11-17', '2025-11-17', 'KH3T', 4.6, 1, 0, 'Relaxed Fit', 'Cotton Pique', 'ACTIVE'),

('Polo Devil Meow / Black', 'Edgy black polo featuring playful devil cat embroidery and contrast piping, blending cute and rebellious style.',
 620000, 434000, 'piece', 0,
 'https://product.hstatic.net/200000306799/product/46935144-ca96-4bc5-80a4-22a81568f011_3cc99d970d434917a974609a45a85cb1_master.jpeg',
 'https://product.hstatic.net/200000306799/product/4e74cb99-f35f-492a-b30f-5ff001f46393_75830af0db9a4e6db074a87955faa1ef_master.jpeg',
 '2025-11-17', '2025-11-17', 'KH3T', 4.8, 1, 30, 'Relaxed Fit', 'Cotton Pique', 'ACTIVE'),

('Striped Long Sleeve Boxy Polo Shirt', 'Boxy-fit long-sleeve polo with bold horizontal stripes and dropped shoulders for contemporary oversized aesthetic.',
 650000, 572000, 'piece', 155,
 'https://content.pancake.vn/1/s2360x2950/b3/af/03/96/b8461d2219e55c4aaaa43b0f2d6d216133b4c96fffe015151eff03ca-w:3000-h:3750-l:971270-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/11/35/52/a9/2d2c1ae91216a975a2534cb3c5c0ddea042f47476d6ae141e052ab41-w:3000-h:3750-l:931232-t:image/jpeg.jpeg',
 '2025-11-18', '2025-11-18', 'KH3T', 4.5, 1, 12, 'Boxy Fit', 'Cotton Blend', 'ACTIVE'),





('Seasonal Long Sleeve Boxy Tee', 'Seasonal oversized long-sleeve tee with premium heavy cotton and relaxed boxy silhouette for ultimate comfort.',
 550000, 550000, 'piece', 200,
 'https://content.pancake.vn/1/s2360x2950/ac/7e/2d/d2/11a51615a03a8918bda28100852b0ec9783634c7c43beaa4cf2103f7-w:3000-h:3750-l:908357-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/37/4b/a7/b8/24696108471b7b6be6fdc4d73c64db26d661fc7f8d1cc33a81d3d0fd-w:3000-h:3750-l:860739-t:image/jpeg.jpeg',
 '2025-11-18', '2025-11-18', 'KH3T', 4.6, 1, 0, 'Oversized', 'Heavy Cotton', 'ACTIVE'),

('Hello Kitty | Champion Oversized Jersey/ White', 'Limited collab oversized jersey featuring Hello Kitty as champion with vintage sportswear aesthetic and mesh fabric.',
 780000, 507000, 'piece', 90,
 'https://content.pancake.vn/1/s2360x2950/72/73/3b/4b/df679a1a9c944c3c52997502b841560340b41bc31608676c9a813004-w:3000-h:3750-l:796197-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/82/6c/35/d7/d895af27de2b34d68c2ab62836ba01c74c4d5523409753bdddd5fd43-w:3000-h:3750-l:718306-t:image/jpeg.jpeg',
 '2025-11-19', '2025-11-19', 'KH3T', 4.9, 1, 35, 'Oversized', 'Mesh Polyester', 'ACTIVE'),

-- 17/11/2025 - Phụ kiện (category = 3)
('Crossbody Bag - Black', 'Minimalist black crossbody bag with adjustable strap and multiple compartments, crafted from premium vegan leather.',
 680000, 680000, 'piece', 140,
 'https://bizweb.dktcdn.net/100/369/010/products/176-2.jpg?v=1752240418253',
 'https://bizweb.dktcdn.net/100/369/010/products/1-a520ece2-fb41-40f8-859d-38af590ce278.jpg?v=1737541346127',
 '2025-11-17', '2025-11-17', 'KH3T', 4.7, 3, 0, NULL, 'Vegan Leather', 'ACTIVE'),

('Logo Patches Crossbody Bag Silver', 'Statement silver crossbody bag covered in tonal logo patches, featuring chain strap and magnetic closure.',
 920000, 782000, 'piece', 75,
 'https://bizweb.dktcdn.net/100/369/010/products/1-dadae622-ed5f-4a26-b279-a67f28bad643.jpg?v=1737541393880',
 'https://bizweb.dktcdn.net/100/369/010/products/2-8b83d771-31ca-487d-9575-c7c62733242f.jpg?v=1737541396687',
 '2025-11-17', '2025-11-17', 'KH3T', 4.8, 3, 15, NULL, 'Metallic PU', 'ACTIVE'),

('Striped Trucker Hat', 'Classic trucker hat with bold striped pattern and embroidered logo patch, featuring breathable mesh back.',
 380000, 285000, 'piece', 0,
 'https://content.pancake.vn/1/s2360x2950/a1/ac/ef/13/9eb5e58568dd3f8a9170e178045d0c48ded465c6da5bd9abada1571b-w:3000-h:3750-l:941366-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/5e/02/46/9c/136f676cc6f2e3846ec72b9cea8ff5126e33d9735466403358d500cb-w:3000-h:3750-l:695373-t:image/jpeg.jpeg',
 '2025-11-17', '2025-11-17', 'KH3T', 4.5, 3, 25, NULL, 'Cotton Twill & Mesh', 'ACTIVE'),

-- Áo mới (category = 1)
('Floral Silhouette Shirt Tan', 'Lightweight tan button-up shirt featuring subtle all-over floral silhouette print, crafted from breathable rayon for effortless summer layering.',
 720000, 720000, 'piece', 135,
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAQgE18Mu4hxOVW4YlVjBw2EmtIN5y_Gdpjg&s',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSARC_wvFag-dm61YSY3mXqhvsmHXDbZbA_aQ&s',
 '2025-11-22', '2025-11-22', 'KH3T', 4.6, 1, 0, 'Regular Fit', 'Rayon Blend', 'ACTIVE'),

('Soccer Jersey Dico Seven Red Green', 'Vibrant red-green soccer jersey with bold "Dico Seven" graphic and retro numbering, made from moisture-wicking mesh for on-and-off field wear.',
 680000, 489600, 'piece', 0,
 'https://bizweb.dktcdn.net/100/369/010/products/1-9a732fc5-1729-4cc8-9bfc-f2d40e062eef.jpg?v=1751626104677',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo_Ckp4uN5WLNS03HpalrhG1ecv9HFl12hDw&s',
 '2025-11-22', '2025-11-22', 'KH3T', 4.7, 1, 28, 'Athletic Fit', 'Polyester Mesh', 'ACTIVE'),

('Striped Soccer Jersey Baby Blue White', 'Clean baby blue and white striped soccer jersey with minimal branding, featuring lightweight fabric and classic athletic cut.',
 650000, 552500, 'piece', 160,
 'https://bizweb.dktcdn.net/100/369/010/products/1-a9b76695-2d0b-439c-9764-9b37cbecf804.jpg?v=1743234415570',
 'https://bizweb.dktcdn.net/100/369/010/products/2-e3bdbffe-3995-46cd-ad91-34c7c87e38b2.jpg?v=1743234418537',
 '2025-11-22', '2025-11-22', 'KH3T', 4.5, 1, 15, 'Athletic Fit', 'Polyester Mesh', 'ACTIVE'),

('Western Logo Print T-Shirt Green', 'Bold forest green tee with oversized western-inspired logo graphic across chest, crafted from premium heavy-weight cotton.',
 520000, 520000, 'piece', 190,
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpg5EZssL56aXhYc8K_BSLu5sO3wX7kigTFA&s',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTPIRp4y2hMwCur6um5giAioeXqwyKqMkIhSA&s',
 '2025-11-22', '2025-11-22', 'KH3T', 4.6, 1, 0, 'Regular Fit', 'Heavy Cotton', 'ACTIVE'),







('Striped Baseball Jersey', 'Classic varsity-style baseball jersey with contrasting raglan sleeves and bold horizontal stripes, perfect for streetwear layering.',
 780000, 624000, 'piece', 110,
 'https://content.pancake.vn/1/s2360x2950/3d/86/7c/ae/4d423b313e606e351314df249b8ba865157bf42ede249ea1b9a5807a-w:3000-h:3750-l:971406-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/b5/97/aa/b7/5e4fea4c171ea9c104dad6896e77ce4500ce75e51c675fdb4c04f4f0-w:3000-h:3750-l:1002130-t:image/jpeg.jpeg',
 '2025-11-14', '2025-11-14', 'KH3T', 4.8, 1, 20, 'Relaxed Fit', 'Cotton-Poly Blend', 'ACTIVE'),

('Meow Walking Tee / Navy Peony', 'Playful navy tee featuring cute cat walking graphic with premium soft-touch cotton and relaxed silhouette.',
 490000, 333200, 'piece', 0,
 'https://product.hstatic.net/200000306799/product/atf1003_2_9b0a2a85fe2948ae9bc11e0ce551bc69_master.jpg',
 'https://product.hstatic.net/200000306799/product/atf1003_3_dcbb689891ab4e35ad4f68dc40bb77fd_master.jpg',
 '2025-11-13', '2025-11-13', 'KH3T', 4.7, 1, 32, 'Regular Fit', 'Premium Cotton', 'ACTIVE'),

('Teddy Bear Tee / Black Color', 'Statement black oversized tee with adorable teddy bear front print, made from ultra-soft heavyweight fabric.',
 550000, 550000, 'piece', 145,
 'https://product.hstatic.net/200000306799/product/2_143b60605c0f4e8ca7b36ecd7867d3c9_master.jpg',
 'https://product.hstatic.net/200000306799/product/3_288f58c38ed14058adfde4b8e127bd49_master.jpg',
 '2025-11-12', '2025-11-12', 'KH3T', 4.9, 1, 0, 'Oversized', 'Heavy Cotton', 'ACTIVE'),

('Butterfly Catalog Semi-Oversized Tee/ White', 'Clean white semi-oversized tee featuring delicate butterfly catalog artwork on back, perfect minimalist statement piece.',
 580000, 475600, 'piece', 98,
 'https://content.pancake.vn/1/s2360x2950/ff/9f/5f/c3/9b6838d40d92da9f19f392372d95e060d26065662fbf30849e3497be-w:3000-h:3750-l:808040-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/bd/20/65/80/20541c54038ca239c93367117b50e36ee96a4adea3e913a4760bfae0-w:3000-h:3750-l:575562-t:image/jpeg.jpeg',
 '2025-11-11', '2025-11-11', 'KH3T', 4.8, 1, 18, 'Semi-Oversized', 'Premium Cotton', 'ACTIVE'),

-- 10/12/2025 – Áo (category = 1)
('DC | DBZ Dragon Team T-Shirt – Cream', 'Official Dragon Ball Z collab cream tee featuring the iconic Dragon Team lineup print, crafted from soft premium cotton for ultimate comfort.',
 620000, 620000, 'piece', 180,
 'https://bizweb.dktcdn.net/100/369/010/products/1-f8b81647-8262-45ea-8fe1-157a58b14b52.jpg?v=1728381392290',
 'https://bizweb.dktcdn.net/100/369/010/products/2-82cae8ec-c80e-4521-acb1-b8969b6b8578.jpg?v=1728381393247',
 '2025-12-10', '2025-12-10', 'KH3T', 4.9, 1, 0, 'Regular Fit', 'Premium Cotton', 'ACTIVE'),

('OP Chopper Fly T-shirt - Black', 'One Piece limited black tee with Tony Tony Chopper in flight graphic, made from heavyweight cotton for a bold streetwear statement.',
 580000, 435000, 'piece', 0,
 'https://bizweb.dktcdn.net/100/369/010/products/dm-20230726160855-001-copy.jpg?v=1690373784267',
 'https://bizweb.dktcdn.net/100/369/010/products/dm-20230726160901-001-copy.jpg?v=1690373784267',
 '2025-12-10', '2025-12-10', 'KH3T', 4.8, 1, 25, 'Regular Fit', 'Heavy Cotton', 'ACTIVE'),

('Hustling Boxy T-Shirt Red', 'Motivational red boxy tee with oversized “Hustling” script across chest, cut from ultra-soft cotton for relaxed everyday wear.',
 550000, 467500, 'piece', 165,
 'https://bizweb.dktcdn.net/100/369/010/products/1-fd43c297-72f0-4023-bc4b-8e3276374c2a.jpg?v=1750677473007',
 'https://bizweb.dktcdn.net/100/369/010/products/2-80286a2b-1904-480d-883a-02050c458480.jpg?v=1750677477823',
 '2025-12-11', '2025-12-11', 'KH3T', 4.7, 1, 15, 'Boxy Fit', 'Soft Cotton', 'ACTIVE'),

('Cobruhh T-Shirt White', 'Clean white tee featuring minimalist “Cobruhh” embroidery on chest, crafted from premium ring-spun cotton for a luxury feel.',
 520000, 520000, 'piece', 200,
 'https://bizweb.dktcdn.net/100/369/010/products/1-3fa58a7c-2267-4d53-b438-fe74be07868a.jpg?v=1733833124683',
 'https://bizweb.dktcdn.net/100/369/010/products/2-9601a5a4-d84a-4a8c-9616-73270f3c2421.jpg?v=1733833128130',
 '2025-12-11', '2025-12-11', 'KH3T', 4.6, 1, 0, 'Regular Fit', 'Ring-Spun Cotton', 'ACTIVE'),

('Hello Kitty | Striped Baseball Jersey/ Red', 'Cute-yet-bold red striped baseball jersey from Hello Kitty collab, featuring varsity lettering and breathable mesh panels.',
 820000, 574000, 'piece', 95,
 'https://content.pancake.vn/1/s2360x2950/27/b8/ea/c4/5589ed46b68cd62e58853bc3825302bcbd22d5406b360b0ec7c0086e-w:3000-h:3750-l:956728-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/d1/b9/1a/33/8cc1a96183f1237a9a5f28438fd90485335b084134bc1b0b9951c61a-w:3000-h:3750-l:911340-t:image/jpeg.jpeg',
 '2025-12-12', '2025-12-12', 'KH3T', 4.9, 1, 30, 'Relaxed Fit', 'Cotton Mesh', 'ACTIVE'),




('Raglan Fearow Basic 2023 / Black & Gray', 'Timeless raglan tee in black & gray contrast sleeves with small Fearow embroidery, made from soft tri-blend fabric.',
 590000, 472000, 'piece', 0,
 'https://product.hstatic.net/200000306799/product/apf7006_1_6f0d8f73042a405ea12b01f965560d30_master.jpg',
 'https://product.hstatic.net/200000306799/product/apf7006_2_4328c2b3a6e64fb9b1a0e6f0002e09cd_master.jpg',
 '2025-12-12', '2025-12-12', 'KH3T', 4.7, 1, 20, 'Regular Fit', 'Tri-Blend', 'ACTIVE'),

('MULTIFONT TEE / DARK BROWN COLOR', 'Dark brown tee showcasing experimental multi-font typography artwork on front and back, cut from heavyweight cotton.',
 610000, 610000, 'piece', 140,
 'https://product.hstatic.net/200000306799/product/2__1__470bc0def4ca468c81abf6613a6b461d_master.jpg',
 'https://product.hstatic.net/200000306799/product/3__1__0e4f3840e6b14ed9b681e9c4fdb9596d_master.jpg',
 '2025-12-13', '2025-12-13', 'KH3T', 4.6, 1, 0, 'Regular Fit', 'Heavy Cotton', 'ACTIVE'),

('Seasonal Polkadot Semi-Oversized Tee/ Black', 'Playful black semi-oversized tee covered in tonal polkadot pattern with subtle chest logo, perfect for effortless cool.',
 640000, 524800, 'piece', 155,
 'https://content.pancake.vn/1/s2360x2950/a8/80/96/05/83a5b0a1862b5b25a07ef46ddb1d9a55e3ec6a70d8ad86a7e2ae8c77-w:3000-h:3750-l:957249-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/1e/61/3e/32/eab65a3797d1633c2dd1f5f36e764af674a5b737cc8f7264daecda5b-w:3000-h:3750-l:814402-t:image/jpeg.jpeg',
 '2025-12-13', '2025-12-13', 'KH3T', 4.8, 1, 18, 'Semi-Oversized', 'Premium Cotton', 'ACTIVE'),

('Dream Maker Raglan Oversized Tee', 'Inspirational oversized raglan tee with “Dream Maker” script and contrast sleeves, crafted from ultra-soft French terry.',
 680000, 680000, 'piece', 120,
 'https://content.pancake.vn/1/s2360x2950/e2/b2/8e/c9/27a013ef89495266cf942e540f71db4c836b0bb6c942f596abbeaf01-w:3000-h:3750-l:713840-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/55/83/17/41/87f4cdeed9be63e1e3d546eb18a0fa608af8fa57873da45b2dd9c216-w:3000-h:3750-l:748780-t:image/jpeg.jpeg',
 '2025-12-14', '2025-12-14', 'KH3T', 4.7, 1, 0, 'Oversized', 'French Terry', 'ACTIVE'),

('Soccer Jersey Wild Fire Green', 'Fiery green soccer jersey with flame-inspired graphics and lightweight performance mesh, built for style and movement.',
 720000, 561600, 'piece', 110,
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSn71GdGaExEnM8osHx8DqaZVeFgwlUMPhd3Q&s',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSjFcaxFsEW6mQcMPWQGN92lHgkKlHUU01S_g&s',
 '2025-12-14', '2025-12-14', 'KH3T', 4.8, 1, 22, 'Athletic Fit', 'Performance Mesh', 'ACTIVE'),

('"Y" Embroidered Denim Shirt Black', 'Premium black denim shirt with tonal “Y” chain-stitch embroidery on chest pocket, featuring raw-edge details and relaxed fit.',
 980000, 705600, 'piece', 85,
 'https://bizweb.dktcdn.net/100/369/010/products/1-a642d2e3-92bf-4a0e-9233-306da7157187.jpg?v=1750141568607',
 'https://cdn.shopify.com/s/files/1/0066/0360/4086/files/53fb65eab3254388bb9eef3b88e38e93.jpg?v=1750317810',
 '2025-12-15', '2025-12-15', 'KH3T', 4.9, 1, 28, 'Relaxed Fit', 'Denim Fabric', 'ACTIVE'),

('Bình Tân Embroidered Polo Black', 'Signature black polo with delicate “Bình Tân” embroidery on chest, crafted from breathable cotton pique for elevated casual wear.',
 690000, 448500, 'piece', 0,
 'https://bizweb.dktcdn.net/100/369/010/products/1-3d8fd54a-355a-4ead-8877-957986552312.jpg?v=1743575741267',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy8Ij4FRD4SmUCtlFxq4dte3kDq2X5TuhX3w&s',
 '2025-12-15', '2025-12-15', 'KH3T', 4.7, 1, 35, 'Relaxed Fit', 'Cotton Pique', 'ACTIVE'),

('Final Things Tee / Green', 'Bold forest-green tee featuring striking “Final Things” graphic on chest and back, crafted from soft heavyweight cotton for a premium streetwear feel.',
 580000, 580000, 'piece', 175,
 'https://content.pancake.vn/1/s2360x2950/6a/7c/8f/d4/64ad8aa2b9a66506a77083c346dc7027b3ac182e715a48069388e42c-w:3000-h:3750-l:973701-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/2c/85/a4/6c/c765a69d4cb26539f26396dc05a38e5b5b2c7d7c44c82474b2bfc13d-w:3000-h:3750-l:828099-t:image/jpeg.jpeg',
 '2025-12-16', '2025-12-16', 'KH3T', 4.8, 1, 0, 'Regular Fit', 'Heavyweight Cotton', 'ACTIVE'),



('Global Raglan Tee', 'Clean raglan-sleeve tee with subtle “Global” chest embroidery and contrast sleeves, made from ultra-soft tri-blend fabric for all-day comfort.',
 620000, 446400, 'piece', 0,
 'https://content.pancake.vn/1/s2360x2950/9e/34/db/a1/4222458a0fa0c6a1c4af86ed8448e791a9a25108e5db74f47dde04de-w:3000-h:3750-l:914644-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/8c/9e/a0/fe/2e4902a9de89817a6c449aba3ad897c8b8f8c235556fc41bf87bddba-w:3000-h:3750-l:895685-t:image/jpeg.jpeg',
 '2025-12-16', '2025-12-16', 'KH3T', 4.7, 1, 28, 'Regular Fit', 'Tri-Blend', 'ACTIVE'),

('Authentic Knitted Semi-Oversized Polo', 'Luxurious knitted polo with semi-oversized silhouette, featuring ribbed collar and subtle tonal stitching for elevated casual style.',
 890000, 756500, 'piece', 110,
 'https://content.pancake.vn/1/s2360x2950/34/8d/ae/68/807e2f9d7582017814cf60bb0ee6f0dc8017640238b65ae4e0a69952-w:3000-h:3750-l:893680-t:image/jpeg.jpeg',
 'https://content.pancake.vn/1/s2360x2950/ea/fd/81/61/9e70c74121eff09cb59179814749c920329ed6d02e49aca8b73a84d3-w:3000-h:3750-l:877497-t:image/jpeg.jpeg',
 '2025-12-17', '2025-12-17', 'KH3T', 4.9, 1, 15, 'Semi-Oversized', 'Knitted Cotton', 'ACTIVE'),

('WorldWide Tee / Mint Color', 'Fresh mint tee with clean “WorldWide” front print and minimal back hit, crafted from soft-touch premium cotton for everyday wear.',
 550000, 550000, 'piece', 190,
 'https://product.hstatic.net/200000306799/product/z3122227538922_3b2263800ea95cf6808ae5a4d91c527f_c92a5a812acd4eb88909fdd1788a04e3_master.jpg',
 'https://product.hstatic.net/200000306799/product/z3122227538949_335494c173f8aadf8384885e59ca1a24_854291a9f92448669d3162f190e79ac1_master.jpg',
 '2025-12-17', '2025-12-17', 'KH3T', 4.6, 1, 0, 'Regular Fit', 'Premium Cotton', 'ACTIVE'),

('Sweet Rainbow Tee - Sky Blue', 'Playful sky-blue tee featuring colorful rainbow arch graphic and positive message on back, made from lightweight cotton for summer vibes.',
 520000, 416000, 'piece', 210,
 'https://product.hstatic.net/200000306799/product/1_ao_32ccedd5cf6c4eb8ae394a817879bfb9_master.jpg',
 'https://product.hstatic.net/200000306799/product/32_de3198ed2cb94e3798d04731b447277b_master.jpg',
 '2025-12-18', '2025-12-18', 'KH3T', 4.8, 1, 20, 'Regular Fit', 'Lightweight Cotton', 'ACTIVE'),

('Y2K Jersey Football Pink', 'Nostalgic pink Y2K-inspired football jersey with shiny satin finish, bold numbering, and retro piping details.',
 780000, 507000, 'piece', 95,
 'https://bizweb.dktcdn.net/100/369/010/products/1-d98b608f-6728-43e0-a169-b630c56e564e.jpg?v=1734344869630',
 'https://bizweb.dktcdn.net/100/369/010/products/2-a8162f84-9450-423b-befd-b12553881baa.jpg?v=1734344873620',
 '2025-12-18', '2025-12-18', 'KH3T', 4.9, 1, 35, 'Athletic Fit', 'Satin Polyester', 'ACTIVE'),

('If I Play I Play To Win T-Shirt - White', 'Motivational white tee with powerful “If I Play I Play To Win” statement print, cut from premium heavyweight cotton for a strong presence.',
 590000, 413000, 'piece', 0,
 'https://bizweb.dktcdn.net/100/369/010/products/1-23f0ec1c-ae0e-4d9c-ac1f-571ea9cc7847.jpg?v=1728447201350',
 'https://bizweb.dktcdn.net/100/369/010/products/2-8aa8f14a-2fd4-4db5-8632-5a5de66e4dfc.jpg?v=1728447204977',
 '2025-12-19', '2025-12-19', 'KH3T', 4.8, 1, 30, 'Regular Fit', 'Heavyweight Cotton', 'ACTIVE'),

-- 20/12/2025 – Phụ kiện (category = 3)
('"Y" Logo Smashed Necklace Grey', 'Statement silver-tone chain necklace featuring smashed and distorted “Y” logo pendant, hand-finished for an industrial streetwear edge.',
 680000, 510000, 'piece', 95,
 'https://bizweb.dktcdn.net/100/369/010/products/1-ebd6f2a2-46d5-46a8-820a-fec706e3e6b0.jpg?v=1745649684140',
 'https://bizweb.dktcdn.net/100/369/010/products/artboard-1-6abaf110-56bb-48e4-a7e3-4072afc86720.jpg?v=1761550804777',
 '2025-12-20', '2025-12-20', 'KH3T', 4.8, 3, 25, NULL, 'Stainless Steel', 'ACTIVE'),

('Letter Monogram Arizona Slides Cream', 'Luxurious cream slides with debossed letter monogram pattern across the strap, crafted from premium cushioned EVA for all-day comfort.',
 720000, 504000, 'piece', 0,
 'https://bizweb.dktcdn.net/100/369/010/products/1-f3564183-3cdd-4dda-be4a-24e8781d7c27.jpg?v=1744104148063',
 'https://cdn.shopify.com/s/files/1/0066/0360/4086/files/79af9c949bb944d89f3b5f2d5c5374cd.jpg?v=1744688621',
 '2025-12-20', '2025-12-20', 'KH3T', 4.7, 3, 30, NULL, 'Premium EVA', 'ACTIVE'),

('Logo Black Wool Knit Scarf', 'Cozy oversized black wool scarf with tonal embroidered KH3T logo at both ends, perfect layering piece for winter street style.',
 850000, 850000, 'piece', 110,
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTD2-I6HYWWZHKn3sumj67kvIjXDci5LiOXkg&s',
 'https://bizweb.dktcdn.net/100/369/010/products/2-06166429-e7a6-42e8-b07b-fbb7050c3e47.jpg?v=1753088434947',
 '2025-12-21', '2025-12-21', 'KH3T', 4.9, 3, 0, NULL, 'Merino Wool Blend', 'ACTIVE'),

('Embossed Slides - Sand', 'Minimalist sand-colored slides featuring subtle embossed KH3T logo on wide strap, ultra-lightweight and waterproof for daily wear.',
 590000, 501500, 'piece', 180,
 'https://bizweb.dktcdn.net/100/369/010/products/1-6-compressed.jpg?v=1749629457473',
 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNvxcf7bFNEEpXbL-rQ-YKVWD_4B7luBuORQ&s',
 '2025-12-21', '2025-12-21', 'KH3T', 4.6, 3, 15, NULL, 'EVA Foam', 'ACTIVE');



INSERT INTO size (name_size) VALUES
                                 ('S'),
                                 ('M'),
                                 ('L'),
                                 ('XL');


-- Triple Star Small Wallet (id=1)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (1, 1, 0),
                                                            (1, 2, 0),
                                                            (1, 3, 0),
                                                            (1, 4, 0);

-- Raw Denim Stitch Baggy Jeans (id=2)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (2, 1, 37),
                                                            (2, 2, 37),
                                                            (2, 3, 38),
                                                            (2, 4, 38);

-- WASHED DENIM PANTS INDIGO BLUE (id=3)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (3, 1, 40),
                                                            (3, 2, 40),
                                                            (3, 3, 40),
                                                            (3, 4, 10);

-- LOOSE FIT DENIM PANTS (DIRTY BLUE WASH) (id=4)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (4, 1, 40),
                                                            (4, 2, 40),
                                                            (4, 3, 40),
                                                            (4, 4, 40);

-- LOOSE FIT DENIM PANTS (OFF WHITE) (id=5)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (5, 1, 30),
                                                            (5, 2, 30),
                                                            (5, 3, 30),
                                                            (5, 4, 30);

-- LOOSE FIT RAW DENIM PANTS (BLACK) (id=6)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (6, 1, 140),
                                                            (6, 2, 0),
                                                            (6, 3, 0),
                                                            (6, 4, 0);

-- PLEATED TROUSERS (BLACK) (id=7)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (7, 1, 0),
                                                            (7, 2, 0),
                                                            (7, 3, 0),
                                                            (7, 4, 0);

-- PLEATED TROUSER (GREY) (id=8)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (8, 1, 25),
                                                            (8, 2, 25),
                                                            (8, 3, 25),
                                                            (8, 4, 35);

-- WIDE LEG SHORT (id=9)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (9, 1, 35), (9, 2, 35), (9, 3, 35), (9, 4, 35);

-- Washed Jorts (id=10)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (10, 1, 40), (10, 2, 40), (10, 3, 40), (10, 4, 40);

-- Hello Kitty Jeans (id=11)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (11, 1, 37), (11, 2, 38), (11, 3, 37), (11, 4, 38);

-- Raw Denim Stitch Jorts (id=12)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (12, 1, 32), (12, 2, 32), (12, 3, 33), (12, 4, 23);

-- Triple Star Classic Cap (id=13)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (13, 1, 30), (13, 2, 30), (13, 3, 30), (13, 4, 30);

-- Drawstring Camo Denim Cargo Pants (id=14)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (14, 1, 20), (14, 2, 20), (14, 3, 20), (14, 4, 35);

-- Embroidery Relaxed Denim Pants (id=15)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (15, 1, 3), (15, 2, 2), (15, 3, 3), (15, 4, 2);

-- Flame Wash Relaxed Denim Pants Black (id=16)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (16, 1, 0), (16, 2, 0), (16, 3, 0), (16, 4, 0);

-- Embroidery Logo Baggy Denim Shorts (id=17)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (17, 1, 20), (17, 2, 20), (17, 3, 20), (17, 4, 20);

-- Comfy Essential Jeans - Black Wash (id=18)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (18, 1, 30), (18, 2, 30), (18, 3, 30), (18, 4, 15);

-- Casual Baggy Cargo Pants Black Wash (id=19)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (19, 1, 0), (19, 2, 0), (19, 3, 0), (19, 4, 0);


-- Product 20 → tổng 130 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (20, 1, 20),  -- S
                                                            (20, 2, 35),  -- M
                                                            (20, 3, 40),  -- L
                                                            (20, 4, 35);  -- XL

-- Product 21 → tổng 160 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (21, 1, 25),  -- S
                                                            (21, 2, 45),  -- M
                                                            (21, 3, 50),  -- L
                                                            (21, 4, 40);  -- XL

-- Product 22 → tổng 140 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (22, 1, 20),  -- S
                                                            (22, 2, 40),  -- M
                                                            (22, 3, 45),  -- L
                                                            (22, 4, 35);  -- XL

-- Product 23 → tổng 180 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (23, 1, 30),  -- S
                                                            (23, 2, 50),  -- M
                                                            (23, 3, 60),  -- L
                                                            (23, 4, 40);  -- XL

-- Product 24
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (24, 1, 0),
                                                            (24, 2, 0),
                                                            (24, 3, 0),
                                                            (24, 4, 0);

-- Product 25 → giữ nguyên mẫu cũ vì bạn chưa chỉ định lại (180 cái)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (25, 1, 30),
                                                            (25, 2, 30),
                                                            (25, 3, 30),
                                                            (25, 4, 65);

-- Product 26 → tổng 200 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (26, 1, 30),  -- S
                                                            (26, 2, 60),  -- M
                                                            (26, 3, 70),  -- L
                                                            (26, 4, 40);  -- XL

-- Product 27 → tổng 90 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (27, 1, 15),  -- S
                                                            (27, 2, 25),  -- M
                                                            (27, 3, 35),  -- L
                                                            (27, 4, 15);  -- XL

-- Product 28 → tổng 140 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (28, 1, 140),  -- S
                                                            (28, 2, 0),  -- M
                                                            (28, 3, 0),  -- L
                                                            (28, 4, 0);  -- XL

-- Product 29 → tổng 75 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (29, 1, 75),  -- S
                                                            (29, 2, 0),  -- M
                                                            (29, 3, 0),  -- L
                                                            (29, 4, 0);  -- XL

-- Product 30 → tổng 0 (hết hàng hoàn toàn)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (30, 1, 0),
                                                            (30, 2, 0),
                                                            (30, 3, 0),
                                                            (30, 4, 0);

-- Product 31 → tổng 135 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (31, 1, 20),  -- S
                                                            (31, 2, 35),  -- M
                                                            (31, 3, 50),  -- L
                                                            (31, 4, 30);  -- XL

-- Product 32 → tổng 0 (hết hàng)
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (32, 1, 0),
                                                            (32, 2, 0),
                                                            (32, 3, 0),
                                                            (32, 4, 0);

-- Product 33 → tổng 160 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (33, 1, 25),  -- S
                                                            (33, 2, 45),  -- M
                                                            (33, 3, 55),  -- L
                                                            (33, 4, 35);  -- XL

-- Product 34 → tổng 190 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (34, 1, 30),  -- S
                                                            (34, 2, 55),  -- M
                                                            (34, 3, 65),  -- L
                                                            (34, 4, 40);  -- XL

-- Product 35 → tổng 110 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (35, 1, 15),  -- S
                                                            (35, 2, 30),  -- M
                                                            (35, 3, 40),  -- L
                                                            (35, 4, 25);  -- XL

-- Product 36 → hết hàng hoàn toàn
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (36, 1, 0),
                                                            (36, 2, 0),
                                                            (36, 3, 0),
                                                            (36, 4, 0);

-- Product 37 → tổng 145 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (37, 1, 20),  -- S
                                                            (37, 2, 40),  -- M
                                                            (37, 3, 50),  -- L
                                                            (37, 4, 35);  -- XL

-- Product 38 → tổng 98 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (38, 1, 15),  -- S
                                                            (38, 2, 25),  -- M
                                                            (38, 3, 35),  -- L
                                                            (38, 4, 23);  -- XL

-- Product 39 → tổng 180 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (39, 1, 30),  -- S
                                                            (39, 2, 50),  -- M
                                                            (39, 3, 60),  -- L
                                                            (39, 4, 40);  -- XL

-- Product 40 → hết hàng hoàn toàn
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (40, 1, 0),
                                                            (40, 2, 0),
                                                            (40, 3, 0),
                                                            (40, 4, 0);

-- Product 41 → tổng 165 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (41, 1, 25),  -- S
                                                            (41, 2, 45),  -- M
                                                            (41, 3, 55),  -- L
                                                            (41, 4, 40);  -- XL

-- Product 42 → tổng 200 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (42, 1, 30),  -- S
                                                            (42, 2, 60),  -- M
                                                            (42, 3, 70),  -- L
                                                            (42, 4, 40);  -- XL

-- Product 43 → tổng 95 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (43, 1, 15),  -- S
                                                            (43, 2, 25),  -- M
                                                            (43, 3, 35),  -- L
                                                            (43, 4, 20);  -- XL

-- Product 44 → hết hàng
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (44, 1, 0),
                                                            (44, 2, 0),
                                                            (44, 3, 0),
                                                            (44, 4, 0);

-- Product 45 → tổng 140 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (45, 1, 20),  -- S
                                                            (45, 2, 40),  -- M
                                                            (45, 3, 50),  -- L
                                                            (45, 4, 30);  -- XL

-- Product 46 → tổng 155 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (46, 1, 25),  -- S
                                                            (46, 2, 45),  -- M
                                                            (46, 3, 55),  -- L
                                                            (46, 4, 30);  -- XL

-- Product 47 → tổng 120 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (47, 1, 20),  -- S
                                                            (47, 2, 35),  -- M
                                                            (47, 3, 40),  -- L
                                                            (47, 4, 25);  -- XL

-- Product 48 → tổng 110 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (48, 1, 15),  -- S
                                                            (48, 2, 30),  -- M
                                                            (48, 3, 40),  -- L
                                                            (48, 4, 25);  -- XL

-- Product 49 → tổng 85 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (49, 1, 10),  -- S
                                                            (49, 2, 25),  -- M
                                                            (49, 3, 35),  -- L
                                                            (49, 4, 15);  -- XL

-- Product 50 → hết hàng
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (50, 1, 0),
                                                            (50, 2, 0),
                                                            (50, 3, 0),
                                                            (50, 4, 0);

-- Product 51 → tổng 175 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (51, 1, 25),  -- S
                                                            (51, 2, 50),  -- M
                                                            (51, 3, 65),  -- L
                                                            (51, 4, 35);  -- XL

-- Product 52 → hết hàng
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (52, 1, 0),
                                                            (52, 2, 0),
                                                            (52, 3, 0),
                                                            (52, 4, 0);

-- Product 53 → tổng 110 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (53, 1, 15),  -- S
                                                            (53, 2, 30),  -- M
                                                            (53, 3, 40),  -- L
                                                            (53, 4, 25);  -- XL

-- Product 54 → tổng 190 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (54, 1, 30),  -- S
                                                            (54, 2, 55),  -- M
                                                            (54, 3, 65),  -- L
                                                            (54, 4, 40);  -- XL

-- Product 55 → tổng 210 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (55, 1, 35),  -- S
                                                            (55, 2, 60),  -- M
                                                            (55, 3, 75),  -- L
                                                            (55, 4, 40);  -- XL

-- Product 56 → tổng 95 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (56, 1, 15),  -- S
                                                            (56, 2, 25),  -- M
                                                            (56, 3, 35),  -- L
                                                            (56, 4, 20);  -- XL

-- Product 57 → hết hàng
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (57, 1, 0),
                                                            (57, 2, 0),
                                                            (57, 3, 0),
                                                            (57, 4, 0);

-- Product 58 → tổng 95 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (58, 1, 95),  -- S
                                                            (58, 2, 0),  -- M
                                                            (58, 3, 0),  -- L
                                                            (58, 4, 0);  -- XL

-- Product 59 → hết hàng
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (59, 1, 0),
                                                            (59, 2, 0),
                                                            (59, 3, 0),
                                                            (59, 4, 0);

-- Product 60 → tổng 110 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (60, 1, 110),  -- S
                                                            (60, 2, 0),  -- M
                                                            (60, 3, 0),  -- L
                                                            (60, 4, 0);  -- XL

-- Product 61 → tổng 180 cái
INSERT INTO size_detail (product_id, size_id, quantity) VALUES
                                                            (61, 1, 180),  -- S
                                                            (61, 2, 0),  -- M
                                                            (61, 3, 0),  -- L
                                                            (61, 4, 0);  -- XL

-- cart


INSERT INTO cart (
    cart_id, customer_login, total_quantity, total_amount,created_at,updated_at
) VALUES
      (1, 2, 4,  2295000, '2025-06-05 10:15:22', '2025-11-10 09:12:41'),
      (2, 3, 3,  2289000, '2025-06-18 11:22:05', '2025-11-10 10:05:33'),
      (3, 4, 3,  3134800, '2025-07-03 09:11:47', '2025-11-10 11:20:15'),  -- 729800 + 1016800 + 1388400
      (4, 5, 4,  3088400, '2025-07-15 17:33:21', '2025-11-10 12:44:02'),  -- 1388400 + 1700000 (2 cái)
      (5, 6, 3,  2153800, '2025-08-01 15:27:13', '2025-11-10 14:01:27'),  -- 694200 + 1459600
      (6, 7, 5,  4246000, '2025-08-18 08:19:33', '2025-11-10 15:33:19'),  -- 1900000 + 1666000 + 680000
      (7, 8, 3,  1898800, '2025-09-10 14:22:45', '2025-11-10 16:18:50'),  -- 350000 + 1548800
      (8, 9, 2,  1614200, '2025-10-05 18:41:03', '2025-11-10 17:55:12');  -- 694200 + 920000


-- cart detail

INSERT INTO cart_detail (
    cart_detail_id,
    cart_id,
    product_id,
    size_detail_id,
    quantity,
    price_at_time,
    subtotal,
    is_selected,
    create_at,
    update_at
) VALUES
      (1, 1, 1,  1,   2, 297500,  595000, 1, '2025-06-05', '2025-11-10'),
      (2, 1, 2,  6,   2, 850000, 1700000, 1, '2025-06-12', '2025-11-10'),
      (3, 2, 4,  15,   1, 623000,  623000, 1, '2025-06-18', '2025-11-10'),
      (4, 2, 18, 70,  2, 833000, 1666000, 1, '2025-06-20', '2025-11-10'),
      (5, 3, 14, 55,  1, 729800,  729800, 1, '2025-07-03', '2025-11-10'),
      (6, 3, 10, 38,  2, 508400, 1016800, 1, '2025-07-08', '2025-11-10'),
      (7, 4, 12, 47,  2, 694200, 1388400, 1, '2025-07-15', '2025-11-10'),
      (8, 4, 2,  5,   2, 850000, 1700000, 1, '2025-07-22', '2025-11-10'),
      (9, 5, 12, 46,  1, 694200,  694200, 1, '2025-08-01', '2025-11-10'),
      (10,5, 14, 55,  2, 729800, 1459600, 1, '2025-08-05', '2025-11-10'),
      (11,6, 17, 67,  2, 950000, 1900000, 1, '2025-08-18', '2025-11-10'),
      (12,6, 18, 72,  2, 833000, 1666000, 1, '2025-08-25', '2025-11-10'),
      (13,6, 13, 49,  1, 680000,  680000, 1, '2025-09-02', '2025-11-10'),
      (14,7, 6,  21,  1, 350000,  350000, 1, '2025-09-10', '2025-11-10'),
      (15,7, 8,  32,  2, 774400, 1548800, 1, '2025-09-20', '2025-11-10'),
      (16,8, 12, 47,  1, 694200,  694200, 1, '2025-10-05', '2025-11-10'),
      (17,8, 7,  27,  1, 920000,  920000, 1, '2025-10-15', '2025-11-10');





INSERT INTO customer_trading (
    trading_id,
    receiver_name,
    receiver_phone,
    receiver_email,
    receiver_address,
    total_amount,
    trading_date,
    created_at,
    updated_at
) VALUES
      (1, 'Leesin', '0911111111', 'leesin@example.com', '123 Đường Giải Phóng, Quận Hai Bà Trưng, Hà Nội',
       2295000, '2025-11-10 09:00:00', '2025-11-10 08:50:00', '2025-11-10 08:50:00'),

      (2, 'Erling Halland', '0903333444', 'halland@example.com', '45 Trần Duy Hưng, Cầu Giấy, Hà Nội',
       2289000, '2025-11-10 10:00:00', '2025-11-10 09:50:00', '2025-11-10 09:50:00'),

      (3, 'Jeremy Doku', '0905555666', 'doku@example.com', '25 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
       3134800, '2025-11-10 11:00:00', '2025-11-10 10:50:00', '2025-11-10 10:50:00'),

      (4, 'Vinicius Junior', '0907777888', 'vinicious@example.com', '120 Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh',
       3088400, '2025-11-10 12:00:00', '2025-11-10 11:50:00', '2025-11-10 11:50:00'),

      (5, 'Donnarumma', '0911111333', 'donnarumma@example.com', '89 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
       2153800, '2025-11-10 13:00:00', '2025-11-10 12:50:00', '2025-11-10 12:50:00'),

      (6, 'Cristiano Ronaldo', '0912222444', 'cr7@example.com', '56 Nguyễn Trãi, Ninh Kiều, Cần Thơ',
       4246000, '2025-11-10 14:00:00', '2025-11-10 13:50:00', '2025-11-10 13:50:00'),

      (7, 'Phil Foden', '0913333555', 'foden@example.com', '12 Lạch Tray, Ngô Quyền, Hải Phòng',
       1898800, '2025-11-10 15:00:00', '2025-11-10 14:50:00', '2025-11-10 14:50:00'),

      (8, 'Sergio Aguero', '0914444666', 'aguero@example.com', '77 Hùng Vương, Phường Phú Nhuận, Huế',
       1614200, '2025-11-10 16:00:00', '2025-11-10 15:50:00', '2025-11-10 15:50:00');



-- Orders
INSERT INTO orders (
    order_id,
    order_code,
    order_date,
    status_ordering,
    note,
    customer_trading_id,
    account_id,
    payment_method
)
VALUES
    (1, 'ORD20251110001', '2025-11-10 09:00:00', 'PENDING', 'Giao giờ hành chính', 1, 1,'CASH'),
    (2, 'ORD20251110002', '2025-11-10 10:00:00', 'PENDING', 'Gọi trước khi giao', 2, 2,'CASH'),
    (3, 'ORD20251110003', '2025-11-10 11:00:00', 'PENDING', 'Giao buổi sáng', 3, 3, 'BANK_TRANSFER'),
    (4, 'ORD20251110004', '2025-11-10 12:00:00', 'PENDING', 'Không giao sau 20h', 4, 4,'CASH'),
    (5, 'ORD20251110005', '2025-11-10 13:00:00', 'PENDING', 'Liên hệ bảo vệ tòa nhà', 5, 5, 'BANK_TRANSFER'),
    (6, 'ORD20251110006', '2025-11-10 14:00:00', 'PENDING', 'Giao nhanh trong ngày', 6, 6, 'BANK_TRANSFER'),
    (7, 'ORD20251110007', '2025-11-10 15:00:00', 'PENDING', 'Để hàng trước cửa', 7, 7,'CASH'),
    (8, 'ORD20251110008', '2025-11-10 16:00:00', 'PENDING', 'Người nhận: Anh Long', 8, 8, 'BANK_TRANSFER');


<<<<<<< HEAD

=======
>>>>>>> 039721822e30517f20ce238f969282c3d1ed56a3
-- Order Details (lấy ví dụ 2-3 sản phẩm mỗi order, giữ giá đúng bảng product)
INSERT INTO order_detail (
    order_detail_id,
    order_id,
    product_id,
    product_name,
    quantity,
    unit_price,
    total_price,
    created_at,
    updated_at
) VALUES
      (1, 1, 1,  'Triple Star Small Wallet',                                      2, 297500,   595000,   '2025-06-10 09:15:33', '2025-06-10 09:15:33'),
      (2, 1, 2,  'Raw Denim Stitch Baggy Jeans',                                   2, 850000,  1700000,   '2025-06-10 09:16:10', '2025-06-10 09:16:10'),

      (3, 2, 4,  'Hello Kitty | Monogram Laser Baggy Jeans/ Blue',                 1, 623000,   623000,   '2025-06-22 10:08:44', '2025-06-22 10:08:44'),
      (4, 2, 18, 'Big Pounch Cargo Pants - Black',                                     2, 833000,  1666000,   '2025-06-22 10:09:12', '2025-06-22 10:09:12'),

      (5, 3, 14, 'Metal Label Wide Trouser Pants – Black',                             1, 729800,   729800,   '2025-07-08 11:22:05', '2025-07-08 11:22:05'),
      (6, 3, 10, 'Embroidery Logo Baggy Denim Shorts - Light Blue',                    2, 508400,  1016800,   '2025-07-08 11:22:41', '2025-07-08 11:22:41'),
      (7, 3, 12, 'Casual Baggy Cargo Pants Black Wash',                                2, 694200,  1388400,   '2025-07-08 11:23:19', '2025-07-08 11:23:19'),

      (8, 4, 2,  'Raw Denim Stitch Baggy Jeans',                                       2, 850000,  1700000,   '2025-07-20 12:41:27', '2025-07-20 12:41:27'),
      (9, 4, 12, 'Casual Baggy Cargo Pants Black Wash',                                2, 694200,  1388400,   '2025-07-20 12:42:03', '2025-07-20 12:42:03'),

      (10,5, 12, 'Casual Baggy Cargo Pants Black Wash',                                1, 694200,   694200,   '2025-08-07 14:18:55', '2025-08-07 14:18:55'),
      (11,5, 14, 'Metal Label Wide Trouser Pants – Black',                             2, 729800,  1459600,   '2025-08-07 14:19:31', '2025-08-07 14:19:31'),

      (12,6, 17, 'Distressed Double Knee Denim Pants Brown',                           2, 950000,  1900000,   '2025-08-25 15:35:42', '2025-08-25 15:35:42'),
      (13,6, 18, 'Big Pounch Cargo Pants - Black',                                     2, 833000,  1666000,   '2025-08-25 15:36:18', '2025-08-25 15:36:18'),
      (14,6, 13, 'Denim Shorts Frayed Logo - Blue Wash',                               1, 680000,   680000,   '2025-08-25 15:36:50', '2025-08-25 15:36:50'),

      (15,7, 6,  'Triple Star Classic Cap',                                            1, 350000,   350000,   '2025-09-15 16:25:11', '2025-09-15 16:25:11'),
      (16,7, 8,  'Embroidery Relaxed Denim Pants',                                     2, 774400,  1548800,   '2025-09-15 16:25:47', '2025-09-15 16:25:47'),

      (17,8, 12, 'Casual Baggy Cargo Pants Black Wash',                                1, 694200,   694200,   '2025-11-20 17:58:33', '2025-11-20 17:58:33'),
      (18,8, 7,  'Drawstring Camo Denim Cargo Pants',                                  1, 920000,   920000,   '2025-11-20 17:59:05', '2025-11-20 17:59:05');





INSERT INTO invoice (
    invoice_id,
    order_id,
    invoice_code,
    subtotal_amount,
    tax_amount,
    total_amount,
    payment_method,
    payment_status,
    created_at,
    updated_at
) VALUES
      (1, 1, 'INV-20250610-001', 2295000, 0, 2295000, 'CASH',         'PAID',   '2025-06-10 09:20:15', '2025-06-10 09:20:15'),
      (2, 2, 'INV-20250622-001', 2289000, 0, 2289000, 'CASH',     'PAID',   '2025-06-22 10:15:22', '2025-06-22 10:15:22'),
      (3, 3, 'INV-20250708-001', 3134800, 0, 3134800, 'BANK_TRANSFER','PAID',   '2025-07-08 11:30:48', '2025-07-08 11:30:48'),
      (4, 4, 'INV-20250720-001', 3088400, 0, 3088400, 'CASH',         'PAID',   '2025-07-20 12:50:33', '2025-07-20 12:50:33'),
      (5, 5, 'INV-20250807-001', 2153800, 0, 2153800, 'BANK_TRANSFER',     'PAID',   '2025-08-07 14:25:10', '2025-08-07 14:25:10'),
      (6, 6, 'INV-20250825-001', 4246000, 0, 4246000, 'BANK_TRANSFER','PAID',   '2025-08-25 15:45:55', '2025-08-25 15:45:55'),
      (7, 7, 'INV-20250915-001', 1898800, 0, 1898800, 'CASH',         'PAID',   '2025-09-15 16:35:20', '2025-09-15 16:35:20'),
      (8, 8, 'INV-20251120-001', 1614200, 0, 1614200, 'BANK_TRANSFER','PAID',   '2025-11-20 18:10:45', '2025-11-20 18:10:45');




-- Tạo bảng wishlist
INSERT INTO wishlist (
    wishlist_id,
    name,
    description,
    created_at,
    updated_at,
    customer_login
) VALUES
      (1, 'Wishlist Leesin', 'Các sản phẩm yêu thích của Leesin', '2025-11-10 08:00:00', '2025-11-10 08:00:00', 2),
      (2, 'Wishlist Halland', 'Các sản phẩm yêu thích của Halland', '2025-11-10 08:10:00', '2025-11-10 08:10:00', 3),
      (3, 'Wishlist Doku', 'Các sản phẩm yêu thích của Doku', '2025-11-10 08:20:00', '2025-11-10 08:20:00', 4),
      (4, 'Wishlist Vinicius', 'Các sản phẩm yêu thích của Vinicius', '2025-11-10 08:30:00', '2025-11-10 08:30:00', 5);

-- Tạo bảng wishlist_detail
INSERT INTO wishlist_detail (
    wishlist_detail_id,
    note,
    created_at,
    wishlist_id,
    product_id
) VALUES
      (1, 'Muốn mua sớm', '2025-11-10 08:05:00', 1, 1),
      (2, 'Xem xét màu sắc khác', '2025-11-10 08:06:00', 1, 3),
      (3, 'Giá hợp lý', '2025-11-10 08:15:00', 2, 2),
      (4, 'Phong cách cá nhân', '2025-11-10 08:16:00', 2, 5),
      (5, 'Mua tặng bạn', '2025-11-10 08:25:00', 3, 6),
      (6, 'Chưa quyết định', '2025-11-10 08:26:00', 3, 7),
      (7, 'Để lại theo dõi', '2025-11-10 08:35:00', 4, 8),
      (8, 'Có thể mua sau', '2025-11-10 08:36:00', 4, 10);
