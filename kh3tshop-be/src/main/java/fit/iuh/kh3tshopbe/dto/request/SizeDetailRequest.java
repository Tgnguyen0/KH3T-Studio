package fit.iuh.kh3tshopbe.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SizeDetailRequest {
    int quantity;
    SizeRequest sizeRequest;
    private int productId;
    private int sizeId;
}
