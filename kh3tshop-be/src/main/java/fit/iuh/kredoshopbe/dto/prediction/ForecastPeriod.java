package fit.iuh.kredoshopbe.dto.prediction;

public enum ForecastPeriod {
    DAILY("Ngày"),
    WEEKLY("Tuần"),
    MONTHLY("Tháng");

    private final String vietnameseName;

    ForecastPeriod(String vietnameseName) {
        this.vietnameseName = vietnameseName;
    }

    public String getVietnameseName() {
        return vietnameseName;
    }
}
