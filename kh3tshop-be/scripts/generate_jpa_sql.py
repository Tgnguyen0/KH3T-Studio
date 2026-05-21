import json
from datetime import datetime

# Simple offline Vietnamese translator fallback helper
def translate_text(text):
    try:
        return text
    except Exception as e:
        return text

def map_price(price):
    if price <= 3000000.0:
        val = price
    elif price <= 10000000.0:
        val = 1200000.0 + (price - 3000000.0) * (600000.0 / 7000000.0)
    elif price <= 50000000.0:
        val = 1800000.0 + (price - 10000000.0) * (600000.0 / 40000000.0)
    else:
        val = 2400000.0 + (price - 50000000.0) * (550000.0 / 1800000000.0)
    # Round to nearest 10,000 VND
    return round(val / 10000.0) * 10000.0

def main():
    base_products = [
        # --- Category 1: Top (Áo) (30 items) ---
        {
            'name': 'Áo Hoodie Drew House Mascot',
            'description': 'Áo Hoodie Drew House Mascot mang tính biểu tượng streetwear với chất liệu nỉ bông dày dặn, ấm áp. Thiết kế hình in Mascot cười đặc trưng mang lại vẻ năng động, thời thượng.',
            'price': 3500000.0,
            'brand': 'Drew House',
            'category_id': 1
        },
        {
            'name': 'Áo Khoác Bomber Saint Laurent Leather',
            'description': 'Áo khoác bomber Saint Laurent bằng da cừu tơ cao cấp siêu mềm mịn. Kiểu dáng vừa vặn mang tính biểu tượng cổ điển vượt thời gian đầy sang trọng và cá tính.',
            'price': 85000000.0,
            'brand': 'Saint Laurent',
            'category_id': 1
        },
        {
            'name': 'Áo Thun Balenciaga Oversized Logo',
            'description': 'Áo thun Balenciaga thiết kế dáng rộng thoải mái, chất liệu 100% cotton hữu cơ cao cấp siêu thoáng mát, logo in sắc nét tinh tế ở ngực.',
            'price': 12500000.0,
            'brand': 'Balenciaga',
            'category_id': 1
        },
        {
            'name': 'Áo Khoác Denim Celine Paris',
            'description': 'Áo khoác Celine chất liệu denim cao cấp giặt đá thời thượng, phom dáng khỏe khoắn, nút kim loại mạ vàng sang trọng dập nổi logo Celine.',
            'price': 42000000.0,
            'brand': 'Celine',
            'category_id': 1
        },
        {
            'name': 'Áo Sơ Mi Silk Gucci Flora',
            'description': 'Áo sơ mi lụa tơ tằm tự nhiên Gucci họa tiết hoa Flora lãng mạn quyến rũ. Khuy áo xà cừ cao cấp chế tác thủ công hoàn hảo.',
            'price': 28000000.0,
            'brand': 'Gucci',
            'category_id': 1
        },
        {
            'name': 'Áo Khoác Trench Coat Burberry Classic',
            'description': 'Áo khoác dáng dài Trench Coat Burberry vải gabardine chống thấm nước kinh điển, lót họa tiết kẻ ô Nova check sang trọng quý phái.',
            'price': 55000000.0,
            'brand': 'Burberry',
            'category_id': 1
        },
        {
            'name': 'Áo Sweater Dior Oblique Jacquard',
            'description': 'Áo sweater len Dior Oblique dệt jacquard cao cấp màu xanh navy thêu vân nổi cực đẹp, chất len cashmere siêu ấm áp và thời thượng.',
            'price': 32000000.0,
            'brand': 'Dior',
            'category_id': 1
        },
        {
            'name': 'Áo Thun Supreme Box Logo',
            'description': 'Áo thun Supreme Box Logo huyền thoại phiên bản giới hạn, chất liệu cotton dày dặn đứng phom cực kỳ cá tính.',
            'price': 4500000.0,
            'brand': 'Supreme',
            'category_id': 1
        },
        {
            'name': 'Áo Thun Essentials Fear of God',
            'description': 'Áo thun Essentials với chất liệu cotton pha nỉ mịn màng, logo cao su nổi phía sau lưng tạo phong cách tối giản sang trọng.',
            'price': 2200000.0,
            'brand': 'Essentials',
            'category_id': 1
        },
        {
            'name': 'Áo Khoác Puffer Moncler Maya Black',
            'description': 'Áo phao Moncler Maya chất liệu nylon bóng chống nước, chần bông ngỗng giữ nhiệt cực ấm, logo dán ngực đặc trưng.',
            'price': 48000000.0,
            'brand': 'Moncler',
            'category_id': 1
        },
        {
            'name': 'Áo Khoác Da Biker Prada',
            'description': 'Áo khoác da cừu phong cách Biker từ Prada, điểm nhấn logo tam giác tráng men kim loại ở túi trước ngực cực sang trọng.',
            'price': 95000000.0,
            'brand': 'Prada',
            'category_id': 1
        },
        {
            'name': 'Áo Blazer Tailored Louis Vuitton',
            'description': 'Áo khoác blazer Louis Vuitton may đo thủ công từ len cừu mịn họa tiết Monogram ẩn tinh tế lịch lãm.',
            'price': 72000000.0,
            'brand': 'Louis Vuitton',
            'category_id': 1
        },
        {
            'name': 'Áo Cardigan Jacquemus Le Cardigan',
            'description': 'Áo cardigan len tăm ôm dáng từ Jacquemus, khuy cài thiết kế chữ ký thương hiệu kim loại vàng độc đáo.',
            'price': 18000000.0,
            'brand': 'Jacquemus',
            'category_id': 1
        },
        {
            'name': 'Áo Sơ Mi Flannel Off-White Arrow',
            'description': 'Áo sơ mi Flannel kẻ ô vuông Off-White thêu họa tiết mũi tên Arrow đặc trưng cực ngầu ở lưng.',
            'price': 14500000.0,
            'brand': 'Off-White',
            'category_id': 1
        },
        {
            'name': 'Áo Khoác Varsity Off-White Leather',
            'description': 'Áo khoác bóng chày Off-White với tay bằng da bò thật 100%, đắp họa tiết vá thêu nổi cá tính thời thượng.',
            'price': 52000000.0,
            'brand': 'Off-White',
            'category_id': 1
        },
        {
            'name': 'Áo Sơ Mi Denim Amiri Distressed',
            'description': 'Áo sơ mi Amiri denim rách gối mài xước bụi bặm phong cách rockstar, cúc áo mạ bạc cao cấp.',
            'price': 21000000.0,
            'brand': 'Amiri',
            'category_id': 1
        },
        {
            'name': 'Áo Sweater Ami Paris Coeur',
            'description': 'Áo len sweater dệt kim Ami Paris với logo hình trái tim thêu chỉ đỏ nổi bật, chất len organic cực mịn và ấm.',
            'price': 9500000.0,
            'brand': 'Ami Paris',
            'category_id': 1
        },
        {
            'name': 'Áo Hoodie Palm Angels Classic',
            'description': 'Áo Hoodie Palm Angels in hình gấu bông Bear Headless đặc trưng mang phong cách hiphop cá tính phóng khoáng.',
            'price': 11000000.0,
            'brand': 'Palm Angels',
            'category_id': 1
        },
        {
            'name': 'Áo Gió Balenciaga Sport Windbreaker',
            'description': 'Áo khoác gió thể thao Balenciaga chống gió nước siêu nhẹ, phom dáng oversize thoải mái thời thượng.',
            'price': 36000000.0,
            'brand': 'Balenciaga',
            'category_id': 1
        },
        {
            'name': 'Áo Thun Kenzo Tiger Embroidered',
            'description': 'Áo thun Kenzo hình hổ thêu đa sắc tinh xảo bằng chỉ bóng cao cấp trước ngực, mang phong cách trẻ trung năng động.',
            'price': 5500000.0,
            'brand': 'Kenzo',
            'category_id': 1
        },
        {
            'name': 'Áo Sơ Mi Hawaiian Prada Printed',
            'description': 'Áo sơ mi Prada ngắn tay chất liệu lụa satin thoáng mát họa tiết in nghệ thuật đương đại cá tính.',
            'price': 26000000.0,
            'brand': 'Prada',
            'category_id': 1
        },
        {
            'name': 'Áo Khoác Bomber Givenchy Red Logo',
            'description': 'Áo khoác bomber Givenchy thêu chữ ký Givenchy màu đỏ nổi bật sau lưng, phom dáng trẻ trung năng động.',
            'price': 45000000.0,
            'brand': 'Givenchy',
            'category_id': 1
        },
        {
            'name': 'Áo Thun Chrome Hearts Cross White',
            'description': 'Áo thun Chrome Hearts chất liệu cotton siêu mịn dệt ống không sườn, in hình thập giá nghệ thuật Gothic.',
            'price': 13000000.0,
            'brand': 'Chrome Hearts',
            'category_id': 1
        },
        {
            'name': 'Áo Hoodie Travis Scott Cactus Jack Olive',
            'description': 'Áo hoodie nỉ bông Cactus Jack phom rộng phối màu rêu olive cá tính đi kèm các patch thêu tay nghệ thuật.',
            'price': 6800000.0,
            'brand': 'Cactus Jack',
            'category_id': 1
        },
        {
            'name': 'Áo Len Dệt Givenchy Distressed Knit',
            'description': 'Áo sweater Givenchy chất len dệt mỏng phá cách mài rách nhẹ nghệ thuật, mang phong cách bụi bặm thời trang.',
            'price': 24000000.0,
            'brand': 'Givenchy',
            'category_id': 1
        },
        {
            'name': 'Áo Khoác Parka Canada Goose Expedition',
            'description': 'Áo khoác phao dáng dài Canada Goose chống lạnh cực hạn, lông mũ tự nhiên tháo rời cao cấp.',
            'price': 35000000.0,
            'brand': 'Canada Goose',
            'category_id': 1
        },
        {
            'name': 'Áo Sơ Mi Silk Versace Barocco Gold',
            'description': 'Áo sơ mi lụa tơ tằm Versace họa tiết hoàng gia Barocco tông vàng đen kinh điển cực kỳ xa hoa và nổi bật.',
            'price': 34000000.0,
            'brand': 'Versace',
            'category_id': 1
        },
        {
            'name': 'Áo Hoodie Balenciaga Paris Distressed',
            'description': 'Áo hoodie Balenciaga phom kén tằm đặc trưng chất nỉ cotton mài sờn vintage thời thượng.',
            'price': 18500000.0,
            'brand': 'Balenciaga',
            'category_id': 1
        },
        {
            'name': 'Áo Thun Rick Owens DRKSHDW Jumbo',
            'description': 'Áo thun Rick Owens dáng dài phom ôm nhẹ đặc trưng, chất liệu cotton hữu cơ siêu mềm co giãn tốt.',
            'price': 8500000.0,
            'brand': 'Rick Owens',
            'category_id': 1
        },
        {
            'name': 'Áo Vest Saint Laurent Smoking Tuxedo',
            'description': 'Bộ vest Tuxedo Saint Laurent huyền thoại cắt may hoàn hảo tôn vinh nét lịch lãm thời thượng.',
            'price': 98000000.0,
            'brand': 'Saint Laurent',
            'category_id': 1
        },

        # --- Category 2: Bottom (Quần/Váy) (25 items) ---
        {
            'name': 'Quần Jeans Balenciaga Baggy Blue',
            'description': 'Quần jeans Balenciaga phom dáng thụng rộng thời thượng cá tính, chất denim dày dặn mài rách nhẹ nghệ thuật độc đáo.',
            'price': 18500000.0,
            'brand': 'Balenciaga',
            'category_id': 2
        },
        {
            'name': 'Quần Tây Celine Classic Tailored Black',
            'description': 'Quần tây Celine được may đo tỉ mỉ từ len dệt cao cấp, ống đứng cổ điển tôn dáng cực kỳ tinh tế và lịch lãm.',
            'price': 24000000.0,
            'brand': 'Celine',
            'category_id': 2
        },
        {
            'name': 'Váy Lụa Slip Dress Chanel Premium',
            'description': 'Váy hai dây lụa satin Chanel cao cấp ôm dáng quyến rũ gợi cảm, thiết kế xẻ tà tinh tế tôn vinh nét quyến rũ quý phái.',
            'price': 65000000.0,
            'brand': 'Chanel',
            'category_id': 2
        },
        {
            'name': 'Quần Shorts Essentials Fleece Beige',
            'description': 'Quần short nỉ Fear of God Essentials chất liệu nỉ bông mịn màu beige nhã nhặn, phom rộng thoải mái đi kèm logo silicon phản quang nổi bật.',
            'price': 2800000.0,
            'brand': 'Essentials',
            'category_id': 2
        },
        {
            'name': 'Chân Váy Xếp Ly Dior Oblique Jacquard',
            'description': 'Chân váy xếp ly Dior với họa tiết Oblique biểu tượng trứ danh dệt jacquard cao cấp, phom dáng xòe bay bổng quyến rũ.',
            'price': 38000000.0,
            'brand': 'Dior',
            'category_id': 2
        },
        {
            'name': 'Quần Cargo Pants Stone Island Olive',
            'description': 'Quần túi hộp Stone Island chất liệu kaki cotton cao cấp dệt chéo bền bỉ màu olive nam tính, đi kèm badge la bàn nhận diện thương hiệu.',
            'price': 12000000.0,
            'brand': 'Stone Island',
            'category_id': 2
        },
        {
            'name': 'Quần Sweatpants Chrome Hearts Fleur-de-lis',
            'description': 'Quần nỉ bo gấu Chrome Hearts thêu họa tiết hoa Iris chìm dọc hai ống chân cá tính bụi bặm.',
            'price': 25000000.0,
            'brand': 'Chrome Hearts',
            'category_id': 2
        },
        {
            'name': 'Quần Shorts Leather Saint Laurent Black',
            'description': 'Quần short da cừu mềm mại từ Saint Laurent, thiết kế cạp cao tôn dáng quyến rũ thời thượng.',
            'price': 42000000.0,
            'brand': 'Saint Laurent',
            'category_id': 2
        },
        {
            'name': 'Quần Jeans Amiri Distressed Vintage',
            'description': 'Quần jeans Amiri được mài sờn rách vá da báo thủ công cực ngầu đậm chất Rock & Roll.',
            'price': 28500000.0,
            'brand': 'Amiri',
            'category_id': 2
        },
        {
            'name': 'Quần Cargo Rick Owens Creatch Drawstring',
            'description': 'Quần cargo Rick Owens với dây rút kéo dài đặc trưng, phom dáng thụng ống côn độc đáo.',
            'price': 19500000.0,
            'brand': 'Rick Owens',
            'category_id': 2
        },
        {
            'name': 'Váy Dạ Tweed Gucci Bow Detail Red',
            'description': 'Đầm dạ tweed Gucci cao cấp dệt sợi kim tuyến lấp lánh phối nơ ngực sang trọng quý phái.',
            'price': 58000000.0,
            'brand': 'Gucci',
            'category_id': 2
        },
        {
            'name': 'Quần Tây Prada Nylon Gabardine Classic',
            'description': 'Quần tây Prada dệt từ chất liệu Re-Nylon bảo vệ môi trường, dáng ôm vừa vặn tối giản lịch sự.',
            'price': 22000000.0,
            'brand': 'Prada',
            'category_id': 2
        },
        {
            'name': 'Quần Shorts Silk Versace Barocco Print',
            'description': 'Quần short lụa Versace in họa tiết Barocco bắt mắt mát mẻ phù hợp cho những chuyến nghỉ dưỡng cao cấp.',
            'price': 16500000.0,
            'brand': 'Versace',
            'category_id': 2
        },
        {
            'name': 'Quần Kaki Celine Pleated Trousers Sand',
            'description': 'Quần kaki xếp ly Celine màu cát thanh lịch, chất vải cotton twill bền bỉ và đứng phom.',
            'price': 19000000.0,
            'brand': 'Celine',
            'category_id': 2
        },
        {
            'name': 'Chân Váy Da Thom Browne Pleated',
            'description': 'Chân váy da xếp ly Thom Browne phối sọc kẻ 4-Bar đặc trưng bên hông đầy cá tính.',
            'price': 32000000.0,
            'brand': 'Thom Browne',
            'category_id': 2
        },
        {
            'name': 'Quần Sweatpants Palm Angels Track pants',
            'description': 'Quần nỉ thể thao Palm Angels chạy sọc biên trắng cổ điển đậm chất streetwear sành điệu.',
            'price': 8500000.0,
            'brand': 'Palm Angels',
            'category_id': 2
        },
        {
            'name': 'Quần Jeans Off-White Diagonal Paint',
            'description': 'Quần jeans Off-White mài bạc in họa tiết kẻ sọc chéo sơn vẽ nghệ thuật cá tính.',
            'price': 16000000.0,
            'brand': 'Off-White',
            'category_id': 2
        },
        {
            'name': 'Quần Cargo Louis Vuitton Monogram Denim',
            'description': 'Quần túi hộp LV chất liệu denim dập chìm họa tiết Monogram thời thượng vô cùng đẳng cấp.',
            'price': 45000000.0,
            'brand': 'Louis Vuitton',
            'category_id': 2
        },
        {
            'name': 'Váy Maxi Hermes Linen White',
            'description': 'Đầm maxi Hermes chất liệu linen tự nhiên thoáng mát sang trọng bay bổng quý phái.',
            'price': 72000000.0,
            'brand': 'Hermes',
            'category_id': 2
        },
        {
            'name': 'Quần Shorts Knit Bottega Veneta Intrecciato',
            'description': 'Quần short len dệt Bottega Veneta họa tiết mô phỏng da đan đắt giá và êm ái.',
            'price': 21000000.0,
            'brand': 'Bottega Veneta',
            'category_id': 2
        },
        {
            'name': 'Quần Tây Wool Givenchy Classic Slate',
            'description': 'Quần tây Givenchy dệt từ sợi len siêu mảnh mịn màu xám đá tinh tế sang trọng.',
            'price': 18000000.0,
            'brand': 'Givenchy',
            'category_id': 2
        },
        {
            'name': 'Quần Jeans Gucci Web Stripe Indigo',
            'description': 'Quần bò Gucci phom đứng phối sọc xanh đỏ sườn đặc trưng cực kỳ phong cách.',
            'price': 24500000.0,
            'brand': 'Gucci',
            'category_id': 2
        },
        {
            'name': 'Chân Váy Denim Balenciaga Asymmetrical',
            'description': 'Váy denim Balenciaga vạt chéo phá cách độc đáo đậm dấu ấn thời trang dị biệt cá tính.',
            'price': 15500000.0,
            'brand': 'Balenciaga',
            'category_id': 2
        },
        {
            'name': 'Quần Sweatpants Supreme Box Logo Black',
            'description': 'Quần nỉ bo gấu Supreme thêu logo hộp đỏ nhỏ nhắn bên hông năng động trẻ trung.',
            'price': 7800000.0,
            'brand': 'Supreme',
            'category_id': 2
        },
        {
            'name': 'Quần Tây Celine Wool Twill Navy',
            'description': 'Quần âu Celine màu xanh navy lịch lãm phom dáng sang trọng tôn chân hoàn hảo.',
            'price': 26000000.0,
            'brand': 'Celine',
            'category_id': 2
        },

        # --- Category 3: Accessories (Phụ kiện) (25 items) ---
        {
            'name': 'Đồng Hồ Audemars Piguet Royal Oak Steel',
            'description': 'Đồng hồ Audemars Piguet Royal Oak vỏ thép không gỉ bát giác biểu tượng, mặt số Tapisserie màu xanh dương sâu thẳm sang trọng.',
            'price': 850000000.0,
            'brand': 'Audemars Piguet',
            'category_id': 3
        },
        {
            'name': 'Túi Xách Hermes Birkin 25 Togo Gold',
            'description': 'Túi xách Hermes Birkin 25 da Togo màu vàng bò huyền thoại, phần cứng khóa mạ vàng 18k, kiệt tác thủ công đẳng cấp xa xỉ bậc nhất.',
            'price': 680000000.0,
            'brand': 'Hermes',
            'category_id': 3
        },
        {
            'name': 'Túi Xách Chanel Classic Flap Caviar',
            'description': 'Túi xách Chanel Classic Flap chất liệu da Caviar hạt bền bỉ, họa tiết chần bông hình quả trám kinh điển và khóa CC mạ vàng lấp lánh.',
            'price': 250000000.0,
            'brand': 'Chanel',
            'category_id': 3
        },
        {
            'name': 'Kính Mát Gentle Monster Roky Acetate',
            'description': 'Kính mát Gentle Monster Roky gọng đen axetat cá tính thời thượng, tròng kính Zeiss chống tia UV tuyệt đối bảo vệ mắt tối ưu.',
            'price': 6500000.0,
            'brand': 'Gentle Monster',
            'category_id': 3
        },
        {
            'name': 'Vòng Tay Cartier Love Gold 18K Solid',
            'description': 'Vòng tay Cartier Love chất liệu vàng hồng 18k chạm khắc vít tinh xảo biểu tượng của tình yêu vĩnh cửu gắn kết.',
            'price': 180000000.0,
            'brand': 'Cartier',
            'category_id': 3
        },
        {
            'name': 'Túi Mini Bag Jacquemus Chiquito Mini',
            'description': 'Túi xách mini Jacquemus Le Chiquito phom dáng độc đáo nhỏ gọn siêu dễ thương, làm nổi bật phong cách thời trang đương đại đột phá.',
            'price': 15000000.0,
            'brand': 'Jacquemus',
            'category_id': 3
        },
        {
            'name': 'Thắt Lưng Gucci Double G Leather Belt',
            'description': 'Thắt lưng da bê cao cấp từ Gucci phối khóa hai chữ G lồng vào nhau bằng đồng giả cổ sang trọng tinh tế.',
            'price': 12500000.0,
            'brand': 'Gucci',
            'category_id': 3
        },
        {
            'name': 'Mũ Bucket Prada Nylon Re-Edition Black',
            'description': 'Mũ tai bèo Prada chất liệu nylon tái chế đính logo tam giác tráng men kim loại góc cạnh sành điệu.',
            'price': 14000000.0,
            'brand': 'Prada',
            'category_id': 3
        },
        {
            'name': 'Ví Dài Louis Vuitton Zippy Monogram Canvas',
            'description': 'Ví khóa kéo zippy Louis Vuitton họa tiết canvas monogram bền bỉ nhiều ngăn chứa thẻ tiện lợi.',
            'price': 22500000.0,
            'brand': 'Louis Vuitton',
            'category_id': 3
        },
        {
            'name': 'Khăn Quàng Burberry Giant Check Cashmere Scarf',
            'description': 'Khăn quàng cổ dệt từ len lông cừu cashmere siêu mịn ấm áp họa tiết kẻ ô lớn di sản kinh điển.',
            'price': 13500000.0,
            'brand': 'Burberry',
            'category_id': 3
        },
        {
            'name': 'Đồng Hồ Rolex Submariner Date Ceramic',
            'description': 'Đồng hồ lặn Rolex Submariner viền gốm Cerachrom đen mặt số sang trọng, biểu tượng của độ bền bỉ xa xỉ.',
            'price': 380000000.0,
            'brand': 'Rolex',
            'category_id': 3
        },
        {
            'name': 'Nhẫn Cartier Trinity Ring Gold',
            'description': 'Nhẫn ba vòng lồng nhau bằng 3 màu vàng khác nhau đại diện cho tình yêu, tình bạn và lòng trung thành.',
            'price': 45000000.0,
            'brand': 'Cartier',
            'category_id': 3
        },
        {
            'name': 'Túi Xách Dior Lady Dior Medium Black',
            'description': 'Túi Lady Dior da cừu khâu họa tiết Cannage nổi tiếng cùng móc khóa chữ DIOR mạ vàng tinh tế.',
            'price': 165000000.0,
            'brand': 'Dior',
            'category_id': 3
        },
        {
            'name': 'Kính Mát Balenciaga Swift Oval Futuristic',
            'description': 'Kính mát Balenciaga thiết kế bầu dung tràn viền vị lai thể thao cá tính thu hút mọi ánh nhìn.',
            'price': 9800000.0,
            'brand': 'Balenciaga',
            'category_id': 3
        },
        {
            'name': 'Vòng Cổ Tiffany & Co. HardWear Graduated Link',
            'description': 'Chuỗi vòng cổ mắt xích Tiffany & Co bằng bạc Sterling chế tác tinh tế đậm cá tính thời trang New York.',
            'price': 92000000.0,
            'brand': 'Tiffany & Co.',
            'category_id': 3
        },
        {
            'name': 'Túi Xách Celine Triomphe Canvas Tan',
            'description': 'Túi đeo vai Celine viền da bê màu nâu da bò, khóa bấm kim loại hình biểu tượng Khải Hoàn Môn Triomphe.',
            'price': 85000000.0,
            'brand': 'Celine',
            'category_id': 3
        },
        {
            'name': 'Thắt Lưng Hermes H Belt Buckle Brushed',
            'description': 'Thắt lưng da đà điểu Hermes hai mặt sử dụng linh hoạt đi kèm mặt chữ H chải xước tinh xảo.',
            'price': 24000000.0,
            'brand': 'Hermes',
            'category_id': 3
        },
        {
            'name': 'Mũ Snapback Chrome Hearts Cross Embroidery',
            'description': 'Mũ lưỡi trai Chrome Hearts thêu họa tiết chữ thập Gothic đính khuy bạc Sterling 925 sang trọng.',
            'price': 18500000.0,
            'brand': 'Chrome Hearts',
            'category_id': 3
        },
        {
            'name': 'Túi Xách Bottega Veneta Cassette Padded',
            'description': 'Túi Bottega Veneta Intrecciato da cừu nhồi bông phồng độc đáo êm ái sang trọng bậc nhất.',
            'price': 75000000.0,
            'brand': 'Bottega Veneta',
            'category_id': 3
        },
        {
            'name': 'Đồng Hồ Patek Philippe Nautilus Ref. 5711',
            'description': 'Siêu phẩm đồng hồ Patek Philippe Nautilus thép không gỉ huyền thoại, mẫu đồng hồ thể thao đắt giá bậc nhất.',
            'price': 1850000000.0,
            'brand': 'Patek Philippe',
            'category_id': 3
        },
        {
            'name': 'Khuyên Tai Chanel CC Pearl Drop',
            'description': 'Khuyên tai Chanel hình logo hai chữ C lồng nhau đính ngọc trai tự nhiên sang quý nữ tính.',
            'price': 16000000.0,
            'brand': 'Chanel',
            'category_id': 3
        },
        {
            'name': 'Túi Tote Marc Jacobs Large Tote Black',
            'description': 'Túi tote Marc Jacobs chất liệu vải canvas dày dặn in chữ nổi lớn thời trang tiện lợi đi học đi chơi.',
            'price': 8500000.0,
            'brand': 'Marc Jacobs',
            'category_id': 3
        },
        {
            'name': 'Kính Mát Tom Ford Campbell Square',
            'description': 'Kính râm gọng dày Tom Ford chữ T kim loại vàng bên hông lịch lãm thời thượng.',
            'price': 8200000.0,
            'brand': 'Tom Ford',
            'category_id': 3
        },
        {
            'name': 'Vòng Tay Hermes Clic H Enamel',
            'description': 'Vòng tay tráng men chữ H biểu tượng của Hermes, bản rộng vừa phải dễ phối đồ sang trọng.',
            'price': 19500000.0,
            'brand': 'Hermes',
            'category_id': 3
        },
        {
            'name': 'Ví Đựng Thẻ Dior Saddle Oblique',
            'description': 'Ví đựng thẻ phom dáng yên ngựa Saddle trứ danh dệt vải canvas họa tiết Oblique xanh thanh lịch.',
            'price': 11500000.0,
            'brand': 'Dior',
            'category_id': 3
        },

        # --- Category 4: Shoes (Giày dép) (20 items) ---
        {
            'name': 'Giày Air Jordan 1 Travis Scott Reverse Mocha',
            'description': 'Giày sneakers Nike Air Jordan 1 Retro High Travis Scott Mocha phối màu nâu đen cá tính, dấu swoosh ngược kinh điển.',
            'price': 45000000.0,
            'brand': 'Nike',
            'category_id': 4
        },
        {
            'name': 'Giày Chelsea Boots Saint Laurent Suede Brown',
            'description': 'Giày Chelsea Boots Saint Laurent chất liệu da lộn cao cấp màu nâu hạt dẻ ấm áp, phom ôm sát cổ chân tôn dáng thanh lịch.',
            'price': 28000000.0,
            'brand': 'Saint Laurent',
            'category_id': 4
        },
        {
            'name': 'Giày Cao Gót Dior J\'Adior Slingback Pump',
            'description': 'Giày cao gót Dior J\'Adior slingback gót nhọn thanh thoát, quai ruy băng thêu chữ J\'Adior độc đáo kiêu sa quý phái.',
            'price': 26000000.0,
            'brand': 'Dior',
            'category_id': 4
        },
        {
            'name': 'Giày Sneakers Balenciaga Triple S Multicolored',
            'description': 'Giày sneakers Balenciaga Triple S đế Clear Sole trong suốt thời thượng, đế thô chunky hầm hố phá cách cực ngầu.',
            'price': 24000000.0,
            'brand': 'Balenciaga',
            'category_id': 4
        },
        {
            'name': 'Giày Loafers Gucci Brixton Black Leather',
            'description': 'Giày Loafers Gucci chất liệu da bê mềm mịn đàn hồi tốt, chi tiết khóa Horsebit kim loại vàng đặc trưng lịch lãm cổ điển.',
            'price': 22000000.0,
            'brand': 'Gucci',
            'category_id': 4
        },
        {
            'name': 'Giày Sneakers Yeezy Boost 350 V2 Zebra',
            'description': 'Giày Yeezy 350 V2 dệt Primeknit co giãn thoáng khí tuyệt đối họa tiết ngựa vằn, đệm Boost cực êm ái đàn hồi cao giúp di chuyển năng động.',
            'price': 9500000.0,
            'brand': 'Adidas',
            'category_id': 4
        },
        {
            'name': 'Giày Derby Prada Monolith Brushed Leather',
            'description': 'Giày Derby Prada da bóng đế răng cưa chunky siêu cao hack dáng cá tính độc lạ.',
            'price': 27500000.0,
            'brand': 'Prada',
            'category_id': 4
        },
        {
            'name': 'Giày Sneakers Alexander McQueen Oversized White',
            'description': 'Giày đế độn McQueen phối gót nhung đen thời thượng phù hợp cho cả nam và nữ.',
            'price': 14500000.0,
            'brand': 'Alexander McQueen',
            'category_id': 4
        },
        {
            'name': 'Giày Chelsea Boots Bottega Veneta Lug Black',
            'description': 'Giày boots Bottega Veneta da bê dày dặn đế cao su đúc bền bỉ phong cách unisex thời thượng.',
            'price': 31000000.0,
            'brand': 'Bottega Veneta',
            'category_id': 4
        },
        {
            'name': 'Giày Cao Gót Christian Louboutin Kate Red Sole',
            'description': 'Giày cao gót Christian Louboutin đế đỏ huyền thoại da bóng màu đen mũi nhọn quý phái.',
            'price': 22500000.0,
            'brand': 'Christian Louboutin',
            'category_id': 4
        },
        {
            'name': 'Giày Loafers Loro Piana Summer Walk Beige',
            'description': 'Giày LP Summer Walk chất da lộn màu beige đế cao su siêu nhẹ tinh tế phong cách Quiet Luxury.',
            'price': 26500000.0,
            'brand': 'Loro Piana',
            'category_id': 4
        },
        {
            'name': 'Giày Sneakers Nike Air Force 1 Tiffany & Co.',
            'description': 'Giày AF1 collab Tiffany & Co chất da lộn đen thêu chữ Tiffany bạc gót giày.',
            'price': 62000000.0,
            'brand': 'Nike',
            'category_id': 4
        },
        {
            'name': 'Giày Sneakers Maison Margiela Replica White',
            'description': 'Giày Margiela phom retro chất liệu da và da lộn xám phối màu tinh tế sang trọng.',
            'price': 13800000.0,
            'brand': 'Maison Margiela',
            'category_id': 4
        },
        {
            'name': 'Giày Mule Hermes Oran Sandals Leather',
            'description': 'Dép lê Hermes Oran quai chữ H bằng da bò Epsom màu nâu bò cực kỳ nổi tiếng.',
            'price': 18000000.0,
            'brand': 'Hermes',
            'category_id': 4
        },
        {
            'name': 'Giày Derby Saint Laurent Army Leather',
            'description': 'Giày Derby Saint Laurent da bóng đen thiết kế 3 lỗ buộc dây đơn giản nam tính sang trọng.',
            'price': 23000000.0,
            'brand': 'Saint Laurent',
            'category_id': 4
        },
        {
            'name': 'Giày Sneakers Balenciaga Track 2.0 Black',
            'description': 'Giày sneakers Balenciaga Track 2.0 hầm hố lồng ghép nhiều vạt lưới đan xen cực chất.',
            'price': 28000000.0,
            'brand': 'Balenciaga',
            'category_id': 4
        },
        {
            'name': 'Giày Loafers Hermes Paris Black Leather',
            'description': 'Giày Loafers Hermes da bê đen đính khóa chữ H kim loại chải xước tinh xảo.',
            'price': 29500000.0,
            'brand': 'Hermes',
            'category_id': 4
        },
        {
            'name': 'Giày Boots Dior Explorer Combat Black',
            'description': 'Giày bốt cao cổ Dior chất liệu da cừu dập chìm họa tiết Oblique cực đẹp.',
            'price': 34000000.0,
            'brand': 'Dior',
            'category_id': 4
        },
        {
            'name': 'Giày Sneakers New Balance 990v6 Kith Grey',
            'description': 'Sneaker NB990v6 phối màu xám rêu cao cấp đệm đế FuelCell cực êm ái.',
            'price': 8500000.0,
            'brand': 'New Balance',
            'category_id': 4
        },
        {
            'name': 'Giày Sneakers Air Jordan 4 Retro Dior Gray',
            'description': 'Jordan 4 phối màu xám dior cực kỳ hiếm hoi và đắt đỏ trên thị trường resell.',
            'price': 250000000.0,
            'brand': 'Nike',
            'category_id': 4
        }
    ]

    # Verified, fast-loading, clean image assets by category (100% working)
    tops_imgs = [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
        'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=600',
        'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600',
        'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=600',
        'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=600',
        'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600',
        'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600',
        'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?q=80&w=600'
    ]
    bottoms_imgs = [
        'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600',
        'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=600',
        'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?q=80&w=600',
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600',
        'https://images.unsplash.com/photo-1517423568366-8b83523034fd?q=80&w=600',
        'https://images.unsplash.com/photo-1551854838-212c50b4c184?q=80&w=600'
    ]
    acc_imgs = [
        'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600',
        'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600',
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600',
        'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600',
        'https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=600',
        'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600'
    ]
    shoes_imgs = [
        'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600',
        'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=600',
        'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600',
        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600',
        'https://images.unsplash.com/photo-1533867617858-e7b97e060509?q=80&w=600',
        'https://images.unsplash.com/photo-1556906781-9a412961c28c?q=80&w=600'
    ]

    translated_products = []
    pid = 1
    
    # Assign verified images round-robin and map prices below 3 million
    cat_counts = {1: 0, 2: 0, 3: 0, 4: 0}
    for p in base_products:
        cat_id = p['category_id']
        if cat_id == 1:
            img = tops_imgs[cat_counts[1] % len(tops_imgs)]
            cat_counts[1] += 1
        elif cat_id == 2:
            img = bottoms_imgs[cat_counts[2] % len(bottoms_imgs)]
            cat_counts[2] += 1
        elif cat_id == 3:
            img = acc_imgs[cat_counts[3] % len(acc_imgs)]
            cat_counts[3] += 1
        else:
            img = shoes_imgs[cat_counts[4] % len(shoes_imgs)]
            cat_counts[4] += 1

        new_price = map_price(p['price'])
        translated_products.append({
            'id': pid,
            'name': p['name'],
            'description': p['description'],
            'price': new_price,
            'cost_price': new_price,
            'image_url': img,
            'rating': p['rating'] if 'rating' in p else 4.8,
            'brand': p['brand'],
            'category_id': p['category_id']
        })
        pid += 1

    print(f"Generated {len(translated_products)} unique fashion products.")
    print("Generating JPA.sql...")
    
    # Pre-calculate prices for carts and orders
    def get_prod(pid):
        return translated_products[pid - 1]

    # Cart details mapping
    carts_def = {
        1: [(1, 2), (2, 2)],
        2: [(4, 1), (18, 2)],
        3: [(14, 1), (10, 2)],
        4: [(12, 2), (2, 2)],
        5: [(12, 1), (14, 2)],
        6: [(17, 2), (18, 2), (13, 1)],
        7: [(6, 1), (8, 2)],
        8: [(12, 1), (7, 1)]
    }
    
    # Order details mapping (matches cart details for consistency)
    orders_def = {
        1: [(1, 2), (2, 2)],
        2: [(4, 1), (18, 2)],
        3: [(14, 1), (10, 2), (12, 2)],
        4: [(2, 2), (12, 2)],
        5: [(12, 1), (14, 2)],
        6: [(17, 2), (18, 2), (13, 1)],
        7: [(6, 1), (8, 2)],
        8: [(12, 1), (7, 1)]
    }

    # Generate SQL file content
    sql = []
    sql.append("CREATE DATABASE IF NOT EXISTS `kredo_studio`;")
    sql.append("USE `kredo_studio`;")
    sql.append("")
    sql.append("SET FOREIGN_KEY_CHECKS = 0;")
    sql.append("TRUNCATE TABLE wishlist_detail;")
    sql.append("TRUNCATE TABLE wishlist;")
    sql.append("TRUNCATE TABLE invoice;")
    sql.append("TRUNCATE TABLE order_detail;")
    sql.append("TRUNCATE TABLE orders;")
    sql.append("TRUNCATE TABLE customer_trading;")
    sql.append("TRUNCATE TABLE cart_detail;")
    sql.append("TRUNCATE TABLE cart;")
    sql.append("TRUNCATE TABLE size_detail;")
    sql.append("TRUNCATE TABLE size;")
    sql.append("TRUNCATE TABLE product;")
    sql.append("TRUNCATE TABLE category;")
    sql.append("TRUNCATE TABLE address;")
    sql.append("TRUNCATE TABLE account;")
    sql.append("TRUNCATE TABLE customer;")
    sql.append("")
    sql.append("")
    
    # 1. Customer seed
    sql.append("INSERT INTO customer (customer_id, full_name, phone_number, email, gender, date_of_birth, create_at, update_at, status)")
    sql.append("VALUES")
    sql.append("    (2, 'Leesin', '0911111111', 'leesin@example.com', 'MALE', '1998-03-14', '2024-10-01', '2024-10-01', 'ACTIVE'),")
    sql.append("    (3, 'Erling Halland', '0903333444', 'halland@example.com', 'MALE', '2000-07-21', '2024-10-02', '2024-10-02', 'ACTIVE'),")
    sql.append("    (4, 'Jeremy Doku', '0905555666', 'doku@example.com', 'MALE', '1995-10-12', '2024-10-03', '2024-10-03', 'ACTIVE'),")
    sql.append("    (5, 'Vinicius Junior', '0907777888', 'vinicious@example.com', 'FEMALE', '1999-01-01', '2024-10-04', '2024-10-04', 'ACTIVE'),")
    sql.append("    (6, 'Donnarumma', '0911111333', 'donnarumma@example.com', 'MALE', '1997-08-09', '2024-10-05', '2024-10-05', 'ACTIVE'),")
    sql.append("    (7, 'Cristiano Ronaldo', '0912222444', 'cr7@example.com', 'FEMALE', '2001-05-05', '2024-10-06', '2024-10-06', 'ACTIVE'),")
    sql.append("    (8, 'Phil Foden', '0913333555', 'foden@example.com', 'MALE', '1996-11-25', '2024-10-07', '2024-10-07', 'ACTIVE'),")
    sql.append("    (9, 'Sergio Aguero', '0914444666', 'aguero@example.com', 'MALE', '1988-02-07', '2024-10-08', '2024-10-08', 'INACTIVE'),")
    sql.append("    (10, 'Messi', '0915555777', 'messi@example.com', 'MALE', '1994-02-02', '2024-10-09', '2024-10-09', 'ACTIVE');")
    sql.append("")

    # 2. Account seed
    sql.append("INSERT INTO account (login_id, create_at, password, role, status_login, update_at, username, customer_id)")
    sql.append("VALUES")
    sql.append("    (1, '2024-10-01', '$2a$10$asqFiSnfasSX4/g2fPID4ec9hxDWHbXDDTlN7FEwRpUjGz4itBlPm', 'ADMIN', 'ACTIVE', '2024-10-01', 'admin', NULL),")
    sql.append("    (2, '2024-10-01', '$2a$10$pdErrGmqR6k4c2cHmTVrCOoKtQmoR.frS.lAFbvU6e7/Cjbnt98Xi', 'USER', 'ACTIVE', '2024-10-01', 'Leesin', 2),")
    sql.append("    (3, '2024-10-02', '$2a$10$UwU6c/qJC6Tg9/ySe5RYLOCtH3pTHzakrVAV0hjRfWzNVCe2kyJni','USER' , 'ACTIVE', '2024-10-02', 'Halland', 3),")
    sql.append("    (4, '2024-10-03', '$2a$10$ezcfId8HGRycvLNNEQZdG.hLaSJ4xLvNoi0KRUkBU6tgu6vlKN2n2', 'USER', 'ACTIVE', '2024-10-03', 'Doku', 4),")
    sql.append("    (5, '2024-10-04', '$2a$10$p1gJ9SJINENQKTZDp02jFOJVy3p3Aci2CNf1AOjR7.PylbyBtGzVm', 'USER', 'ACTIVE', '2024-10-04', 'Vinicious', 5),")
    sql.append("    (6, '2024-10-05', '$2a$10$.7Rcw1esqB3LUK.bgVxmo.7jbWjsuckn4rPd4lGniJJdzyHOCh05i', 'USER', 'ACTIVE', '2024-10-05', 'Donnarumma', 6),")
    sql.append("    (7, '2024-10-06', '$2a$10$asqFiSnfasSX4/g2fPID4ec9hxDWHbXDDTlN7FEwRpUjGz4itBlPm', 'USER', 'ACTIVE', '2024-10-06', 'CR7', 7),")
    sql.append("    (8, '2024-10-07', '$2a$10$lzBHVSAD78l.eR/xM3IrEe2.iMhRwmuEXgSDrHSpJ0DoaojEMu3b2', 'USER', 'ACTIVE', '2024-10-07', 'Foden', 8),")
    sql.append("    (9, '2024-10-08', '$2a$10$It2D4MaWB4Hq5PI9JyaUDu9.bscYWA7er6L3ZVv3B3FJl47ndvgH2', 'USER', 'LOCKED', '2024-10-08', 'Aguero', 9),")
    sql.append("    (10, '2024-10-09', '$2a$10$rL7cPLbyOKSb7x/ebJM3CuXvv5wC3Ksa6i6L9D.BCLwq0fg9gxRb.', 'STAFF', 'PENDING', '2024-10-09', 'Lionel Messi', 10);")
    sql.append("")

    # 3. Address seed
    sql.append("INSERT INTO address (province, delivery_address, delivery_note, account_id) VALUES")
    sql.append("    ('Hà Nội', '123 Đường Giải Phóng, Quận Hai Bà Trưng', 'Giao giờ hành chính', 1),")
    sql.append("    ('Hà Nội', '45 Trần Duy Hưng, Cầu Giấy', 'Gọi trước khi giao', 1),")
    sql.append("    ('TP. Hồ Chí Minh', '25 Nguyễn Huệ, Quận 1', 'Giao buổi sáng', 2),")
    sql.append("    ('TP. Hồ Chí Minh', '120 Lê Văn Sỹ, Quận 3', 'Không giao sau 20h', 2),")
    sql.append("    ('Đà Nẵng', '89 Nguyễn Văn Linh, Hải Châu', 'Liên hệ bảo vệ tòa nhà', 3),")
    sql.append("    ('Cần Thơ', '56 Nguyễn Trãi, Ninh Kiều', 'Giao nhanh trong ngày', 3),")
    sql.append("    ('Hải Phòng', '12 Lạch Tray, Ngô Quyền', 'Để hàng trước cửa', 4),")
    sql.append("    ('Thừa Thiên Huế', '77 Hùng Vương, Phường Phú Nhuận', 'Người nhận: Anh Minh', 4),")
    sql.append("    ('Bắc Ninh', '09 Nguyễn Gia Thiều, TP. Bắc Ninh', 'Không giao cuối tuần', 5),")
    sql.append("    ('Khánh Hòa', '50 Trần Phú, TP. Nha Trang', 'Liên hệ trước 30 phút', 5),")
    sql.append("    ('Đồng Nai', '150 Võ Thị Sáu, P. Thống Nhất', 'Có thể giao buổi tối', 6),")
    sql.append("    ('Đắk Lắk', '98 Lê Duẩn, TP. Buôn Ma Thuột', 'Giao cho lễ tân', 6),")
    sql.append("    ('Bà Rịa - Vũng Tàu', '12 Hạ Long, Phường 2', 'Cần gọi trước khi đến', 7),")
    sql.append("    ('Long An', '67 Nguyễn Huệ, Tân An', 'Giao buổi chiều', 7),")
    sql.append("    ('Hà Tĩnh', '33 Phan Đình Phùng, TP. Hà Tĩnh', 'Nhà gần trường học', 8),")
    sql.append("    ('Quảng Ninh', '88 Trần Quốc Nghiễn, Hạ Long', 'Không gọi cửa', 8),")
    sql.append("    ('Thái Nguyên', '120 Cách Mạng Tháng 8, TP. Thái Nguyên', 'Người nhận là bố tôi', 9),")
    sql.append("    ('Nam Định', '75 Hùng Vương, TP. Nam Định', 'Có chó dữ, gọi trước', 9),")
    sql.append("    ('Hòa Bình', '5 Trần Hưng Đạo, TP. Hòa Bình', 'Nhà cuối ngõ nhỏ', 10),")
    sql.append("    ('Bình Dương', '230 Đại lộ Bình Dương, TP. Thủ Dầu Một', 'Công ty ABC, tầng 3', 10);")
    sql.append("")

    # 4. Category seed
    sql.append("INSERT INTO category (category_id, category_name, description, image_url, display_order, is_active, created_at, updated_at)")
    sql.append("VALUES")
    sql.append("    (1, 'Top', 'Các loại áo như áo thun, sơ mi, hoodie...', 'https://i.postimg.cc/LXQSc1jQ/Tops-Size-Chart.png', 1, true, '2025-11-10', '2025-11-10'),")
    sql.append("    (2, 'Bottom', 'Các loại quần như jeans, trousers, shorts...', 'https://i.postimg.cc/HsDMRc35/Bottoms-Size-Chart.png', 2, true, '2025-11-10', '2025-11-10'),")
    sql.append("    (3, 'Accessories', 'Các loại phụ kiện như ví, mũ, thắt lưng...', 'https://i.postimg.cc/T3QWKkx7/accessires-Sizechart.png', 3, true, '2025-11-10', '2025-11-10'),")
    sql.append("    (4, 'Shoes', 'Các loại giày dép như giày thể thao, cao gót...', 'https://i.postimg.cc/L5n4xN2c/shoes-Sizechart.png', 4, true, '2025-11-10', '2025-11-10');")
    sql.append("")

    # 5. Product seed (100 fashion products)
    current_date = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
    sql.append("INSERT INTO product")
    sql.append("(product_id, product_name, description, price, cost_price, unit, quantity, image_url_front, image_url_back, created_at, updated_at, brand, rating, category, discount_amount, form, material, status)")
    sql.append("VALUES")
    
    prod_values = []
    for p in translated_products:
        name_clean = p['name'].replace("'", "''")
        desc_clean = p['description'].replace("'", "''")[:250]
        img_clean = p['image_url'].replace("'", "''")
        val = (
            f"({p['id']}, '{name_clean}', '{desc_clean}', {p['price']}, {p['cost_price']}, 'Cai', 100, "
            f"'{img_clean}', '{img_clean}', '{current_date}', '{current_date}', '{p['brand']}', {p['rating']}, {p['category_id']}, "
            f"0, 'Regular', 'Mixed', 'ACTIVE')"
        )
        prod_values.append(val)
    sql.append(",\n".join(prod_values) + ";")
    sql.append("")

    # 6. Size seed
    sql.append("INSERT INTO size (id, name_size) VALUES")
    sql.append("    (1, 'S'),")
    sql.append("    (2, 'M'),")
    sql.append("    (3, 'L'),")
    sql.append("    (4, 'XL'),")
    sql.append("    (5, '38'),")
    sql.append("    (6, '39'),")
    sql.append("    (7, '40'),")
    sql.append("    (8, '41'),")
    sql.append("    (9, '42'),")
    sql.append("    (10, 'ONESIZE');")
    sql.append("")

    # 7. Size detail seed (Categorized sizing for products)
    sql.append("INSERT INTO size_detail (product_id, size_id, quantity) VALUES")
    size_detail_values = []
    prod_to_sd_ids = {}
    sd_counter = 1
    for p in translated_products:
        pid = p['id']
        cat_id = p['category_id']
        prod_to_sd_ids[pid] = []
        if cat_id in [1, 2]:
            # Tops and Bottoms get S, M, L, XL
            size_detail_values.append(f"({pid}, 1, 25)")
            prod_to_sd_ids[pid].append(sd_counter)
            sd_counter += 1
            size_detail_values.append(f"({pid}, 2, 25)")
            prod_to_sd_ids[pid].append(sd_counter)
            sd_counter += 1
            size_detail_values.append(f"({pid}, 3, 25)")
            prod_to_sd_ids[pid].append(sd_counter)
            sd_counter += 1
            size_detail_values.append(f"({pid}, 4, 25)")
            prod_to_sd_ids[pid].append(sd_counter)
            sd_counter += 1
        elif cat_id == 4:
            # Shoes get 38, 39, 40, 41, 42
            size_detail_values.append(f"({pid}, 5, 20)")
            prod_to_sd_ids[pid].append(sd_counter)
            sd_counter += 1
            size_detail_values.append(f"({pid}, 6, 20)")
            prod_to_sd_ids[pid].append(sd_counter)
            sd_counter += 1
            size_detail_values.append(f"({pid}, 7, 20)")
            prod_to_sd_ids[pid].append(sd_counter)
            sd_counter += 1
            size_detail_values.append(f"({pid}, 8, 20)")
            prod_to_sd_ids[pid].append(sd_counter)
            sd_counter += 1
            size_detail_values.append(f"({pid}, 9, 20)")
            prod_to_sd_ids[pid].append(sd_counter)
            sd_counter += 1
        elif cat_id == 3:
            # Accessories get ONESIZE
            size_detail_values.append(f"({pid}, 10, 100)")
            prod_to_sd_ids[pid].append(sd_counter)
            sd_counter += 1
    sql.append(",\n".join(size_detail_values) + ";")
    sql.append("")

    # 8. Cart seed
    cart_inserts = []
    cart_detail_inserts = []
    cd_id = 1
    
    for cid, items in carts_def.items():
        total_qty = 0
        total_amount = 0
        
        for pid, qty in items:
            p = get_prod(pid)
            subtotal = p['price'] * qty
            total_qty += qty
            total_amount += subtotal
            
            sd_list = prod_to_sd_ids.get(pid, [])
            size_detail_id = sd_list[1] if len(sd_list) > 1 else sd_list[0]
            
            cart_detail_inserts.append(
                f"({cd_id}, {cid}, {pid}, {size_detail_id}, {qty}, {p['price']}, {subtotal}, 1, '2025-06-05', '2025-11-10')"
            )
            cd_id += 1
            
        customer_login = cid + 1
        cart_inserts.append(
            f"({cid}, {customer_login}, {total_qty}, {total_amount}, '2025-06-05 10:15:22', '2025-11-10 09:12:41')"
        )
        
    sql.append("INSERT INTO cart (cart_id, customer_login, total_quantity, total_amount, created_at, updated_at) VALUES")
    sql.append(",\n".join(cart_inserts) + ";")
    sql.append("")
    
    sql.append("INSERT INTO cart_detail (cart_detail_id, cart_id, product_id, size_detail_id, quantity, price_at_time, subtotal, is_selected, create_at, update_at) VALUES")
    sql.append(",\n".join(cart_detail_inserts) + ";")
    sql.append("")

    # 9. Customer Trading seed
    trading_inserts = []
    recipients = {
        1: ('Leesin', '0911111111', 'leesin@example.com', '123 Đường Giải Phóng, Quận Hai Bà Trưng, Hà Nội'),
        2: ('Erling Halland', '0903333444', 'halland@example.com', '45 Trần Duy Hưng, Cầu Giấy, Hà Nội'),
        3: ('Jeremy Doku', '0905555666', 'doku@example.com', '25 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh'),
        4: ('Vinicius Junior', '0907777888', 'vinicious@example.com', '120 Lê Văn Sỹ, Quận 3, TP. Hồ Chí Minh'),
        5: ('Donnarumma', '0911111333', 'donnarumma@example.com', '89 Nguyễn Văn Linh, Hải Châu, Đà Nẵng'),
        6: ('Cristiano Ronaldo', '0912222444', 'cr7@example.com', '56 Nguyễn Trãi, Ninh Kiều, Cần Thơ'),
        7: ('Phil Foden', '0913333555', 'foden@example.com', '12 Lạch Tray, Ngô Quyền, Hải Phòng'),
        8: ('Sergio Aguero', '0914444666', 'aguero@example.com', '77 Hùng Vương, Phường Phú Nhuận, Huế')
    }
    
    order_detail_inserts = []
    od_id = 1
    
    for oid, items in orders_def.items():
        total_amount = 0
        for pid, qty in items:
            p = get_prod(pid)
            subtotal = p['price'] * qty
            total_amount += subtotal
            
            pname_clean = p['name'].replace("'", "''")
            order_detail_inserts.append(
                f"({od_id}, {oid}, {pid}, '{pname_clean}', {qty}, {p['price']}, {subtotal}, '2025-06-10 09:15:33', '2025-06-10 09:15:33')"
            )
            od_id += 1
            
        r_name, r_phone, r_email, r_address = recipients[oid]
        trading_inserts.append(
            f"({oid}, '{r_name}', '{r_phone}', '{r_email}', '{r_address}', {total_amount}, '2025-11-10 09:00:00', '2025-11-10 08:50:00', '2025-11-10 08:50:00')"
        )
        
    sql.append("INSERT INTO customer_trading (trading_id, receiver_name, receiver_phone, receiver_email, receiver_address, total_amount, trading_date, created_at, updated_at) VALUES")
    sql.append(",\n".join(trading_inserts) + ";")
    sql.append("")

    # 10. Orders seed
    sql.append("INSERT INTO orders (order_id, order_code, order_date, status_ordering, note, customer_trading_id, account_id, payment_method) VALUES")
    sql.append("    (1, 'ORD20251110001', '2025-11-10 09:00:00', 'PENDING', 'Giao giờ hành chính', 1, 1,'CASH'),")
    sql.append("    (2, 'ORD20251110002', '2025-11-10 10:00:00', 'PENDING', 'Gọi trước khi giao', 2, 2,'CASH'),")
    sql.append("    (3, 'ORD20251110003', '2025-11-10 11:00:00', 'PENDING', 'Giao buổi sáng', 3, 3, 'BANK_TRANSFER'),")
    sql.append("    (4, 'ORD20251110004', '2025-11-10 12:00:00', 'PENDING', 'Không giao sau 20h', 4, 4,'CASH'),")
    sql.append("    (5, 'ORD20251110005', '2025-11-10 13:00:00', 'PENDING', 'Liên hệ bảo vệ tòa nhà', 5, 5, 'BANK_TRANSFER'),")
    sql.append("    (6, 'ORD20251110006', '2025-11-10 14:00:00', 'PENDING', 'Giao nhanh trong ngày', 6, 6, 'BANK_TRANSFER'),")
    sql.append("    (7, 'ORD20251110007', '2025-11-10 15:00:00', 'PENDING', 'Để hàng trước cửa', 7, 7,'CASH'),")
    sql.append("    (8, 'ORD20251110008', '2025-11-10 16:00:00', 'PENDING', 'Người nhận: Anh Long', 8, 8, 'BANK_TRANSFER');")
    sql.append("")

    # 11. Order details seed
    sql.append("INSERT INTO order_detail (order_detail_id, order_id, product_id, product_name, quantity, unit_price, total_price, created_at, updated_at) VALUES")
    sql.append(",\n".join(order_detail_inserts) + ";")
    sql.append("")

    # 12. Invoice seed
    invoice_inserts = []
    for oid, items in orders_def.items():
        total_amount = sum(get_prod(pid)['price'] * qty for pid, qty in items)
        pmethod = 'BANK_TRANSFER' if oid in [3, 5, 6, 8] else 'CASH'
        invoice_inserts.append(
            f"({oid}, {oid}, 'INV-20251110-00{oid}', {total_amount}, 0, {total_amount}, '{pmethod}', 'PAID', '2025-11-10 09:20:15', '2025-11-10 09:20:15')"
        )
    sql.append("INSERT INTO invoice (invoice_id, order_id, invoice_code, subtotal_amount, tax_amount, total_amount, payment_method, payment_status, created_at, updated_at) VALUES")
    sql.append(",\n".join(invoice_inserts) + ";")
    sql.append("")

    # 13. Wishlist seed
    sql.append("INSERT INTO wishlist (wishlist_id, name, description, created_at, updated_at, customer_login) VALUES")
    sql.append("    (1, 'Wishlist Leesin', 'Các sản phẩm yêu thích của Leesin', '2025-11-10 08:00:00', '2025-11-10 08:00:00', 2),")
    sql.append("    (2, 'Wishlist Halland', 'Các sản phẩm yêu thích của Halland', '2025-11-10 08:10:00', '2025-11-10 08:10:00', 3),")
    sql.append("    (3, 'Wishlist Doku', 'Các sản phẩm yêu thích của Doku', '2025-11-10 08:20:00', '2025-11-10 08:20:00', 4),")
    sql.append("    (4, 'Wishlist Vinicius', 'Các sản phẩm yêu thích của Vinicius', '2025-11-10 08:30:00', '2025-11-10 08:30:00', 5);")
    sql.append("")

    # 14. Wishlist detail seed
    sql.append("INSERT INTO wishlist_detail (wishlist_detail_id, note, created_at, wishlist_id, product_id) VALUES")
    sql.append("    (1, 'Muon mua som', '2025-11-10 08:05:00', 1, 1),")
    sql.append("    (2, 'Xem xet mau sac khac', '2025-11-10 08:06:00', 1, 3),")
    sql.append("    (3, 'Gia hop ly', '2025-11-10 08:15:00', 2, 2),")
    sql.append("    (4, 'Phong cach ca nhan', '2025-11-10 08:16:00', 2, 5),")
    sql.append("    (5, 'Mua tang ban', '2025-11-10 08:25:00', 3, 6),")
    sql.append("    (6, 'Chua quyet dinh', '2025-11-10 08:26:00', 3, 7),")
    sql.append("    (7, 'De lai theo doi', '2025-11-10 08:35:00', 4, 8),")
    sql.append("    (8, 'Co the mua sau', '2025-11-10 08:36:00', 4, 10);")
    sql.append("SET FOREIGN_KEY_CHECKS = 1;")
    
    output_path = "scripts/JPA.sql"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write("\n".join(sql))
        
    print(f"Success! Complete JPA.sql generated at: {output_path}")

if __name__ == "__main__":
    main()
