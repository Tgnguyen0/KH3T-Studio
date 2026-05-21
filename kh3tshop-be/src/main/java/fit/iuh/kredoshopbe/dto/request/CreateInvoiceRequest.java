package fit.iuh.kredoshopbe.dto.request;

import fit.iuh.kredoshopbe.enums.PaymentMethod;
import fit.iuh.kredoshopbe.enums.StatusPayment;
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