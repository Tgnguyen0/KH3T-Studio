package fit.iuh.kredoshopbe.dto.request;

import fit.iuh.kredoshopbe.enums.PaymentMethod;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderRequest {
    private String note;
    private int customerTradingId;
    private int account_id;
    private PaymentMethod paymentMethod;
}
