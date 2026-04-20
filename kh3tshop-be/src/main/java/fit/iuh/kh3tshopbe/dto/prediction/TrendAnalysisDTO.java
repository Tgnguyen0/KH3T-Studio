package fit.iuh.kh3tshopbe.dto.prediction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrendAnalysisDTO {
    private String direction; // INCREASING, DECREASING, STABLE
    private double slope; // Độ dốc xu hướng
    private double rSquared; // R² - độ phù hợp của xu hướng
    private String description;
    private double growthPercentage; // % tăng trưởng
}
