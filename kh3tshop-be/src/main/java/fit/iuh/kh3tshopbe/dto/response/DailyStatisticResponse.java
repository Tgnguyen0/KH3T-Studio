package fit.iuh.kh3tshopbe.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DailyStatisticResponse {
    private String date;
    private long revenue;
    private long orders;
    private long customers;
    private long products;
}
