
package fit.iuh.kh3tshopbe.dto.response;

import lombok.*;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishListResponse {
    private Integer id;
    private String name;
    private String description;
    private Date created_at;
    private Date updated_at;
    private String username;
    private Integer itemCount;
}