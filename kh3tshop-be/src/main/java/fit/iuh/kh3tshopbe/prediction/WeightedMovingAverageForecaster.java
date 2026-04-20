package fit.iuh.kh3tshopbe.prediction;

import fit.iuh.kh3tshopbe.dto.prediction.ForecastPeriod;
import fit.iuh.kh3tshopbe.dto.prediction.ForecastResult;
import fit.iuh.kh3tshopbe.dto.prediction.RevenueDataPoint;
import fit.iuh.kh3tshopbe.dto.prediction.TimeSeriesData;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class WeightedMovingAverageForecaster implements ForecastAlgorithm{
    @Override
    public ForecastResult forecast(TimeSeriesData historicalData, int numberOfPeriods) {
        List<RevenueDataPoint> dataPoints = historicalData.getDataPoints();
        int n = dataPoints.size();

        if (n < 3) {
            throw new IllegalArgumentException("Cần ít nhất 3 điểm dữ liệu");
        }

        double[] data = dataPoints.stream()
                .mapToDouble(RevenueDataPoint::getRevenue)
                .toArray();

        // Xác định window size (tối đa 30% dữ liệu, tối thiểu 3)
        int windowSize = Math.max(3, Math.min(n / 3, 10));

        // Tính seasonal factors
        int seasonLength = getSeasonLength(historicalData.getPeriod());
        double[] seasonalFactors = calculateSeasonalFactors(data, seasonLength);

        // Tính trọng số giảm dần (exponential weights)
        double[] weights = calculateExponentialWeights(windowSize);

        // Tính xu hướng (trend)
        double trend = calculateTrend(data, windowSize);

        // Dự đoán
        List<Double> predictions = new ArrayList<>();
        double[] allData = Arrays.copyOf(data, n + numberOfPeriods);

        for (int i = 0; i < numberOfPeriods; i++) {
            int currentIndex = n + i;

            // Weighted moving average
            double wma = 0;
            double sumWeights = 0;

            for (int j = 0; j < windowSize && (currentIndex - j - 1) >= 0; j++) {
                wma += allData[currentIndex - j - 1] * weights[j];
                sumWeights += weights[j];
            }

            wma /= sumWeights;

            // Thêm trend
            double baseForeccast = wma + trend * (i + 1);

            // Điều chỉnh theo mùa vụ
            int seasonIndex = currentIndex % seasonLength;
            double seasonalForecast = baseForeccast * seasonalFactors[seasonIndex];

            double finalForecast = Math.max(0, seasonalForecast);
            predictions.add(finalForecast);
            allData[currentIndex] = finalForecast;
        }

        // Tính độ chính xác trên dữ liệu lịch sử
        double[] fittedValues = new double[n];
        for (int i = windowSize; i < n; i++) {
            double wma = 0;
            double sumWeights = 0;

            for (int j = 0; j < windowSize; j++) {
                wma += data[i - j - 1] * weights[j];
                sumWeights += weights[j];
            }

            fittedValues[i] = wma / sumWeights;
        }

        double mape = calculateMAPE(data, fittedValues, windowSize);
        double rmse = calculateRMSE(data, fittedValues, windowSize);

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
        return "Weighted Moving Average";
    }

    private int getSeasonLength(ForecastPeriod period) {
        switch (period) {
            case DAILY: return 7;
            case WEEKLY: return 4;
            case MONTHLY: return 12;
            default: return 7;
        }
    }

    private double[] calculateExponentialWeights(int windowSize) {
        double[] weights = new double[windowSize];
        double alpha = 0.5; // Hệ số giảm

        for (int i = 0; i < windowSize; i++) {
            weights[i] = Math.exp(-alpha * i);
        }

        return weights;
    }

    private double[] calculateSeasonalFactors(double[] data, int seasonLength) {
        double[] seasonalFactors = new double[seasonLength];
        double[] seasonalSums = new double[seasonLength];
        int[] counts = new int[seasonLength];

        double overallAverage = Arrays.stream(data).average().orElse(1.0);

        for (int i = 0; i < data.length; i++) {
            int seasonIndex = i % seasonLength;
            seasonalSums[seasonIndex] += data[i];
            counts[seasonIndex]++;
        }

        for (int i = 0; i < seasonLength; i++) {
            if (counts[i] > 0) {
                double seasonAverage = seasonalSums[i] / counts[i];
                seasonalFactors[i] = overallAverage > 0 ? seasonAverage / overallAverage : 1.0;
            } else {
                seasonalFactors[i] = 1.0;
            }
        }

        return seasonalFactors;
    }

    private double calculateTrend(double[] data, int windowSize) {
        int n = data.length;
        if (n < windowSize) return 0;

        double recentAvg = 0;
        double pastAvg = 0;

        for (int i = n - windowSize; i < n; i++) {
            recentAvg += data[i];
        }
        recentAvg /= windowSize;

        int startIndex = Math.max(0, n - 2 * windowSize);
        int endIndex = n - windowSize;
        for (int i = startIndex; i < endIndex; i++) {
            pastAvg += data[i];
        }
        pastAvg /= (endIndex - startIndex);

        return (recentAvg - pastAvg) / windowSize;
    }

    private double calculateMAPE(double[] actual, double[] fitted, int startIndex) {
        double sum = 0;
        int count = 0;

        for (int i = startIndex; i < actual.length; i++) {
            if (actual[i] != 0) {
                sum += Math.abs((actual[i] - fitted[i]) / actual[i]);
                count++;
            }
        }

        return count > 0 ? (sum / count) * 100 : 0;
    }

    private double calculateRMSE(double[] actual, double[] fitted, int startIndex) {
        double sum = 0;
        int count = 0;

        for (int i = startIndex; i < actual.length; i++) {
            double error = actual[i] - fitted[i];
            sum += error * error;
            count++;
        }

        return count > 0 ? Math.sqrt(sum / count) : 0;
    }
}
