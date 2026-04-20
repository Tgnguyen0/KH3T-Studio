package fit.iuh.kh3tshopbe.prediction;

import fit.iuh.kh3tshopbe.dto.prediction.ForecastResult;
import fit.iuh.kh3tshopbe.dto.prediction.RevenueDataPoint;
import fit.iuh.kh3tshopbe.dto.prediction.TimeSeriesData;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
@Component
public class PolynomialRegressionForecaster implements ForecastAlgorithm {
    @Override
    public ForecastResult forecast(TimeSeriesData historicalData, int numberOfPeriods) {
        List<RevenueDataPoint> dataPoints = historicalData.getDataPoints();
        int n = dataPoints.size();

        if (n < 3) {
            throw new IllegalArgumentException("Cần ít nhất 3 điểm dữ liệu để dự đoán");
        }

        // Chuẩn bị dữ liệu cho polynomial regression (degree 2)
        double[] x = new double[n];
        double[] y = new double[n];

        for (int i = 0; i < n; i++) {
            x[i] = i;
            y[i] = dataPoints.get(i).getRevenue();
        }

        // Tính các hệ số a, b, c cho y = ax^2 + bx + c
        double[] coefficients = fitPolynomial(x, y, 2);

        // Dự đoán
        List<Double> predictions = new ArrayList<>();
        for (int i = 0; i < numberOfPeriods; i++) {
            double futureX = n + i;
            double prediction = predictPolynomial(coefficients, futureX);
            predictions.add(Math.max(0, prediction)); // Đảm bảo không âm
        }

        // Tính MAPE
        double mape = calculateMAPE(x, y, coefficients);

        // Tính RMSE
        double rmse = calculateRMSE(x, y, coefficients);

        return ForecastResult.builder()
                .algorithmName(getName())
                .predictions(predictions)
                .mape(mape)
                .rmse(rmse)
                .weight(1.0) // Sẽ được điều chỉnh trong ensemble
                .build();
    }

    @Override
    public String getName() {
        return "Polynomial Regression";
    }

    private double[] fitPolynomial(double[] x, double[] y, int degree) {
        int n = x.length;
        int terms = degree + 1;

        // Xây dựng ma trận Vandermonde và vector y
        double[][] matrix = new double[terms][terms];
        double[] vector = new double[terms];

        for (int i = 0; i < terms; i++) {
            for (int j = 0; j < terms; j++) {
                double sum = 0;
                for (int k = 0; k < n; k++) {
                    sum += Math.pow(x[k], i + j);
                }
                matrix[i][j] = sum;
            }

            double sum = 0;
            for (int k = 0; k < n; k++) {
                sum += y[k] * Math.pow(x[k], i);
            }
            vector[i] = sum;
        }

        // Giải hệ phương trình tuyến tính (Gaussian elimination)
        return solveLinearSystem(matrix, vector);
    }

    private double[] solveLinearSystem(double[][] A, double[] b) {
        int n = b.length;
        double[][] augmented = new double[n][n + 1];

        for (int i = 0; i < n; i++) {
            System.arraycopy(A[i], 0, augmented[i], 0, n);
            augmented[i][n] = b[i];
        }

        // Forward elimination
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

            for (int k = i + 1; k < n; k++) {
                double factor = augmented[k][i] / augmented[i][i];
                for (int j = i; j <= n; j++) {
                    augmented[k][j] -= factor * augmented[i][j];
                }
            }
        }

        // Back substitution
        double[] solution = new double[n];
        for (int i = n - 1; i >= 0; i--) {
            solution[i] = augmented[i][n];
            for (int j = i + 1; j < n; j++) {
                solution[i] -= augmented[i][j] * solution[j];
            }
            solution[i] /= augmented[i][i];
        }

        return solution;
    }


    private double predictPolynomial(double[] coefficients, double x) {
        double result = 0;
        for (int i = 0; i < coefficients.length; i++) {
            result += coefficients[i] * Math.pow(x, i);
        }
        return result;
    }

    private double calculateMAPE(double[] x, double[] y, double[] coefficients) {
        double sumPercentageError = 0;
        int count = 0;

        for (int i = 0; i < x.length; i++) {
            double predicted = predictPolynomial(coefficients, x[i]);
            if (y[i] != 0) {
                sumPercentageError += Math.abs((y[i] - predicted) / y[i]);
                count++;
            }
        }

        return count > 0 ? (sumPercentageError / count) * 100 : 0;
    }
    private double calculateRMSE(double[] x, double[] y, double[] coefficients) {
        double sumSquaredError = 0;

        for (int i = 0; i < x.length; i++) {
            double predicted = predictPolynomial(coefficients, x[i]);
            double error = y[i] - predicted;
            sumSquaredError += error * error;
        }

        return Math.sqrt(sumSquaredError / x.length);
    }
}
