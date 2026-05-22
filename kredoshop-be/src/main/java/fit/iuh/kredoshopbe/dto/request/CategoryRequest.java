package fit.iuh.kredoshopbe.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryRequest {
     String name;
     String description;
     String imageUrl;
     int display_order;
     boolean isActive;
}
