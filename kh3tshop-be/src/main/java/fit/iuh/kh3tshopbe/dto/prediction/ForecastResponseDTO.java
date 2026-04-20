package fit.iuh.kh3tshopbe.dto.prediction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ForecastResponseDTO {
    private ForecastPeriod period;
    private List<ForecastPointDTO> forecasts;
    private ForecastMetricsDTO metrics;
    private SeasonalAnalysisDTO seasonalAnalysis;
    private TrendAnalysisDTO trendAnalysis;
    private LocalDateTime generatedAt;
    private List<String> algorithmsUsed;
}
