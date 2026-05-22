package fit.iuh.kredoshopbe.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SePayRequest {
    String gateway;
    String transactionDate;
    String accountNumber;
    String subAccount;
    String code;
    String content;
    String transferType;
    String description;
    double transferAmount;
    String referenceCode;
    double accumulated;
    long id;
}
