package fit.iuh.kh3tshopbe.dto.response;

import fit.iuh.kh3tshopbe.enums.PaymentMethod;
import fit.iuh.kh3tshopbe.enums.StatusPayment;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceResponse {
    private int id;
    private String invoiceCode;
    private PaymentMethod paymentMethod;
    private StatusPayment paymentStatus;
    private double subtotalAmount;
    private double taxAmount;
    private double totalAmount;
    private Date createdAt;
    private Date updatedAt;

    private OrderResponse order;

}