package fit.iuh.kredoshopbe.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartResponse {
    private int id;
    private int totalQuantity;
    private double totalAmount;
}
