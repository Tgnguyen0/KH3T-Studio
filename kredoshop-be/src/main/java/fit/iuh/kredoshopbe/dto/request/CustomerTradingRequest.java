package fit.iuh.kredoshopbe.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomerTradingRequest {
    private String receiverName;
    private String receiverPhone;
    private String receiverEmail;
    private String receiverAddress;
    private double totalAmount;
}
