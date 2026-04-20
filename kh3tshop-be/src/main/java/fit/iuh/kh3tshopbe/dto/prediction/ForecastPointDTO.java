package fit.iuh.kh3tshopbe.dto.prediction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastPointDTO {
    private LocalDate date; // Ngày dự đoán
    private double predictedRevenue; // Doanh thu dự đoán
    private double lowerBound; // Giới hạn dưới (confidence interval)
    private double upperBound; // Giới hạn trên
    private double confidence; // Độ tin cậy (0-100%)
    private String periodLabel; // Mô tả kỳ (VD: "Tuần 1/2025", "Tháng 1/2025")
}
