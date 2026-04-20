package fit.iuh.kh3tshopbe.controller;

import fit.iuh.kh3tshopbe.dto.prediction.ForecastPeriod;
import fit.iuh.kh3tshopbe.dto.prediction.ForecastRequestDTO;
import fit.iuh.kh3tshopbe.dto.prediction.ForecastResponseDTO;
import fit.iuh.kh3tshopbe.service.RevenueForecastService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin/forecast")
@RequiredArgsConstructor
@Slf4j
@PreAuthorize("hasRole('ADMIN')") // Chỉ admin mới truy cập được
public class RevenueForecastController {
    private final RevenueForecastService forecastService;

    @PostMapping("/predict")
    public ResponseEntity<ForecastResponseDTO> predictRevenue(
            @RequestBody ForecastRequestDTO request) {

        try {
            log.info("Received forecast request: period={}, numberOfPeriods={}",
                    request.getPeriod(), request.getNumberOfPeriods());

            ForecastResponseDTO response = forecastService.forecast(request);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            log.error("Invalid request: {}", e.getMessage());
            return ResponseEntity.badRequest().build();

        } catch (IllegalStateException e) {
            log.error("Insufficient data: {}", e.getMessage());
            return ResponseEntity.unprocessableEntity().build();

        } catch (Exception e) {
            log.error("Error during forecast: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/predict/daily")
    public ResponseEntity<ForecastResponseDTO> predictDailyRevenue(
            @RequestParam(defaultValue = "7") int days,
            @RequestParam(required = false) List<String> algorithms) {

        ForecastRequestDTO request = ForecastRequestDTO.builder()
                .period(ForecastPeriod.DAILY)
                .numberOfPeriods(days)
                .includeConfidenceInterval(true)
                .algorithms(algorithms)
                .build();

        return predictRevenue(request);
    }

    @GetMapping("/predict/weekly")
    public ResponseEntity<ForecastResponseDTO> predictWeeklyRevenue(
            @RequestParam(defaultValue = "4") int weeks,
            @RequestParam(required = false) List<String> algorithms) {

        ForecastRequestDTO request = ForecastRequestDTO.builder()
                .period(ForecastPeriod.WEEKLY)
                .numberOfPeriods(weeks)
                .includeConfidenceInterval(true)
                .algorithms(algorithms)
                .build();

        return predictRevenue(request);
    }

    @GetMapping("/predict/monthly")
    public ResponseEntity<ForecastResponseDTO> predictMonthlyRevenue(
            @RequestParam(defaultValue = "3") int months,
            @RequestParam(required = false) List<String> algorithms) {

        ForecastRequestDTO request = ForecastRequestDTO.builder()
                .period(ForecastPeriod.MONTHLY)
                .numberOfPeriods(months)
                .includeConfidenceInterval(true)
                .algorithms(algorithms)
                .build();

        return predictRevenue(request);
    }

    @GetMapping("/predict/total")
    public ResponseEntity<?> predictTotalRevenue(
            @RequestParam ForecastPeriod period,
            @RequestParam int numberOfPeriods) {

        try {
            ForecastRequestDTO request = ForecastRequestDTO.builder()
                    .period(period)
                    .numberOfPeriods(numberOfPeriods)
                    .includeConfidenceInterval(true)
                    .build();

            ForecastResponseDTO response = forecastService.forecast(request);

            // Trả về summary
            return ResponseEntity.ok(new TotalRevenueSummary(
                    response.getMetrics().getTotalPredictedRevenue(),
                    response.getMetrics().getAveragePredictedRevenue(),
                    response.getMetrics().getGrowthRate(),
                    response.getMetrics().getTrendDirection(),
                    response.getForecasts().get(0).getPredictedRevenue(), // Kỳ đầu tiên
                    response.getGeneratedAt()
            ));

        } catch (Exception e) {
            log.error("Error predicting total revenue: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // DTO cho summary response
    record TotalRevenueSummary(
            double totalPredictedRevenue,
            double averagePerPeriod,
            double growthRate,
            String trend,
            double nextPeriodRevenue,
            java.time.LocalDateTime generatedAt
    ) {}
}
