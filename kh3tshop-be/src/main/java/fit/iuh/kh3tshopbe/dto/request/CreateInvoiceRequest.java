package fit.iuh.kh3tshopbe.dto.request;

import fit.iuh.kh3tshopbe.enums.PaymentMethod;
import fit.iuh.kh3tshopbe.enums.StatusPayment;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.validation.constraints.NotNull;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateInvoiceRequest {

    @NotNull(message = "Order ID là bắt buộc")
    private int orderId;

    @NotNull(message = "Phương thức thanh toán là bắt buộc")
    private PaymentMethod paymentMethod;

    @NotNull(message = "Trạng thái thanh toán là bắt buộc")
    private StatusPayment paymentStatus;
}