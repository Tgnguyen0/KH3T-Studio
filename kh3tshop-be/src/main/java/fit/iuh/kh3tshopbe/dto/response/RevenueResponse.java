package fit.iuh.kh3tshopbe.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class RevenueResponse {
    private String name;    // T2, Tháng 1, 2024...
    private double revenue;
    private double profit;
}
