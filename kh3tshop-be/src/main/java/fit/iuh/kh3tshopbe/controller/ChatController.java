package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.entities.Product;
import fit.iuh.kh3tshopbe.repository.ProductRepository;
import fit.iuh.kh3tshopbe.service.GeminiService;
import fit.iuh.kh3tshopbe.service.ProductCacheService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/chat")
public class ChatController {

    private final GeminiService geminiService;
    private final ProductCacheService productCacheService;

    // Lưu lịch sử chat theo token (dùng để Gemini nhớ ngữ cảnh)
    private static final Map<String, Deque<String>> chatHistory = new ConcurrentHashMap<>();
    private static final int MAX_MESSAGES = 10;

    public ChatController(GeminiService geminiService, ProductCacheService productCacheService) {
        this.geminiService = geminiService;
        this.productCacheService = productCacheService;
    }

    // ================== ENDPOINT MỚI: TRẢ VỀ JSON CÓ LINK SẢN PHẨM ==================
    @PostMapping("/ask")
    public ResponseEntity<Map<String, Object>> askGemini(
            HttpServletRequest request,
            @RequestBody PromptRequest promptRequest
    ) {
        String token = extractToken(request.getHeader("Authorization"));
        String userPrompt = promptRequest.getPrompt().trim();

        if (userPrompt.isEmpty()) {
            return ResponseEntity.ok(Map.of(
                    "message", "Dạ anh/chị nhắn gì cho em với ạ!",
                    "suggestedProducts", List.of()
            ));
        }

        String userId = token != null ? "user_" + token : "guest";
        Deque<String> history = chatHistory.computeIfAbsent(userId, k -> new ArrayDeque<>());

        // Lưu tin nhắn user
        history.addFirst("user: " + userPrompt);
        keepOnlyLastN(history, MAX_MESSAGES);

        // Gửi TOÀN BỘ sản phẩm với giá = costPrice
        String productContext = buildFullProductContextWithCostPrice();

        String shopInfo = """
            === KH3T SHOP - Trợ lý dễ thương ===
            - Chỉ bán online, ship toàn quốc
            - Đổi trả miễn phí 7 ngày (lỗi NSX)
            - Hotline/Zalo: 0903.456.789
            - Giờ làm: 8h30 - 22h00 
            - Quy trình đặt hàng: Chọn áo/quần muốn mua, chọn size, nhập thông tin cá nhân để ship hàng, thanh toán qua ngân hàng, ví điện tử, tiền mặt, các thắc mắc khác liên hệ MrK qua zalo số 0794263939
            - Các câu hỏi khác liên hệ Mr Khánh gia qua zalo
            """;

        String historyText = history.isEmpty() ? ""
                : "Lịch sử chat gần đây (mới nhất ở trên):\n" + String.join("\n", history) + "\n";

        String finalPrompt = """
            Bạn là cô trợ lý mua sắm SIÊU DỄ THƯƠNG của KH3T Shop
            Xưng "em", gọi khách là "anh/chị", dùng thật nhiều emoji
            Trả lời tự nhiên, ngắn gọn, tối đa 3 câu thôi nha!

            Thông tin shop:
            %s

            Lịch sử chat:
            %s

            Danh sách TOÀN BỘ sản phẩm (giá hiển thị là giá bán cuối cùng - costPrice):
            %s

            Khách vừa hỏi: "%s"
            Hãy trả lời thật dễ thương và chính xác nhé!
            """.formatted(shopInfo, historyText, productContext, userPrompt);

        try {
            String reply = geminiService.generateText(finalPrompt);

            String botReply = reply == null || reply.trim().isEmpty()
                    ? "Dạ để em kiểm tra lại giúp anh/chị nha!"
                    : reply.trim();

            // Lưu tin bot vào lịch sử
            history.addFirst("bot: " + botReply);
            keepOnlyLastN(history, MAX_MESSAGES);

            // === PHẦN MỚI: Tìm các sản phẩm được nhắc đến trong câu trả lời của bot ===
            List<Map<String, Object>> suggestedProducts = findSuggestedProducts(botReply);

            // ================== THÊM MỚI: PHÁT HIỆN YÊU CẦU SO SÁNH ==================
            List<Long> compareIds = detectCompareRequest(userPrompt, botReply);

            Map<String, Object> response = new HashMap<>();
            response.put("message", botReply);
            response.put("suggestedProducts", suggestedProducts);

            // Nếu khách muốn so sánh → thêm field compareIds
            if (compareIds != null && compareIds.size() >= 2 && compareIds.size() <= 4) {
                response.put("compareIds", compareIds);
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("message", "Em đang hơi lag xíu, anh/chị nhắn lại giúp em nha!");
            errorResponse.put("suggestedProducts", List.of());
            errorResponse.put("compareIds", null); // thêm cho an toàn
            return ResponseEntity.ok(errorResponse);
        }
    }

    // ================== HÀM MỚI: Tìm sản phẩm được nhắc đến trong câu trả lời của bot ==================
    private List<Map<String, Object>> findSuggestedProducts(String botReply) {
        List<Product> allProducts = productCacheService.getAllProducts();
        if (allProducts.isEmpty()) return List.of();

        String lowerReply = botReply.toLowerCase();

        return allProducts.stream()
                .filter(product -> {
                    String productNameLower = product.getName().toLowerCase();
                    return lowerReply.contains(productNameLower) ||
                            lowerReply.contains(productNameLower.replace(" ", "")) ||
                            lowerReply.contains(productNameLower.replace("-", "")) ||
                            lowerReply.contains(productNameLower.replace("&", ""));
                })
                .map(product -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", product.getId());
                    map.put("name", product.getName());
                    return map;
                })
                .distinct()
                .limit(5)
                .collect(Collectors.toList());
    }

