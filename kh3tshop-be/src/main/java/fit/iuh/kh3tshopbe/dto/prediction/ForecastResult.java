package fit.iuh.kh3tshopbe.dto.prediction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastResult {
    private String algorithmName;
    private List<Double> predictions;
    private double mape; // Mean Absolute Percentage Error
    private double rmse; // Root Mean Square Error
    private double weight; // Trọng số trong ensemble
}
