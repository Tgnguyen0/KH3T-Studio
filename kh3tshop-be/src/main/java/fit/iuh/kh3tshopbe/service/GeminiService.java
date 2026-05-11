package fit.iuh.kh3tshopbe.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient;

    // System prompt chuyên biệt cho web thời trang
    private static final String FASHION_SYSTEM_PROMPT = """
            Bạn là trợ lý tư vấn thời trang chuyên nghiệp của shop KH3T.
            Nhiệm vụ của bạn:
            - Tư vấn phối đồ, chọn size, màu sắc phù hợp với khách hàng
            - Gợi ý sản phẩm dựa trên nhu cầu và phong cách của khách
            - Trả lời các câu hỏi về chất liệu, cách bảo quản quần áo
            - Hỗ trợ đơn hàng, đổi trả, chính sách shop
            Luôn trả lời bằng tiếng Việt, thân thiện và ngắn gọn.
            """;

    public GeminiService(WebClient webClient) {
        this.webClient = webClient;
    }

    public String generateText(String prompt) {
        String url = "/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> requestBody = Map.of(
                "system_instruction", Map.of(
                        "parts", List.of(Map.of("text", FASHION_SYSTEM_PROMPT))
                ),
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                ),
                "generationConfig", Map.of(
                        "temperature", 0.7,       // Sáng tạo vừa phải
                        "maxOutputTokens", 500,   // Giới hạn độ dài trả lời
                        "topP", 0.9
                )
        );

        try {
            Map<String, Object> response = webClient.post()
                    .uri(url)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(new ParameterizedTypeReference<Map<String, Object>>() {})
                    .block();

            if (response == null || !response.containsKey("candidates")) {
                return "Gemini API response is empty or invalid.";
            }

            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates.isEmpty()) {
                return "No candidates returned from Gemini API.";
            }

            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");

            return (String) parts.get(0).get("text");

        } catch (WebClientResponseException e) {
            return "Gemini API error: " + e.getStatusCode() + " - " + e.getResponseBodyAsString();
        } catch (Exception e) {
            return "Error calling Gemini API: " + e.getMessage();
        }
    }
}
