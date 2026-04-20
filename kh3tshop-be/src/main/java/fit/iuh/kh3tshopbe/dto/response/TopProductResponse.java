package fit.iuh.kh3tshopbe.dto.response;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TopProductResponse {
    String name;
    String category;
    int sales;
    double revenue;
    String trend;
    String img;
}
