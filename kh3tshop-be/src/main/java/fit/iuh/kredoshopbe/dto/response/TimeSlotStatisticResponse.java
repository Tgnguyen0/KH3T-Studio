package fit.iuh.kredoshopbe.dto.response;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSlotStatisticResponse {
    private String time;
    private long orders;
    private double revenue;
}
