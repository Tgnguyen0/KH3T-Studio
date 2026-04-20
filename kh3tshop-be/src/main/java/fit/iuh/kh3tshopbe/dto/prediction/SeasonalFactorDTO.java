package fit.iuh.kh3tshopbe.dto.prediction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SeasonalFactorDTO {
    private String period; // "Thứ 2", "Tháng 1", "Quý 1"
    private double factor; // Hệ số mùa vụ (1.0 = trung bình)
    private double averageRevenue;
    private int orderCount; // Số đơn hàng trung bình
}
