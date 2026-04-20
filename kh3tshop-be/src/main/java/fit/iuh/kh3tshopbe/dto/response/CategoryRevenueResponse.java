package fit.iuh.kh3tshopbe.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoryRevenueResponse {
    private String name;
    private long value;     // số lượng sản phẩm
    private double revenue; // tổng doanh thu
    private String color;
}