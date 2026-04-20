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
public class ForecastRequestDTO  {
    private ForecastPeriod period; // DAILY, WEEKLY, MONTHLY
    private int numberOfPeriods; // Số kỳ cần dự đoán
    private LocalDate startDate; // Ngày bắt đầu dự đoán (optional)
    private boolean includeConfidenceInterval; // Có tính khoảng tin cậy không
    private List<String> algorithms; // Các thuật toán muốn sử dụng (optional)
}
