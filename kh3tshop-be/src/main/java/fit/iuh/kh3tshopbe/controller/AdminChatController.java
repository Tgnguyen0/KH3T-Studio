package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.entities.Product;
import fit.iuh.kh3tshopbe.enums.StatusOrdering;
import fit.iuh.kh3tshopbe.repository.AccountRepository;
import fit.iuh.kh3tshopbe.repository.CustomerRepository;
import fit.iuh.kh3tshopbe.repository.OrderRepository;
import fit.iuh.kh3tshopbe.repository.ProductRepository;
import fit.iuh.kh3tshopbe.service.GeminiService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/admin-chat")
public class AdminChatController {

    @Autowired private GeminiService geminiService;
    @Autowired private OrderRepository orderRepository;
    @Autowired private ProductRepository productRepository;
    @Autowired private AccountRepository accountRepository;
    @Autowired private CustomerRepository customerRepository;

    // ======== Chat history ========
    private static final Map<String, Deque<String>> chatHistory = new ConcurrentHashMap<>();
    private static final int MAX_MESSAGES = 10;

    @PostMapping("/ask")
    public ResponseEntity<String> askAdminBot(
            HttpServletRequest request,
            @RequestBody Map<String, String> body
    ) {
        String prompt = body.get("prompt");
        if (prompt == null || prompt.trim().isEmpty()) {
            return ResponseEntity.ok("Sếp nhắn gì cho em với ạ!");
        }
        prompt = prompt.trim();

        // SIÊU CHUẨN: Ưu tiên token → F5 vẫn giữ chat
        // Nếu chưa login → dùng session (vẫn giữ được khi F5 bình thường)
        String token = extractToken(request.getHeader("Authorization"));
        String adminId;

        if (token != null && !token.isEmpty()) {
            // Đã login → dùng token (F5 vẫn giữ nguyên vì token vẫn còn trong localStorage)
            adminId = "admin_" + token.hashCode(); // Dùng hashCode để key ngắn + ổn định
        } else {
            // Chưa login hoặc token null (F5 lúc đầu) → dùng guest admin ID theo session
            String guestAdminId = (String) request.getSession().getAttribute("adminGuestChatId");
            if (guestAdminId == null) {
                guestAdminId = "admin_guest_" + UUID.randomUUID().toString().substring(0, 8);
                request.getSession().setAttribute("adminGuestChatId", guestAdminId);
            }
            adminId = guestAdminId;
        }

        Deque<String> history = chatHistory.computeIfAbsent(adminId, k -> new ArrayDeque<>());

        // Lưu tin nhắn của sếp
        history.addFirst("admin: " + prompt);
        keepOnlyLastN(history, MAX_MESSAGES);

        String stats = generateAdminStats();

        String historyText = history.isEmpty() ? ""
                : "Lịch sử chat gần đây (mới nhất ở trên):\n" + String.join("\n", history) + "\n";

        String finalPrompt = """
    Bạn là Trợ lý CEO siêu thông minh của KH3T Shop – cực kỳ chuyên nghiệp, nói chuyện như giám đốc!
    Xưng "em", gọi admin là "sếp" hoặc "anh/chị chủ shop"
    Dùng tiếng Việt, trả lời ngắn gọn, có số liệu chính xác, thêm biểu tượng cảm xúc phù hợp
    Không cần chào hỏi dài dòng, đi thẳng vào vấn đề luôn!

    DỮ LIỆU THỐNG KÊ HIỆN TẠI (cập nhật realtime):
    %s

    Lịch sử chat:
    %s

    Sếp hỏi: "%s"
    Hãy trả lời cực kỳ chuyên nghiệp, có số liệu, có dự đoán nếu được!
    """.formatted(stats, historyText, prompt);

        try {
            String reply = geminiService.generateText(finalPrompt);
            String botReply = reply == null || reply.trim().isEmpty()
                    ? "Em đang tính toán giúp sếp..."
                    : reply.trim();

            // Lưu tin nhắn bot
            history.addFirst("bot: " + botReply);
            keepOnlyLastN(history, MAX_MESSAGES);

            return ResponseEntity.ok(botReply);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok("Em đang cập nhật dữ liệu, sếp hỏi lại sau 1 phút nha!");
        }
    }


