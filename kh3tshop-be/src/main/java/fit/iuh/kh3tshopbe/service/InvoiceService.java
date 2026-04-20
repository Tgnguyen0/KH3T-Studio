package fit.iuh.kh3tshopbe.service;

import fit.iuh.kh3tshopbe.dto.request.CreateInvoiceRequest;
import fit.iuh.kh3tshopbe.dto.response.InvoiceResponse;
import fit.iuh.kh3tshopbe.dto.response.PaymentStatisticResponse;
import fit.iuh.kh3tshopbe.entities.Invoice;
import fit.iuh.kh3tshopbe.entities.Order;

import fit.iuh.kh3tshopbe.enums.PaymentMethod;
import fit.iuh.kh3tshopbe.exception.AppException;
import fit.iuh.kh3tshopbe.exception.ErrorCode;

import fit.iuh.kh3tshopbe.mapper.InvoiceMapper;
import fit.iuh.kh3tshopbe.repository.InvoiceRepository;
import fit.iuh.kh3tshopbe.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.WeekFields;
import java.util.*;
import java.util.List;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;
    private final InvoiceMapper invoiceMapper;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter DATETIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.SSSSSS");
    private final OrderRepository orderRepository;

    @Transactional
    public InvoiceResponse createInvoice(CreateInvoiceRequest request) {
        // 1. Tìm Order và kiểm tra tồn tại + chưa có invoice
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng với ID: " + request.getOrderId()));

        if (order.getInvoice() != null) {
            throw new RuntimeException("Đơn hàng này đã có hóa đơn rồi!");
        }

        // 2. Tạo invoiceCode tự động: INV-YYYYMMDD-XXX
        String invoiceCode = generateInvoiceCode();

        // 3. Tạo invoice
        Invoice invoice = new Invoice();
        invoice.setInvoiceCode(invoiceCode);
        invoice.setPaymentMethod(request.getPaymentMethod());
        invoice.setPaymentStatus(request.getPaymentStatus());
        invoice.setSubtotalAmount(order.getCustomerTrading().getTotalAmount());
        invoice.setTaxAmount(0.0);
        invoice.setTotalAmount(order.getCustomerTrading().getTotalAmount());

        LocalDateTime now = LocalDateTime.now();
        invoice.setCreatedAt(java.sql.Timestamp.valueOf(now));
        invoice.setUpdatedAt(java.sql.Timestamp.valueOf(now));

        // Liên kết với Order
        invoice.setOrder(order);

        // Lưu
        Invoice savedInvoice = invoiceRepository.save(invoice);

        // Trả về response
        return invoiceMapper.toInvoiceMapper(savedInvoice);
    }

    // Sinh mã hóa đơn: INV-20250807-001, INV-20250807-002,...
    private String generateInvoiceCode() {
        LocalDate today = LocalDate.now();
        String datePart = today.format(DateTimeFormatter.ofPattern("yyyyMMdd"));

        LocalDateTime startOfDay = today.atStartOfDay();
        LocalDateTime endOfDay = today.plusDays(1).atStartOfDay();

        long count = invoiceRepository.countByCreatedAtBetween(startOfDay, endOfDay);
        String sequence = String.format("%03d", count + 1);

        return "INV-" + datePart + "-" + sequence;
    }

    public List<InvoiceResponse> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(invoiceMapper::toInvoiceMapper)
                .collect(Collectors.toList());
    }

    private Date toDateStart(LocalDate date) {
        return java.sql.Timestamp.valueOf(date.atStartOfDay());
    }

    private Date toDateEnd(LocalDate date) {
        return java.sql.Timestamp.valueOf(date.atTime(23, 59, 59));
    }

    public List<Map<String, Object>> getProfitWeekly(LocalDate startDate, LocalDate endDate) {

        Date start = toDateStart(startDate);
        Date end = toDateEnd(endDate);

        List<Object[]> results = invoiceRepository.getProfitByWeek(start, end);

        // Convert DB data thành map week → profit
        Map<Integer, Double> profitMap = new HashMap<>();
        for (Object[] row : results) {
            Integer week = (Integer) row[1];
            Double profit = (Double) row[2];
            profitMap.put(week, profit);
        }

        int weekNumber = startDate.get(WeekFields.ISO.weekOfWeekBasedYear());
        int year = startDate.getYear();

        List<Map<String, Object>> finalList = new ArrayList<>();

        // Chỉ 1 tuần → fill đủ thứ 2 → CN
        for (int i = 1; i <= 7; i++) {
            Map<String, Object> item = new HashMap<>();
            item.put("year", year);
            item.put("week", weekNumber);
            item.put("day", startDate.plusDays(i - 1).getDayOfWeek().toString());
            item.put("profit", profitMap.getOrDefault(weekNumber, 0.0));
            finalList.add(item);
        }

        return finalList;
    }

    public List<Map<String, Object>> getProfitMonthly(LocalDate startDate, LocalDate endDate) {
        Date start = toDateStart(startDate);
        Date end = toDateEnd(endDate);

        List<Object[]> results = invoiceRepository.getProfitByMonth(start, end);

        // Convert DB results thành map dạng "month → profit"
        Map<Integer, Double> profitMap = new HashMap<>();
        for (Object[] row : results) {
            Integer month = (Integer) row[1];
            Double profit = (Double) row[2];
            profitMap.put(month, profit);
        }

        // Tạo danh sách 12 tháng, fill profit = 0 nếu không có
        List<Map<String, Object>> finalList = new ArrayList<>();

        for (int month = 1; month <= 12; month++) {
            Map<String, Object> item = new HashMap<>();
            item.put("year", startDate.getYear());
            item.put("month", month);
            item.put("profit", profitMap.getOrDefault(month, 0.0));
            finalList.add(item);
        }
        return finalList;
    }

    public List<Map<String, Object>> getProfitYearly(LocalDate startDate, LocalDate endDate) {

        Date start = toDateStart(startDate);
        Date end = toDateEnd(endDate);

        List<Object[]> results = invoiceRepository.getProfitByYear(start, end);

        // Đưa DB vào map
        Map<Integer, Double> profitMap = new HashMap<>();
        for (Object[] row : results) {
            Integer year = (Integer) row[0];
            Double profit = (Double) row[1];
            profitMap.put(year, profit);
        }

        List<Map<String, Object>> finalList = new ArrayList<>();

        int startYear = startDate.getYear();
        int endYear = endDate.getYear();

        for (int year = startYear; year <= endYear; year++) {
            Map<String, Object> item = new HashMap<>();
            item.put("year", year);
            item.put("profit", String.format("%,.0f", profitMap.getOrDefault(year, 0.0)));
            finalList.add(item);
        }

        return finalList;
    }



    private static final Map<PaymentMethod, String> COLOR_MAP = Map.of(
            PaymentMethod.CASH, "#10b981",
            PaymentMethod.BANK_TRANSFER, "#6366f1"
    );

    public List<PaymentStatisticResponse> getPaymentStatistics() {

        List<Object[]> results = invoiceRepository.getPaymentStatistics();
        List<PaymentStatisticResponse> dtoList = new ArrayList<>();

        for (Object[] row : results) {

            PaymentMethod method = (PaymentMethod) row[0];
            long count = (long) row[1];
            double revenue = (double) row[2];

            dtoList.add(
                    new PaymentStatisticResponse(
                            convertName(method), // tên hiển thị
                            count,               // value
                            revenue,             // doanh thu
                            COLOR_MAP.get(method),
                            count                // số đơn
                    )
            );
        }

        return dtoList;
    }

    private String convertName(PaymentMethod p) {
        return switch (p) {
            case CASH -> "Cash on Delivery (COD)";
            case BANK_TRANSFER -> "Bank Transfer";
        };
    }


    public InvoiceResponse getInvoiceById(int id) {
        Invoice invoice = invoiceRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.INVOICE_NOT_FOUND));
        return invoiceMapper.toInvoiceMapper(invoice);
    }
}