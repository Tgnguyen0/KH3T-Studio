package fit.iuh.kh3tshopbe.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartDetailRequest {
    private int productId;
    private int cartId;
    private int sizeDetailId;
    private int quantity;
}
