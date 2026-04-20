package fit.iuh.kh3tshopbe.prediction;

import fit.iuh.kh3tshopbe.dto.prediction.ForecastResult;
import fit.iuh.kh3tshopbe.dto.prediction.RevenueDataPoint;
import fit.iuh.kh3tshopbe.dto.prediction.TimeSeriesData;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
public class ARIMAForecaster implements ForecastAlgorithm{
    private static final int AR_ORDER = 2; // AutoRegressive order
    private static final int MA_ORDER = 1; // Moving Average order
    @Override
    public ForecastResult forecast(TimeSeriesData historicalData, int numberOfPeriods) {
        List<RevenueDataPoint> dataPoints = historicalData.getDataPoints();
        int n = dataPoints.size();

        if (n < AR_ORDER + MA_ORDER + 2) {
            throw new IllegalArgumentException("Không đủ dữ liệu cho mô hình ARIMA");
        }

        double[] data = dataPoints.stream()
                .mapToDouble(RevenueDataPoint::getRevenue)
                .toArray();

        // Bước 1: Differencing để làm chuỗi stationary
        double[] diffData = difference(data);

        // Bước 2: Ước lượng AR coefficients
        double[] arCoeffs = estimateARCoefficients(diffData, AR_ORDER);

        // Bước 3: Tính residuals
        double[] residuals = calculateResiduals(diffData, arCoeffs);

        // Bước 4: Ước lượng MA coefficients
        double[] maCoeffs = estimateMACoefficients(residuals, MA_ORDER);

        // Bước 5: Dự đoán
        List<Double> predictions = new ArrayList<>();
        double[] extendedDiff = Arrays.copyOf(diffData, diffData.length + numberOfPeriods);
        double[] extendedResiduals = Arrays.copyOf(residuals, residuals.length + numberOfPeriods);
        double lastValue = data[n - 1];

        for (int i = 0; i < numberOfPeriods; i++) {
            int idx = diffData.length + i;

            // AR component
            double arComponent = 0;
            for (int j = 0; j < AR_ORDER && idx - j - 1 >= 0; j++) {
                arComponent += arCoeffs[j] * extendedDiff[idx - j - 1];
            }

            // MA component
            double maComponent = 0;
            for (int j = 0; j < MA_ORDER && idx - j - 1 >= 0; j++) {
                maComponent += maCoeffs[j] * extendedResiduals[idx - j - 1];
            }

            double forecastDiff = arComponent + maComponent;
            extendedDiff[idx] = forecastDiff;
            extendedResiduals[idx] = 0; // Assume zero residual for future

            // Integrate back (reverse differencing)
            lastValue += forecastDiff;
            predictions.add(Math.max(0, lastValue));
        }

        // Tính độ chính xác
        double[] fittedDiff = fitARMA(diffData, arCoeffs, maCoeffs, residuals);
        double[] fittedValues = integrate(data[0], fittedDiff);

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
        return "ARIMA";
    }

    private double[] difference(double[] data) {
        double[] diff = new double[data.length - 1];
        for (int i = 0; i < diff.length; i++) {
            diff[i] = data[i + 1] - data[i];
        }
        return diff;
    }

    private double[] estimateARCoefficients(double[] data, int order) {
        int n = data.length;
        double[][] matrix = new double[order][order];
        double[] vector = new double[order];

        // Yule-Walker equations
        double[] autocorr = calculateAutocorrelation(data, order + 1);

        for (int i = 0; i < order; i++) {
            for (int j = 0; j < order; j++) {
                matrix[i][j] = autocorr[Math.abs(i - j)];
            }
            vector[i] = autocorr[i + 1];
        }

        return solveLinearSystem(matrix, vector);
    }

    private double[] calculateAutocorrelation(double[] data, int maxLag) {
        int n = data.length;
        double mean = Arrays.stream(data).average().orElse(0);
        double[] autocorr = new double[maxLag];

        double variance = 0;
        for (double value : data) {
            variance += Math.pow(value - mean, 2);
        }
        variance /= n;

        for (int lag = 0; lag < maxLag; lag++) {
            double sum = 0;
            for (int i = 0; i < n - lag; i++) {
                sum += (data[i] - mean) * (data[i + lag] - mean);
            }
            autocorr[lag] = sum / (n * variance);
        }

        return autocorr;
    }

