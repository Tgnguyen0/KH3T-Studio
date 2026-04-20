package fit.iuh.kh3tshopbe.dto.response;
import fit.iuh.kh3tshopbe.enums.Status;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductResponse {

    private int id;
    private String name;
    private String description;
    private double price;
    private double costPrice; // THÊM: Giá giảm (cost_price from DB)
    private String unit;
    private int quantity;
    private String imageUrlFront;
    private String imageUrlBack;
    private Date createdAt; // THÊM: created_at
    private Date updatedAt;
    private double rating;
    private CategoryResponse category;
    private double discountAmount;
    private String material; // THÊM: material
    private String form; // THÊM: form
    private Long soldQuantity;
    private Status status;

    private List<SizeDetailResponse> sizeDetails; // THÊM: List size details cho buttons

    // THÊM: Inner class cho SizeDetail DTO
    @Data
    @Builder
    public static class SizeDetailResponse {
        private int id;
        private String sizeName; // Từ Size.nameSize
        private int quantity; // Số lượng còn lại cho size này
    }


}

