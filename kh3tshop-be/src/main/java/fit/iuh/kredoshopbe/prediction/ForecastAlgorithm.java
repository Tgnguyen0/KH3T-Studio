package fit.iuh.kredoshopbe.prediction;

import fit.iuh.kredoshopbe.dto.prediction.ForecastResult;
import fit.iuh.kredoshopbe.dto.prediction.TimeSeriesData;

public interface ForecastAlgorithm {
    ForecastResult forecast(TimeSeriesData historicalData, int numberOfPeriods);
    String getName();
}
