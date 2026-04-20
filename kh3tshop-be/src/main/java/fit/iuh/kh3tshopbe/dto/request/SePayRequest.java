package fit.iuh.kh3tshopbe.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.Date;

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
