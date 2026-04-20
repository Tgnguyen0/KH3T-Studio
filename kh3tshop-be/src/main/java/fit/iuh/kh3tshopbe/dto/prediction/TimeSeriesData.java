package fit.iuh.kh3tshopbe.dto.prediction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimeSeriesData {
    private List<RevenueDataPoint> dataPoints;
    private ForecastPeriod period;
    private LocalDate startDate;
    private LocalDate endDate;
    private int size;

    public double[] getRevenueArray() {
        return dataPoints.stream()
                .mapToDouble(RevenueDataPoint::getRevenue)
                .toArray();
    }

    public double[] getTimeIndexArray() {
        double[] indices = new double[dataPoints.size()];
        for (int i = 0; i < dataPoints.size(); i++) {
            indices[i] = i;
        }
        return indices;
    }
}
