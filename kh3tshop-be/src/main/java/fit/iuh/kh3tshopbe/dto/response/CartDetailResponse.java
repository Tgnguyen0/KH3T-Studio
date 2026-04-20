package fit.iuh.kh3tshopbe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDetailResponse {
    private int id;
    private int productId;
    private String productName;
    private String productImage;
    private double priceAtTime;
    private int quantity;
    private double subtotal;
    private boolean isSelected;
    private int sizeDetailId;
    private String sizeName;
}
