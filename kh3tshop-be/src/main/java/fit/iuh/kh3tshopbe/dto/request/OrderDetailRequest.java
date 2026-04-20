package fit.iuh.kh3tshopbe.dto.request;

import jakarta.persistence.Column;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderDetailRequest {

    private String productName;
    private int quantity;
    private double unitPrice;
    private double totalPrice;
    private int orderId;
    private int productId;
}
