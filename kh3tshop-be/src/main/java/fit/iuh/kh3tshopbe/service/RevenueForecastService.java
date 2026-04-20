package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.prediction.*;
import fit.iuh.kh3tshopbe.enums.StatusPayment;
import fit.iuh.kh3tshopbe.prediction.*;
import fit.iuh.kh3tshopbe.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class RevenueForecastService {
    private final InvoiceRepository forecastRepository;
    private final PolynomialRegressionForecaster polynomialForecaster;
    private final ExponentialSmoothingForecaster exponentialForecaster;
    private final WeightedMovingAverageForecaster wmaForecaster;
    private final ARIMAForecaster arimaForecaster;

    public ForecastResponseDTO forecast(ForecastRequestDTO request) {
        log.info("Starting revenue forecast for period: {}, numberOfPeriods: {}",
                request.getPeriod(), request.getNumberOfPeriods());

        // Validate request
        validateRequest(request);

        // Thu thập dữ liệu lịch sử
        TimeSeriesData historicalData = collectHistoricalData(request.getPeriod());

        // Kiểm tra đủ dữ liệu
        validateHistoricalData(historicalData, request.getPeriod());

        // Chạy các thuật toán dự đoán
        List<ForecastResult> algorithmResults = runForecastAlgorithms(
                historicalData,
                request.getNumberOfPeriods(),
                request.getAlgorithms()
        );

        // Ensemble predictions (kết hợp các mô hình)
        List<Double> ensemblePredictions = ensemblePredictions(algorithmResults);

        // Tính confidence intervals
        List<ForecastPointDTO> forecastPoints = buildForecastPoints(
                ensemblePredictions,
                historicalData,
                request,
                algorithmResults
        );

        // Phân tích mùa vụ
        SeasonalAnalysisDTO seasonalAnalysis = analyzeSeasonality(historicalData);

        // Phân tích xu hướng
        TrendAnalysisDTO trendAnalysis = analyzeTrend(historicalData);

        // Tính metrics
        ForecastMetricsDTO metrics = calculateMetrics(
                forecastPoints,
                algorithmResults,
                trendAnalysis
        );

        log.info("Forecast completed successfully. Average predicted revenue: {}",
                metrics.getAveragePredictedRevenue());

        return ForecastResponseDTO.builder()
                .period(request.getPeriod())
                .forecasts(forecastPoints)
                .metrics(metrics)
                .seasonalAnalysis(seasonalAnalysis)
                .trendAnalysis(trendAnalysis)
                .generatedAt(LocalDateTime.now())
                .algorithmsUsed(algorithmResults.stream()
                        .map(ForecastResult::getAlgorithmName)
                        .collect(Collectors.toList()))
                .build();
    }

    private TimeSeriesData collectHistoricalData(ForecastPeriod period) {
        // Xác định khoảng thời gian cần lấy dữ liệu
        Date endDate = new Date();
        Date startDate = calculateStartDate(endDate, period);

        List<RevenueDataPoint> dataPoints = new ArrayList<>();

        switch (period) {
            case DAILY:
                dataPoints = collectDailyData(startDate, endDate);
                break;
            case WEEKLY:
                dataPoints = collectWeeklyData(startDate, endDate);
                break;
            case MONTHLY:
                dataPoints = collectMonthlyData(startDate, endDate);
                break;
        }

        log.info("Collected {} data points for period {}", dataPoints.size(), period);

        return TimeSeriesData.builder()
                .dataPoints(dataPoints)
                .period(period)
                .startDate(convertToLocalDate(startDate))
                .endDate(convertToLocalDate(endDate))
                .size(dataPoints.size())
                .build();
    }

    private List<RevenueDataPoint> collectDailyData(Date startDate, Date endDate) {
        List<Object[]> results = forecastRepository.findDailyRevenue(
                startDate, endDate, StatusPayment.PAID
        );

        return results.stream()
                .map(row -> {
                    java.sql.Date sqlDate = (java.sql.Date) row[0];
                    LocalDate date = sqlDate.toLocalDate();
                    Double revenue = ((Number) row[1]).doubleValue();
                    Long orderCount = ((Number) row[2]).longValue();

                    return RevenueDataPoint.builder()
                            .date(date)
                            .revenue(revenue)
                            .orderCount(orderCount.intValue())
                            .averageOrderValue(orderCount > 0 ? revenue / orderCount : 0)
                            .dayOfWeek(date.getDayOfWeek().getValue())
                            .dayOfMonth(date.getDayOfMonth())
                            .month(date.getMonthValue())
                            .quarter((date.getMonthValue() - 1) / 3 + 1)
                            .year(date.getYear())
                            .isWeekend(date.getDayOfWeek().getValue() >= 6)
                            .isHoliday(false) // TODO: Implement holiday detection
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<RevenueDataPoint> collectWeeklyData(Date startDate, Date endDate) {
        List<Object[]> results = forecastRepository.findWeeklyRevenue(
                startDate, endDate, StatusPayment.PAID
        );

        return results.stream()
                .map(row -> {
                    Integer year = ((Number) row[0]).intValue();
                    Integer week = ((Number) row[1]).intValue();
                    Double revenue = ((Number) row[2]).doubleValue();
                    Long orderCount = ((Number) row[3]).longValue();

                    LocalDate date = getDateFromYearAndWeek(year, week);

                    return RevenueDataPoint.builder()
                            .date(date)
                            .revenue(revenue)
                            .orderCount(orderCount.intValue())
                            .averageOrderValue(orderCount > 0 ? revenue / orderCount : 0)
                            .month(date.getMonthValue())
                            .quarter((date.getMonthValue() - 1) / 3 + 1)
                            .year(year)
                            .isWeekend(false)
                            .isHoliday(false)
                            .build();
                })
                .collect(Collectors.toList());
    }

    private List<RevenueDataPoint> collectMonthlyData(Date startDate, Date endDate) {
        List<Object[]> results = forecastRepository.findMonthlyRevenue(
                startDate, endDate, StatusPayment.PAID
        );

        return results.stream()
                .map(row -> {
                    Integer year = ((Number) row[0]).intValue();
                    Integer month = ((Number) row[1]).intValue();
                    Double revenue = ((Number) row[2]).doubleValue();
                    Long orderCount = ((Number) row[3]).longValue();

                    LocalDate date = LocalDate.of(year, month, 1);

                    return RevenueDataPoint.builder()
                            .date(date)
                            .revenue(revenue)
                            .orderCount(orderCount.intValue())
                            .averageOrderValue(orderCount > 0 ? revenue / orderCount : 0)
                            .month(month)
                            .quarter((month - 1) / 3 + 1)
                            .year(year)
                            .isWeekend(false)
                            .isHoliday(false)
                            .build();
                })
                .collect(Collectors.toList());
    }

    /**
     * Chạy các thuật toán dự đoán
     */
    private List<ForecastResult> runForecastAlgorithms(
            TimeSeriesData historicalData,
            int numberOfPeriods,
            List<String> requestedAlgorithms) {

        List<ForecastAlgorithm> algorithms = new ArrayList<>();

        // Nếu không chỉ định, dùng tất cả
        if (requestedAlgorithms == null || requestedAlgorithms.isEmpty()) {
            algorithms.add(polynomialForecaster);
            algorithms.add(exponentialForecaster);
            algorithms.add(wmaForecaster);

            // ARIMA chỉ dùng khi có đủ dữ liệu
            if (historicalData.getSize() >= 20) {
                algorithms.add(arimaForecaster);
            }
        } else {
            // Chọn theo yêu cầu
            if (requestedAlgorithms.contains("polynomial")) {
                algorithms.add(polynomialForecaster);
            }
            if (requestedAlgorithms.contains("exponential")) {
                algorithms.add(exponentialForecaster);
            }
            if (requestedAlgorithms.contains("wma")) {
                algorithms.add(wmaForecaster);
            }
            if (requestedAlgorithms.contains("arima") && historicalData.getSize() >= 20) {
                algorithms.add(arimaForecaster);
            }
        }

        List<ForecastResult> results = new ArrayList<>();

        for (ForecastAlgorithm algorithm : algorithms) {
            try {
                log.info("Running forecast algorithm: {}", algorithm.getName());
                ForecastResult result = algorithm.forecast(historicalData, numberOfPeriods);
                results.add(result);
            } catch (Exception e) {
                log.error("Error running algorithm {}: {}", algorithm.getName(), e.getMessage());
            }
        }

        // Tính trọng số dựa trên độ chính xác
        calculateWeights(results);

        return results;
    }

    /**
     * Tính trọng số cho các mô hình dựa trên MAPE
     */
    private void calculateWeights(List<ForecastResult> results) {
        if (results.isEmpty()) return;

        // Chuyển MAPE thành weights (MAPE càng thấp, weight càng cao)
        double totalInverseMAPE = results.stream()
                .mapToDouble(r -> 1.0 / (r.getMape() + 1.0)) // +1 để tránh chia cho 0
                .sum();

        for (ForecastResult result : results) {
            double weight = (1.0 / (result.getMape() + 1.0)) / totalInverseMAPE;
            result.setWeight(weight);
        }
    }

    /**
     * Kết hợp predictions từ nhiều mô hình
     */
    private List<Double> ensemblePredictions(List<ForecastResult> results) {
        if (results.isEmpty()) {
            throw new IllegalStateException("Không có mô hình nào chạy thành công");
        }

        int numberOfPeriods = results.get(0).getPredictions().size();
        List<Double> ensemble = new ArrayList<>();

        for (int i = 0; i < numberOfPeriods; i++) {
            double weightedSum = 0;

            for (ForecastResult result : results) {
                weightedSum += result.getPredictions().get(i) * result.getWeight();
            }

            ensemble.add(weightedSum);
        }

        return ensemble;
    }

    /**
     * Xây dựng forecast points với confidence intervals
     */
    private List<ForecastPointDTO> buildForecastPoints(
            List<Double> predictions,
            TimeSeriesData historicalData,
            ForecastRequestDTO request,
            List<ForecastResult> algorithmResults) {

        List<ForecastPointDTO> points = new ArrayList<>();
        LocalDate lastDate = historicalData.getEndDate();

        // Tính standard deviation từ dữ liệu lịch sử
        double[] historicalRevenues = historicalData.getRevenueArray();
        double stdDev = calculateStandardDeviation(historicalRevenues);

        for (int i = 0; i < predictions.size(); i++) {
            LocalDate forecastDate = calculateNextDate(lastDate, request.getPeriod(), i + 1);
            double prediction = predictions.get(i);

            // Confidence interval (95%): prediction ± 1.96 * stdDev
            double confidenceMargin = 1.96 * stdDev * Math.sqrt(i + 1); // Tăng dần theo thời gian
            double lowerBound = Math.max(0, prediction - confidenceMargin);
            double upperBound = prediction + confidenceMargin;

            // Tính confidence score (giảm dần theo thời gian)
            double confidence = Math.max(50, 95 - (i * 2.0)); // Giảm 2% mỗi kỳ

            points.add(ForecastPointDTO.builder()
                    .date(forecastDate)
                    .predictedRevenue(prediction)
                    .lowerBound(lowerBound)
                    .upperBound(upperBound)
                    .confidence(confidence)
                    .periodLabel(formatPeriodLabel(forecastDate, request.getPeriod()))
                    .build());
        }

        return points;
    }

    /**
     * Phân tích mùa vụ
     */
    private SeasonalAnalysisDTO analyzeSeasonality(TimeSeriesData historicalData) {
        List<RevenueDataPoint> dataPoints = historicalData.getDataPoints();

        if (dataPoints.size() < 14) {
            return SeasonalAnalysisDTO.builder()
                    .hasSeasonality(false)
                    .seasonalPattern("UNKNOWN")
                    .factors(new ArrayList<>())
                    .build();
        }

        // Phân tích theo day of week cho DAILY
        if (historicalData.getPeriod() == ForecastPeriod.DAILY) {
            return analyzeDayOfWeekSeasonality(dataPoints);
        }

        // Phân tích theo month cho MONTHLY
        if (historicalData.getPeriod() == ForecastPeriod.MONTHLY) {
            return analyzeMonthSeasonality(dataPoints);
        }

        return SeasonalAnalysisDTO.builder()
                .hasSeasonality(false)
                .seasonalPattern("NONE")
                .factors(new ArrayList<>())
                .build();
    }

    private SeasonalAnalysisDTO analyzeDayOfWeekSeasonality(List<RevenueDataPoint> dataPoints) {
        Map<Integer, List<Double>> revenueByDay = new HashMap<>();

        for (RevenueDataPoint point : dataPoints) {
            revenueByDay.computeIfAbsent(point.getDayOfWeek(), k -> new ArrayList<>())
                    .add(point.getRevenue());
        }

        double overallAvg = dataPoints.stream()
                .mapToDouble(RevenueDataPoint::getRevenue)
                .average()
                .orElse(1.0);

        List<SeasonalFactorDTO> factors = new ArrayList<>();
        String peakDay = "";
        String lowDay = "";
        double maxFactor = 0;
        double minFactor = Double.MAX_VALUE;

        String[] dayNames = {"", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ nhật"};

        for (int day = 1; day <= 7; day++) {
            List<Double> revenues = revenueByDay.get(day);
            if (revenues != null && !revenues.isEmpty()) {
                double avgRevenue = revenues.stream()
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(0);

                double factor = overallAvg > 0 ? avgRevenue / overallAvg : 1.0;

                factors.add(SeasonalFactorDTO.builder()
                        .period(dayNames[day])
                        .factor(factor)
                        .averageRevenue(avgRevenue)
                        .orderCount((int) revenues.stream().count())
                        .build());

                if (factor > maxFactor) {
                    maxFactor = factor;
                    peakDay = dayNames[day];
                }
                if (factor < minFactor) {
                    minFactor = factor;
                    lowDay = dayNames[day];
                }
            }
        }

        // Kiểm tra có mùa vụ không (chênh lệch > 20%)
        boolean hasSeasonality = (maxFactor - minFactor) > 0.2;

        return SeasonalAnalysisDTO.builder()
                .hasSeasonality(hasSeasonality)
                .seasonalPattern("WEEKLY")
                .factors(factors)
                .peakPeriod(peakDay)
                .lowPeriod(lowDay)
                .build();
    }

    private SeasonalAnalysisDTO analyzeMonthSeasonality(List<RevenueDataPoint> dataPoints) {
        Map<Integer, List<Double>> revenueByMonth = new HashMap<>();

        for (RevenueDataPoint point : dataPoints) {
            revenueByMonth.computeIfAbsent(point.getMonth(), k -> new ArrayList<>())
                    .add(point.getRevenue());
        }

        double overallAvg = dataPoints.stream()
                .mapToDouble(RevenueDataPoint::getRevenue)
                .average()
                .orElse(1.0);

        List<SeasonalFactorDTO> factors = new ArrayList<>();
        String peakMonth = "";
        String lowMonth = "";
        double maxFactor = 0;
        double minFactor = Double.MAX_VALUE;

        String[] monthNames = {"", "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
                "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"};

        for (int month = 1; month <= 12; month++) {
            List<Double> revenues = revenueByMonth.get(month);
            if (revenues != null && !revenues.isEmpty()) {
                double avgRevenue = revenues.stream()
                        .mapToDouble(Double::doubleValue)
                        .average()
                        .orElse(0);

                double factor = overallAvg > 0 ? avgRevenue / overallAvg : 1.0;

                factors.add(SeasonalFactorDTO.builder()
                        .period(monthNames[month])
                        .factor(factor)
                        .averageRevenue(avgRevenue)
                        .orderCount(revenues.size())
                        .build());

                if (factor > maxFactor) {
                    maxFactor = factor;
                    peakMonth = monthNames[month];
                }
                if (factor < minFactor) {
                    minFactor = factor;
                    lowMonth = monthNames[month];
                }
            }
        }

        boolean hasSeasonality = (maxFactor - minFactor) > 0.15;

        return SeasonalAnalysisDTO.builder()
                .hasSeasonality(hasSeasonality)
                .seasonalPattern("YEARLY")
                .factors(factors)
                .peakPeriod(peakMonth)
                .lowPeriod(lowMonth)
                .build();
    }

    /**
     * Phân tích xu hướng
     */
    private TrendAnalysisDTO analyzeTrend(TimeSeriesData historicalData) {
        double[] revenues = historicalData.getRevenueArray();
        int n = revenues.length;

        if (n < 2) {
            return TrendAnalysisDTO.builder()
                    .direction("STABLE")
                    .slope(0)
                    .rSquared(0)
                    .description("Không đủ dữ liệu để phân tích xu hướng")
                    .growthPercentage(0)
                    .build();
        }

        // Linear regression: y = a + bx
        double sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

        for (int i = 0; i < n; i++) {
            sumX += i;
            sumY += revenues[i];
            sumXY += i * revenues[i];
            sumX2 += i * i;
        }

        double slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        double intercept = (sumY - slope * sumX) / n;

        // Tính R²
        double meanY = sumY / n;
        double ssTotal = 0, ssResidual = 0;

        for (int i = 0; i < n; i++) {
            double predicted = intercept + slope * i;
            ssTotal += Math.pow(revenues[i] - meanY, 2);
            ssResidual += Math.pow(revenues[i] - predicted, 2);
        }

        double rSquared = ssTotal > 0 ? 1 - (ssResidual / ssTotal) : 0;

        // Xác định hướng
        String direction;
        double avgRevenue = meanY;
        double growthPercentage = avgRevenue > 0 ? (slope / avgRevenue) * 100 : 0;

        if (Math.abs(growthPercentage) < 1) {
            direction = "STABLE";
        } else if (slope > 0) {
            direction = "INCREASING";
        } else {
            direction = "DECREASING";
        }

        String description = String.format(
                "Doanh thu có xu hướng %s với tốc độ %.2f%% mỗi kỳ",
                direction.equals("INCREASING") ? "tăng" :
                        direction.equals("DECREASING") ? "giảm" : "ổn định",
                Math.abs(growthPercentage)
        );

        return TrendAnalysisDTO.builder()
                .direction(direction)
                .slope(slope)
                .rSquared(rSquared)
                .description(description)
                .growthPercentage(growthPercentage)
                .build();
    }

    /**
     * Tính metrics
     */
    private ForecastMetricsDTO calculateMetrics(
            List<ForecastPointDTO> forecastPoints,
            List<ForecastResult> algorithmResults,
            TrendAnalysisDTO trendAnalysis) {

        double totalPredicted = forecastPoints.stream()
                .mapToDouble(ForecastPointDTO::getPredictedRevenue)
                .sum();

        double avgPredicted = totalPredicted / forecastPoints.size();

        // Tính volatility
        double[] predictions = forecastPoints.stream()
                .mapToDouble(ForecastPointDTO::getPredictedRevenue)
                .toArray();
        double volatility = calculateStandardDeviation(predictions) / avgPredicted * 100;

        // Lấy model accuracy tốt nhất
        double bestAccuracy = algorithmResults.stream()
                .mapToDouble(ForecastResult::getMape)
                .min()
                .orElse(0);

        return ForecastMetricsDTO.builder()
                .averagePredictedRevenue(avgPredicted)
                .totalPredictedRevenue(totalPredicted)
                .growthRate(trendAnalysis.getGrowthPercentage())
                .volatility(volatility)
                .modelAccuracy(bestAccuracy)
                .trendDirection(trendAnalysis.getDirection())
                .build();
    }

    // ========== HELPER METHODS ==========

    private void validateRequest(ForecastRequestDTO request) {
        if (request.getNumberOfPeriods() <= 0 || request.getNumberOfPeriods() > 365) {
            throw new IllegalArgumentException("Số kỳ dự đoán phải từ 1 đến 365");
        }
    }

    private void validateHistoricalData(TimeSeriesData data, ForecastPeriod period) {
        int minRequired = switch (period) {
            case DAILY -> 30;   // Tối thiểu 30 ngày
            case WEEKLY -> 12;  // Tối thiểu 12 tuần (3 tháng)
            case MONTHLY -> 6;  // Tối thiểu 6 tháng
        };

        if (data.getSize() < minRequired) {
            throw new IllegalStateException(
                    String.format("Không đủ dữ liệu. Cần tối thiểu %d %s",
                            minRequired, period.getVietnameseName())
            );
        }
    }

    private Date calculateStartDate(Date endDate, ForecastPeriod period) {
        LocalDate end = convertToLocalDate(endDate);
        LocalDate start = switch (period) {
            case DAILY -> end.minusMonths(12);   // 12 tháng dữ liệu
            case WEEKLY -> end.minusMonths(18);  // 18 tháng dữ liệu
            case MONTHLY -> end.minusYears(3);   // 3 năm dữ liệu
        };
        return convertToDate(start);
    }

    private LocalDate calculateNextDate(LocalDate current, ForecastPeriod period, int offset) {
        return switch (period) {
            case DAILY -> current.plusDays(offset);
            case WEEKLY -> current.plusWeeks(offset);
            case MONTHLY -> current.plusMonths(offset);
        };
    }

    private String formatPeriodLabel(LocalDate date, ForecastPeriod period) {
        return switch (period) {
            case DAILY -> String.format("%02d/%02d/%d",
                    date.getDayOfMonth(), date.getMonthValue(), date.getYear());
            case WEEKLY -> String.format("Tuần %d/%d",
                    date.get(java.time.temporal.WeekFields.ISO.weekOfYear()), date.getYear());
            case MONTHLY -> String.format("Tháng %d/%d",
                    date.getMonthValue(), date.getYear());
        };
    }

    private LocalDate getDateFromYearAndWeek(int year, int week) {
        return LocalDate.of(year, 1, 1)
                .with(java.time.temporal.WeekFields.ISO.weekOfYear(), week)
                .with(java.time.temporal.WeekFields.ISO.dayOfWeek(), 1);
    }

    private double calculateStandardDeviation(double[] values) {
        double mean = Arrays.stream(values).average().orElse(0);
        double variance = Arrays.stream(values)
                .map(v -> Math.pow(v - mean, 2))
                .average()
                .orElse(0);
        return Math.sqrt(variance);
    }

    private LocalDate convertToLocalDate(Date date) {
        return date.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
    }

    private Date convertToDate(LocalDate localDate) {
        return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
    }
}
