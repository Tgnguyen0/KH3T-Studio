package fit.iuh.kh3tshopbe.dto.request;

import lombok.Data;

@Data
public class CartRequest {
    private int quantity;
    private double totalAmount;
}
