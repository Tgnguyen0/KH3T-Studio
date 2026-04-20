package fit.iuh.kh3tshopbe.dto.prediction;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RevenueDataPoint {
    private LocalDate date;
    private double revenue;
    private int orderCount;
    private double averageOrderValue;
    private int dayOfWeek; // 1-7
    private int dayOfMonth; // 1-31
    private int month; // 1-12
    private int quarter; // 1-4
    private int year;
    private boolean isWeekend;
    private boolean isHoliday; // Có thể mở rộng thêm
}
