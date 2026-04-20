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
public class SeasonalAnalysisDTO {
    private boolean hasSeasonality;
    private String seasonalPattern; // WEEKLY, MONTHLY, QUARTERLY
    private List<SeasonalFactorDTO> factors;
    private String peakPeriod; // Kỳ có doanh thu cao nhất
    private String lowPeriod; // Kỳ có doanh thu thấp nhất
}
