package fit.iuh.kh3tshopbe.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MeetingRequest {
    String title;
    String description;
    String startTime;
    String endTime;
}
