package fit.iuh.kh3tshopbe.service;


import fit.iuh.kh3tshopbe.dto.response.OrderResponse;
import fit.iuh.kh3tshopbe.entities.Customer;
import fit.iuh.kh3tshopbe.entities.Order;
import fit.iuh.kh3tshopbe.entities.Product;
import fit.iuh.kh3tshopbe.repository.OrderRepository;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.experimental.FieldDefaults;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendSimpleEmail(String to, String subject, String content) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(to);
        msg.setSubject(subject);
        msg.setText(content);
        mailSender.send(msg);

    }



    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true); // true = HTML

            mailSender.send(message);

        } catch (MessagingException e) {
            throw new RuntimeException("Lỗi gửi email: " + e.getMessage());
        }
    }

    @Async
    public void sendEmailToAllCustomers(List<Customer> customers, List<Product> products) {
        for (Customer c : customers) {
            try {
                // Giả lập logic build và send email của bạn
                String html = buildSoldOffEmail(products, c);
                sendHtmlEmail(c.getEmail(), "Sản phẩm hot sale trên website!", html);

                // Log để kiểm tra tiến độ trong console
                System.out.println("Đang gửi email cho: " + c.getEmail());
            } catch (Exception e) {
                System.err.println("Lỗi gửi cho " + c.getEmail() + ": " + e.getMessage());
            }
        }
        System.out.println("=== ĐÃ GỬI XONG TẤT CẢ EMAIL ===");
    }

    @Async
    public  void sendEmailToCustomerAfterPurchase(Customer customer, OrderResponse order) {
        String html = buildNoticationAfterPurchase(customer, order);
        sendHtmlEmail(customer.getEmail(), "Cảm ơn bạn đã mua hàng tại KH3TShop!", html);
    }
    public String buildNoticationAfterPurchase(Customer customer, OrderResponse order) {
        StringBuilder html = new StringBuilder();

        html.append("<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #f9f9f9; border: 1px solid #e5e7eb;'>");

        html.append("<h2 style='color: #D72638; text-align: center; margin-bottom: 10px;'>KH3TShop Thông Báo</h2>");
        html.append("<p style='font-size: 15px; color: #333;'>Xin chào <strong>")
                .append(customer.getFullName())
                .append("</strong>,</p>");

        // câu đã sửa
        html.append("<p style='font-size: 15px; color: #333;'>Đơn hàng có mã code <strong>")
                .append(order.getOrderCode())
                .append("</strong> của bạn đã được xác nhận.</p>");

        // footer
        html.append("<div style='text-align:center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;'>")
                .append("<p style='font-size: 14px; color: #777;'>Cảm ơn bạn đã luôn tin tưởng KH3TShop!</p>")
                .append("<p style='font-size: 13px; color: #aaa;'>© 2025 KH3TShop. Tất cả các quyền được bảo lưu.</p>")
                .append("</div>");

        html.append("</div>");

        return html.toString();
    }


    public String buildSoldOffEmail(List<Product> products, Customer customer) {
        StringBuilder html = new StringBuilder();

        html.append("<div style='font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border-radius: 10px; background: #ffffff; border: 1px solid #e5e7eb;'>");

        html.append("<h2 style='color: #D72638; text-align: center; margin-bottom: 10px;'>KH3TShop Thông Báo Khuyến Mãi</h2>");
        html.append("<p style='font-size: 15px; color: #333;'>Xin chào <strong>")
                .append(customer.getFullName())
                .append("</strong>,</p>");

        html.append("<p style='font-size: 15px; color: #333;'>Dưới đây là danh sách sản phẩm <strong style='color:#D72638;'>đang sale sốc</strong> dành cho bạn:</p>");

        // product list section
        html.append("<div style='margin-top: 20px;'>");

        for (Product p : products) {
            html.append("<div style='display: flex; padding: 15px; border-bottom: 1px solid #f0f0f0;'>");

            // image
            html.append("<div style='width: 30%;'>")
                    .append("<img src='").append(p.getImageUrlFront()).append("' alt='product' style='width: 100%; border-radius: 8px;'>")
                    .append("</div>");

            // info
            html.append("<div style='width: 70%; padding-left: 15px;'>")
                    .append("<h3 style='margin: 0; font-size: 16px; color: #111;'>").append(p.getName()).append("</h3>")
                    .append("<p style='margin: 6px 0; font-size: 14px; color: #555;'>")
                    .append("Giá gốc: <span style='text-decoration: line-through; color: #999;'>")
                    .append(String.format("%,.0f", p.getPrice()))
                    .append("₫ </span><br>")

                    .append("Giảm còn: <strong style='color: #D72638;'>")
                    .append(String.format("%,.0f", p.getPrice() * (100 - p.getDiscountAmount()) / 100))
                    .append("₫</strong><br>")

                    .append("Giảm giá: <strong style='color: #16a34a;'>")
                    .append(p.getDiscountAmount()).append("%</strong>")
                    .append("</p>")
                    .append("</div>");

            html.append("</div>");
        }

        html.append("</div>");

        // --- PHẦN THÊM MỚI: NÚT TRUY CẬP WEBSITE ---
        html.append("<div style='text-align: center; margin: 30px 0;'>")
                .append("<a href='http://localhost:5173/product' style='display: inline-block; padding: 12px 25px; background-color: #D72638; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;'>")
                .append("Xem thêm tại Website")
                .append("</a>")
                .append("</div>");
        // -------------------------------------------

        // footer
        html.append("<div style='text-align:center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb;'>")
                .append("<p style='font-size: 14px; color: #777;'>Cảm ơn bạn đã luôn tin tưởng KH3TShop!</p>")
                .append("<p style='font-size: 13px; color: #aaa;'>© 2025 KH3TShop. Tất cả các quyền được bảo lưu.</p>")
                .append("</div>");

        html.append("</div>");

        return html.toString();
    }

    @Async
    public void createMeetingEmail(List<Customer> employees, String meetLink) {
        for (Customer e : employees) {
            try {
                sendMeetingEmail(e.getEmail(), meetLink);
                System.out.println("Đang gửi email họp cho: " + e.getEmail());
            } catch (Exception ex) {
                System.err.println("Lỗi gửi cho " + e.getEmail() + ": " + ex.getMessage());
            }
        }
        System.out.println("=== ĐÃ GỬI XONG EMAIL HỌP ===");
    }


    public void sendMeetingEmail(String employeeEmail, String meetLink) {
        String content = """
            <h2>Cuộc họp mới đã được tạo</h2>
            <p>Vui lòng tham gia cuộc họp qua đường link sau:</p>
            <a href='%s' style='font-size:18px;font-weight:600;color:#2a7ae4;'>Tham gia Google Meet</a>
            """.formatted(meetLink);

        sendHtmlEmail(employeeEmail, "Lịch họp mới từ KH3TShop", content);
    }


}