    private void keepOnlyLastN(Deque<String> deque, int max) {
        while (deque.size() > max) {
            deque.removeLast();
        }
    }

    // ======== Chức năng cũ ========
    private LocalDate toLocalDate(java.util.Date date) {
        if (date == null) return null;
        if (date instanceof java.sql.Timestamp ts) {
            return ts.toLocalDateTime().toLocalDate();
        }
        return date.toInstant()
                .atZone(ZoneId.systemDefault())
                .toLocalDate();
    }

    private String generateAdminStats() {
        LocalDate today = LocalDate.now();
        LocalDate startOfMonth = today.withDayOfMonth(1);
        LocalDate sevenDaysAgo = today.minusDays(7);

        // ===== DOANH THU =====

        // Revenue today
        double revenueToday = orderRepository.findAll().stream()
                .filter(o -> o.getOrderDate() != null)
                .filter(o -> toLocalDate(o.getOrderDate()).isEqual(today))
                .filter(o -> o.getInvoice() != null)
                .mapToDouble(o -> o.getInvoice().getTotalAmount())
                .sum();

        // Revenue last 7 days
        double revenueLast7Days = orderRepository.findAll().stream()
                .filter(o -> o.getOrderDate() != null)
                .map(o -> toLocalDate(o.getOrderDate()))
                .filter(date -> !date.isBefore(sevenDaysAgo) && !date.isAfter(today))
                .mapToDouble(date -> orderRepository.findAll().stream()
                        .filter(o -> toLocalDate(o.getOrderDate()).equals(date))
                        .filter(o -> o.getInvoice() != null)
                        .mapToDouble(o -> o.getInvoice().getTotalAmount())
                        .sum())
                .sum();

        // Highest revenue day this month
        Map<LocalDate, Double> revenueByDay = new HashMap<>();
        orderRepository.findAll().forEach(o -> {
            if (o.getOrderDate() != null && o.getInvoice() != null) {
                LocalDate d = toLocalDate(o.getOrderDate());
                if (!d.isBefore(startOfMonth)) {
                    revenueByDay.put(d,
                            revenueByDay.getOrDefault(d, 0.0) + o.getInvoice().getTotalAmount());
                }
            }
        });

        LocalDate highestRevenueDay = revenueByDay.entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse(null);

        double highestRevenueAmount = highestRevenueDay != null
                ? revenueByDay.get(highestRevenueDay)
                : 0;

        // ===== TOP SẢN PHẨM BÁN CHẠY =====
        List<String> top5Products = productRepository.findAll().stream()
                .filter(p -> p.getOrderDetails() != null && !p.getOrderDetails().isEmpty())
                .sorted((p1, p2) -> Integer.compare(
                        p2.getOrderDetails().stream().mapToInt(od -> od.getQuantity()).sum(),
                        p1.getOrderDetails().stream().mapToInt(od -> od.getQuantity()).sum()
                ))
                .limit(5)
                .map(p -> p.getName())
                .toList();

        // ===== ĐƠN HÀNG THEO TRẠNG THÁI =====
        long pendingOrders = orderRepository.countByStatusOrder(StatusOrdering.PENDING);
        long cancelledOrders = orderRepository.countByStatusOrder(StatusOrdering.CANCELLED);

        // ===== RETURN NGẮN GỌN NHƯ SẾP YÊU CẦU =====
        return """
Doanh thu hôm nay: %,.0fđ
Doanh thu 7 ngày qua: %,.0fđ
Ngày doanh thu cao nhất tháng: %s (%,.0fđ)
Top 5 sản phẩm bán chạy:
%s
Đơn chờ xử lý: %d
Đơn bị hủy: %d
""".formatted(
                revenueToday,
                revenueLast7Days,
                highestRevenueDay != null ? highestRevenueDay : "Chưa có",
                highestRevenueAmount,
                String.join(", ", top5Products),
                pendingOrders,
                cancelledOrders
        );
    }


    private String extractToken(String header) {
        if (header == null || !header.startsWith("Bearer ")) return null;
        return header.substring(7).trim();
    }
}
