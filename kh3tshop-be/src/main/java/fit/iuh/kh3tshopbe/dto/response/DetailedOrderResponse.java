package fit.iuh.kh3tshopbe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DetailedOrderResponse {
    private String id;
    private String customer;
    private double total;
    private String payment;
    private String status;
    private String date;
    private int items;
}
