package fit.iuh.kh3tshopbe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PaymentStatisticResponse {
    private String name;
    private long value;      // số lượng đơn
    private double revenue;  // tổng doanh thu
    private String color;
    private long orders;
}
