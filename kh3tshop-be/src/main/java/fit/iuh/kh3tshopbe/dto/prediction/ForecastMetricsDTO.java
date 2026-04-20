package fit.iuh.kh3tshopbe.dto.prediction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastMetricsDTO {
    private double averagePredictedRevenue;
    private double totalPredictedRevenue;
    private double growthRate; // Tốc độ tăng trưởng dự kiến (%)
    private double volatility; // Độ biến động
    private double modelAccuracy; // Độ chính xác mô hình (MAPE %)
    private String trendDirection; // UP, DOWN, STABLE
}