    private double[] calculateResiduals(double[] data, double[] arCoeffs) {
        int n = data.length;
        double[] residuals = new double[n];

        for (int i = arCoeffs.length; i < n; i++) {
            double fitted = 0;
            for (int j = 0; j < arCoeffs.length; j++) {
                fitted += arCoeffs[j] * data[i - j - 1];
            }
            residuals[i] = data[i] - fitted;
        }

        return residuals;
    }

    private double[] estimateMACoefficients(double[] residuals, int order) {
        // Simplified MA estimation
        double[] maCoeffs = new double[order];
        double[] autocorr = calculateAutocorrelation(residuals, order + 1);

        for (int i = 0; i < order; i++) {
            maCoeffs[i] = -autocorr[i + 1];
        }

        return maCoeffs;
    }

    private double[] fitARMA(double[] data, double[] arCoeffs, double[] maCoeffs, double[] residuals) {
        int n = data.length;
        double[] fitted = new double[n];

        for (int i = Math.max(arCoeffs.length, maCoeffs.length); i < n; i++) {
            double arComponent = 0;
            for (int j = 0; j < arCoeffs.length && i - j - 1 >= 0; j++) {
                arComponent += arCoeffs[j] * data[i - j - 1];
            }

            double maComponent = 0;
            for (int j = 0; j < maCoeffs.length && i - j - 1 >= 0; j++) {
                maComponent += maCoeffs[j] * residuals[i - j - 1];
            }

            fitted[i] = arComponent + maComponent;
        }

        return fitted;
    }

    private double[] integrate(double initialValue, double[] diffData) {
        double[] integrated = new double[diffData.length + 1];
        integrated[0] = initialValue;

        for (int i = 0; i < diffData.length; i++) {
            integrated[i + 1] = integrated[i] + diffData[i];
        }

        return integrated;
    }

    private double[] solveLinearSystem(double[][] A, double[] b) {
        int n = b.length;
        double[][] augmented = new double[n][n + 1];

        for (int i = 0; i < n; i++) {
            System.arraycopy(A[i], 0, augmented[i], 0, n);
            augmented[i][n] = b[i];
        }

        for (int i = 0; i < n; i++) {
            int maxRow = i;
            for (int k = i + 1; k < n; k++) {
                if (Math.abs(augmented[k][i]) > Math.abs(augmented[maxRow][i])) {
                    maxRow = k;
                }
            }

            double[] temp = augmented[i];
            augmented[i] = augmented[maxRow];
            augmented[maxRow] = temp;

            if (Math.abs(augmented[i][i]) < 1e-10) continue;

            for (int k = i + 1; k < n; k++) {
                double factor = augmented[k][i] / augmented[i][i];
                for (int j = i; j <= n; j++) {
                    augmented[k][j] -= factor * augmented[i][j];
                }
            }
        }

        double[] solution = new double[n];
        for (int i = n - 1; i >= 0; i--) {
            solution[i] = augmented[i][n];
            for (int j = i + 1; j < n; j++) {
                solution[i] -= augmented[i][j] * solution[j];
            }
            if (Math.abs(augmented[i][i]) > 1e-10) {
                solution[i] /= augmented[i][i];
            }
        }

        return solution;
    }

    private double calculateMAPE(double[] actual, double[] fitted) {
        double sum = 0;
        int count = 0;
        int startIdx = Math.max(AR_ORDER, MA_ORDER);

        for (int i = startIdx; i < Math.min(actual.length, fitted.length); i++) {
            if (actual[i] != 0) {
                sum += Math.abs((actual[i] - fitted[i]) / actual[i]);
                count++;
            }
        }

        return count > 0 ? (sum / count) * 100 : 0;
    }

    private double calculateRMSE(double[] actual, double[] fitted) {
        double sum = 0;
        int count = 0;
        int startIdx = Math.max(AR_ORDER, MA_ORDER);

        for (int i = startIdx; i < Math.min(actual.length, fitted.length); i++) {
            double error = actual[i] - fitted[i];
            sum += error * error;
            count++;
        }

        return count > 0 ? Math.sqrt(sum / count) : 0;
    }
}
