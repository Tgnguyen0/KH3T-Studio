package fit.iuh.kh3tshopbe.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderDetailResponse {
    private String productName;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
    private int orderId;
    private int productId;
}
