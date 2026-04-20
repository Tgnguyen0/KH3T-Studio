package fit.iuh.kh3tshopbe.prediction;

import fit.iuh.kh3tshopbe.dto.prediction.ForecastPeriod;
import fit.iuh.kh3tshopbe.dto.prediction.ForecastResult;
import fit.iuh.kh3tshopbe.dto.prediction.RevenueDataPoint;
import fit.iuh.kh3tshopbe.dto.prediction.TimeSeriesData;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import static fit.iuh.kh3tshopbe.dto.prediction.ForecastPeriod.*;
@Component
public class ExponentialSmoothingForecaster  implements ForecastAlgorithm{

    private static final double ALPHA = 0.3; // Level smoothing
    private static final double BETA = 0.1;  // Trend smoothing
    private static final double GAMMA = 0.2; // Seasonal smoothing
    @Override
    public ForecastResult forecast(TimeSeriesData historicalData, int numberOfPeriods) {
        List<RevenueDataPoint> dataPoints = historicalData.getDataPoints();
        int n = dataPoints.size();

        if (n < 4) {
            throw new IllegalArgumentException("Cần ít nhất 4 điểm dữ liệu");
        }

        double[] data = dataPoints.stream()
                .mapToDouble(RevenueDataPoint::getRevenue)
                .toArray();

        // Khởi tạo
        double level = data[0];
        double trend = (data[n - 1] - data[0]) / n;

        // Tính seasonal pattern (chu kỳ 7 ngày cho daily, 4 tuần cho weekly)
        int seasonLength = getSeasonLength(historicalData.getPeriod());
        double[] seasonal = initializeSeasonalFactors(data, seasonLength);

        // Triple exponential smoothing
        double[] fittedValues = new double[n];

        for (int i = 0; i < n; i++) {
            double observation = data[i];
            int seasonIndex = i % seasonLength;

            // Cập nhật level
            double lastLevel = level;
            level = ALPHA * (observation - seasonal[seasonIndex]) + (1 - ALPHA) * (level + trend);

            // Cập nhật trend
            trend = BETA * (level - lastLevel) + (1 - BETA) * trend;

            // Cập nhật seasonal
            seasonal[seasonIndex] = GAMMA * (observation - level) + (1 - GAMMA) * seasonal[seasonIndex];

            fittedValues[i] = level + trend + seasonal[seasonIndex];
        }

        // Dự đoán
        List<Double> predictions = new ArrayList<>();
        for (int i = 0; i < numberOfPeriods; i++) {
            int seasonIndex = (n + i) % seasonLength;
            double forecast = level + (i + 1) * trend + seasonal[seasonIndex];
            predictions.add(Math.max(0, forecast));
        }

        double mape = calculateMAPE(data, fittedValues);
        double rmse = calculateRMSE(data, fittedValues);

        return ForecastResult.builder()
                .algorithmName(getName())
                .predictions(predictions)
                .mape(mape)
                .rmse(rmse)
                .weight(1.0)
                .build();
    }

    @Override
    public String getName() {
        return "Exponential Smoothing (Holt-Winters)";
    }

    private int getSeasonLength(ForecastPeriod period) {
        switch (period) {
            case DAILY: return 7; // Chu kỳ tuần
            case WEEKLY: return 4; // Chu kỳ tháng
            case MONTHLY: return 12; // Chu kỳ năm
            default: return 7;
        }
    }

    private double[] initializeSeasonalFactors(double[] data, int seasonLength) {
        double[] seasonal = new double[seasonLength];
        double average = 0;

        for (double value : data) {
            average += value;
        }
        average /= data.length;

        int[] counts = new int[seasonLength];
        for (int i = 0; i < data.length; i++) {
            seasonal[i % seasonLength] += data[i];
            counts[i % seasonLength]++;
        }

        for (int i = 0; i < seasonLength; i++) {
            if (counts[i] > 0) {
                seasonal[i] = (seasonal[i] / counts[i]) - average;
            }
        }

        return seasonal;
    }

    private double calculateMAPE(double[] actual, double[] fitted) {
        double sum = 0;
        int count = 0;

        for (int i = 0; i < actual.length; i++) {
            if (actual[i] != 0) {
                sum += Math.abs((actual[i] - fitted[i]) / actual[i]);
                count++;
            }
        }

        return count > 0 ? (sum / count) * 100 : 0;
    }

    private double calculateRMSE(double[] actual, double[] fitted) {
        double sum = 0;

        for (int i = 0; i < actual.length; i++) {
            double error = actual[i] - fitted[i];
            sum += error * error;
        }

        return Math.sqrt(sum / actual.length);
    }
}