    // ================== HÀM MỚI: PHÁT HIỆN YÊU CẦU SO SÁNH & TRẢ VỀ DANH SÁCH ID ==================
    private List<Long> detectCompareRequest(String userPrompt, String botReply) {
        String text = (userPrompt + " " + botReply).toLowerCase();
        System.out.println("=== [COMPARE DETECT] Bắt đầu kiểm tra yêu cầu so sánh ===");
        System.out.println("Text kết hợp (user + bot): " + text);

        // Từ khóa tiếng Việt phổ biến khi muốn so sánh
        boolean isCompareIntent = text.contains("so sánh") ||
                text.contains("vs") ||
                text.contains("versus") ||
                text.contains("đối chiếu") ||
                text.contains("khác nhau") ||
                text.contains("nên mua cái nào") ||
                text.contains("cái nào tốt ho") ||
                text.contains("vs với") ||
                text.contains("so với") ||
                (text.contains("trong 2 cái") && (text.contains("trong hai cái") || text.contains("so kè") || text.contains("phân tích")));
        System.out.println("Có từ khóa so sánh không? → " + isCompareIntent);
        if (!isCompareIntent){
            System.out.println("→ Không phát hiện ý định so sánh → trả về null");
            return null;
        }

        List<Product> allProducts = productCacheService.getAllProducts();
        Set<Long> mentionedIds = new HashSet<>();
        System.out.println("Danh sách sản phẩm đang kiểm tra (" + allProducts.size() + " món):");

        for (Product p : allProducts) {
            String name = p.getName().toLowerCase();
            String cleanName = name.replace(" ", "").replace("-", "").replace("&", "").replace("jeans", "").replace("shirt", "");

            if (text.contains(name) || text.contains(cleanName)) {
                mentionedIds.add((long) p.getId());
            }
        }

        if (mentionedIds.size() >= 2 && mentionedIds.size() <= 4) {
            return new ArrayList<>(mentionedIds);
        }

        return null;
    }

    // ================== CODE CŨ GIỮ NGUYÊN HOÀN TOÀN ==================
    private String buildFullProductContextWithCostPrice() {
        List<Product> products = productCacheService.getAllProducts();
        if (products.isEmpty()) {
            return "Shop đang cập nhật sản phẩm mới ạ!";
        }

        StringBuilder sb = new StringBuilder("=== DANH SÁCH SẢN PHẨM ===\n");

        for (Product p : products) {
            String finalPrice = String.format("%,.0fđ", p.getCostPrice());

            String sizeStr = p.getSizeDetails() == null || p.getSizeDetails().isEmpty()
                    ? "Hết hàng"
                    : p.getSizeDetails().stream()
                    .filter(sd -> sd.getQuantity() > 0)
                    .map(sd -> sd.getSize().getNameSize() + ":" + sd.getQuantity() + "c")
                    .reduce((a, b) -> a + ", " + b)
                    .orElse("Hết hàng");

            sb.append(String.format(
                    "• %s | Giá cuối: %s | Giảm: %,.0f%% | Rating: %.1f | Mô tả: %s | Chất liệu: %s | Form: %s | Size còn: %s\n",
                    p.getName(),
                    finalPrice,
                    p.getDiscountAmount(),
                    p.getRating(),
                    p.getDescription(),
                    p.getMaterial(),
                    p.getForm(),
                    sizeStr
            ));
        }

        sb.append("Tổng cộng: ").append(products.size()).append(" sản phẩm\n");
        return sb.toString();
    }

    private void keepOnlyLastN(Deque<String> deque, int max) {
        while (deque.size() > max) {
            deque.removeLast();
        }
    }

    public static class PromptRequest {
        private String prompt;
        public String getPrompt() { return prompt; }
        public void setPrompt(String prompt) { this.prompt = prompt; }
    }

    private String extractToken(String header) {
        if (header == null || !header.startsWith("Bearer ")) return null;
        return header.substring(7).trim();
    }
}