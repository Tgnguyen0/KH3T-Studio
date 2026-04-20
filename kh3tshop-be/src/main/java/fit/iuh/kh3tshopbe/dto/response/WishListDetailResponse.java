// src/main/java/fit/iuh/kh3tshopbe/dto/response/WishlistDetailResponse.java
package fit.iuh.kh3tshopbe.dto.response;

import lombok.*;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WishListDetailResponse {
    private Integer id;
    private String note;
    private Date created_at;
    private Integer wishlistId;
    private Integer productId;
    private String productName;
    private String productImage;
    private Double productPrice;
    private Integer discountAmount;
}