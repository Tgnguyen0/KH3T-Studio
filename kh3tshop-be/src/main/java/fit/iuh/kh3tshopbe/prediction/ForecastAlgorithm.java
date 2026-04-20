package fit.iuh.kh3tshopbe.prediction;

import fit.iuh.kh3tshopbe.dto.prediction.ForecastResult;
import fit.iuh.kh3tshopbe.dto.prediction.TimeSeriesData;

public interface ForecastAlgorithm {
    ForecastResult forecast(TimeSeriesData historicalData, int numberOfPeriods);
    String getName();
}
